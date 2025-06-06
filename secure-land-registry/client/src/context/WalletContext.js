import React, { createContext, useState, useEffect } from "react";
import Web3 from "web3";
import LandRegistryABI from "../abis/LandRegistry.json"; // ⬅️ Make sure this file exists
import { toast } from "react-hot-toast"; // Optional: for better feedback

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  const CONTRACT_ADDRESS = "0x668cE11F1d2F3b76dD64Df483c42F02eB8955027"; // ⬅️ Replace with actual deployed address

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = window.ethereum;
        await provider.request({ method: "eth_requestAccounts" });
        const web3Instance = new Web3(provider);
        const accounts = await web3Instance.eth.getAccounts();

        setWalletAddress(accounts[0]);
        setWeb3(web3Instance);

        const contractInstance = new web3Instance.eth.Contract(
          LandRegistryABI.abi,
          CONTRACT_ADDRESS
        );
        setContract(contractInstance);
      } catch (err) {
        console.error("🛑 Wallet connection failed", err);
        alert("Wallet connection failed.");
      }
    } else {
      alert("MetaMask is not installed!");
    }
  };

  const sendTransaction = async (buyer, seller, priceInEth) => {
    if (!web3 || !contract) {
      alert("Wallet not connected or contract not initialized.");
      return;
    }

    try {
      const accounts = await web3.eth.getAccounts();

      const tx = await contract.methods.createTransaction(buyer, seller).send({
        from: accounts[0],
        value: web3.utils.toWei(priceInEth.toString(), "ether"),
      });

      console.log("✅ Blockchain TX Success:", tx);
      return tx;
    } catch (err) {
      console.error("❌ Blockchain TX Failed:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0] || "");
      });
    }
  }, []);

  return (
    <WalletContext.Provider value={{ walletAddress, connectWallet, web3, sendTransaction }}>
      {children}
    </WalletContext.Provider>
  );
};
