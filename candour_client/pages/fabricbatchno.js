import { useRouter } from "next/router";
import React, { Component, useEffect, useState } from "react";
import ClothingSupplyChain from "../../build/contracts/ClothingSupplyChain.json";
import detectEthereumProvider from "@metamask/detect-provider";
import Image from "next/image";
import Web3 from "web3";
import getWeb3 from "./getWeb3";
import { Button, Divider, Input } from "antd";

function pid() {
    const [state, setState] = useState({
        web3: null,
        accounts: null,
        contract: null,
    });
    const [result, setResult] = useState();
    const [batchNo, setBatchNo] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [factoryName, setFactoryName] = useState("");
    const [waterUsed, setWaterUsed] = useState("");
    const [dyeUsed, setDyeUsed] = useState("");
    const [fabricType, setFabricType] = useState("");
    const [pocId, setPocId] = useState("");
    const [pocName, setPocName] = useState("");

    const router = useRouter();
    const {
        query: { batchno },
    } = router;

    const setFabricDetails = async () => {
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
            .setFabricDetails(
                batchNo,
                factoryName,
                fabricType,
                dyeUsed,
                pocName,
                pocId,
                waterUsed
            )
            .send({ from: accounts[0], gasPrice: "200" });
    };
    useEffect(() => {
        const init = async () => {
            try {
                setBatchNo(batchno);
                const web3 = await getWeb3();
                const accounts = await web3.eth.getAccounts();
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = ClothingSupplyChain.networks[networkId];
                const instance = new web3.eth.Contract(
                    ClothingSupplyChain.abi,
                    deployedNetwork && deployedNetwork.address
                );
                setState({ web3, accounts, contract: instance });
                if (batchno != undefined) {
                    console.log(instance);
                    const returnValue = await instance.methods
                        .getFabricDetails(batchno)
                        .send({ from: accounts[0] });
                    setFabricType(
                        returnValue.events.FabricBatchNo.returnValues.fabricType
                    );
                    setDyeUsed(
                        returnValue.events.FabricBatchNo.returnValues.dyeUsed
                    );
                    setFactoryName(
                        returnValue.events.FabricBatchNo.returnValues
                            .factoryName
                    );
                    setPocId(
                        returnValue.events.FabricBatchNo.returnValues.pocId
                    );
                    setPocName(
                        returnValue.events.FabricBatchNo.returnValues.pocName
                    );
                    setWaterUsed(
                        returnValue.events.FabricBatchNo.returnValues.waterUsed
                    );
                    setResult(returnValue);
                    console.log(returnValue);
                }
            } catch (error) {
                alert(
                    `Failed to load web3, accounts, or contract.
                Check console for details.`
                );
                console.error(error);
            }
        };
        init();
        console.log(result);
    }, [router]);
    return (
        <div className="w-full flex-col flex items-center justify-center p-5">
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
            <div>
                <div className="flex-col flex ">
                    <span className="text-2xl">
                        Fabric Manufacturer Information
                    </span>
                    <span>Find out more about your suppliers</span>
                </div>
            </div>
            <Divider />
            <div className=" w-full px-8">
                <div className="flex-col w-full ">
                    <div>
                        <span className="font-bold">
                            Cumulative Sustainability Meter
                        </span>
                    </div>
                    <Image src="/cumulative.png" width={2000} height={10} />
                    <div className="w-full px-16">
                        <Image src="/tag.png" width={20} height={20} />
                    </div>
                </div>
                <div
                    onClick={() => {
                        setIsEdit(!isEdit);
                    }}
                    className="border rounded-full p-2 bg-blue-100 w-1/8 items-center flex flex-col "
                >
                    Edit
                </div>
                <div className="flex-col w-full mt-5">
                    <div>
                        <span className="font-bold">Batch Number</span>

                        <div className="w-full mt-2 p-3 bg-gray-100 rounded-xl border">
                            <span className="text-gray-400">
                                {result ? batchNo : ""}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex-col w-full mt-5">
                    <div>
                        <span className="font-bold">Factory Name</span>
                        {!isEdit ? (
                            <div className="w-full mt-2 p-3 bg-gray-100 rounded-xl border">
                                <span className="text-gray-400">
                                    {factoryName}
                                </span>
                            </div>
                        ) : (
                            <div className="w-full mt-2 p-3 bg-white rounded-xl border">
                                <input
                                    className="text-gray-400 w-full bg-white outline-0"
                                    placeholder={factoryName}
                                    onChange={(e) =>
                                        setFactoryName(e.target.value)
                                    }
                                ></input>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-col w-full mt-5">
                    <div>
                        <span className="font-bold">Fabric Type</span>
                        {!isEdit ? (
                            <div className="w-full mt-2 p-3 bg-gray-100 rounded-xl border">
                                <span className="text-gray-400">
                                    {fabricType}
                                </span>
                            </div>
                        ) : (
                            <div className="w-full mt-2 p-3 bg-white rounded-xl border">
                                <input
                                    className="text-gray-400 w-full bg-white outline-0"
                                    placeholder={fabricType}
                                    onChange={(e) =>
                                        setFabricType(e.target.value)
                                    }
                                ></input>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-col w-full mt-5">
                    <div>
                        <span className="font-bold">Dye Used</span>
                        {!isEdit ? (
                            <div className="w-full mt-2 p-3 bg-gray-100 rounded-xl border">
                                <span className="text-gray-400">{dyeUsed}</span>
                            </div>
                        ) : (
                            <div className="w-full mt-2 p-3 bg-white rounded-xl border">
                                <input
                                    className="text-gray-400 w-full bg-white outline-0"
                                    placeholder={dyeUsed}
                                    onChange={(e) =>
                                        setDyeUsed(e.target.value)
                                    }
                                ></input>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-col w-full mt-5">
                    <div>
                        <span className="font-bold">POC Name</span>
                        {!isEdit ? (
                            <div className="w-full mt-2 p-3 bg-gray-100 rounded-xl border">
                                <span className="text-gray-400">{pocName}</span>
                            </div>
                        ) : (
                            <div className="w-full mt-2 p-3 bg-white rounded-xl border">
                                <input
                                    className="text-gray-400 w-full bg-white outline-0"
                                    placeholder={pocName}
                                    onChange={(e) =>
                                        setPocName(e.target.value)
                                    }
                                ></input>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-col w-full mt-5">
                    <div>
                        <span className="font-bold">POC ID</span>
                        {!isEdit ? (
                            <div className="w-full mt-2 p-3 bg-gray-100 rounded-xl border">
                                <span className="text-gray-400">{pocId}</span>
                            </div>
                        ) : (
                            <div className="w-full mt-2 p-3 bg-white rounded-xl border">
                                <input
                                    className="text-gray-400 w-full bg-white outline-0"
                                    placeholder={pocId}
                                    onChange={(e) =>
                                        setPocId(e.target.value)
                                    }
                                ></input>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-col w-full mt-5">
                    <div>
                        <span className="font-bold">Water Used</span>
                        {!isEdit ? (
                            <div className="w-full mt-2 p-3 bg-gray-100 rounded-xl border">
                                <span className="text-gray-400">
                                    {waterUsed}
                                </span>
                            </div>
                        ) : (
                            <div className="w-full mt-2 p-3 bg-white rounded-xl border">
                                <input
                                    className="text-gray-400 w-full bg-white outline-0"
                                    placeholder={waterUsed}
                                    onChange={(e) =>
                                        setWaterUsed(e.target.value)
                                    }
                                ></input>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="w-full px-8 mt-16">
                {isEdit?(
                    <div className="w-full p-3 border border-black rounded-xl  text-center" onClick={()=>setFabricDetails()}>
                        <span>Submit Changes</span>
                    </div>
                ) : (
                    <div></div>
                )}
                <div className="w-full p-3 border border-black rounded-xl mt-5 text-center">
                    <span>View Batch History</span>
                </div>
                <div className="w-full p-3 border text-white rounded-xl bg-black mt-5 text-center">
                    <span>Continue</span>
                </div>
            </div>
        </div>
    );
}

export default pid;
