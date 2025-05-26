import { ethers } from "ethers";

const create_tx = async (contract_address, raw_input, wallet, provider, value = 0) => {
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice ? feeData.gasPrice : ethers.parseUnits("1.5", "gwei"); // using default gas fee if estimate failed
    const gas = await provider.estimateGas({
      to: contract_address,
      data: raw_input,
      from: wallet.address,
      value: value !=0 ? ethers.parseEther(`${value}`) : "0", // or ethers.parseEther("0.1") if sending ETH
  });
  console.log(`this is gas ${gas}`);
  const tx = {
      to: contract_address,
      data: raw_input,
      value: value !=0 ? ethers.parseEther(`${value}`) : "0", // or ethers.parseEther("0.1") if sending ETH
      gasLimit: gas, // rough estimate, or use .estimateGas()
      gasPrice: gasPrice,
  };

    console.log("📤 Sending transaction...");
    const response = await wallet.sendTransaction(tx);
    console.log("⏳ Waiting for confirmation...");
    const receipt = await response.wait();

    console.log("✅ Transaction confirmed!");
    console.log("Tx hash:", response.hash);
    console.log("Status:", receipt.status === 1 ? "Success" : "Failed");
    // console.log(response);
    return response.hash
};

export {create_tx};