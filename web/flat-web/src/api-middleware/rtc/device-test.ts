import AgoraRTC, { ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import { useCallback, useEffect, useRef, useState } from "react";
import { addEventListener, removeEventListener } from "./hot-plug";

export class DeviceTest {
    public devices: MediaDeviceInfo[] = [];
    public onDevicesChanged?: (devices: MediaDeviceInfo[]) => void;

    public cameraVideoTrack?: ICameraVideoTrack;
    public microphoneAudioTrack?: IMicrophoneAudioTrack;

    public volume = 0;
    public onVolumeChanged?: (volume: number) => void;
    private volumeTimer = 0;

    public cameraElement: HTMLDivElement | null = null;

    public constructor() {
        addEventListener("camera", this.refreshDevices);
        addEventListener("microphone", this.refreshDevices);
        this.refreshVolume();
    }

    public initialize(): Promise<void> {
        return this.refreshDevices();
    }

    public refreshDevices = async (): Promise<void> => {
        this.devices = await AgoraRTC.getDevices(true);
        if (this.onDevicesChanged) {
            this.onDevicesChanged(this.devices);
        }
    };

    public setCameraElement(cameraElement: HTMLDivElement | null): void {
        this.cameraElement = cameraElement;
    }

    public refreshVolume = (): void => {
        if (this.microphoneAudioTrack) {
            const volume = this.microphoneAudioTrack.getVolumeLevel();
            if (this.volume !== volume) {
                this.volume = volume;
                if (this.onVolumeChanged) {
                    this.onVolumeChanged(volume);
                }
            }
        }
        this.volumeTimer = window.setTimeout(this.refreshVolume, 200);
    };

    public async setCamera(deviceId: string): Promise<void> {
        if (this.cameraVideoTrack) {
            await this.cameraVideoTrack.setDevice(deviceId);
        } else {
            this.cameraVideoTrack = await AgoraRTC.createCameraVideoTrack({
                cameraId: deviceId,
            });
            if (this.cameraElement) {
                this.cameraVideoTrack.play(this.cameraElement);
            }
        }
    }

    public async setMicrophone(deviceId: string): Promise<void> {
        if (this.microphoneAudioTrack) {
            await this.microphoneAudioTrack.setDevice(deviceId);
        } else {
            this.microphoneAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
                microphoneId: deviceId,
            });
        }
    }

    public destroy(): void {
        window.clearTimeout(this.volumeTimer);
        removeEventListener("camera", this.refreshDevices);
        removeEventListener("microphone", this.refreshDevices);
        if (this.cameraVideoTrack) {
            this.cameraVideoTrack.close();
            this.cameraVideoTrack = undefined;
        }
        if (this.microphoneAudioTrack) {
            this.microphoneAudioTrack.close();
            this.microphoneAudioTrack = undefined;
        }
    }

    public static isPermissionError(error: any): error is Error {
        return "code" in error && "message" in error && error.code === "PERMISSION_DENIED";
    }
}

export function useDevicesTest(): {
    cameraDevices: MediaDeviceInfo[];
    speakerDevices: MediaDeviceInfo[];
    microphoneDevices: MediaDeviceInfo[];
    volume: number;
    cameraDeviceId: string;
    microphoneDeviceId: string;
    setCameraDeviceId: (deviceId: string) => void;
    setMicrophoneDeviceId: (deviceId: string) => void;
    cameraPermission: boolean;
    microphonePermission: boolean;
    setCameraElement: (cameraElement: HTMLDivElement | null) => void;
} {
    const [deviceTest] = useState(() => new DeviceTest());

    const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
    const [speakerDevices, setSpeakerDevices] = useState<MediaDeviceInfo[]>([]);
    const [microphoneDevices, setMicrophoneDevices] = useState<MediaDeviceInfo[]>([]);

    const [cameraDeviceId, setCameraDeviceId] = useState<string>("");
    const [microphoneDeviceId, setMicrophoneDeviceId] = useState<string>("");

    const [cameraPermission, setCameraPermission] = useState(true);
    const [microphonePermission, setMicrophonePermission] = useState(true);

    const [volume, setVolume] = useState(0);

    const refreshDevicesTimer = useRef(0);

    const setCameraElement = useCallback(
        (cameraElement: HTMLDivElement | null): void => {
            deviceTest.setCameraElement(cameraElement);
        },
        [deviceTest],
    );

    const onDevicesChanged = useCallback((devices: MediaDeviceInfo[]) => {
        const cameraDevices: MediaDeviceInfo[] = [];
        const speakerDevices: MediaDeviceInfo[] = [];
        const microphoneDevices: MediaDeviceInfo[] = [];
        for (const device of devices) {
            if (!device.deviceId) {
                continue;
            }
            switch (device.kind) {
                case "audioinput": {
                    microphoneDevices.push(device);
                    break;
                }
                case "audiooutput": {
                    speakerDevices.push(device);
                    break;
                }
                case "videoinput": {
                    cameraDevices.push(device);
                    break;
                }
            }
        }
        setCameraDevices(cameraDevices);
        setSpeakerDevices(speakerDevices);
        setMicrophoneDevices(microphoneDevices);
        setCameraPermission(cameraDevices.length > 0);
        setMicrophonePermission(microphoneDevices.length > 0);
    }, []);

    useEffect(() => {
        if (cameraDevices.length > 0 && !cameraDeviceId) {
            setCameraDeviceId(cameraDevices[0].deviceId);
        }
    }, [cameraDeviceId, cameraDevices]);

    useEffect(() => {
        if (microphoneDevices.length > 0 && !microphoneDeviceId) {
            setMicrophoneDeviceId(microphoneDevices[0].deviceId);
        }
    }, [microphoneDeviceId, microphoneDevices]);

    useEffect(() => {
        deviceTest.onVolumeChanged = setVolume;
        deviceTest.onDevicesChanged = onDevicesChanged;
        deviceTest.initialize().catch((error: any) => {
            if (DeviceTest.isPermissionError(error)) {
                setCameraPermission(false);
                setMicrophonePermission(false);
            }
        });

        return deviceTest.destroy.bind(deviceTest);
    }, [deviceTest, onDevicesChanged]);

    useEffect(() => {
        if (cameraDeviceId) {
            void deviceTest.setCamera(cameraDeviceId).catch((error: any) => {
                if (DeviceTest.isPermissionError(error)) {
                    setCameraPermission(false);
                }
            });
        }
    }, [cameraDeviceId, deviceTest]);

    useEffect(() => {
        if (microphoneDeviceId) {
            void deviceTest.setMicrophone(microphoneDeviceId).catch((error: any) => {
                if (DeviceTest.isPermissionError(error)) {
                    setMicrophonePermission(false);
                }
            });
        }
    }, [microphoneDeviceId, deviceTest]);

    const refreshDevices = useCallback(() => {
        refreshDevicesTimer.current = window.setTimeout(() => {
            refreshDevicesTimer.current = 0;
            void deviceTest.refreshDevices();
            refreshDevices();
        }, 1000);
    }, [deviceTest]);

    useEffect(() => {
        if (cameraPermission && microphonePermission) {
            return;
        }
        if (refreshDevicesTimer.current) {
            return;
        }
        refreshDevices();
    }, [cameraPermission, deviceTest, microphonePermission, refreshDevices]);

    return {
        cameraDevices,
        speakerDevices,
        microphoneDevices,
        cameraDeviceId,
        setCameraDeviceId,
        microphoneDeviceId,
        setMicrophoneDeviceId,
        volume,
        cameraPermission,
        microphonePermission,
        setCameraElement,
    };
}
