import React, { Component, useEffect, useState, useRef } from "react";
import ClothingSupplyChain from "../contracts/ClothingSupplyChain.json";
import detectEthereumProvider from "@metamask/detect-provider";
import {useRouter} from "next/router";
import Web3 from "web3";
import getWeb3 from "./getWeb3";
import Loading from "./Loading";
import QrcodeDecoder from 'qrcode-decoder';
import { notification } from 'antd';

const App = () => {
    const openNotification = placement => {
        notification.info({
            message: `File Uploaded`,
            description: 'Please hold while we process your document.',
            placement,
        });
    };

    const successNotification = placement => {
        notification.success({
            message: `Success`,
            description: 'Batch number was found in QR Code. You will be redirected shortly. ',
            placement,
        });
    };

    const failureNotification = placement => {
        notification.error({
            message: `An error has occured.`,
            description: 'Unable to detect QR Code in file. Please try again with another file.',
            placement,
        });
    };

    const [state, setState] = useState({
        web3: null,
        accounts: null,
        contract: null,
    });
    const [loading,setLoading] = useState(true)
    const router = useRouter()
    const uploadQR = useRef(null);
    var qr = new QrcodeDecoder();
    const iconHandleClick = () => {
        uploadQR.current.click()
    }
    const [registrationNo, setRegistrationNo] = useState("");
    const [farmerName, setFarmerName] = useState("");
    const [farmAddress, setFarmAddress] = useState("");
    const [exporterName, setExporterName] = useState("");
    const [importerName, setImporterName] = useState("");
    const [batchNo, setBatchNo] = useState("");
    const [returnValue, setReturnValue] = useState(null);
    const [allDetails, setAllDetails] = useState();
    
    useEffect(() => {
        document.title = 'Candour'
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

    const handleUpload = async (event) => {
        openNotification('topRight')
        try {
            if (event.target.files[0].name.split(".").pop() == 'pdf') {
                var file = event.target.files[0];
                var fileReader = new FileReader();
                fileReader.onload = async function () {
                    const canvas = document.createElement("canvas");
                    const pdfJS = require("pdfjs-dist/build/pdf.js");
                    const pdfJSWorker = require("pdfjs-dist/build/pdf.worker.entry.js");
                    pdfJS.GlobalWorkerOptions.workerSrc = pdfJSWorker;

                    var typedarray = new Uint8Array(this.result);
                    const pdf = await pdfJS.getDocument(typedarray).promise;

                    for (let i = 0; i < pdf.numPages; i++) {
                        const page = await pdf.getPage(i + 1);
                        const viewport = page.getViewport({ scale: 2 });
                        const context = canvas.getContext("2d");
                        canvas.height = viewport.height * 2;
                        canvas.width = 2480 * 2;
                        await page.render({ canvasContext: context, viewport: viewport }).promise;
                        canvas.toBlob(function (blob) {
                            var image = URL.createObjectURL(blob);
                            qr.decodeFromImage(image).then((res) => {
                                setBatchNo(res.data.split("batchno?batchno=")[1]);
                                successNotification('topRight');
                            }).catch(function (error) {
                                console.log("Unable to detect QR Code");
                            });
                        });
                    }
                }
                fileReader.readAsArrayBuffer(file)
            } else {
                let image = URL.createObjectURL(event.target.files[0]);
                qr.decodeFromImage(image).then((res) => {
                    console.log(res.data)
                    setBatchNo(res.data.split("batchno?batchno=")[1]);
                    if (res.data.split("batchno?batchno=")[1] !== undefined) {
                        successNotification('topRight');
                    } else {
                        throw "exit"
                    }
                }).catch(function (error) {
                    failureNotification('topRight');
                    console.log("Unable to detect QR Code");
                });
            }
        } catch (error) {
            console.log("An error occured")
        }
    }

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
        <div className="pt-7 px-4 lg:pb-10 pb-28 bg-standard bg-cover lg:px-10" style={{ backgroundPosition: "left top" }}>
            <div className="grid grid-cols-6 gap-4 pb-6">
                <div onClick={() => router.push("/")} className="cursor-pointer col-start-1 col-span-2 pl-5"><img
                    src="/navbarlogo.png"
                    width={80}
                    height="auto"
                /></div>
                <div data-tooltip-placement="bottom" data-tooltip-target="tooltip-bottom" className="col-start-5 col-span-2 pr-5 font-semibold" style={{ textAlignLast: "end" }}>
                    {state.accounts[0].substring(0, 5) + "..." + state.accounts[0].substring(state.accounts[0].length - 4)}
                </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg px-5 pt-5 lg:h-full lg:px-7 lg:text-center md:text-center">
                <h3 className="font-header text-xl tracking-tighter mb-1 text-black-900 lg:text-2xl lg:pt-2">Add / View Batch <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="cursor-pointer ml-0.5 mb-0.5 item-center inline bi bi-question-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"/>
</svg></h3>
                <p className="text-black-800 text-xs tracking-tighter leading-none font-prints lg:text-sm">Upload / scan receipt or input product batch number to begin. Contact your suppliers to find out more.</p>
                <div className="lg:h-60 sm:h-40 md:h-56 xl:h-56 2xl:h-56 h-44 text-center">
                    <img src="/qrscan.gif" className="p-4 inline h-full w-auto" />
                </div>
                <div className="pb-8 w-full mt-2 text-center lg:px-20">
                    <label htmlFor="website-admin" className="block mb-1 font-semibold text-black-900 tracking-tighter text-left">Batch Number</label>
                    <div className="flex justify-center">
                        <div className="w-full inline-flex h-12">
                            <input onChange={(e) => setBatchNo(e.target.value)} type="text" value={batchNo} className="focus:border-blue-900 rounded-none rounded-l-lg border outline-0 border-gray-300 text-gray-900 text-xs font-prints block flex-1 min-w-0 w-full text-xs border-gray-300 p-2.5" placeholder="e.g. 0x2108429832e29832" />
                            <input ref={uploadQR} id="uploadQR" type="file" style={{ display: "none" }} accept="application/pdf,image/*" capture="environment" onChange={(e) => handleUpload(e)} />
                            <span onClick={iconHandleClick} className="border-blue-900 inline-flex items-center px-3 text-sm text-gray-900 rounded-r-md border border-l-0 bg-blue-900">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="m-2 bi bi-qr-code-scan" viewBox="0 0 16 16">
                                    <path d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0v-3Zm12 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V1h-2.5a.5.5 0 0 1-.5-.5ZM.5 12a.5.5 0 0 1 .5.5V15h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5Zm15 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H15v-2.5a.5.5 0 0 1 .5-.5ZM4 4h1v1H4V4Z" />
                                    <path d="M7 2H2v5h5V2ZM3 3h3v3H3V3Zm2 8H4v1h1v-1Z" />
                                    <path d="M7 9H2v5h5V9Zm-4 1h3v3H3v-3Zm8-6h1v1h-1V4Z" />
                                    <path d="M9 2h5v5H9V2Zm1 1v3h3V3h-3ZM8 8v2h1v1H8v1h2v-2h1v2h1v-1h2v-1h-3V8H8Zm2 2H9V9h1v1Zm4 2h-1v1h-2v1h3v-2Zm-4 2v-1H8v1h2Z" />
                                    <path d="M12 9h2V8h-2v1Z" />
                                </svg>
                            </span>
                        </div>
                    </div>
                    <button onClick={() => router.push({
                        pathname: "/batchno", query: {
                            batchno: batchNo
                        }
                    })}
                        type="submit" className="h-12 bg-blue-900 font-header tracking-tighter mt-3 inline-flex mb-5 w-full items-center justify-center text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="self-center mr-2 bi bi-arrow-right-square-fill" viewBox="0 0 16 16">
                            <path d="M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1z" />
                        </svg>
                        Continue</button>
                    <br /><span className="text-xs text-black-900 cursor-pointer mt-2 font-header">Not this? </span>
                    <span onClick={() => router.push('/newbatch')} className="text-sm tracking-tighter text-blue-900 cursor-pointer mt-2 font-header hover:underline">Create new batch</span>
                    <br />
                </div>
            </div>
        </div>
    );
};
export default App;
