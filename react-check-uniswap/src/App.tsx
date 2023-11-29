
import { useSDK } from '@metamask/sdk-react';
import { useEffect, useState } from 'react';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import './App.css';
import getUniswapTransactions from './services/uniswapQueryService';
import getEtherscanTransaction, { EtherscanTransaction, getEtherscanContract } from './services/etherscanServices';
import Web3Bridge, { getCheckUniswapContract, mintWelcomeNFT } from './services/web3BridgeService';

export default function App() {

  const [account, setAccount] = useState<string>("");
  const [validTransaction, isValidTransaction] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number>(-1);
  const { sdk, provider } = useSDK();

  useEffect(() => {
    console.log("useEffect");
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_chainId' }).then((chainId) => {
        setChainId(Number(chainId));
      });

      //Events
      window.ethereum.on('chainChanged', handleChanges);
      window.ethereum.on('accountsChanged', handleChanges);
    } else {
      console.error('MetaMask non è disponibile');
    }
  }, []);

  const handleChanges = async () => {
    disconnect();
    window.location.reload();
  };

  async function connect(){
    try {
      const accounts: any = await sdk?.connect();
      const account: string = accounts?.[0];
      console.log("wallet " + account + " connected")
      setAccount(account);
      
      var last24hTransactions: any = await walletTransaction(account, chainId);
      await uniswapTransactions(last24hTransactions, account, chainId);

    } catch(err) {
      console.warn(`failed to connect..`, err);
    }
  };
  
  function disconnect() {
    try {
      console.log("wallet " + account + " disconnected")
      sdk?.terminate();
      setAccount("");
    } catch (err) {
      console.warn(`failed to disconnect..`, err);
    }
  }

  //ETHERSCAN
  async function walletTransaction(ethereumAddress: string, chainId: number){
    const res = await getEtherscanTransaction(ethereumAddress, chainId);

    if(res.data.status === '1' && res.data.result.length > 0){
      const allTransactions = res.data.result;
      const last24hTransaction = filterTransactions(allTransactions);
      return last24hTransaction;
    }
    
  }

  function filterTransactions(results: any): EtherscanTransaction[]{
    const now = Date.now();
    const from = now - 86400000; // 1 Giorno
    var transactions: EtherscanTransaction[] = [];

    console.log ( "filter transaction from: " + from + " to " + now);
    results.forEach((transaction: EtherscanTransaction) => {
      var timestamp = Number(transaction.timeStamp) * 1000;
      if (timestamp < now && timestamp > from){
        transactions.push(transaction);
      }
    });

    return transactions;
  }



  //UNISWAP
  async function uniswapTransactions(last24hTransactions: EtherscanTransaction[], ethereumAddress: string, chainId: number){
    if(last24hTransactions.length === 0){
      const baseUrl = chainId === 11155111 ? "https://sepolia.etherscan.io/address/" : "https://etherscan.io/address/";
      showPopUp("Something's missing!", "Be sure your wallet had a transition in the last 24h:\nPlease refers to " + baseUrl + ethereumAddress, "error");
    } else {
      const transactionPromises = last24hTransactions.map(async (tx) => {
        try {
          const txs = await getUniswapTransactions(tx.hash);
    
          if (txs && txs.length > 0) {
            console.log("Transaction found on Uniswap for Tx hash: " + tx.hash);
            isValidTransaction(true);
          } else {
            console.log("No transaction found on Uniswap for Tx hash: " + tx.hash);
            throw new Error("No transaction found on Uniswap");
          }

        } catch (error) {
          throw error;  // Rilancia l'errore per farlo catturare da Promise.all
        }
      });
    
      try {
        await Promise.all(transactionPromises);
      } catch (error) {
        showPopUp("Something's missing!","Be sure your wallet had a transition to Uniswap in the last 24h", "error");
      }

    }
    
    // For mint testing uncomment
    // const testing = true;
    // if( testing ) {
    //   isValidTransaction(true);
    // }

  }

  async function mint(){
    try {
        Web3Bridge(provider);
        const contract = getCheckUniswapContract();
        const contractExist:boolean = await getEtherscanContract(contract._address, chainId);
      if(contractExist){
        const tokenId = await mintWelcomeNFT(account)
        .then((result: any) => {
          showPopUp("Welcome NFT Minted", "Token ID: #" + tokenId, "success");
        });
        console.log(tokenId);
      } else {
        throw new Error("No contract found on Etherscan");
      }

    } catch (error) {
      showPopUp("Transaction not sent", "Something goes wrong in the minting process. Please try later.", "error");
    }
  }

  function showPopUp(title: string, text: string, level: SweetAlertIcon){
    Swal.fire({
      title: title,
      text: text,
      icon: level,
      showConfirmButton: false
    });
  }

  return (
    <>
      <div className="main">
        <h1 className="title"><span className="accent">Uniswap</span> Check </h1>
        <div className="row">
            <div className="col-12">

              <p className="subtitle">Connect your wallet and retrieve your welcome NFT!</p>
              <p className="condition">Be sure your wallet had a transition to Uniswap in the last 24h</p>
              <button className="btn btn-connect" onClick={account !== ""? () => disconnect(): () => connect()}> <strong>{account !== "" ? "disconnect" : "connect wallet"}</strong> </button>
              <button className="btn btn-nft" onClick={() => mint()} disabled={account === "" || (account !== "" && !validTransaction)}><strong> mint your NFT </strong></button>

            </div>
        </div>
      </div>
    </>
  )
}


