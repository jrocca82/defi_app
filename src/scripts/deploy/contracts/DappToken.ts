import { deployContract } from "../utils";
import { DappToken } from "../../../../build/typechain";

export const contractNames = () => ["token"];

export const constructorArguments = () => [
];

export const deploy = async (deployer, setAddresses) => {
  console.log("deploying Token");
  const daiToken: DappToken = (await deployContract(
    "DaiToken",
    constructorArguments(),
    deployer,
    1
  )) as DappToken;
  console.log(`deployed Token to address ${daiToken.address}`);
  setAddresses({ token: daiToken.address });
  return daiToken;
};
