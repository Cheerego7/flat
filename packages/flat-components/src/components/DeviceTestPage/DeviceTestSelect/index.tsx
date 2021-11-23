import disabledSVG from "../icons/disabled.svg";
import "./style.less";

import React from "react";
import { Button, Select } from "antd";
import { Device } from "../constants";

export interface DeviceTestSelectProps {
    devices?: Device[];
    isGranted: boolean;
    onChange: (deviceID: string) => void;
}

export const DeviceTestSelect: React.FC<DeviceTestSelectProps> = ({
    devices,
    isGranted,
    onChange,
}) => {
    return (
        <div className="device-test-select-container">
            {isGranted ? (
                <div className="device-test-select-box">
                    <Select value={devices?.[0]?.deviceId} onChange={onChange}>
                        {devices?.map(({ deviceId, label }) => {
                            return (
                                <Select.Option value={deviceId} key={deviceId}>
                                    {label}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </div>
            ) : (
                <div className="device-test-select-disabled-btn">
                    <Button icon={<img src={disabledSVG} />}>未开启权限</Button>
                </div>
            )}
        </div>
    );
};
