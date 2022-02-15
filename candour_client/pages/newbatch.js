import React from "react";
import Image from "next/image";
import { Divider } from "antd";
import { useRouter } from "next/router";

function newbatch(props) {
    const router = useRouter();

    return (
        <div className="w-full h-full flex-col flex items-center p-5">
            <div className="flex-row flex w-full justify-between p-5 items-center top-0 absolute">
                <div className="w-1/6">
                    <Image
                        src="/Candour_Square.png"
                        width={1000}
                        height={200}
                    />
                </div>
                <div className="flex-col justify-center">
                    <div>
                        <span>Lai Jye Yi</span>
                    </div>
                </div>
            </div>
            <div className="flex-col flex w-full px-8 mt-16">
                <span className="text-2xl">Sustainability Declaration</span>
                <span>Voluntary disclosure of manufacturing processes</span>
            </div>
            <Divider />
            {/* string registrationNo;

        string farmerName;
        string farmAddress;
        string exporterName;
        string importerName; */}
            <div className="w-full">
                <div className="flex-col w-full ">
                    <div>
                        <span className="font-bold">Registration Number</span>
                        <div className="w-full mt-2 p-3  rounded-xl border">
                            <input
                                placeholder="Unique identifier for this good"
                                className="text-gray-400 w-full "
                            ></input>
                        </div>
                    </div>
                </div>
                <div className="flex-col w-full mt-5">
                    <div>
                        <span className="font-bold">Farmer's Name</span>
                        <div className="w-full mt-2 p-3  rounded-xl border">
                            <input
                                placeholder="Name of farmer that harvested"
                                className="text-gray-400 w-full "
                            ></input>
                        </div>
                    </div>
                </div>
                <div className="flex-col w-full mt-5">
                    <div>
                        <span className="font-bold">Farm's Address</span>
                        <div className="w-full mt-2 p-3  rounded-xl border">
                            <input
                                placeholder="Where the farm is located"
                                className="text-gray-400 w-full "
                            ></input>
                        </div>
                    </div>
                </div>
                <div className="flex-col w-full mt-5">
                    <div>
                        <span className="font-bold">Exporter's Name</span>
                        <div className="w-full mt-2 p-3  rounded-xl border">
                            <input
                                placeholder="Name of exporter company"
                                className="text-gray-400 w-full "
                            ></input>
                        </div>
                    </div>
                </div>
                <div className="flex-col w-full mt-5">
                    <div>
                        <span className="font-bold">Importer's Name</span>
                        <div className="w-full mt-2 p-3  rounded-xl border">
                            <input
                                placeholder="Name of importer company"
                                className="text-gray-400 w-full "
                            ></input>
                        </div>
                    </div>
                </div>

                <div onClick={()=>router.push("/")} className="w-full items-center flex-col bg-black rounded-full flex mt-8 p-4 border cursor-pointer">
                    <span className="text-white ">
                        Submit Details
                    </span>
                </div>
            </div>
            
        </div>
    );
}

export default newbatch;
