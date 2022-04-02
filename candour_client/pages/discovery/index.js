import { useRouter } from "next/router";
import React, { Component, useEffect, useState } from "react";
import ClothingSupplyChain from "../../build/contracts/ClothingSupplyChain.json";
import detectEthereumProvider from "@metamask/detect-provider";
import Image from "next/image";
import Web3 from "web3";
import getWeb3 from "./getWeb3";
import Loading from "./Loading";
import { Button, Divider, Input, Skeleton, Timeline } from "antd";

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
        document.title = 'Candour | Transparency in Supplychain'
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
                    console.log(instance)
                    const returnValue = await instance.methods
                        .getCottonHarvester(batchno)
                        .send({ from: accounts[0] });
                    
                    setResult(returnValue);
                    console.log(returnValue);
                    console.log(returnValue.events);
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
        // console.log(result);
    }, [router]);
    if (!state.web3) {
        return (<Loading />)
    }

    return (
        <div className="flex-col flex pt-7 px-4 lg:pb-10 pb-28 bg-teal bg-cover lg:px-10" style={{ backgroundPosition: "left top" }}>
            <div className="grid grid-cols-6 gap-4 pb-6">
                <div onClick={() => router.push("/")} className="cursor-pointer col-start-1 col-span-2 pl-5"><img
                    src="/navbarlogo.png"
                    width={80}
                    height="auto"
                /></div>
            </div>
            <div className="w-full h-full bg-white shadow-lg rounded-lg px-5 pt-5 pb-8 lg:h-full lg:px-7 lg:text-center md:text-center">
                <h3 className="font-header text-xl tracking-tighter mb-1 text-black-900 lg:text-2xl lg:pt-2">Product Discovery  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="cursor-pointer ml-0.5 mb-0.5 item-center inline bi bi-question-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
                </svg></h3>
                <p className="text-black-800 text-xs tracking-tighter leading-none font-prints lg:text-sm">Discover and find out more about these sustainable fashion products.</p>
                
            </div>
        </div>
    );
}

export default pid;
