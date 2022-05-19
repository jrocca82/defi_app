import { deployContract } from "../utils";
import { DaiToken } from "../../../../build/typechain";

export const contractNames = () => ["token"];

export const constructorArguments = () => [
];

export const deploy = async (deployer, setAddresses) => {
  console.log("deploying Token");
  const daiToken: DaiToken = (await deployContract(
    "DaiToken",
    constructorArguments(),
    deployer,
    1
  )) as DaiToken;
  console.log(`deployed Token to address ${daiToken.address}`);
  setAddresses({ token: daiToken.address });
  return daiToken;
};
