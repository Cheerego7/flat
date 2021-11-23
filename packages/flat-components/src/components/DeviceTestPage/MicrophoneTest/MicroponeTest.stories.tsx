import React from "react";
import { Meta, Story } from "@storybook/react";
import { MicrophoneTest, MicrophoneTestProps } from ".";

const storyMeta: Meta = {
    title: "DeviceTestPage/MicrophoneTest",
    component: MicrophoneTest,
};

export default storyMeta;

export const PlayableExample: Story<MicrophoneTestProps> = args => (
    <div className="vh-100 mw5-ns">
        <MicrophoneTest {...args} />
    </div>
);
PlayableExample.args = {
    microphoneDevices: [
        { deviceName: "default(MacBook Pro Microphone)", deviceId: "1" },
        { deviceName: "other Microphone", deviceId: "2" },
    ],
    currentDeviceID: "1",
    microphoneVolume: 21,
    isMicrophoneGranted: true,
};
