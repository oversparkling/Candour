import Web3 from "web3";

// const getWeb3 = () =>
//   new Promise((resolve, reject) => {
//     // Wait for loading completion to avoid race conditions with web3 injection timing.
//     window.addEventListener("load", async () => {
//       // Modern dapp browsers...
//       if (window.ethereum) {
//         const web3 = new Web3(window.ethereum);
//         try {
//           // Request account access if needed
//           await window.ethereum.enable();
//           // Accounts now exposed
//           resolve(web3);
//         } catch (error) {
//           reject(error);
//         }
//       }
//       // Legacy dapp browsers...
//       else if (window.web3) {
//         // Use Mist/MetaMask's provider.
//         const web3 = window.web3;
//         console.log("Injected web3 detected.");
//         resolve(web3);
//       }
//       // Fallback to localhost; use dev console port by default...
//       else {
//         const provider = new Web3.providers.HttpProvider(
//           "http://127.0.0.1:8545"
//         );
//         const web3 = new Web3(provider);
//         console.log("No web3 instance injected, using Local web3.");
//         resolve(web3);
//       }
//     });
//   });
const getWeb3 = async (isFirstLoad) => {
    try {
        let web3;
        if (window && window.ethereum) {
            web3 = new Web3(window.ethereum);
            // Ask User permission to connect to Metamask
            if (!isFirstLoad) {
                try {
                    await window.ethereum.enable();
                } catch (err) {
                    console.log("Transaction rejected by user:", err);
                }
            }
        } else if (window && window.web3) {
            web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert(
                "Non-Ethereum browser detected. Please install MetaMask plugin"
            );
            return;
        }
        return web3
        // ...
    } catch (err) {
        console.log("Error in Web3.tsx -> getWeb3(): ", err);
    }
};

export default getWeb3;
