import { ethers } from "ethers";

// 1. Paste your Contract Address from the Remix "Deploy" tab here
const contractAddress = "PASTE_YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";

// 2. This is the ABI you just grabbed
const contractABI = [
    {
        "inputs": [
            { "internalType": "string", "name": "_name", "type": "string" },
            { "internalType": "string", "name": "_farmer", "type": "string" },
            { "internalType": "uint256", "name": "_quantity", "type": "uint256" }
        ],
        "name": "addProduct",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
        "name": "receiveProduct",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
        "name": "shipProduct",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
        "name": "getProduct",
        "outputs": [
            { "internalType": "string", "name": "", "type": "string" },
            { "internalType": "string", "name": "", "type": "string" },
            { "internalType": "uint256", "name": "", "type": "uint256" },
            { "internalType": "string", "name": "", "type": "string" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

export const getContract = async () => {
    // Connect to Ganache locally (usually port 7545 for the UI)
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
    
    // Get the first account from Ganache to sign transactions
    const signer = await provider.getSigner();
    
    return new ethers.Contract(contractAddress, contractABI, signer);
};