import { useRouter } from "next/router";
import React, { Component, useEffect, useState } from "react";
import { Button, Divider, Input, Skeleton, Timeline, Carousel } from "antd";
import axios from "axios";

function Pid() {
    const contentStyle = {
        height: '300px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
    };
    const router = useRouter();
    const [allProduct, setAllProduct] = useState([])

    useEffect(() => {
        document.title = 'Candour | Transparency in Supplychain'
        axios.get("https://candour-indexer.herokuapp.com/getAll").then(function (response) {
            setAllProduct(response.data['products'])
            console.log(response.data['products'])
        }).catch(function (error) {
            console.log(error)
        })
    }, []);

    return (
        <div className="flex-col flex pt-7 px-4 lg:pb-10 pb-28 bg-standard bg-cover lg:px-10" style={{ backgroundPosition: "left top" }}>
            <div className="grid grid-cols-6 gap-4 pb-6">
                <div onClick={() => router.push("/")} className="cursor-pointer col-start-1 col-span-2 pl-5"><img
                    src="/navbarlogo.png"
                    width={80}
                    height="auto"
                /></div>
            </div>
            <div className="w-full h-full bg-white shadow-lg rounded-lg px-5 pt-5 pb-8 lg:h-full lg:px-7 lg:text-center md:text-center">
                <h3 className="font-header text-xl tracking-tighter mb-1 text-black-900 lg:text-2xl lg:pt-2">Popular Products</h3>
                <p className="text-black-800 text-xs tracking-tighter leading-none font-prints lg:text-sm"></p>
                <Carousel autoplay className="w-full mb-3 mt-4" dotPosition={"top"}>
                    {allProduct && allProduct.length > 0 && allProduct.map((element,index) => {
                        return (
                            <div key = {index}>
                                <div onClick={() => router.push("/discovery/" + element.batchNo)} style={{
                                    backgroundImage: 'linear-gradient(to bottom, transparent 0%, black 100%), url(' + 'https://picsum.photos/seed/' + element.batchNo + '1/2000/1000' + ')',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    color: "white"
                                }} className="cursor-pointer text-lg sm:text-xl font-normal pt-32 pb-3 sm:pt-48 pl-4 text-left font-bold">{element.productName === "" ? "Supima Cotton Shirt" : element.productName}
                                    <p className="font-normal text-xs sm:text-sm">{element.description.length < 30 ? "Luxury, quality and craftsmanship are the benchmarks of American-grown, extra-long staple cotton." : element.description.split('.')[0] + "."}</p>
                                </div>
                            </div>
                        );
                    })}
                </Carousel>
                < Divider />
                <h3 className="font-header text-xl tracking-tighter mb-1 text-black-900 lg:text-2xl lg:pt-2">Product Discovery  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="cursor-pointer ml-0.5 mb-0.5 item-center inline bi bi-question-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
                </svg></h3>
                <p className="text-black-800 text-xs tracking-tighter leading-none font-prints lg:text-sm">Discover and find out more about these sustainable fashion products.</p>
                <div className="text-left mt-0 sm:flex sm:grid sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                    {allProduct && allProduct.length > 0 && allProduct.slice(0, 15).map((element,index) => {
                        return (
                            <div key={index} onClick={() => router.push("/discovery/" + element.batchNo)} className="cursor-pointer bg-gray-100 m-auto w-full h-full sm:h-52" style={{backgroundImage: 'linear-gradient(to bottom, transparent 0%, black 100%), url(' + [element.imageUrl !== "" ? element.imageUrl : ('https://picsum.photos/seed/' + element.batchNo + '1/2000/1000')] + ')', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                                <div className="flex flex-row items-end h-full w-full">
                                    <div className="flex flex-col w-full pb-3 pt-10 px-3 bg-gradient-to-t from-black text-white">
                                        <h3 className="text-base font-bold leading-5 uppercase text-white">{element.productName === "" ? "Supima Cotton Shirt" : element.productName}</h3>
                                        <div className="flex flex-row justify-between">
                                            <div className="flex flex-row">
                                                <div className="w-max inline-flex items-center">
                                                    <svg className="w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-xs ml-1 antialiased">{element.last_updated}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    );
}

export default Pid;
