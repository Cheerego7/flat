import "./style.less";

import { DeviceTestPanel } from "flat-components";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";

import { useDevicesTest } from "../../api-middleware/rtc/device-test";

// import { ICameraVideoTrack } from "agora-rtc-sdk-ng";

export const DevicesTestPage = observer(function DeviceTestPage() {
    const {
        cameraDevices,
        speakerDevices,
        microphoneDevices,
        // cameraDeviceId,
        cameraPermission,
        // microphoneDeviceId,
        microphonePermission,
        // setCameraDeviceId,
        // setMicrophoneDeviceId,
        volume,
        setCameraElement,
    } = useDevicesTest();
    // const [cameraVideoTrack, setCameraVideoTrack] = useState<ICameraVideoTrack | null>(null);

    const cameraVideoStreamRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCameraElement(cameraVideoStreamRef.current);
    }, [cameraVideoStreamRef, setCameraElement]);

    return (
        <div className="device-test-page-container">
            <div className="device-test-panel-box">
                <DeviceTestPanel
                    cameraDevices={cameraDevices}
                    speakerDevices={speakerDevices}
                    microphoneDevices={microphoneDevices}
                    speakerTestFileName={"test"}
                    microphoneVolume={volume}
                    isCameraGranted={cameraPermission}
                    isSpeakerGranted={true}
                    isMicrophoneGranted={microphonePermission}
                    isPlaying={true}
                    cameraVideoStreamRef={cameraVideoStreamRef}
                    onChange={console.log}
                />
            </div>
        </div>
    );
});

export default DevicesTestPage;
