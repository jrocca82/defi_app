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
    address public owner;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;


    constructor (DaiToken _daiToken, DappToken _dappToken) {
        daiToken = _daiToken;
        dappToken = _dappToken;
        owner = msg.sender;
    }

    //1. Stake tokens (Deposit)
    function stakeTokens(uint256 _amount) public {
        require(_amount > 0, "Amount cannot be 0");

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

    //2. Issuing tokens (Earn DApp)
    function issueTokens() public {
        require(owner == msg.sender, "Caller must be owner");

        for (uint256 i=0; i < stakers.length; i ++) {
            address recepient = stakers[i];
            uint256 balance = stakingBalance[recepient];
            if (balance > 0) {
                dappToken.transfer(recepient, balance);
            }
        }
    }
    
    //3. Unstake tokens (Withdrawal)
    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, "Balance must be greater than 0");

        //Transfer
        daiToken.transfer(msg.sender, balance);

        //Set user statuses
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }

}