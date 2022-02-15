import React from "react";
import Image from "next/image";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function Loading(props) {
    const antIcon = <LoadingOutlined style={{ fontSize: 42 }} spin />;
    return (
        <div className="h-screen flex-col flex items-center justify-center w-screen">
            <div className="w-1/3 ">
                <Image src="/Candour_Square.png" height={200} width={1000} />
            </div>
            <Spin indicator={antIcon}></Spin>
        </div>
    );
}

export default Loading;
