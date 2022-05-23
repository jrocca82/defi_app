import { deployContract } from "../utils";
import { TokenFarm } from "../../../../build/typechain";

export const contractNames = () => ["token"];

export const constructorArguments = () => [
  process.env.CONSTRUCTOR_DAI_TOKEN,
  process.env.CONSTRUCTOR_DAPP_TOKEN
];

export const deploy = async (deployer, setAddresses) => {
  console.log("deploying Token");
  const tokenFarm: TokenFarm = (await deployContract(
    "TokenFarm",
    constructorArguments(),
    deployer,
    1
  )) as TokenFarm;
  console.log(`deployed Token to address ${tokenFarm.address}`);
  setAddresses({ tokenFarm: tokenFarm.address });
  return tokenFarm;
};
