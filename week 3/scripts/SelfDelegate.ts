import { ethers, JsonRpcProvider, Wallet } from "ethers";
import { MyToken, MyToken__factory } from "../typechain-types";
import * as dontenv from "dotenv";
dontenv.config();

const MYTOKEN_CONTRACT_ADDRESS = process.env.MYTOKEN_ADDRESS ?? "";

function setupProvider() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    return provider;
}

function setupWallet(provider: JsonRpcProvider) {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider)
    return wallet.connect(provider);
}

function setupContract(wallet: Wallet, contract_address=MYTOKEN_CONTRACT_ADDRESS) {
    const myTokenFactory = new MyToken__factory(wallet);
    const myTokenContract = myTokenFactory.attach(contract_address) as MyToken;
    return myTokenContract;
}


async function main() {
    const provider = setupProvider();
    const wallet = setupWallet(provider);
    const myTokenContract = setupContract(wallet);

    const delegateTx = await myTokenContract.delegate(wallet.address);
    await delegateTx.wait();

    const votesAfterDelegate = await myTokenContract.getVotes(wallet.address);
    console.log(
        `Account ${wallet.address} has ${votesAfterDelegate.toString()} units of voting power after self delegating\n`);
}

main().catch((error) => {
    console.log(`Failed.`);
    console.error(error);
    process.exitCode = 1;
});