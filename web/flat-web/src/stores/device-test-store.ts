import { makeAutoObservable, observable } from "mobx";
import { DeviceTest } from "../api-middleware/rtc/device-test";

export class DeviceTestStore {
    private deviceTest: DeviceTest;

    public isCameraGranted = false;
    public isSpeakerGranted = false;
    public isMicrophoneGranted = false;
    public microphoneVolume = 0;

    public constructor() {
        makeAutoObservable<this, "deviceTest">(this, { deviceTest: observable.ref });
        this.deviceTest = new DeviceTest();
    }

    public updateIsCameraGranted(isCameraGranted: boolean): void {
        this.isCameraGranted = isCameraGranted;
    }

    public updateIsSpeakerGranted(isSpeakerGranted: boolean): void {
        this.isSpeakerGranted = isSpeakerGranted;
    }

    public updateIsMicrophoneGranted(isMicrophoneGranted: boolean): void {
        this.isMicrophoneGranted = isMicrophoneGranted;
    }

    public updateMicrophoneVolume(microphoneVolume: number): void {
        this.microphoneVolume = microphoneVolume;
    }

    public setCameraVideoStream(): void {
        if (this.deviceTest.microphoneAudioTrack) {
            const microphoneVolume = this.deviceTest.microphoneAudioTrack?.getVolumeLevel();
            this.updateMicrophoneVolume(microphoneVolume);
        }
    }

    public destroy(): void {
        this.deviceTest.destroy();
    }
}
