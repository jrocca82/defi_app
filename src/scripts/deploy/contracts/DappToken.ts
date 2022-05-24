import { deployContract } from "../utils";
import { DappToken } from "../../../../build/typechain";

export const contractNames = () => ["dappToken"];

export const constructorArguments = () => [
];

export const deploy = async (deployer, setAddresses) => {
  console.log("deploying Token");
  const dappToken: DappToken = (await deployContract(
    "DappToken",
    constructorArguments(),
    deployer,
    1
  )) as DappToken;
  console.log(`deployed Token to address ${dappToken.address}`);
  setAddresses({ dappToken: dappToken.address });
  return dappToken;
};
