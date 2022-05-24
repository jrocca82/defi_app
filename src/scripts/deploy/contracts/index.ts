import { ethers as tsEthers } from "ethers";
import * as TokenFarm from "./TokenFarm";
import * as DaiToken from "./DaiToken";
import * as DappToken from "./DappToken";

export interface DeploymentModule {
  contractNames: (...params: any) => string[];
  constructorArguments: (addresses?: any) => any[];
  deploy: (
    deployer: tsEthers.Signer,
    setAddresses: Function,
    addresses?: any
  ) => Promise<tsEthers.Contract>;
  upgrade?: (deployer: tsEthers.Signer, addresses?: any) => void;
}

const modules: DeploymentModule[] = [DaiToken, DappToken, TokenFarm];

export default modules;
