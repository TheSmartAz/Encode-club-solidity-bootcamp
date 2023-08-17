import { JsonRpcProvider, Wallet, ethers } from "ethers";
import { MyToken__factory, TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();


function setupProvider() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    return provider;
}

function setupWallet(provider: JsonRpcProvider) {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider)
    return wallet.connect(provider);
}

async function deployMyTokenContract(wallet: Wallet) {
    const MyTokenFactory = new MyToken__factory(wallet);
    const MyTokenContract = await MyTokenFactory.deploy();
    await MyTokenContract.waitForDeployment();
    return MyTokenContract;
}


async function main() {
    const provider = setupProvider();
    const wallet = setupWallet(provider);
    const balanceBN = await provider.getBalance(wallet.address);

    
    const myTokenContract = await deployMyTokenContract(wallet);
    const myTokenContractAddress = await myTokenContract.getAddress();
    console.log(`MyTokenContract deployed at ${myTokenContractAddress}\n`);

}

main().catch((error) => {
    console.log("Failed to deploy contract.")
    console.error(error);
    process.exitCode = 1;
});