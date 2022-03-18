import React, { Component, useEffect, useState } from "react";
import ClothingSupplyChain from "../../build/contracts/ClothingSupplyChain.json";
import detectEthereumProvider from "@metamask/detect-provider";
import Image from "next/image";
import {useRouter} from "next/router";
import Web3 from "web3";
import getWeb3 from "./getWeb3";
import { Button, Input } from "antd";
import Loading from "./Loading";

const App = () => {
    const [state, setState] = useState({
        web3: null,
        accounts: null,
        contract: null,
    });
    const [loading,setLoading] = useState(true)
    const router = useRouter()
    const [registrationNo, setRegistrationNo] = useState("");
    const [farmerName, setFarmerName] = useState("");
    const [farmAddress, setFarmAddress] = useState("");
    const [exporterName, setExporterName] = useState("");
    const [importerName, setImporterName] = useState("");
    const [batchNo, setBatchNo] = useState("");
    const [returnValue, setReturnValue] = useState(null);
    const [allDetails, setAllDetails] = useState();
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
                setState({ web3, accounts, contract: instance });
            } catch (error) {
                alert(
                    `Failed to load web3, accounts, or contract.
                Check console for details.`
                );
                console.error(error);
            }
        };
        init();
        // "0x69b6bF0d2Daaad6cBEbBd62e4AEA94ce5Cf93eF4"
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
            .send({ from: accounts[0], gasPrice: "200" });
        console.log(batchNo1.events.CottonHarvested.returnValues.batchNo);
        setBatchNo(batchNo1.events.CottonHarvested.returnValues.batchNo);
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
            .send({ from: accounts[0], gasPrice: "200" });
        console.log(returnValue);
        setReturnValue(returnValue);
        // console.log(test.call().send({ from: state.accounts[0] }))
    };
    const getAllBasicDetails = async () => {
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
            .getAllBasicDetails()
            .send({ from: accounts[0], gasPrice: "200" });
        console.log(returnValue);
        setAllDetails(returnValue.events.RetrievedAll.returnValues.result);
        // console.log(test.call().send({ from: state.accounts[0] }))
    };
    if (!state.web3) {
        return(<Loading/>)
    }
    return (
        // <div className="flex-col flex items-center justify-center">
        //     <h1 className="text-3xl font-bold">Welcome to Candour </h1>
        //     {batchNo != "" ? (
        //         <span>
        //             Your batch number is:{" "}
        //             <span className="font-bold">{batchNo}</span>{" "}
        //         </span>
        //     ) : (
        //         <span></span>
        //     )}
        //     <input
        //         className="border mt-5 px-5"
        //         placeholder="Registration No."
        //         onChange={(e) => setRegistrationNo(e.target.value)}
        //     ></input>
        //     <input
        //         className="border mt-5 px-5"
        //         placeholder="Farmer Name"
        //         onChange={(e) => setFarmerName(e.target.value)}
        //     ></input>
        //     <input
        //         className="border mt-5 px-5"
        //         placeholder="Farm Address"
        //         onChange={(e) => setFarmAddress(e.target.value)}
        //     ></input>
        //     <input
        //         className="border mt-5 px-5"
        //         placeholder="Exporter Name"
        //         onChange={(e) => setExporterName(e.target.value)}
        //     ></input>
        //     <input
        //         className="border mt-5 px-5"
        //         placeholder="Importer Name"
        //         onChange={(e) => setImporterName(e.target.value)}
        //     ></input>
        //     <Button className="mt-5" onClick={() => setBasicDetails()}>
        //         setBasicDetails
        //     </Button>
        //     <div className="flex-row flex w-1/3 justify-center ">
        //         {returnValue != null ? (
        //             <div className="p-8 flex-col flex items-center">
        //                 <span>
        //                     Registration No. is:{" "}
        //                     {
        //                         returnValue.events.CottonBatchNo.returnValues
        //                             .registrationNo
        //                     }
        //                 </span>
        //                 <span>
        //                     Farmer's name is:{" "}
        //                     {
        //                         returnValue.events.CottonBatchNo.returnValues
        //                             .farmerName
        //                     }
        //                 </span>

        //                 <span>
        //                     Farm Address is:{" "}
        //                     {
        //                         returnValue.events.CottonBatchNo.returnValues
        //                             .farmAddress
        //                     }
        //                 </span>
        //                 <span>
        //                     Exporter Name is:{" "}
        //                     {
        //                         returnValue.events.CottonBatchNo.returnValues
        //                             .exporterName
        //                     }
        //                 </span>
        //                 <span>
        //                     Importer Name is:{" "}
        //                     {
        //                         returnValue.events.CottonBatchNo.returnValues
        //                             .importerName
        //                     }
        //                 </span>
        //             </div>
        //         ) : (
        //             <div className="p-8"></div>
        //         )}
        //     </div>
        //     <Button onClick={() => getBasicDetails(batchNo)}>
        //         getBasicDetails
        //     </Button>
        //     <Button onClick={() => getAllBasicDetails()}>
        //         getAllBasicDetails
        //     </Button>
        //     <div className=" w-full flex-col flex">
        //         <div className="p-8 flex-col flex items-center">
        //             {allDetails && allDetails.map((entries) => {
        //                 return (
        //                     <div className="flex-col flex mb-5">
        //                         <span>
        //                             Registration No. is:{" "}
        //                             {
        //                                 entries.registrationNo

        //                             }
        //                         </span>
        //                         <span>
        //                             Farmer's name is:{" "}
        //                             {
        //                                 entries.farmerName

        //                             }
        //                         </span>

        //                         <span>
        //                             Farm Address is:{" "}
        //                             {
        //                                 entries.farmAddress

        //                             }
        //                         </span>
        //                         <span>
        //                             Exporter Name is:{" "}
        //                             {
        //                                 entries.exporterName

        //                             }
        //                         </span>
        //                         <span>
        //                             Importer Name is:{" "}
        //                             {
        //                                 entries.importerName

        //                             }
        //                         </span>
        //                     </div>
        //                 );
        //             })}
        //         </div>
        //     </div>
        // </div>
        // <div className="w-full h-screen flex-col flex items-center justify-center p-5">
        //     <div className="flex-row flex w-full justify-between p-5 items-center top-0 absolute">
        //         <div className="w-1/6">
        //             <Image
        //                 src="/Candour_Square.png"
        //                 width={1000}
        //                 height={200}
        //             />
        //         </div>
        //         <div className="flex-col justify-center">
        //             <div>
        //                 <span>Lai Jye Yi</span>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="flex-col flex text-center w-full items-center	px-10">
        //         <span className="text-2xl">Please scan / enter Batch No.</span>
        //         <span>You can find the batch number attached to products</span>
        //         <Image src={"/scanme.png"} width ={150} height = {200} />
        //         <div className=" w-full mt-2">
        //             <input className="md:w-1/2 w-full border p-3 rounded-2xl " placeholder="Input product Batch No." onChange={(e) => setBatchNo(e.target.value)}/>
        //         </div>
        //         {/* <Button className="mt-2 ">Scan QR Code</Button> */}
        //         <div className="md:w-1/2  p-3 w-full bg-black rounded-2xl cursor-pointer mt-2" onClick={()=>router.push({
        //             pathname:"/batchno", query:{
        //                 batchno:batchNo
        //             }
        //         })}>
        //             <span className="text-white ">Scan QR Code</span>
        //         </div>
        //         <span onClick={()=>router.push('/newbatch')} className="text-xs text-blue-500 cursor-pointer underline mt-2">Not this? Start a new batch</span>
        //     </div>
        // </div>
        <div className="w-full h-screen flex-col flex pt-7 pl-4 pr-4 lg:pb-10 pb-28 bg-center bg-cover" style={{ backgroundImage: 'url(' + "https://i.im.ge/2022/03/18/lxoEWF.png" + ')' }}>
            <div className="grid grid-cols-6 gap-4 pb-6">
                <div className="col-start-1 col-span-2 pl-5"><img
                    src="/navbarlogo.png"
                    width={80}
                    height="auto"
                /></div>
                <div data-tooltip-placement="bottom" data-tooltip-target="tooltip-bottom" className="col-start-5 col-span-2 pr-5 font-semibold" style={{ textAlignLast: "end" }}>
                    {state.accounts[0].substring(0, 5) + "..." + state.accounts[0].substring(state.accounts[0].length - 4)}
                </div>
            </div>

            <div className="w-full h-full bg-white shadow-lg rounded-md px-5 pt-5 text-center lg:h-full">
                <h3 className="font-semibold text-2xl text-gray-600 font-sans pb-0 mb-0 pt-3">Scan or enter batch number.</h3>
                <p className="text-gray-500 text-xs">Batch number are usually found on products and receipts.<br />Otherwise, liaise with your suppliers to find out about .</p>
                <img src="/scan.gif" className="p-8 inline h-max w-max lg:h-2/5 md:h-3/5 sm:h-3/5" />
                <div className=" w-full mt-2">
                    <input id="default" className="w-3/5 border p-3 rounded-lg text-xs" placeholder="Product Batch No." onChange={(e) => setBatchNo(e.target.value)} />
                </div>
                {/* <button className="md:w-1/2 p-3 w-full bg-black rounded-lg font-bold py-2 px-4 rounded inline-flex items-center" onClick={()=>console.log(state.accounts[0])}>
                    <span className="text-white font-semibold text-xs">Scan QR Code</span>
                </button> */}
                <button type="submit" className="mt-3 inline-flex w-3/5 justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-2 bi bi-qr-code-scan" viewBox="0 0 16 16">
                        <path d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0v-3Zm12 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V1h-2.5a.5.5 0 0 1-.5-.5ZM.5 12a.5.5 0 0 1 .5.5V15h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5Zm15 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H15v-2.5a.5.5 0 0 1 .5-.5ZM4 4h1v1H4V4Z" />
                        <path d="M7 2H2v5h5V2ZM3 3h3v3H3V3Zm2 8H4v1h1v-1Z" />
                        <path d="M7 9H2v5h5V9Zm-4 1h3v3H3v-3Zm8-6h1v1h-1V4Z" />
                        <path d="M9 2h5v5H9V2Zm1 1v3h3V3h-3ZM8 8v2h1v1H8v1h2v-2h1v2h1v-1h2v-1h-3V8H8Zm2 2H9V9h1v1Zm4 2h-1v1h-2v1h3v-2Zm-4 2v-1H8v1h2Z" />
                        <path d="M12 9h2V8h-2v1Z" />
                    </svg>
                    Scan QR Code
                </button>
                <br />
                <button onClick={() => router.push({
                    pathname: "/batchno", query: {
                        batchno: batchNo
                    }
                })}
                    type="submit" class="mt-1 inline-flex w-3/5 justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-2 bi bi-arrow-right-square-fill" viewBox="0 0 16 16">
                        <path d="M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1z" />
                    </svg>
                    Continue</button>
                <br />
                <span onClick={() => router.push('/newbatch')} className="text-xs text-blue-500 cursor-pointer underline mt-2">Not this? Start a new batch</span>
            </div>
        </div>
    );
};
export default App;
