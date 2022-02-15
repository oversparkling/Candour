import React from "react";
import QRCode from "qrcode.react";
import { Fragment, useRef, useState } from "react";
import ClothingSupplyChain from "../../build/contracts/ClothingSupplyChain.json";
import { Spin } from "antd";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import Image from "next/image";
import getWeb3 from "./getWeb3";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import { Divider } from "antd";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";

function newbatch(props) {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    const [open, setOpen] = useState(false);
    const [registrationNo, setRegistrationNo] = useState("");
    const [farmerName, setFarmerName] = useState("");
    const [farmAddress, setFarmAddress] = useState("");
    const [exporterName, setExporterName] = useState("");
    const [importerName, setImporterName] = useState("");
    const [batchNo, setBatchNo] = useState("");
    const cancelButtonRef = useRef(null);
    const setBasicDetails = async () => {
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = ClothingSupplyChain.networks[networkId];
        const instance = new web3.eth.Contract(
            ClothingSupplyChain.abi,
            deployedNetwork && deployedNetwork.address
        );
        const batchNo1 = await instance.methods
            .setBasicDetails(
                registrationNo,
                farmerName,
                farmAddress,
                exporterName,
                importerName
            )
            .send({ from: accounts[0], gasPrice: "200" });
        setBatchNo(batchNo1.events.CottonHarvested.returnValues.batchNo);
        // console.log(test.call().send({ from: state.accounts[0] }))
    };
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
                                className="text-gray-400 w-full outline-0 "
                                onChange={(e) =>
                                    setRegistrationNo(e.target.value)
                                }
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
                                className="text-gray-400 w-full outline-0"
                                onChange={(e) => setFarmerName(e.target.value)}
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
                                className="text-gray-400 w-full outline-0"
                                onChange={(e) => setFarmAddress(e.target.value)}
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
                                className="text-gray-400 w-full outline-0 "
                                onChange={(e) =>
                                    setExporterName(e.target.value)
                                }
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
                                className="text-gray-400 w-full outline-0 "
                                onChange={(e) =>
                                    setImporterName(e.target.value)
                                }
                            ></input>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => {
                        setBasicDetails();
                        setOpen(true);
                    }}
                    className="w-full items-center flex-col bg-black rounded-full flex mt-8 p-4 border cursor-pointer"
                >
                    <span className="text-white ">Submit Details</span>
                </div>
            </div>
            <Transition.Root show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    initialFocus={cancelButtonRef}
                    onClose={setOpen}
                >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <ExclamationIcon
                                                className="h-6 w-6 text-red-600"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg leading-6 font-medium text-gray-900"
                                            >
                                                New Batch Number
                                            </Dialog.Title>
                                            <div className="mt-2 items-center flex flex-col w-full ">
                                                {batchNo == "" ? (
                                                    <div className="mt-2">
                                                        <Spin
                                                            indicator={antIcon}
                                                        ></Spin>
                                                    </div>
                                                ) : (
                                                    <div className=" flex-col flex text-center items-center">
                                                        <p className="text-sm text-gray-500">
                                                            Your new batch
                                                            number is{" "}
                                                            <span className="text-sm text-gray-500 font-bold">
                                                                {batchNo}
                                                            </span>
                                                        </p>
                                                        <QRCode
                                                            value={"http://localhost:3000/batchno?batchno="+batchNo}
                                                            size={100}
                                                            // fg Color={"#a4091c"}
                                                        />
                                                        <p className="text-sm text-gray-500 mt-5">
                                                            Please note down
                                                            this number for
                                                            future references
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setOpen(false)}
                                    >
                                        Ok
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
}

export default newbatch;
