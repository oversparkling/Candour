import React, { Component, useEffect, useState } from "react";
import ClothingSupplyChain from "../../build/contracts/ClothingSupplyChain.json";

import getWeb3 from "./getWeb3";

const App = () => {
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
        console.log(state.web3);
    }, []);
    const setBasicDetails = async() => {

      console.log(state.contract)
      await state.contract.methods.setBasicDetails("test","test","test","test","test").send({from: state.accounts[0],gasPrice:"200"});
      // console.log(test.call().send({ from: state.accounts[0] }))
    }
    if (!state.web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
        <div className="App">
            <h1>Good to Go!</h1>
            <p>Your Truffle Box is installed and ready.</p>
            <h2>Smart Contract Example</h2>
            <p>
                If your contracts compiled and migrated successfully, below will
                show a stored value of 5 (by default).
            </p>
            <p>
                Try changing the value stored on <strong>line 42</strong> of
                App.js.
            </p>
            <button onClick={() => setBasicDetails()}>Hello</button>
        </div>
    );
};
export default App;
