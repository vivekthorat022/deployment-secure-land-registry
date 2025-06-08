import Web3 from "web3";
import LandRegistryArtifact from "../abis/LandRegistry.json";

const CONTRACT_ADDRESS = "0x5B050C78Ff3940980802faE38632E70C1992E88e"; // Deployed address

let web3;
let contract;

export const getWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error("User denied account access");
    }
  } else {
    alert("⚠️ Please install MetaMask to use this feature");
  }
  return web3;
};

// 👇 This alias helps support the ChatPage.js version
export const getWeb3Instance = getWeb3;

export const getContract = async () => {
  if (!web3) await getWeb3();
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = LandRegistryArtifact.networks[networkId];

  if (!deployedNetwork) {
    throw new Error("⚠️ Contract not deployed on this network.");
  }

  contract = new web3.eth.Contract(LandRegistryArtifact.abi, CONTRACT_ADDRESS);
  return contract;
};
