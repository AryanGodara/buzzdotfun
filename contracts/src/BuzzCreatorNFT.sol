// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.20;

import {ERC721} from "openzeppelin/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "openzeppelin/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "openzeppelin/access/Ownable.sol";
import {Strings} from "openzeppelin/utils/Strings.sol";

/**
 * @title BuzzCreatorNFT
 * @notice NFT contract for Buzz.fun creator scores
 * @dev Allows multiple NFTs per address to farm transactions on Base
 */
contract BuzzCreatorNFT is ERC721, ERC721Enumerable, Ownable {
    using Strings for uint256;

    struct CreatorScore {
        uint256 overallScore;
        uint256 engagement;
        uint256 consistency;
        uint256 growth;
        uint256 quality;
        uint256 network;
        uint256 fid; // Farcaster ID
        string username;
        uint256 timestamp;
    }

    // Token ID counter
    uint256 private _nextTokenId = 1;
    
    // Mapping from token ID to creator score data
    mapping(uint256 => CreatorScore) public creatorScores;
    
    // Mapping from address to array of token IDs they own
    mapping(address => uint256[]) public ownerTokens;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Events
    event CreatorScoreMinted(
        address indexed to,
        uint256 indexed tokenId,
        uint256 overallScore,
        uint256 fid,
        string username
    );

    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseTokenURI;
    }

    /**
     * @notice Mint a new creator score NFT
     * @param to Address to mint the NFT to
     * @param overallScore Overall creator score (0-100)
     * @param engagement Engagement score component
     * @param consistency Consistency score component
     * @param growth Growth score component
     * @param quality Quality score component
     * @param network Network score component
     * @param fid Farcaster ID
     * @param username Farcaster username
     */
    function mintCreatorScore(
        address to,
        uint256 overallScore,
        uint256 engagement,
        uint256 consistency,
        uint256 growth,
        uint256 quality,
        uint256 network,
        uint256 fid,
        string memory username
    ) external {
        require(overallScore <= 100, "Score must be <= 100");
        require(bytes(username).length > 0, "Username cannot be empty");
        
        uint256 tokenId = _nextTokenId++;
        
        // Store creator score data
        creatorScores[tokenId] = CreatorScore({
            overallScore: overallScore,
            engagement: engagement,
            consistency: consistency,
            growth: growth,
            quality: quality,
            network: network,
            fid: fid,
            username: username,
            timestamp: block.timestamp
        });
        
        // Mint the NFT
        _safeMint(to, tokenId);
        
        // Track tokens owned by address
        ownerTokens[to].push(tokenId);
        
        emit CreatorScoreMinted(to, tokenId, overallScore, fid, username);
    }

    /**
     * @notice Get creator score data for a token
     * @param tokenId The token ID to query
     * @return CreatorScore struct with all score data
     */
    function getCreatorScore(uint256 tokenId) external view returns (CreatorScore memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return creatorScores[tokenId];
    }

    /**
     * @notice Get all token IDs owned by an address
     * @param owner The address to query
     * @return Array of token IDs
     */
    function getTokensByOwner(address owner) external view returns (uint256[] memory) {
        return ownerTokens[owner];
    }

    /**
     * @notice Get the latest creator score NFT for an address
     * @param owner The address to query
     * @return tokenId The most recent token ID, 0 if none
     * @return score The creator score data
     */
    function getLatestCreatorScore(address owner) external view returns (uint256 tokenId, CreatorScore memory score) {
        uint256[] memory tokens = ownerTokens[owner];
        if (tokens.length == 0) {
            return (0, CreatorScore(0, 0, 0, 0, 0, 0, 0, "", 0));
        }
        
        // Find the token with the latest timestamp
        uint256 latestTokenId = tokens[0];
        uint256 latestTimestamp = creatorScores[tokens[0]].timestamp;
        
        for (uint256 i = 1; i < tokens.length; i++) {
            if (creatorScores[tokens[i]].timestamp > latestTimestamp) {
                latestTokenId = tokens[i];
                latestTimestamp = creatorScores[tokens[i]].timestamp;
            }
        }
        
        return (latestTokenId, creatorScores[latestTokenId]);
    }


    /**
     * @notice Update base URI for metadata (owner only)
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    /**
     * @notice Withdraw contract balance (owner only)
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @notice Get token URI for metadata
     * @param tokenId Token ID to get URI for
     * @return Token URI string
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 
            ? string(abi.encodePacked(baseURI, tokenId.toString()))
            : "";
    }

    /**
     * @notice Get base URI
     * @return Base URI string
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @notice Override _update to handle token transfers and ownership tracking
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override(ERC721, ERC721Enumerable) returns (address) {
        address from = _ownerOf(tokenId);
        
        // Handle ownership tracking for transfers
        if (from != address(0) && to != address(0) && from != to) {
            // Remove from old owner's list
            uint256[] storage fromTokens = ownerTokens[from];
            for (uint256 i = 0; i < fromTokens.length; i++) {
                if (fromTokens[i] == tokenId) {
                    fromTokens[i] = fromTokens[fromTokens.length - 1];
                    fromTokens.pop();
                    break;
                }
            }
            
            // Add to new owner's list
            ownerTokens[to].push(tokenId);
        }
        
        return super._update(to, tokenId, auth);
    }

    /**
     * @notice Override _increaseBalance for ERC721Enumerable compatibility
     */
    function _increaseBalance(address account, uint128 value) internal virtual override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    /**
     * @notice Override supportsInterface for ERC721Enumerable compatibility
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
