//SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.20;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/Math.sol";

contract CheckUniswapNFT is ERC721URIStorage, Ownable {

    uint public _tokenIds;
    mapping(address => uint) public userTokenId;
    event Minted(address indexed owner, uint indexed tokenId);

    constructor(address initialOwner) Ownable(initialOwner)
    ERC721("UniswapChecked", "USCK") {
        userTokenId[initialOwner] = 0;
        ( ,_tokenIds) = Math.tryAdd(_tokenIds, 1);
    }

    function mint() external returns (uint tokenId)
    {   
        require(msg.sender != owner(), "Owner cannot retrieve Welcome NFT");
        require(!checkMinted(msg.sender), "Welcome NFT already retrieved!");

        tokenId = _tokenIds;
        _safeMint(msg.sender, tokenId);
       
        //create tokenURI
        string memory tokenURI = "https://cryptologos.cc/logos/uniswap-uni-logo.png";
        _setTokenURI(tokenId, tokenURI);

        userTokenId[msg.sender] = tokenId;
        ( ,_tokenIds) = Math.tryAdd(_tokenIds, 1);
        emit Minted(msg.sender, tokenId);
    }

    function checkMinted(address userAddress) public view returns (bool){
        return userTokenId[userAddress] > 0;
    }

}