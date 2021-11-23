import React from "react";
import { Meta, Story } from "@storybook/react";
import { DeviceTestPanel, DeviceTestPanelProps } from ".";

const storyMeta: Meta = {
    title: "DeviceTestPage/DeviceTestPanel",
    component: DeviceTestPanel,
};

export default storyMeta;

export const PlayableExample: Story<DeviceTestPanelProps> = args => (
    <div className="vh-100 w-70">
        <DeviceTestPanel {...args} />
    </div>
);
PlayableExample.args = {
    cameraDevices: [
        { deviceName: "default(MacBook Pro camera)", deviceId: "1" },
        { deviceName: "other Camera", deviceId: "2" },
    ],
    speakerDevices: [
        { deviceName: "default(MacBook Pro speaker)", deviceId: "1" },
        { deviceName: "other speaker", deviceId: "2" },
    ],
    microphoneDevices: [
        { deviceName: "default(MacBook Pro microphone)", deviceId: "1" },
        { deviceName: "other microphone", deviceId: "2" },
    ],
    currentDeviceID: "1",
    microphoneVolume: 21,
    isCameraGranted: false,
    isMicrophoneGranted: true,
    isSpeakerGranted: true,
    isPlaying: true,
    speakerTestFileName: "test",
};
