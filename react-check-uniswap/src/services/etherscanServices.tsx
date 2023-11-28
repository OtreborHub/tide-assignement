import axios from 'axios';

export interface EtherscanTransaction {
  hash: string,
  timeStamp: string,
  blockHash: string,
  contractAddress: string,
  from: string,
  to: string,
}


export default async function getEtherscanTransaction(ethereumAddress: string, chainId: number) {
  const baseUrl = chainId === 11155111 ? process.env.REACT_APP_ETHERSCAN_SEP_URL : process.env.REACT_APP_ETHERSCAN_MNT_URL;
  
  const params = {
        module: 'account',
        action: 'txlist',
        address: ethereumAddress,
        sort: 'desc',
        apikey: process.env.REACT_APP_ETHERSCAN_API_KEY
      }
      
    // const response = await axios.get(`${process.env.REACT_APP_ETHERSCAN_MNT_URL}`, { params });
    const response = await axios.get(String(baseUrl), { params });
    return response;
}

export async function getEtherscanContract(ethereumAddress: string, chainId: number){
  const baseUrl = chainId === 11155111 ? process.env.REACT_APP_ETHERSCAN_SEP_URL : process.env.REACT_APP_ETHERSCAN_MNT_URL;

  const params = {
    module: 'contract',
    action: 'getcontractcreation',
    contractaddresses: ethereumAddress,
    apikey: process.env.REACT_APP_ETHERSCAN_API_KEY
  }

  const response = await axios.get(String(baseUrl), { params });
  return response.data.result.length > 0;
}