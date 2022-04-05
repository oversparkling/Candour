import React, { Component, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { LoadingOutlined } from "antd";
import mapboxgl from "!mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import { Button, Divider, Input, Skeleton, Timeline } from "antd";
import { getMiddlewareManifest } from "next/dist/client/route-loader";

// Note: API Key for MapBox has been deliberately committed to git to facilitate ease of grading for instructor(s).
// API key will be disabled once grading is over.
mapboxgl.accessToken =
    "pk.eyJ1IjoiYWx2aW5vd3lvbmciLCJhIjoiY2wxaHhnYXh0MGNhZDNpczZxZTZsb204cCJ9.8rGpBI5OY17vDLkhsAe5Xw";

const App = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [batch, setBatch] = useState(null);
    const [geocode, setGeocode] = useState([]);
    const [lng, setLng] = useState(-8.1);
    const [lat, setLat] = useState(26.1);
    const [zoom, setZoom] = useState(10);

    // const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    const router = useRouter();
    const size = 200;

    const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // When the layer is added to the map,
        // get the rendering context for the map canvas.
        onAdd: function () {
            const canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext("2d");
        },

        // Call once before every frame where the icon will be used.
        render: function () {
            const duration = 1000;
            const t = (performance.now() % duration) / duration;

            const radius = (size / 2) * 0.3;
            const outerRadius = (size / 2) * 0.7 * t + radius;
            const context = this.context;

            // Draw the outer circle.
            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                outerRadius,
                0,
                Math.PI * 2
            );
            context.fillStyle = `rgba(200, 255, 200, ${1 - t})`;
            context.fill();

            // Draw the inner circle.
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                radius,
                0,
                Math.PI * 2
            );
            context.fillStyle = "rgba(120, 230, 120, 1)";
            context.strokeStyle = "white";
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();

            // Update this image's data with data from the canvas.
            this.data = context.getImageData(
                0,
                0,
                this.width,
                this.height
            ).data;

            // Continuously repaint the map, resulting
            // in the smooth animation of the dot.
            map.current.triggerRepaint();

            // Return `true` to let the map know that the image was updated.
            return true;
        },
    };

    useEffect(() => {
        if (geocode.length <= 0) return;
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/light-v10",
            center: [geocode[0][0], geocode[0][1]],
            zoom: zoom,
            interactive: false,
        });
    }, [geocode]);

    useEffect(() => {
        if (!batch) return;
        if (batch["productName"] === "") return;
        document.title = "Candour | " + batch["productName"];
    }, [batch]);

    useEffect(() => {
        document.title = "Candour | Product Discovery";
        if (!router.isReady) return;
        const { batchNo } = router.query;
        let geoArray = [];
        axios
            .get("https://candour-indexer.herokuapp.com/product?id=" + batchNo)
            .then(function (response) {
                setBatch(response["data"]);
                if (response["data"]["location"] === "") {
                    geoArray.push([+5, -1]);
                    // setGeocode([+5, -1]);
                } else {
                    axios
                        .get(
                            "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
                                response["data"]["location"] +
                                ".json?access_token=pk.eyJ1IjoiYWx2aW5vd3lvbmciLCJhIjoiY2wxaHhnYXh0MGNhZDNpczZxZTZsb204cCJ9.8rGpBI5OY17vDLkhsAe5Xw"
                        )
                        .then(function (response1) {
                            geoArray.push([
                                response1["data"]["features"][0]["center"][0],
                                response1["data"]["features"][0]["center"][1],
                            ]);
                            // setGeocode([
                            //     response1["data"]["features"][0]["center"][0],
                            //     response1["data"]["features"][0]["center"][1],
                            // ]);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
                if (response["data"]["location_two"] === "") {
                    geoArray.push([+5, -1]);
                    console.log(geoArray);
                    // setGeocode((geocode1) => [...geocode1, [+5, -1]]);
                } else {
                    axios
                        .get(
                            "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
                                response["data"]["location_two"] +
                                ".json?access_token=pk.eyJ1IjoiYWx2aW5vd3lvbmciLCJhIjoiY2wxaHhnYXh0MGNhZDNpczZxZTZsb204cCJ9.8rGpBI5OY17vDLkhsAe5Xw"
                        )
                        .then(function (response2) {
                            geoArray.push([
                                response2["data"]["features"][0]["center"][0],
                                response2["data"]["features"][0]["center"][1],
                            ]);
                            // setGeocode((geocode1) => [
                            //     ...geocode1,
                            //     [
                            //         response2["data"]["features"][0][
                            //             "center"
                            //         ][0],
                            //         response2["data"]["features"][0][
                            //             "center"
                            //         ][1],
                            //     ],
                            // ]);
                            if (
                                Math.abs(geoArray[0][0] - geoArray[1][0]) +
                                    Math.abs(geoArray[0][1] - geoArray[1][1]) >
                                40
                            ) {
                                setZoom(1.2);
                            }
                            setGeocode(geoArray);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [router.isReady]);

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        if (geocode.length <= 1) return;

        map.current.on("load", () => {
            map.current.addImage("pulsing-dot", pulsingDot, {
                pixelRatio: [window.innerWidth < 600 ? 3.5 : 3],
            });
            map.current.addSource("dot-point", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [geocode[0][0], geocode[0][1]], // icon position [lng, lat]
                            },
                        },
                        {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [geocode[1][0], geocode[1][1]], // icon position [lng, lat]
                            },
                        },
                    ],
                },
            });

            map.current.addLayer({
                id: "layer-with-pulsing-dot",
                type: "symbol",
                source: "dot-point",
                layout: {
                    "icon-image": "pulsing-dot",
                },
            });
        });
    }, [geocode, map]);

    return (
        <div
            className="pt-7 px-4 lg:pb-10 pb-28 bg-green bg-cover lg:px-10"
            style={{ backgroundPosition: "left top" }}
        >
            <div className="grid grid-cols-6 gap-4 pb-6">
                <div
                    onClick={() => router.push("/")}
                    className="cursor-pointer col-start-1 col-span-2 pl-5"
                >
                    <img src="/navbarlogo.png" width={80} height="auto" />
                </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg px-5 pt-5 lg:h-full lg:px-7 lg:text-center md:text-center ">
                <div
                    className="mb-3 font-semibold bg-green-100 text-green-800 px-4 py-3 rounded relative text-left lg:text-center md:text-center text-xs lg:text-s"
                    role="alert"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="cursor-pointer mr-1 mb-0.5 inline bi bi-qr-code"
                        viewBox="0 0 16 16"
                    >
                        <path d="M2 2h2v2H2V2Z" />
                        <path d="M6 0v6H0V0h6ZM5 1H1v4h4V1ZM4 12H2v2h2v-2Z" />
                        <path d="M6 10v6H0v-6h6Zm-5 1v4h4v-4H1Zm11-9h2v2h-2V2Z" />
                        <path d="M10 0v6h6V0h-6Zm5 1v4h-4V1h4ZM8 1V0h1v2H8v2H7V1h1Zm0 5V4h1v2H8ZM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8H6Zm0 0v1H2V8H1v1H0V7h3v1h3Zm10 1h-1V7h1v2Zm-1 0h-1v2h2v-1h-1V9Zm-4 0h2v1h-1v1h-1V9Zm2 3v-1h-1v1h-1v1H9v1h3v-2h1Zm0 0h3v1h-2v1h-1v-2Zm-4-1v1h1v-2H7v1h2Z" />
                        <path d="M7 12h1v3h4v1H7v-4Zm9 2v2h-3v-1h2v-1h1Z" />
                    </svg>
                    <strong className="font-bold">Batch No.: </strong>
                    <span className="block sm:inline">
                        {batch ? batch.batchNo : ""}
                    </span>
                </div>
                <h3 className="font-header text-xl tracking-tighter mb-1 text-black-900 lg:text-2xl lg:pt-2">
                    Product Journey
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
                    Find out where your product came from and how it was made.
                </p>
                <div className="pb-8 w-full mt-2 text-center lg:px-20">
                    {/* <img src="https://images.pexels.com/photos/7296338/pexels-photo-7296338.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" className="h-auto w-1/3" /> */}
                    <div ref={mapContainer} className="map-container" />

                    <div className="w-full mt-5 text-center lg:px-20 mt-6">
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
                        {batch ? (
                            <div>
                                <div className="px-2">
                                    <img
                                        src="/cumulative.png"
                                        width={2000}
                                        height={5}
                                    />
                                </div>
                                <div className="px-12">
                                    <img
                                        src="/tag.png"
                                        width={10}
                                        height={20}
                                    />
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
                            <Timeline>
                                <Timeline.Item color="green">
                                    {batch ? (
                                        <div>
                                            <span className="pr-0.5 tracking-tighter font-header text-green-600">
                                                Cotton Harvest:{" "}
                                                {batch &
                                                (batch.productName !== "")
                                                    ? batch.productName
                                                    : "Supima® Cotton"}
                                            </span>
                                            <br />
                                        </div>
                                    ) : (
                                        <div>
                                            <Skeleton active />
                                        </div>
                                    )}
                                    {batch ? (
                                        <div>
                                            <span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">
                                                Location:
                                            </span>
                                            <span className="tracking-tighter text-black-800 font-prints text-sm">
                                                {batch ? batch.location : ""}
                                            </span>
                                            <br />
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {batch ? (
                                        <div>
                                            <span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">
                                                Fertilised Type:
                                            </span>
                                            <span className="tracking-tighter text-black-800 font-prints text-sm">
                                                {batch
                                                    ? batch.fertiliser_type
                                                    : ""}
                                            </span>
                                            <br />
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {batch ? (
                                        <div>
                                            <span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">
                                                Fertiliser Used:
                                            </span>
                                            <span className="tracking-tighter text-black-800 font-prints text-sm">
                                                {batch
                                                    ? batch.fertiliser_used
                                                    : ""}
                                            </span>
                                            <br />
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {batch ? (
                                        <div>
                                            <span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">
                                                Water Consumed:
                                            </span>
                                            <span className="tracking-tighter text-black-800 font-prints text-sm">
                                                {batch
                                                    ? batch.water_consumption
                                                    : ""}
                                            </span>
                                            <br />
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </Timeline.Item>
                                <Timeline.Item color="green">
                                    {batch ? (
                                        <div>
                                            <span className="pr-0.5 tracking-tighter font-header text-green-600">
                                                Manufacturing: SpinDye® Process
                                            </span>
                                            <br />
                                        </div>
                                    ) : (
                                        <div>
                                            <Skeleton active />
                                        </div>
                                    )}
                                    {batch ? (
                                        <div>
                                            <span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">
                                                Location:
                                            </span>
                                            <span className="tracking-tighter text-black-800 font-prints text-sm">
                                                {batch
                                                    ? batch.location_two
                                                    : ""}{" "}
                                            </span>
                                            <br />
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {batch ? (
                                        <div>
                                            <span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">
                                                Effluent Released:
                                            </span>
                                            <span className="tracking-tighter text-black-800 font-prints text-sm">
                                                {batch
                                                    ? batch.effluent_released
                                                    : ""}{" "}
                                            </span>
                                            <br />
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {batch ? (
                                        <div>
                                            <span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">
                                                Electricity Used:
                                            </span>
                                            <span className="tracking-tighter text-black-800 font-prints text-sm">
                                                {batch
                                                    ? batch.electricity_used
                                                    : ""}
                                            </span>
                                            <br />
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {batch ? (
                                        <div>
                                            <span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">
                                                Water Consumed:
                                            </span>
                                            <span className="tracking-tighter text-black-800 font-prints text-sm">
                                                {batch
                                                    ? batch.water_consumption_2
                                                    : ""}
                                            </span>
                                            <br />
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {batch ? (
                                        <div>
                                            <span className="pr-0.5 tracking-tighter text-black-900 font-prints text-sm">
                                                Biowaste Produced:
                                            </span>
                                            <span className="tracking-tighter text-black-800 font-prints text-sm">
                                                {batch ? batch.biowaste : ""}{" "}
                                            </span>
                                            <br />
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </Timeline.Item>
                            </Timeline>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default App;
