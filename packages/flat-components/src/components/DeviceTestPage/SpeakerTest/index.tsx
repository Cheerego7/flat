import muteSVG from "../icons/mute.svg";
import volumeSVG from "../icons/volume.svg";
import playSVG from "../icons/play.svg";
import stopSVG from "../icons/stop.svg";
import "./style.less";

import { Button, Slider } from "antd";
import React, { useState } from "react";
import { Device } from "../constants";
import { DeviceTestSelect } from "../DeviceTestSelect";

export interface SpeakerTestProps {
    speakerDevices?: Device[];
    speakerTestFileName: string;
    isPlaying: boolean;
    isSpeakerGranted: boolean;
    onChange: (deviceID: string) => void;
}

export const SpeakerTest: React.FC<SpeakerTestProps> = ({
    speakerDevices,
    speakerTestFileName,
    isPlaying,
    isSpeakerGranted,
    onChange,
}) => {
    const [currentVolume, setCurrentVolume] = useState(30);
    return (
        <div className="speaker-test-container">
            <div className="speaker-test-text">扬声器</div>
            <div className="speaker-text-select-box">
                <DeviceTestSelect
                    devices={speakerDevices}
                    isGranted={isSpeakerGranted}
                    onChange={onChange}
                />
            </div>
            <div className="speaker-test-output-box">
                <Button icon={<img src={isPlaying ? stopSVG : playSVG} />} onClick={togglePlay}>
                    {speakerTestFileName}
                </Button>
            </div>
            <div className="speaker-test-volume-box">
                <img src={muteSVG} />
                <Slider value={currentVolume} onChange={setCurrentVolume} />
                <img src={volumeSVG} />
            </div>
        </div>
    );
};

const togglePlay = (): void => {
    // setIsPlaying(!isPlaying);
    console.log("1");
};
