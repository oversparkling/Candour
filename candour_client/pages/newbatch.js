import React from "react";
import QRCode from "qrcode.react";
import { Fragment, useRef, useState, useEffect } from "react";
import ClothingSupplyChain from "../../build/contracts/ClothingSupplyChain.json";
import { Spin } from "antd";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import Image from "next/image";
import getWeb3 from "./getWeb3";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import Loading from "./Loading";
import { Divider } from "antd";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";

function newbatch(props) {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    const [state, setState] = useState({
        web3: null,
        accounts: null,
        contract: null,
    });
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

    return (
        <div className="flex-col flex pt-7 px-4 lg:pb-10 pb-28 bg-red bg-cover lg:px-10" style={{ backgroundPosition: "left top" }}>
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
            <div className="w-full h-full bg-white shadow-lg rounded-lg px-5 pt-5 pb-8 lg:h-full lg:px-7 lg:text-center md:text-center">
                <h3 className="font-header text-xl tracking-tighter mb-1 text-black-900 lg:text-2xl lg:pt-2">Sustainability Declaration  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="cursor-pointer ml-0.5 mb-0.5 item-center inline bi bi-question-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
                </svg></h3>
                <p className="text-black-800 text-xs tracking-tighter leading-none font-prints lg:text-sm">Voluntary disclosure of manufacturing processes.</p>
                <div className=" w-full mt-2 text-center lg:px-20">
                    <label htmlFor="website-admin" className="block mb-1 font-semibold text-black-900 tracking-tighter text-left">Registration Number</label>
                    <div className="flex justify-center">
                        <div className="w-full inline-flex h-12">
                            <input onChange={(e) => setRegistrationNo(e.target.value)} type="text" placeholder="Unique identifier for this good" className="focus:border-blue-900 rounded-none rounded-l-lg border outline-0 border-gray-300 text-gray-900 text-xs font-prints block flex-1 min-w-0 w-full text-xs border-gray-300 p-2.5 " />
                        </div>
                    </div>
                </div>
                <div className=" w-full mt-2 text-center lg:px-20">
                    <label htmlFor="website-admin" className="block mb-1 font-semibold text-black-900 tracking-tighter text-left">Farmer's Name</label>
                    <div className="flex justify-center">
                        <div className="w-full inline-flex h-12">
                            <input onChange={(e) => setFarmerName(e.target.value)} type="text" placeholder="Name of farmer that harvested" className="focus:border-blue-900 rounded-none rounded-l-lg border outline-0 border-gray-300 text-gray-900 text-xs font-prints block flex-1 min-w-0 w-full text-xs border-gray-300 p-2.5 " />
                        </div>
                    </div>
                </div>
                <div className=" w-full mt-2 text-center lg:px-20">
                    <label htmlFor="website-admin" className="block mb-1 font-semibold text-black-900 tracking-tighter text-left">Farm's Address</label>
                    <div className="flex justify-center">
                        <div className="w-full inline-flex h-12">
                            <input onChange={(e) => setFarmAddress(e.target.value)} type="text" placeholder="Where the farm is located" className="focus:border-blue-900 rounded-none rounded-l-lg border outline-0 border-gray-300 text-gray-900 text-xs font-prints block flex-1 min-w-0 w-full text-xs border-gray-300 p-2.5 " />
                        </div>
                    </div>
                </div>
                <div className=" w-full mt-2 text-center lg:px-20">
                    <label htmlFor="website-admin" className="block mb-1 font-semibold text-black-900 tracking-tighter text-left">Exporter's Name</label>
                    <div className="flex justify-center">
                        <div className="w-full inline-flex h-12">
                            <input onChange={(e) => setExporterName(e.target.value)} type="text" placeholder="Name of exporter company" className="focus:border-blue-900 rounded-none rounded-l-lg border outline-0 border-gray-300 text-gray-900 text-xs font-prints block flex-1 min-w-0 w-full text-xs border-gray-300 p-2.5 " />
                        </div>
                    </div>
                </div>
                <div className=" w-full mt-2 text-center lg:px-20">
                    <label htmlFor="website-admin" className="block mb-1 font-semibold text-black-900 tracking-tighter text-left">Importer's Name</label>
                    <div className="flex justify-center">
                        <div className="w-full inline-flex h-12">
                            <input onChange={(e) => setImporterName(e.target.value)} type="text" placeholder="Name of importer company" className="focus:border-blue-900 rounded-none rounded-l-lg border outline-0 border-gray-300 text-gray-900 text-xs font-prints block flex-1 min-w-0 w-full text-xs border-gray-300 p-2.5 " />
                        </div>
                    </div>
                </div>
                <div className=" w-full mt-2 text-center lg:px-20">
                    <div className="flex justify-center">
                        <div className="w-full inline-flex h-12">
                            <button onClick={() => { setBasicDetails(); setOpen(true); }}
                                type="submit" className="h-12 bg-blue-900 font-header tracking-tighter mt-3 inline-flex mb-5 w-full items-center justify-center text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="self-center mr-2 bi bi-arrow-right-square-fill" viewBox="0 0 16 16">
                                    <path d="M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1z" />
                                </svg>
                                Submit</button>
                        </div>
                    </div>
                </div>
                <br />


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
                                                                value={"http://localhost:3000/batchno?batchno=" + batchNo}
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
        </div>
    );
}

export default newbatch;
