import Swal from "sweetalert2";
import Web3 from "web3";
import {default as checkUniswapABI} from "./abi.json";

export var web3js: any;
var uniswapCheckSC: any = null;

export function getAccounts(){
    return web3js.eth.getAccounts();
}

export default function Web3Bridge(provider: any) {
    web3js = new Web3(provider);
}
    
export function getCheckUniswapContract(){
    if (uniswapCheckSC) {
        return uniswapCheckSC;
      } else {
        uniswapCheckSC = new web3js.eth.Contract(checkUniswapABI, process.env.REACT_APP_CHECK_UNISWAP_ADDRESS);
        addContractListener();
        return uniswapCheckSC;
    }
}  


async function addContractListener() {
    uniswapCheckSC.events.Minted({}, (error: { message: string; }, data: { returnValues: any; }) => {
      if (error) {
        console.log("Error NewResource: " + error);
      } else {
        let owner = data.returnValues.owner;
        let tokenId = data.returnValues.tokenId;
        Swal.fire('Welcome NFT received', "tokenId: " + tokenId, 'info');
        console.log("New Minted Event: { id: " + tokenId + ", owner: " + owner + "}");
      }
    });
    console.log("Uniswap Check Event: Contract Listener agganciato");
}

export async function mintWelcomeNFT(account: string) {
    const tokenId = await uniswapCheckSC.methods.mint().send({ from : account });
    return tokenId;
}

