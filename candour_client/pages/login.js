import React, { Component, useEffect, useState, Fragment, useRef } from "react";
import ClothingSupplyChain from "../contracts/ClothingSupplyChain.json";
import detectEthereumProvider from "@metamask/detect-provider";
import Image from "next/image";
import { useRouter } from "next/router";
import Web3 from "web3";
import getWeb3 from "./getWeb3";
import Loading from "./Loading";
import { Button, notification, Divider, Space } from 'antd';
// import pdfJS from 'pdfjs-dist/build/pdf.js';

const Login = () => {
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

    const router = useRouter();
    const uploadQR = useRef(null);
    var qr = new QrcodeDecoder();
    const iconHandleClick = () => {
        uploadQR.current.click()
    }
    const [batchNo, setBatchNo] = useState("");
    const [state, setState] = useState({
        web3: null,
        accounts: null,
        contract: null,
    });
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
    }, []);
    if (!state.web3) {
        return (<Loading />)
    }

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

    return (
        <div className="w-full h-screen flex-col flex pt-7 px-4 lg:pb-10 pb-28 bg-standard bg-cover lg:px-10" style={{ backgroundPosition: "left top" }}>
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

            <div className="w-full h-full bg-white shadow-lg rounded-lg px-5 pt-5 lg:h-full lg:px-7 lg:text-center md:text-center">
                <h3 className="font-header text-xl tracking-tighter mb-1 text-black-900 lg:text-2xl lg:pt-2">Add / View Batch</h3>
                <p className="text-black-800 text-xs tracking-tighter leading-none font-prints lg:text-sm">Scan or input product batch number to begin. Contact your suppliers to find out more.</p>
                <div className="lg:h-1/3 md:h-1/3 sm:h-1/3 h-1/3 text-center">
                    <img src="/qrscan.gif" className="p-8 inline h-full w-auto" />
                </div>
                <div className=" w-full mt-2 text-center lg:px-20">
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
                </div>
            </div>
        </div>
    );
};
export default Login;
