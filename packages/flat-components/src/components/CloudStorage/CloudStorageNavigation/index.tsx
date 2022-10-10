import "./style.less";

import React, { useMemo } from "react";
import { Breadcrumb } from "antd";
import rightSVG from "./icons/right.svg";

export interface CloudStorageNavigationProps {
    // eg: /myCloudStorage/aaa/bbb/ccc
    path: string;
    pushHistory: (path: string) => void;
}

export const CloudStorageNavigation = /* @__PURE__ */ React.memo<CloudStorageNavigationProps>(
    function CloudStorageNavigation({ path, pushHistory }) {
        const pathName = useMemo(() => path.split("/").filter(Boolean), [path]);

        return (
            <div className="cloud-storage-navigation-container">
                <Breadcrumb separator={<img src={rightSVG} />}>
                    {pathName.length >= 5 ? (
                        <>
                            <Breadcrumb.Item>
                                <a onClick={() => pushHistory("/")}>myCloudStorage</a>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span className="cloud-storage-navigation-more-path">...</span>
                            </Breadcrumb.Item>
                            {pathName.map((path, index) => {
                                const routePath =
                                    "/" + pathName.slice(0, index + 1).join("/") + "/";
                                // get last tree element of path name array
                                if (pathName.slice(-3).some(pathVal => path === pathVal)) {
                                    return (
                                        <Breadcrumb.Item key={index}>
                                            <a onClick={() => pushHistory(routePath)}>{path}</a>
                                        </Breadcrumb.Item>
                                    );
                                }
                                return null;
                            })}
                        </>
                    ) : (
                        <>
                            <Breadcrumb.Item>
                                <a onClick={() => pushHistory("/")}>myCloudStorage</a>
                            </Breadcrumb.Item>
                            {pathName.map((path, index) => {
                                const routePath =
                                    "/" + pathName.slice(0, index + 1).join("/") + "/";
                                return (
                                    <Breadcrumb.Item key={index}>
                                        <a onClick={() => pushHistory(routePath)}>{path}</a>
                                    </Breadcrumb.Item>
                                );
                            })}
                        </>
                    )}
                </Breadcrumb>
            </div>
        );
    },
);
