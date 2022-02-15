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
    const router = useRouter();
    const {
        query: { batchno },
    } = router;

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
                    const returnValue = await instance.methods
                        .getBasicDetails(batchno)
                        .send({ from: accounts[0] });
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
        <div className="w-full h-screen flex-col flex items-center justify-center p-5">
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
                    <span className="text-2xl">Batch Information</span>
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
                        <span className="font-bold">Seller Company Name</span>
                        <div className="w-full mt-2 p-3 bg-gray-100 rounded-xl border">
                            <span className="text-gray-400">
                                {result ? result.events.CottonBatchNo.returnValues.farmAddress : ""}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex-col w-full mt-5">
                    <div>
                        <span className="font-bold">Logistics Partner</span>
                        <div className="w-full mt-2 p-3 bg-gray-100 rounded-xl border">
                            <span className="text-gray-400">
                                {result ? result.events.CottonBatchNo.returnValues.importerName : ""}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full px-8 mt-16">
                <div className="w-full p-3 border border-black rounded-xl  text-center">
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
