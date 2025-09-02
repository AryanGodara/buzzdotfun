// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.20;

import {BaseDeployScript} from "src/deploy/BaseDeployScript.sol";
import {BuzzCreatorNFT} from "src/BuzzCreatorNFT.sol";

/**
 * @title DeployBuzzNFT
 * @notice Deployment script for BuzzCreatorNFT contract
 */
contract DeployBuzzNFT is BaseDeployScript {
    BuzzCreatorNFT public buzzCreatorNFT;

    function deploy() internal override {
        // Deploy the NFT contract deterministically
        (address nftAddress,) = deployDeterministic(
            "BuzzCreatorNFT",
            type(BuzzCreatorNFT).creationCode,
            abi.encode(
                "Buzz Creator Score",
                "BUZZ",
                "https://buzzfunbackend.buzzdotfun.workers.dev/api/nft/metadata/"
            ),
            bytes32(uint256(0))
        );
        
        buzzCreatorNFT = BuzzCreatorNFT(nftAddress);
    }
}
