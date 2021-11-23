import "./style.less";

import React from "react";
import { Device } from "../constants";
import { DeviceTestSelect } from "../DeviceTestSelect";

export interface MicrophoneTestProps {
    microphoneDevices?: Device[];
    microphoneVolume: number;
    isMicrophoneGranted: boolean;
    onChange: (deviceID: string) => void;
}

export const MicrophoneTest: React.FC<MicrophoneTestProps> = ({
    microphoneDevices,
    microphoneVolume,
    isMicrophoneGranted,
    onChange,
}) => {
    return (
        <div className="microphone-test-container">
            <div className="microphone-test-text">麦克风</div>
            <div className="microphone-text-select-box">
                <DeviceTestSelect
                    devices={microphoneDevices}
                    isGranted={isMicrophoneGranted}
                    onChange={onChange}
                />
            </div>
            <div className="microphone-test-wrapper">
                <div
                    className="microphone-test-volume"
                    style={{ width: `${microphoneVolume * 100}%` }}
                />
                <div className="microphone-test-mask" />
            </div>
        </div>
    );
};
