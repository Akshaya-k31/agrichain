import { ethers } from "ethers";

// Replace with the address from your Remix "Deploy & Run" tab
const contractAddress = "0x..."; 

// Replace with the ABI from your Remix "Compiler" tab (bottom of the sidebar)
const contractABI = [ /* Your ABI JSON goes here */ ];

export const getContract = async () => {
    // Connect to Ganache
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
    const signer = await provider.getSigner();
    
    // Create and return the contract instance
    return new ethers.Contract(contractAddress, contractABI, signer);
};
