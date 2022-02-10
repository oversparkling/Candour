import React, {Component, useEffect, useState} from "react";
import ClothingSupplyChain from "../../build/contracts/ClothingSupplyChain.json";
import detectEthereumProvider from "@metamask/detect-provider";

import Web3 from "web3";
import getWeb3 from "./getWeb3";
import {Button, Input} from "antd";

const App = () => {
    const [state, setState] = useState({
        web3: null,
        accounts: null,
        contract: null,
    });
    const [registrationNo, setRegistrationNo] = useState("");
    const [farmerName, setFarmerName] = useState("");
    const [farmAddress, setFarmAddress] = useState("");
    const [exporterName, setExporterName] = useState("");
    const [importerName, setImporterName] = useState("");
    const [batchNo, setBatchNo] = useState("");
    const [returnValue, setReturnValue] = useState(null);
    useEffect(() => {
        const init = async () => {
            try {
                const web3 = await getWeb3();
                const accounts = await web3.eth.getAccounts();
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = ClothingSupplyChain.networks[networkId];
                const instance = new web3.eth.Contract(
                    ClothingSupplyChain.abi,
                    deployedNetwork && deployedNetwork.address
                );
                setState({web3, accounts, contract: instance});
            } catch (error) {
                alert(
                    `Failed to load web3, accounts, or contract.
                Check console for details.`
                );
                console.error(error);
            }
        };
        init();
        console.log(state.web3);
    }, []);
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
        console.log(state.contract.options);
        const batchNo1 = await state.contract.methods
            .setBasicDetails(
                registrationNo,
                farmerName,
                farmAddress,
                exporterName,
                importerName
            )
            .send({from: accounts[0], gasPrice: "200"});
        console.log(batchNo1.events.CottonHarvested.returnValues.batchNo);
        setBatchNo(batchNo1.events.CottonHarvested.returnValues.batchNo);
        // console.log(test.call().send({ from: state.accounts[0] }))
    };

    const getBasicDetails = async () => {
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = ClothingSupplyChain.networks[networkId];
        const instance = new web3.eth.Contract(
            ClothingSupplyChain.abi,
            deployedNetwork && deployedNetwork.address
        );

        const returnValue = await state.contract.methods
            .getBasicDetails(batchNo)
            .send({from: accounts[0], gasPrice: "200"});
        console.log(returnValue);
        setReturnValue(returnValue);
        // console.log(test.call().send({ from: state.accounts[0] }))
    };
    if (!state.web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
        <div className="flex-col flex items-center justify-center">
            <h1 className="text-3xl font-bold">Welcome to Candour </h1>
            {batchNo != "" ? (
                <span>
                    Your batch number is:{" "}
                    <span className="font-bold">{batchNo}</span>{" "}
                </span>
            ) : (
                <span></span>
            )}
            <input
                className="border mt-5 px-5"
                placeholder="Registration No."
                onChange={(e) => setRegistrationNo(e.target.value)}
            ></input>
            <input
                className="border mt-5 px-5"
                placeholder="Farmer Name"
                onChange={(e) => setFarmerName(e.target.value)}
            ></input>
            <input
                className="border mt-5 px-5"
                placeholder="Farm Address"
                onChange={(e) => setFarmAddress(e.target.value)}
            ></input>
            <input
                className="border mt-5 px-5"
                placeholder="Exporter Name"
                onChange={(e) => setExporterName(e.target.value)}
            ></input>
            <input
                className="border mt-5 px-5"
                placeholder="Importer Name"
                onChange={(e) => setImporterName(e.target.value)}
            ></input>
            <Button className="mt-5" onClick={() => setBasicDetails()}>
                setBasicDetails
            </Button>
            <div className="flex-row flex w-1/3 justify-center ">
                {returnValue != null ? (
                    <div className="p-8 flex-col flex items-center">
                        <span>
                            Registration No. is:{" "}
                            {
                                returnValue.events.CottonBatchNo.returnValues
                                    .registrationNo
                            }
                        </span>
                        <span>
                            Farmer's name is:{" "}
                            {
                                returnValue.events.CottonBatchNo.returnValues
                                    .farmerName
                            }
                        </span>

                        <span>
                            Farm Address is:{" "}
                            {
                                returnValue.events.CottonBatchNo.returnValues
                                    .farmAddress
                            }
                        </span>
                        <span>
                            Exporter Name is:{" "}
                            {
                                returnValue.events.CottonBatchNo.returnValues
                                    .exporterName
                            }
                        </span>
                        <span>
                            Importer Name is:{" "}
                            {
                                returnValue.events.CottonBatchNo.returnValues
                                    .importerName
                            }
                        </span>
                    </div>
                ) : (
                    <div className="p-8"></div>
                )}
            </div>
            <Button onClick={() => getBasicDetails(batchNo)}>
                getBasicDetails
            </Button>
        </div>
    );
};
export default App;
