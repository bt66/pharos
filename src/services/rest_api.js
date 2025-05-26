import { fetcher } from "../utils/fetcher.js";


export const report_send_token_to_pharos = async (wallet,txhash, bearer, proxy_url) => {
  const config = {
    headers: {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      "authorization": `Bearer ${bearer}`,
      "origin": "https://testnet.pharosnetwork.xyz",
      "referer": "https://testnet.pharosnetwork.xyz/",
      "sec-ch-ua": `"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"`,
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": `"Windows"`,
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
    }
  }
  console.log("===========================");
  // console.log(wallet.address);
  // console.log(txhash);
  console.log("===========================");
  try {
    const result = await fetcher("POST", `https://api.pharosnetwork.xyz/task/verify?address=${wallet.address}&task_id=103&tx_hash=${txhash}`, null, config, proxy_url)
    return result
    
  }catch(error){
    console.log(error);
  }
  // console.log(result);
}

export const get_bearer = async(wallet, proxy_url)=> {
  const message = "pharos";

  const signature = await wallet.signMessage(message);

  // console.log("Signature:", signature);
  const config = {
    headers: {
      'content-profile': 'public',
      'Referer': 'https://testnet.pharosnetwork.xyz/',
      'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
      'accept': 'application/vnd.pgrst.object+json',
      'content-type': 'application/json',
      'sec-ch-ua-mobile' : '?0',
      'sec-ch-ua-platform' : 'Windows',
      'sec-fetch-dest' : 'empty',
      'sec-fetch-mode' : 'cors',
      'sec-fetch-site' : 'same-site'
    }
  }
  try {
    const bearer = await fetcher("POST", `https://api.pharosnetwork.xyz/user/login?address=${wallet.address}&signature=${signature}`,null, config, proxy_url)
    // console.log(bearer);
    return bearer.data.jwt

  }catch (err) {
    console.log(err);
    // throw new Error(err)
  }
}

export const daily_login = async (bearer, wallet, proxy_url) => {

  const config = {
    headers: {
      'accept':'application/json, text/plain, */*',
      'accept-language':'en-US,en;q=0.9',
      'authorization':`Bearer ${bearer}`,
      'content-length':'0',
      'origin':'https://testnet.pharosnetwork.xyz',
      'priority':'u=1, i',
      'referer':'https://testnet.pharosnetwork.xyz/',
      'sec-ch-ua':'"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
      'sec-ch-ua-mobile':'?0',
      'sec-ch-ua-platform':'"Windows"',
      'sec-fetch-dest':'empty',
      'sec-fetch-mode':'cors',
      'sec-fetch-site':'same-site',
      'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36'
    }
  }
  try {
    const result = await fetcher("POST", `https://api.pharosnetwork.xyz/sign/in?address=${wallet.address}`,null, config, proxy_url);
    return result

  }catch(error) {
    console.log(error);
    // throw new Error(error)
  }
}
export const claim_faucet = async (wallet, bearer, proxy_url) => {
  const config = {
    headers: {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9',
    'authorization': `Bearer ${bearer}`,
    'content-length': '0',
    'origin': 'https://testnet.pharosnetwork.xyz',
    'priority': 'u=1, i',
    'referer': 'https://testnet.pharosnetwork.xyz/',
    'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36'
    }
  }
  try {
    const result = await fetcher("POST", `https://api.pharosnetwork.xyz/faucet/daily?address=${wallet.address}`, null, config, proxy_url)
    console.log(result);
    return result

  }catch(error) {
    console.log(error);
  }
}

export const claim_faucet_usdc_usdt = async(wallet,bearer, proxy_url) => {
  const usdt_contract_address = "0xEd59De2D7ad9C043442e381231eE3646FC3C2939";
  const usdc_contract_address = "0xAD902CF99C2dE2f1Ba5ec4D642Fd7E49cae9EE37";
  const config = {
    headers: {
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json',
      'origin': 'https://testnet.zenithswap.xyz',
      'priority': 'u=1, i',
      'referer': 'https://testnet.zenithswap.xyz/',
      'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36'
    }
  }
  try {
    console.log("req usdt faucet ...");
    const result = await fetcher(
      "POST", 
      `https://testnet-router.zenithswap.xyz/api/v1/faucet`, 
      {
        tokenAddress: usdt_contract_address,
        userAddress: wallet.address
      },
      config, 
      proxy_url
    )
    console.log(result);

  }catch(error) {
    console.log(error);
  }
  try {
    console.log("req usdc faucet ...");
    const result = await fetcher(
      "POST", 
      `https://testnet-router.zenithswap.xyz/api/v1/faucet`, 
      {
        tokenAddress: usdc_contract_address,
        userAddress: wallet.address
      }, 
      config, 
      proxy_url
    )
    console.log(result);
    return result

  }catch(error) {
    console.log(error);
  }
}