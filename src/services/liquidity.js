import { ethers } from "ethers";

const abi = [
    "function multicall(bytes[] data) external payable returns (bytes[] memory)",
    "function mint((address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline))",
    "function refundETH() external payable"
]

const POOL_ABI = [
  'function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
  'function token0() external view returns (address)',
  'function token1() external view returns (address)'
];

const usdt_token_contract = "0xed59de2d7ad9c043442e381231ee3646fc3c2939"
const usdc_token_contract = "0xad902cf99c2de2f1ba5ec4d642fd7e49cae9ee37"
const wphrs_token_contract = "0x76aaada469d23216be5f7c596fa25f282ff9b364"
const uniswap_lp_contract = "0xF8a1D4FF0f9b9Af7CE58E1fc1833688F3BFd6115"

export const add_lp_wphrs_usdc = async (wallet) => {
    const router = new ethers.Contract(
        uniswap_add_lp_multicall_contract,
        ["function multicall(bytes[] data) external payable returns (bytes[] memory)"],
        wallet
    );

    const iface = new ethers.Interface([
        "function mint((address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline))",
        "function refundETH() external payable"
    ]);

    const mintParams = {
        token0: "0x76aaada469d23216be5f7c596fa25f282ff9b364",
        token1: "0xad902cf99c2de2f1ba5ec4d642fd7e49cae9ee37",
        fee: 500,
        tickLower: 59860,
        tickUpper: 59880,
        amount0Desired: ethers.parseUnits("0.01", 18),
        amount1Desired: ethers.parseUnits("0.0475", 18),
        amount0Min: 0,
        amount1Min: 0,
        recipient: wallet.address,
        deadline: Math.floor(Date.now() / 1000) + 600
    };

    const encodedMint = iface.encodeFunctionData("mint", [mintParams]);
    const encodedRefund = iface.encodeFunctionData("refundETH");
    console.log(encodedMint);
    console.log("================");
    console.log(encodedRefund);
    const gasLimit = 219249;
    const tx = await router.multicall([encodedMint, encodedRefund], {
        value: ethers.parseEther("0.001"),
        gasLimit: gasLimit,
        gasPrice: 0
    });

    console.log("Tx hash:", tx.hash);
    await tx.wait();
    console.log("✅ Transaction confirmed");
};  

export const addLiquidityUniswapV3 = async (wallet, wphrs_amount, usdc_amount) => {
    const erc20Abi = [
    "function approve(address spender, uint amount) public returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function balanceOf(address account) view returns (uint256)"
    ];

    // --- Manager ABI ---
    const managerAbi = [
    "function mint((address token0,address token1,uint24 fee,int24 tickLower,int24 tickUpper,uint256 amount0Desired,uint256 amount1Desired,uint256 amount0Min,uint256 amount1Min,address recipient,uint256 deadline) params) external payable returns (uint128 liquidity, uint256 amount0, uint256 amount1)"
    ];

    // --- Setup Contracts ---
    const wphrs = new ethers.Contract(wphrs_token_contract, erc20Abi, wallet);
    const usdc = new ethers.Contract(usdc_token_contract, erc20Abi, wallet);
    const manager = new ethers.Contract(uniswap_lp_contract, managerAbi, wallet);

    // --- Parameters ---
    const feeTier = 500; // 0.05%
    const tickSpacing = 10; // For fee tier 500
    const tickLower = -887270;
    const tickUpper = 887270;

    const amount0Desired = ethers.parseUnits(`${wphrs_amount}`, 18);  // WPHRS
    const amount1Desired = ethers.parseUnits(`${usdc_amount}`, 18);    // USDC
                                         
    const amount0Min = ethers.parseUnits(`${wphrs_amount - 0.000006}`, 18);       // WPHRS slippage
    const amount1Min = ethers.parseUnits(`${usdc_amount - 0.002}`, 18);          // USDC slippage
    const deadline = Math.floor(Date.now() / 1000) + 600;
    // console.log("Approving tokens...");

    // const wphrsBal = await wphrs.balanceOf(wallet.address);
    // const usdcBal = await usdc.balanceOf(wallet.address);
    // if (wphrsBal < amount0Desired || usdcBal < amount1Desired) {
    //     // throw new Error("Insufficient token balance");
    // }

    // await wphrs.approve(uniswap_lp_contract, amount0Desired);
    // await usdc.approve(uniswap_lp_contract, amount1Desired);

    console.log("Sending mint transaction...");
// (address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256)	('0x76aaada469d23216be5f7c596fa25f282ff9b364', '0xad902cf99c2de2f1ba5ec4d642fd7e49cae9ee37', 500, -887270, 887270, 1000000000000000, 423839490391613438, 997509336107633, 422778563845596915, '0xae78d3af741ea85e812c8fdd92c3704b8c19f6f7', 1747530353)

    const tx = await manager.mint({
    token0: "0x76aaada469d23216be5f7c596fa25f282ff9b364",
    token1: "0xad902cf99c2de2f1ba5ec4d642fd7e49cae9ee37",
    fee: 500,
    tickLower: -887270,
    tickUpper: 887270,
    amount0Desired: amount0Desired,
    amount1Desired: amount1Desired, //"463793490391613438", 
    amount0Min: amount0Min,
    amount1Min: amount1Min,
    recipient: wallet.address,
    deadline: deadline
    },
    {
    gasLimit: 507882,
    gasPrice: 0
    });

    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log("Liquidity added successfully.");
};

export const get_coin_price = async (provider) => {
    const poolAddress = '0xF8a1D4FF0f9b9Af7CE58E1fc1833688F3BFd6115';
    const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);
    const slot0 = await poolContract.slot0();
    const token0 = await poolContract.token0();
    const token1 = await poolContract.token1();

    const sqrtPriceX96 = slot0.sqrtPriceX96;

    // Convert sqrtPriceX96 to price
    const price = (sqrtPriceX96 ** 2) / (2n ** 192n); // result is token1/token0

    // Figure out which token is USDC
    const USDC_ADDRESS = `${usdc_token_contract}`.toLowerCase();

    let pricePerUSDC;
    if (token0.toLowerCase() === USDC_ADDRESS) {
    pricePerUSDC = 1 / Number(price); // coin per USDC
    } else {
    pricePerUSDC = Number(price); // coin per USDC
    }

    console.log('Coin per USDC:', pricePerUSDC);
}