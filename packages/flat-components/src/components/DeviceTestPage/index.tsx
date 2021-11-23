import "./style.less";

import { Button, Checkbox } from "antd";
import React from "react";
import { CameraTest } from "./CameraTest";
import { Device } from "./constants";
import { MicrophoneTest } from "./MicrophoneTest";
import { SpeakerTest } from "./SpeakerTest";

export type { Device };

export interface DeviceTestPanelProps {
    cameraDevices?: Device[];
    speakerDevices?: Device[];
    microphoneDevices?: Device[];
    speakerTestFileName: string;
    microphoneVolume: number;
    isCameraGranted: boolean;
    isSpeakerGranted: boolean;
    isMicrophoneGranted: boolean;
    isPlaying: boolean;
    cameraVideoStreamRef: React.RefObject<HTMLDivElement>;
    onChange: (deviceID: string) => void;
}

export const DeviceTestPanel: React.FC<DeviceTestPanelProps> = ({
    cameraDevices,
    speakerDevices,
    microphoneDevices,
    speakerTestFileName,
    microphoneVolume,
    isCameraGranted,
    isSpeakerGranted,
    isMicrophoneGranted,
    isPlaying,
    cameraVideoStreamRef,
    onChange,
}) => {
    return (
        <div className="device-test-panel-container">
            <div className="device-test-panel-title-box">设备检测</div>
            <div className="device-test-panel-inner-box">
                <div className="device-test-panel-inner-left">
                    <CameraTest
                        cameraDevices={cameraDevices}
                        isCameraGranted={isCameraGranted}
                        cameraVideoStreamRef={cameraVideoStreamRef}
                        onChange={onChange}
                    />
                </div>
                <div className="device-test-panel-inner-right">
                    <SpeakerTest
                        speakerDevices={speakerDevices}
                        speakerTestFileName={speakerTestFileName}
                        isPlaying={isPlaying}
                        isSpeakerGranted={isSpeakerGranted}
                        onChange={onChange}
                    />
                    <MicrophoneTest
                        microphoneDevices={microphoneDevices}
                        isMicrophoneGranted={isMicrophoneGranted}
                        onChange={onChange}
                        microphoneVolume={microphoneVolume}
                    />
                </div>
            </div>
            <div className="device-test-panel-tips-box">
                <div className="device-test-panel-tips-radio">
                    <Checkbox>不再提示</Checkbox>
                </div>
                <div className="device-test-panel-join-btn">
                    <Button type="primary">进入房间</Button>
                </div>
            </div>
        </div>
    );
};
