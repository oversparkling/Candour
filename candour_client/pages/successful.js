import React, { Component, useEffect, useState, useRef } from "react";
import ClothingSupplyChain from "../../build/contracts/ClothingSupplyChain.json";
import detectEthereumProvider from "@metamask/detect-provider";
import { useRouter } from "next/router";
import Web3 from "web3";
import getWeb3 from "./getWeb3";
import Loading from "./Loading";
import QrcodeDecoder from 'qrcode-decoder';
import { notification, LoadingOutlined } from 'antd';

const App = () => {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    const router = useRouter()
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
        document.title = 'Candour | Transparency in Supplychain'
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
        <div className="pt-7 px-4 lg:pb-10 pb-28 bg-green bg-cover lg:px-10" style={{ backgroundPosition: "left top" }}>
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
                <div class="mb-3 font-semibold bg-green-100 text-green-800 px-4 py-3 rounded relative" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="inline-block mr-2 bi bi-check-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
</svg><strong class="font-bold">Successfully submitted! </strong>
                    <span class="block sm:inline">Copy of receipt will be emailed to you.</span>
                    <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                        {/* <svg class="fill-current h-6 w-6 text-green-600" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg> */}
                    </span>
                </div>
                <h3 className="font-header text-xl tracking-tighter mb-1 text-black-900 lg:text-2xl lg:pt-2">Submission Receipt<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="cursor-pointer ml-0.5 mb-0.5 item-center inline bi bi-question-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
                </svg></h3>
                <p className="text-black-800 text-xs tracking-tighter leading-none font-prints lg:text-sm">Reproduce the below QR Code onto processed products.</p>
                <div className="pb-8 w-full mt-2 text-center lg:px-20">

                </div>
            </div>
        </div>
    );
};
export default App;
