import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import EventEmitter from "eventemitter3";
import { AGORA } from "../../constants/Process";
import { globalStore } from "../../stores/GlobalStore";
import { generateRTCToken } from "../flatServer/agora";

if (import.meta.env.PROD) {
    AgoraRTC.setLogLevel(/* WARNING */ 2);
}

export enum RtcChannelType {
    Communication = 0,
    Broadcast = 1,
}

export enum RTCMessageType {
    /** receive RTC meta data */
    ReceiveMetaData = "ReceiveMetaData",
}

export type RTCEvents = {
    [RTCMessageType.ReceiveMetaData]: number;
};

export declare interface Rtm {
    on<U extends keyof RTCEvents>(event: U, listener: (value: RTCEvents[U]) => void): this;
    once<U extends keyof RTCEvents>(event: U, listener: (value: RTCEvents[U]) => void): this;
}

/**
 * Flow:
 * ```
 * join() -> now it has `client
 *   getLatency() -> number
 * destroy()
 * ```
 */
export class RtcRoom extends EventEmitter {
    public client?: IAgoraRTCClient;
    public codec?: "h264" | "vp8";
    public getTimestamp: number | undefined;

    private roomUUID?: string;
    private sendMetadataTimer: number = NaN;

    public constructor(config: { getTimestamp: number | undefined }) {
        super();
        this.getTimestamp = config.getTimestamp;
    }

    public async join({
        roomUUID,
        isCreator,
        rtcUID,
        channelType,
    }: {
        roomUUID: string;
        isCreator: boolean;
        rtcUID: number;
        channelType: RtcChannelType;
    }): Promise<void> {
        if (this.client) {
            await this.destroy();
        }

        const mode = channelType === RtcChannelType.Communication ? "rtc" : "live";
        const codec = channelType === RtcChannelType.Broadcast && isCreator ? "h264" : "vp8";
        this.client = AgoraRTC.createClient({ mode, codec });
        this.codec = codec;

        this.client.on("token-privilege-will-expire", this.renewToken);

        if (channelType === RtcChannelType.Broadcast) {
            const role = isCreator ? "host" : "audience";
            await this.client.setClientRole(role, { level: isCreator ? 2 : 1 });

            this.client.on("receive-metadata", (uid: number, data: Uint8Array) => {
                this.emit(RTCMessageType.ReceiveMetaData, uid, data);
            });
            this.sendMetaData(5000);
        }

        const token = globalStore.rtcToken || (await generateRTCToken(roomUUID));
        await this.client.join(AGORA.APP_ID, roomUUID, token, rtcUID);

        this.roomUUID = roomUUID;
    }

    public getLatency(): number {
        return this.client?.getRTCStats().RTT ?? NaN;
    }

    public async destroy(): Promise<void> {
        if (this.client) {
            this.client.off("token-privilege-will-expire", this.renewToken);
            await this.client.leave();
            this.client = undefined;
            clearTimeout(this.sendMetadataTimer);
        }
    }

    /**
     * @param intervalMS should > 2s
     */
    public sendMetaData(intervalMS: number): void {
        clearTimeout(this.sendMetadataTimer);

        this.sendMetadataTimer = setTimeout(() => {
            (this.client as any).sendMetadata(new TextEncoder().encode(String(this.getTimestamp)));
        }, intervalMS);
    }

    private renewToken = async (): Promise<void> => {
        if (this.client && this.roomUUID) {
            const token = await generateRTCToken(this.roomUUID);
            await this.client.renewToken(token);
        }
    };
}

(window as any).RtcRoom = RtcRoom;
