import { useRouter } from "next/router";
import React, { Component, useEffect, useState } from "react";
import ClothingSupplyChain from "../contracts/ClothingSupplyChain.json";
import detectEthereumProvider from "@metamask/detect-provider";
import Image from "next/image";
import Web3 from "web3";
import getWeb3 from "./getWeb3";
import Loading from "./Loading";
import { Button, Divider, Input, Skeleton, Timeline } from "antd";

function Pid() {
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
        document.title = "Candour | Transparency in Supplychain";
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
                    const batchNo1 = await instance.methods
                        .getAllDetails(batchno)
                        .send({ from: accounts[0] });
                    console.log(batchNo1);
                    setResult(batchNo1.events.RetrievedAllDetails.returnValues);
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
        return <Loading />;
    }

    return (
        <div
            className="flex-col flex pt-7 px-4 lg:pb-10 pb-28 bg-teal bg-cover lg:px-10"
            style={{ backgroundPosition: "left top" }}
        >
            <div className="grid grid-cols-6 gap-4 pb-6">
                <div
                    onClick={() => router.push("/")}
                    className="cursor-pointer col-start-1 col-span-2 pl-5"
                >
                    <img src="/navbarlogo.png" width={80} height="auto" />
                </div>
                <div
                    data-tooltip-placement="bottom"
                    data-tooltip-target="tooltip-bottom"
                    className="col-start-5 col-span-2 pr-5 font-semibold"
                    style={{ textAlignLast: "end" }}
                >
                    OK
                </div>
            </div>
            <div className="w-full h-full bg-white shadow-lg rounded-lg px-5 pt-5 pb-8 lg:h-full lg:px-7 lg:text-center md:text-center">
                <h3 className="font-header text-xl tracking-tighter mb-1 text-black-900 lg:text-2xl lg:pt-2">
                    Batch Information{" "}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="cursor-pointer ml-0.5 mb-0.5 item-center inline bi bi-question-circle-fill"
                        viewBox="0 0 16 16"
                    >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
                    </svg>
                </h3>
                <p className="text-black-800 text-xs tracking-tighter leading-none font-prints lg:text-sm">
                    Review the information provided by your supplier(s).
                </p>
                <div className="w-full text-center lg:px-20 mt-6">
                    <label
                        htmlFor="website-admin"
                        className="block mb-1 font-semibold text-black-900 tracking-tighter text-left"
                    >
                        Batch identifier
                    </label>
                    <p className="outline-0 text-gray-900 text-xs font-prints block flex-1 min-w-0 w-full text-left">
                        {result ? (
                            batchNo
                        ) : (
                            <Skeleton paragraph={{ rows: 0 }} active />
                        )}
                    </p>
                </div>
                <div className="w-full mt-2 text-center lg:px-20 mt-6">
                    <label
                        htmlFor="website-admin"
                        className="block mb-1 font-semibold text-black-900 tracking-tighter text-left"
                    >
                        Cumulative Sustainability Meter{" "}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="cursor-pointer ml-0.5 mb-0.5 p-0.5 item-center inline bi bi-question-circle-fill"
                            viewBox="0 0 16 16"
                        >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                        </svg>
                    </label>
                    {result ? (
                        <div>
                            <div className="px-2">
                                <img
                                    src="/cumulative.png"
                                    width={2000}
                                    height={5}
                                />
                            </div>
                            <div className="px-12">
                                <img src="/tag.png" width={10} height={20} />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <Skeleton
                                title={true}
                                active
                                paragraph={{ rows: 0 }}
                            />
                        </div>
                    )}
                </div>
                <div className="w-full mt-2 text-center lg:px-20">
                    <label
                        htmlFor="website-admin"
                        className="block mb-1 font-semibold text-black-900 tracking-tighter text-left"
                    >
                        Registration Number{" "}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="cursor-pointer ml-0.5 mb-0.5 p-0.5 item-center inline bi bi-question-circle-fill"
                            viewBox="0 0 16 16"
                        >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                        </svg>
                    </label>
                    <div className="pl-2 mt-6 text-left">
                        <Timeline
                            pending={
                                result &&
                                result.water1 != "" &&
                                result.electricity1 != "" &&
                                result.toxicWaste1 != ""
                                    ? false
                                    : "Next stage name.."
                            }
                        >
                            <Timeline.Item color="green">
                                {result ? (
                                    <div>
                                        <span className="pr-0.5 tracking-tighter font-header text-green-600">
                                            Cotton Harvested: Supima®
                                        </span>
                                        <br />
                                    </div>
                                ) : (
                                    <div>
                                        <Skeleton active />
                                    </div>
                                )}
                                {result ? (
                                    <div>
                                        <span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">
                                            Harvest Location:
                                        </span>
                                        <span className="tracking-tighter text-black-800 font-prints text-sm">
                                            {result ? result.fertiliser : ""}
                                        </span>
                                        <br />
                                    </div>
                                ) : (
                                    ""
                                )}
                                {result ? (
                                    <div>
                                        <span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">
                                            Fertiliser Type:
                                        </span>
                                        <span className="tracking-tighter text-black-800 font-prints text-sm">
                                            {result ? result.fertiliser : ""}{" "}
                                        </span>
                                        <br />
                                    </div>
                                ) : (
                                    ""
                                )}
                                {result ? (
                                    <div>
                                        <span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">
                                            Fertiliser Used:
                                        </span>
                                        <span className="tracking-tighter text-black-800 font-prints text-sm">
                                            {result ? result._fertiliser : ""}
                                        </span>
                                        <br />
                                    </div>
                                ) : (
                                    ""
                                )}
                                {result ? (
                                    <div>
                                        <span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">
                                            Water Consumed:
                                        </span>
                                        <span className="tracking-tighter text-black-800 font-prints text-sm">
                                            {result ? result._water : ""}{" "}
                                        </span>
                                        <br />
                                    </div>
                                ) : (
                                    ""
                                )}
                                {result ? (
                                    <div>
                                        <span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">
                                            Biowaste Produced:
                                        </span>
                                        <span className="tracking-tighter text-black-800 font-prints text-sm">
                                            {result ? result._biowaste : ""}{" "}
                                        </span>
                                        <br />
                                    </div>
                                ) : (
                                    ""
                                )}
                            </Timeline.Item>
                            {result &&
                                result.water1 != "" &&
                                result.electricity1 != "" &&
                                result.toxicWaste1 != "" && (
                                    <Timeline.Item color="green">
                                        {result ? (
                                            <div>
                                                <span className="pr-0.5 tracking-tighter font-header text-green-600">
                                                    Cotton Harvested: Supima®
                                                </span>
                                                <br />
                                            </div>
                                        ) : (
                                            <div>
                                                <Skeleton active />
                                            </div>
                                        )}
                                        {result ? (
                                            <div>
                                                <span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">
                                                    Water Used:
                                                </span>
                                                <span className="tracking-tighter text-black-800 font-prints text-sm">
                                                    {result
                                                        ? result.water1
                                                        : ""}
                                                </span>
                                                <br />
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                        {result ? (
                                            <div>
                                                <span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">
                                                    Electricity Used:
                                                </span>
                                                <span className="tracking-tighter text-black-800 font-prints text-sm">
                                                    {result
                                                        ? result.electricity1
                                                        : ""}{" "}
                                                </span>
                                                <br />
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                        {result ? (
                                            <div>
                                                <span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">
                                                    Toxic Waste:
                                                </span>
                                                <span className="tracking-tighter text-black-800 font-prints text-sm">
                                                    {result
                                                        ? result.toxicWaste1
                                                        : ""}
                                                </span>
                                                <br />
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </Timeline.Item>
                                )}

                            {/* <Timeline.Item color="green">
                                {result ? <div><span className="pr-0.5 tracking-tighter font-header text-green-600">Cotton Harvested: Supima®</span><br /></div> : <div><Skeleton active /></div>}
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Legal Entity Identifier (LEI):</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.registrationNo : ""}</span><br /></div> : "" }
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Batch Producer:</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.farmerName : ""} </span><br /></div> : "" }
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Production Location:</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.registrationNo : ""}</span><br /></div> : "" }
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Importer's Name:</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.importerName : ""} </span><br /></div> : "" }
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Importer's Number:</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.importerName : ""} </span><br /></div> : "" }
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Exporter's Name:</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.exporterName : ""} </span><br /></div> : "" }
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Exporter's Number:</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.exporterName : ""} </span><br /></div> : "" }
                            </Timeline.Item>
                            <Timeline.Item color="green">
                                {result ? <div><span className="pr-0.5 tracking-tighter font-header text-green-600">Cotton Harvested: Supima®</span><br /></div> : <div><Skeleton active /></div>}
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Legal Entity Identifier (LEI):</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.registrationNo : ""}</span><br /></div> : "" }
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Batch Producer:</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.farmerName : ""} </span><br /></div> : "" }
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Production Location:</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.registrationNo : ""}</span><br /></div> : "" }
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Importer's Name:</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.importerName : ""} </span><br /></div> : "" }
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Importer's Number:</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.importerName : ""} </span><br /></div> : "" }
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Exporter's Name:</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.exporterName : ""} </span><br /></div> : "" }
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Exporter's Number:</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.exporterName : ""} </span><br /></div> : "" }
                            </Timeline.Item>
                            <Timeline.Item color="green">
                                {result ? <div><span className="pr-0.5 tracking-tighter font-header text-green-600">Cotton Harvested: Supima®</span><br /></div> : <div><Skeleton active /></div>}
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Legal Entity Identifier (LEI):</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.registrationNo : ""}</span><br /></div> : "" }
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Batch Producer:</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.farmerName : ""} </span><br /></div> : "" }
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Production Location:</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.registrationNo : ""}</span><br /></div> : "" }
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Importer's Name:</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.importerName : ""} </span><br /></div> : "" }
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Importer's Number:</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.importerName : ""} </span><br /></div> : "" }
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Exporter's Name:</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.exporterName : ""} </span><br /></div> : "" }
                                {result ? <div><span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">Exporter's Number:</span><span className="tracking-tighter text-black-800 font-prints text-sm">{result ? result.events.CottonBatchNo.returnValues.exporterName : ""} </span><br /></div> : "" }
                            </Timeline.Item> */}
                        </Timeline>
                    </div>
                </div>

                <div className=" w-full mt-2 text-center lg:px-20">
                    <button
                        disabled={
                            result &&
                            result.water1 != "" &&
                            result.electricity1 != "" &&
                            result.toxicWaste1 != ""
                        }
                        className={`w-full lg:px-20 h-12 font-header tracking-tighter mt-3 inline-flex mb-5 items-center justify-center text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm text-center ${
                            result &&
                            result.water1 != "" &&
                            result.electricity1 != "" &&
                            result.toxicWaste1 != ""
                                ? "bg-gray-300"
                                : "bg-blue-900"
                        }`}
                        onClick={() =>
                            router.push("/secondStage?batchno=" + batchNo)
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="self-center mr-2 bi bi-arrow-right-square-fill"
                            viewBox="0 0 16 16"
                        >
                            <path d="M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1z" />
                        </svg>
                        Add Next Stage
                    </button>
                    <br />
                </div>
            </div>
        </div>
    );
}

export default Pid;
