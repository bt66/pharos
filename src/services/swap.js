import { create_tx } from "../utils/create_tx.js"
import { ethers } from "ethers";

const wrap_phrs_contract = "0x76aaaDA469D23216bE5f7C596fA25F282Ff9b364" 
const wrap_phrs_rawinput = "0xd0e30db0"
const unwrap_phrs_rawinput = "0x2e1a7d4d00000000000000000000000000000000000000000000000000038d7ea4c68000"

const wprs_contract = "0x1A4DE519154Ae51200b0Ad7c90F7faC75547888a"
const swap_phrs_usdc_rawinput = ""

const routerAbi = [
  `function multicall(uint256 deadline, bytes[] data) payable returns (bytes[])`,
  "function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external returns (uint256 amountOut)",
  "function exactOutputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountOut, uint256 amountInMaximum, uint160 sqrtPriceLimitX96)) external returns (uint256 amountIn)"
];

const usdt_token_contract = "0xed59de2d7ad9c043442e381231ee3646fc3c2939"
const usdc_token_contract = "0xad902cf99c2de2f1ba5ec4d642fd7e49cae9ee37"
const wphrs_token_contract = "0x76aaada469d23216be5f7c596fa25f282ff9b364"
const swap_router_contract = "0x1A4DE519154Ae51200b0Ad7c90F7faC75547888a"


export const wrap_phrs_wphrs = async(wallet, provider, value) => {
    console.log("wrapping phrs to wphrs");
    const tx_hash = await create_tx(wrap_phrs_contract, ethers.id("deposit()").slice(0, 10),wallet, provider, value)
    return tx_hash
}

export const swap_wphrs_usdt = async(wallet, value) => {
    console.log("swapping wphrs to usdt");
    const router = new ethers.Contract(swap_router_contract, routerAbi, wallet);
    const iface = new ethers.Interface(routerAbi);

    const amountIn = ethers.parseEther(`${value}`); // 0.01 ETH
    const minAmountOut = 0; // Set to 0 for now or estimate via a quote API

    const params = {
    tokenIn: wphrs_token_contract, // WETH
    tokenOut: usdt_token_contract, // USDT
    fee: 500,                  // 0.3% pool
    recipient: wallet.address,  // Where to send USDT
    amountIn,
    amountOutMinimum: minAmountOut,
    sqrtPriceLimitX96: 0
    
    };

    const call = iface.encodeFunctionData("exactInputSingle", [params]);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
    const gasLimit = 219249;
    const tx = await router.multicall(deadline, [call], {
        gasLimit,
        gasPrice: 0
    });

    console.log("Sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Confirmed:", receipt.hash);
    return receipt.hash
}

export const swap_wphrs_usdc = async(wallet, value) => {
    console.log("swapping wphrs to usdc");
    const router = new ethers.Contract(swap_router_contract, routerAbi, wallet);
    const iface = new ethers.Interface(routerAbi);

    const amountOut = ethers.parseEther(`${value}`); // 0.01 ETH
    const minAmountOut = "2180000000000000000";  // 2.18 usdc or token with 18 decimals
    // const params = {
    // tokenIn: wphrs_token_contract, // WETH
    // tokenOut: usdc_token_contract, // USDT
    // fee: 500,                  // 0.3% pool
    // recipient: wallet.address,  // Where to send USDT
    // amountOut,
    // amountInMaximum: minAmountOut,
    // sqrtPriceLimitX96: 0
    // };
    const params = {
    tokenIn: "0x76aaada469d23216be5f7c596fa25f282ff9b364",
    tokenOut: "0xad902cf99c2de2f1ba5ec4d642fd7e49cae9ee37",
    fee: 500,
    recipient: wallet.address,
    amountOut: "160000000000000",            // 0.00016e18 = 0.00016 ETH or token with 18 decimals
    amountInMaximum: "2180000000000000000", // 2.18 ETH or token with 18 decimals
    sqrtPriceLimitX96: "0"
    };

    const call = iface.encodeFunctionData("exactOutputSingle", [params]);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
    const gasLimit = 219249;
    const tx = await router.multicall(deadline, [call], {
        gasLimit,
        gasPrice: 0
    });

    console.log("Sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Confirmed:", receipt.hash);
    return receipt.hash
}