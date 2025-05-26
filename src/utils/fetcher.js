import axios from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";

const fetcher = async (method, url, body, config, proxyUrl) => {
    proxyUrl? console.log(`using proxy ${proxyUrl}...`): console.log(`running without proxy`);
    try {
      const agent = proxyUrl ? new SocksProxyAgent(proxyUrl) : undefined;
  
      const response = await axios({
        method,
        url,
        data: body,
        httpsAgent: agent,
        httpAgent: agent,
        ...config,
      });
  
      return response.data;
    } catch (error) {
      console.error("Request failed:", error);
  
      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response);
        console.error("Axios error config:", error.config);
        // throw new Error((error.response && error.response.data && error.response.data.message) || error.message);
      } else {
        // throw new Error(`Unknown error: ${error.message}`);
      }
    }
};

export {fetcher};