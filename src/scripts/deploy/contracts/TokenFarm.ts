import { deployContract } from "../utils";
import { DappToken__factory, TokenFarm, DaiToken__factory } from "../../../../build/typechain";
import { ethers } from "ethers";

export const contractNames = () => ["tokenFarm"];

export const constructorArguments = (addresses) => [
  addresses.daiToken, 
  addresses.dappToken
];

export const deploy = async (deployer, setAddresses, addresses) => {
  console.log("deploying Token");
  const tokenFarm: TokenFarm = (await deployContract(
    "TokenFarm",
    constructorArguments(addresses),
    deployer,
    1
  )) as TokenFarm;
  console.log(`deployed Token to address ${tokenFarm.address}`);
  setAddresses({ tokenFarm: tokenFarm.address });

  //SEND ALL TOKENS TO TOKEN FARM
  const dappToken = DappToken__factory.connect(addresses.dappToken, deployer);
  const value = ethers.utils.parseEther("1000000");
  const tx = await dappToken.transfer(tokenFarm.address, value);

  //SEND STARTING VALUE TO INVESTOR
  const daiToken = DaiToken__factory.connect(addresses.daiToken, deployer)
  const investorValue = ethers.utils.parseEther("100");
  const investorTx = await daiToken.transfer("0x0000000000000000000000000000000000000000000000000000000000000002", investorValue)

  //AWAIT TRANSACTIONS ON CHAIN CONFIRMED
  await investorTx.wait(1);
  await tx.wait(1);
  return tokenFarm;
};
