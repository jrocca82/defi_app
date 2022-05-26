import { ethers } from "hardhat";
import { ethers as tsEthers } from "ethers";
import { expect } from "chai";
import {
  DaiToken,
  DaiToken__factory,
  DappToken,
  DappToken__factory,
  TokenFarm,
  TokenFarm__factory
} from "../../build/typechain";
import { parseEther } from "ethers/lib/utils";

let tokenFarm: TokenFarm;
let daiToken: DaiToken;
let dappToken: DappToken;
let deployer: tsEthers.Signer;
let user: tsEthers.Wallet;
let userTwo: tsEthers.Wallet;

describe("Token Farm", () => {
  before(async () => {
    deployer = (await ethers.getSigners())[0];

    daiToken = await new DaiToken__factory(deployer).deploy();
    dappToken = await new DappToken__factory(deployer).deploy();
    tokenFarm = await new TokenFarm__factory(deployer).deploy(
      daiToken.address,
      dappToken.address
    );
    
    user = new ethers.Wallet(
      "0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef",
      deployer.provider
    );
      
      userTwo = new ethers.Wallet(
        "0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddead",
        deployer.provider
      );

      // Send ETH to user from signer.
      await deployer.sendTransaction({
        to: user.address,
        value: parseEther("1000")
      });

      //Tranfer DApp to Token Farm
      const value = parseEther("1000000");
      await dappToken.transfer(tokenFarm.address, value);
  
      //Transfer Dai to User
      const investorValue = parseEther("100");
      await daiToken.transfer(user.address, investorValue);
    });

  it("Should deploy Mock Dai", async () => {
    expect(await daiToken.name()).to.equal("Mock DAI Token");
  });

  it("Should deploy Dapp Tokens", async () => {
    expect(await dappToken.name()).to.equal("DApp Token");
  });

  it("Should deploy Token Farm", async () => {
    expect(await tokenFarm.name()).to.equal("Dapp Token Farm");
  });

  it("Should transfer Dapp to TokenFarm", async () => {
    let balance = await dappToken.balanceOf(tokenFarm.address);
    expect(balance).to.equal(parseEther("1000000"));
  });

  it("Should transfer Dai to user", async () => {
    let balance = await daiToken.balanceOf(user.address);
    expect(balance).to.equal(parseEther("100"));
  });
  
  it("Allows user to stake dai", async () => {
    const balance = await daiToken.balanceOf(user.address);
    expect(balance).to.equal(parseEther("100"));

    await daiToken.connect(user).approve(tokenFarm.address, parseEther("10"));
    await tokenFarm.connect(user).stakeTokens(parseEther("10"));

    const newBalance = await daiToken.balanceOf(user.address);
    expect(newBalance).to.equal(parseEther("90"));

    const tokenFarmDaiBalance = await daiToken.balanceOf(tokenFarm.address);
    const stakingBalance = await tokenFarm.stakingBalance(user.address);
    expect(tokenFarmDaiBalance).to.equal(parseEther("10"));
    expect(stakingBalance).to.equal(parseEther("10"));

    const userStakingStatus = await tokenFarm.isStaking(user.address);
    expect(userStakingStatus).to.equal(true);
  });

  it("Should issue DApp tokens", async () => {
    await tokenFarm.issueTokens();
    const dappBalance = await dappToken.balanceOf(user.address);
    expect(dappBalance).to.equal(parseEther("10"));
  });

  
  it("Should unstake tokens", async () => {
    await tokenFarm.connect(user).unstakeTokens();
    
    const balance = await daiToken.connect(user).balanceOf(user.address);
    expect(balance).to.equal(parseEther("100"));
    
    const tokenFarmDaiBalance = await daiToken.balanceOf(tokenFarm.address);
    const stakingBalance = await tokenFarm.stakingBalance(user.address);
    
    expect(tokenFarmDaiBalance).to.equal(parseEther("0"));
    expect(stakingBalance).to.equal(parseEther("0"));
    
    const userStakingStatus = await tokenFarm.isStaking(user.address);
    expect(userStakingStatus).to.equal(false);
  });
  
  it("Should only let owner issue tokens", async () => {
    tokenFarm.connect(userTwo);
    expect(tokenFarm.issueTokens()).to.be.revertedWith(
      "Caller must be owner"
    );
  });
});
