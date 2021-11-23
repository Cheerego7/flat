import "./style.less";
import cameraDisabledSVG from "../icons/camera-disabled.svg";

import React from "react";
import classNames from "classnames";
import { Device } from "../constants";
import { DeviceTestSelect } from "../DeviceTestSelect";

export interface CameraTestProps {
    cameraDevices?: Device[];
    isCameraGranted: boolean;
    cameraVideoStreamRef: React.RefObject<HTMLDivElement>;
    onChange: (deviceID: string) => void;
}

export const CameraTest: React.FC<CameraTestProps> = ({
    cameraDevices,
    isCameraGranted,
    cameraVideoStreamRef,
    onChange,
}) => {
    return (
        <div className="camera-test-container">
            <div className="camera-test-text">摄像头</div>
            <div className="camera-test-select-box">
                <DeviceTestSelect
                    devices={cameraDevices}
                    isGranted={isCameraGranted}
                    onChange={onChange}
                />
            </div>
            <div className="camera-test-wrapper">
                <div className="camera-box" ref={cameraVideoStreamRef} />
                <div
                    className={classNames("camera-no-accredit-box", {
                        visible: !isCameraGranted,
                    })}
                >
                    <img src={cameraDisabledSVG} />
                    <span>请开启浏览器的摄像头使用权限</span>
                </div>
            </div>
        </div>
    );
};
