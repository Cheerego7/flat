import AgoraRTC, { ICameraVideoTrack, ILocalAudioTrack } from "agora-rtc-sdk-ng";
// import { useEffect, useState } from "react";

export class DeviceTest {
    public devices: MediaDeviceInfo[] = [];

    // public cameraDevices?: MediaDeviceInfo[];
    // public speakerDevices?: MediaDeviceInfo[];
    // public microphoneDevices?: MediaDeviceInfo[];

    public cameraVideoTrack?: ICameraVideoTrack;
    public speakerAudioTrack?: ILocalAudioTrack;
    public microphoneAudioTrack?: ILocalAudioTrack;
    public microphoneVolume = 0;

    public onVolumeChanged?: (volume: number) => void;

    public initialize(): void {
        return;
    }

    public async getDevices(): Promise<void> {
        this.devices = await AgoraRTC.getDevices();
    }

    public async getCameraDevices(): Promise<MediaDeviceInfo[]> {
        try {
            await this.getDevices();
        } catch (error) {
            console.log(error);
            DeviceTest.isCameraDevicePermissionError(error);
        }
        return this.devices.filter(device => {
            return device.kind === "videoinput";
        });
    }

    public async getSpeakerDevices(): Promise<MediaDeviceInfo[]> {
        await this.getDevices();
        return this.devices.filter(device => {
            return device.kind === "audiooutput";
        });
    }

    public async getMicrophoneDevices(): Promise<MediaDeviceInfo[]> {
        await this.getDevices();
        return this.devices.filter(device => {
            return device.kind === "audioinput";
        });
    }

    public async createCameraVideoTrack(cameraDeviceId: string): Promise<void> {
        this.cameraVideoTrack = await AgoraRTC.createCameraVideoTrack({
            cameraId: cameraDeviceId,
        });
    }

    public async createSpeakerAudioTrack(speakerDeviceId: string): Promise<void> {
        this.speakerAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
            microphoneId: speakerDeviceId,
        });
    }

    public async createMicrophoneAudioTrack(microphoneDeviceId: string): Promise<void> {
        this.microphoneAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
            microphoneId: microphoneDeviceId,
        });
    }

    public async enableCameraVideoStream(
        cameraDeviceId: string,
        ref: HTMLDivElement,
    ): Promise<void> {
        console.log("device id ", cameraDeviceId);
        await this.createCameraVideoTrack(cameraDeviceId);
        this.cameraVideoTrack?.play(ref);
    }

    public async enableMicrophoneAudioVolume(microphoneDeviceId: string): Promise<void> {
        await this.createMicrophoneAudioTrack(microphoneDeviceId);

        setInterval(() => {
            if (this.microphoneAudioTrack) {
                this.microphoneVolume = this.microphoneAudioTrack?.getVolumeLevel();
            }
            console.log("device test microphone volume,", this.microphoneVolume);
        }, 1000);
    }

    public closeCameraVideoTrack(): void {
        this.cameraVideoTrack?.close();
        this.cameraVideoTrack = undefined;
    }

    public closeSpeakerAudioTrack(): void {
        this.speakerAudioTrack?.close();
        this.speakerAudioTrack = undefined;
    }

    public closeMicrophoneAudioTrack(): void {
        this.microphoneAudioTrack?.close();
        this.microphoneAudioTrack = undefined;
    }

    public destroy(): void {
        this.closeCameraVideoTrack();
        this.closeSpeakerAudioTrack();
        this.closeMicrophoneAudioTrack();
    }

    private static isCameraDevicePermissionError(error: any): error is Error {
        return "code" in error && "message" in error && error.code === "PERMISSION_DENIED";
    }
}

// export function useDevicesTest() {
//     const [app] = useState(() => new DeviceTest());
//     const [volume, setVolume] = useState(0);

//     useEffect(() => {
//         void app.getDevices();
//         app.onVolumeChanged = setVolume;

//         return () => {
//             app.destroy();
//         };
//     }, [app]);

//     return { volume };
// }
