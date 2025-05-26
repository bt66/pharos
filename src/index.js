import { ethers, formatUnits } from "ethers";
import { SocksProxyAgent } from "socks-proxy-agent";
import { load_pk, load_proxy } from "./utils/load_env_text.js";
import dotenv from "dotenv";
import { claim_faucet, claim_faucet_usdc_usdt, daily_login, get_bearer, report_send_token_to_pharos } from "./services/rest_api.js";
import { sleep } from "./utils/sleep.js";
import { swap_wphrs_usdc, swap_wphrs_usdt, wrap_phrs_wphrs } from "./services/swap.js";
import { addLiquidityUniswapV3, get_coin_price } from "./services/liquidity.js";
import { send_to_other } from "./services/send_to_other.js";

dotenv.config();

const main = async() => {
  const privateKey = load_pk()
  const proxys = load_proxy();
  const rpc = "https://testnet.dplabs-internal.com"
  let provider;
  if(privateKey.length == 0) {
    console.log("No pk found in .env, please spesify PK in .env before you run this code... ");
    return;
  }
  console.log(privateKey);
  console.log(proxys);

  for(let i = 0; i < privateKey.length; i++) {
    if(proxys[i] == undefined) {
        console.log("run without proxy");
        provider = new ethers.JsonRpcProvider(rpc);
    } else {
        console.log("running task with proxy");
        const agent = new SocksProxyAgent(proxys[i]);
        const fetchWithProxy = (url, options) => {
            return fetch(url, { ...options, agent });
        };
        provider = new ethers.JsonRpcProvider(rpc, undefined, {
            fetchFn: fetchWithProxy,
        });
    }
    const wallet = new ethers.Wallet(privateKey[i], provider);
    
    console.log("===================================================================");
    console.log(`DOING TASK FOR ADDRESS ${wallet.address}`);
    console.log("GETTING BEARER TOKEN");
    const bearer_token = await get_bearer(wallet, proxys[i])
    bearer_token ? console.log(" bearer token acquired ") : console.log("!! obtaining bearer token failed !!");
    console.log("==================== CLAIM FAUCET PHRS ====================");
    try {
      await claim_faucet(wallet,bearer_token,proxys[i])
    }catch(error) {
      console.log(error);
    }
    await sleep(5000)

    console.log("==================== CLAIM FAUCET USDT USDC ====================");
    try {
      await claim_faucet_usdc_usdt(wallet, bearer_token, proxys[i])
    }catch(error) {
      console.log(error);
    }
    await sleep(5000)

    console.log("==================== Daily checkin ====================");
    try {
      const daily_result = await daily_login(bearer_token, wallet, proxys[i])
      console.log(daily_result.msg);
    }catch(error){
      console.log(error);
    }
    await sleep(5000)

    console.log("==================== Daily swap, send 10x ====================");
    for(let j = 0; j < 4; j++) {
      console.log("=========================");
      console.log(`swap count : ${j}/10`);
      console.log(`wrap count : ${j}/10`);
      console.log(`send count : ${j}/10`);
      console.log("=========================");
      
      try {
        console.log("wrapping phrs to wphrs for 0.001");
        const wrap_tx_hash = await wrap_phrs_wphrs(wallet, provider, 0.001)
        // console.log(report_result.msg);
      }catch(error) {
        console.log(error);
      }
      await sleep(5000);
      try {
        console.log("swap wphrs to usdt for 0.001");
        const swap_wphrs_to_usdt = await swap_wphrs_usdt(wallet, 0.001)
      }catch(error) {
        console.log(error);
      }
      await sleep(5000);
  
      try {
        console.log("swap wphrs to usdc for 0.001");
        const swap_wphrs_to_usdc = await swap_wphrs_usdc(wallet, 0.001)
      }catch(error) {
        console.log(error);
      }
      await sleep(5000);
      console.log("sent to other");
      try {
        await send_to_other(wallet, provider, bearer_token, proxys[i])

      }catch(error) {
        console.log(error);
      }
    }
    // for(let k =0; k< 10; k++) {
    //   console.log(`ADD LIQUIDITY for account : ${wallet.address} - ${k+1}/10`);
    //   try {
    //     console.log("add liquidity wphrs + usdc");
    //     const add_liquidity = await addLiquidityUniswapV3(wallet,0.001,0.460931)
    //   }catch(error) {
    //     console.log(error);
    //   }
    //   await sleep(10000);
    // }
  }
}
console.log("running first ...");
main()

console.log("running every 2 hour");
cron.schedule('0 */2 * * *', async () => {
  console.log('Task running every 2 hour :', new Date().toLocaleTimeString());
  main()
});