import "./style.less";

import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { Device, DeviceTestPanel } from "flat-components";
import { DeviceTest } from "../../api-middleware/rtc/device-test";
// import { ICameraVideoTrack } from "agora-rtc-sdk-ng";

export const DevicesTestPage = observer(function DeviceTestPage() {
    const [deviceTest] = useState(() => new DeviceTest());
    const [cameraDevices, setCameraDevices] = useState<Device[]>([]);
    const [speakerDevices, setSpeakerDevices] = useState<Device[]>([]);
    const [microphoneDevices, setMicrophoneDevices] = useState<Device[]>([]);
    // const [cameraVideoTrack, setCameraVideoTrack] = useState<ICameraVideoTrack | null>(null);

    const cameraVideoStreamRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const getDevices = async (): Promise<void> => {
            const cameraDevices = await deviceTest.getCameraDevices();
            const speakerDevices = await deviceTest.getSpeakerDevices();
            const microphoneDevices = await deviceTest.getMicrophoneDevices();
            setCameraDevices(cameraDevices);
            setSpeakerDevices(speakerDevices);
            setMicrophoneDevices(microphoneDevices);
        };

        void getDevices();

        // return () => {
        //     destroy device
        // }
    }, [deviceTest]);

    useEffect(() => {
        const enableCameraStream = async (): Promise<void> => {
            console.log("camera device , ", cameraDevices);
            if (cameraDevices && cameraVideoStreamRef.current) {
                console.log("cameraDevice >>>>>. ,", cameraDevices[1].deviceId);
                await deviceTest.enableCameraVideoStream(
                    cameraDevices[1].deviceId,
                    cameraVideoStreamRef.current,
                );
            }
        };

        void enableCameraStream();

        return () => {
            deviceTest.closeCameraVideoTrack();
        };
    }, []);

    useEffect(() => {
        const enableMicrophoneAudioVolume = async (): Promise<void> => {
            if (microphoneDevices[0].deviceId) {
                await deviceTest.enableMicrophoneAudioVolume(microphoneDevices[0].deviceId);
            }
        };

        void enableMicrophoneAudioVolume();
        return () => {
            deviceTest.closeMicrophoneAudioTrack();
        };
    }, [deviceTest, microphoneDevices]);

    (window as any).device = deviceTest;

    console.log("deviceTest.volumeValue", deviceTest.microphoneVolume);

    return (
        <div className="device-test-page-container">
            <div className="device-test-panel-box">
                <DeviceTestPanel
                    cameraDevices={cameraDevices}
                    speakerDevices={speakerDevices}
                    microphoneDevices={microphoneDevices}
                    speakerTestFileName={"test"}
                    microphoneVolume={deviceTest.microphoneVolume}
                    isCameraGranted={true}
                    isSpeakerGranted={true}
                    isMicrophoneGranted={true}
                    isPlaying={true}
                    cameraVideoStreamRef={cameraVideoStreamRef}
                    onChange={() => null}
                />
            </div>
        </div>
    );
});

export default DevicesTestPage;
