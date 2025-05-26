import { create_tx } from "../utils/create_tx.js";
import { report_send_token_to_pharos } from "./rest_api.js";

const rand_wallet_finder = [
  "0x1f4b39f7fbd7a0b1ef7cb6443c5e08eec1649625",
  "0x11E45F1B62ac2AE2e03627fa466D2e106ECA8e9e",
  "0xaed7F45A2d7404cf16417B11eA00a15A7760c8Cb",
  "0x7B9cD23De6F3160fa5a0C16C1E138124aA126e2f",
  "0x799A788629b0126D2a5136adFbF1152102Cb6C90",
  "0x69679fa325A44c06c7bB5a17A88E8633a6d51BF7",
  "0xb8Ed390DF9B55454BE76E8Fcc2930236e2408a8A",
  "0x881c08c4ebc45162b5c9d2eDc1aefb67eA50b1A1",
  "0xb8Ed390DF9B55454BE76E8Fcc2930236e2408a8A",
  "0xB59C589aB7805146cE663f6aa307aAC1A50AD5b3",
  "0x85723Cf15342a05FD57D2D544Ce66364d8E08E59",
  "0x11E45F1B62ac2AE2e03627fa466D2e106ECA8e9e",
  "0x62D6DB03B2125e4c745A7476fb83E54EED0de55B",
  "0x9Cf47dAF6FfeA9e0615456ba7fAf6fFfCb64e20D",
  "0xb8Ed390DF9B55454BE76E8Fcc2930236e2408a8A",
  "0x268a95eeF8740b30222599D158a9d7795e8fEeB6",
  "0x9Cf47dAF6FfeA9e0615456ba7fAf6fFfCb64e20D",
  "0x799A788629b0126D2a5136adFbF1152102Cb6C90",
  "0xD45f1449ef4a06068e103b2145827ad8Fe530254",
  "0xb8Ed390DF9B55454BE76E8Fcc2930236e2408a8A",
  "0x51D2117C454af0b8c808cA14C7578F896FD372fC",
  "0x11E45F1B62ac2AE2e03627fa466D2e106ECA8e9e",
  "0x69679fa325A44c06c7bB5a17A88E8633a6d51BF7",
  "0xb8Ed390DF9B55454BE76E8Fcc2930236e2408a8A",
  "0x8659EAEFC904D9C4fa77a2B4fD0D0Eff3F2dcbbf",
  "0x1f4b39f7fbd7a0b1ef7cb6443c5e08eec1649625",
  "0x7B9cD23De6F3160fa5a0C16C1E138124aA126e2f",
  "0x11E45F1B62ac2AE2e03627fa466D2e106ECA8e9e",
  "0x51D2117C454af0b8c808cA14C7578F896FD372fC",
  "0x881c08c4ebc45162b5c9d2eDc1aefb67eA50b1A1"
]


export const send_to_other = async(wallet, provider, bearer_token, proxy_url, value=0.001) => {
      const random_index = Math.floor(Math.random() * rand_wallet_finder.length);
      console.log(`send to address ${rand_wallet_finder[random_index]}`);
      try {
        console.log("send to rand wallet finder member ...");
        const tx_hash = await create_tx(rand_wallet_finder[random_index], "0x", wallet, provider, value);
        const result_report = await report_send_token_to_pharos(wallet, tx_hash, bearer_token, proxy_url)
        console.log(result_report);
      }catch(error) {
        console.log(error);
        // throw new Error(error)
      }
}