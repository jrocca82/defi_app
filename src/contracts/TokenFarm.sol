// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    DaiToken public daiToken;
    DappToken public dappToken;

    address[] public stakers;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor (DaiToken _daiToken, DappToken _dappToken) {
        daiToken = _daiToken;
        dappToken = _dappToken;
    }

    //1. Stake tokens (Deposit)
    function stakeTokens(uint256 _amount) public {
        //Deposit function
        daiToken.transferFrom(msg.sender, address(this), _amount);

        //Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        //Add a new user to stakers array
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    //2. Issuing tokens (Earn Interest)
    
    //3. Unstake tokens (Withdrawal)

}