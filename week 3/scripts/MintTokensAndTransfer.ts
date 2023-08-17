import { ethers, JsonRpcProvider, Wallet } from "ethers";
import { MyToken, MyToken__factory } from "../typechain-types";
import * as dontenv from "dotenv";
dontenv.config();

const MYTOKEN_CONTRACT_ADDRESS = process.env.MYTOKEN_ADDRESS ?? "";
const MINT_VALUE = ethers.parseUnits("12");
const TRANSFER_ACCOUNT = [
    "0x5Fd1C6398785c4ee270AE2EE567CfA316d96Bcf1",
    "0x6875A2d992Fc47fB991506e4A5CDf2684be9F905", 
    "0x642c17127fE9313A05207F60Ee888a5FE8286863",
    "0x5f96ddb952233c1cC7F8946385E0762573810daE",
    "0xC577E96DFB02fC3D2E4cDc1aF9D84BfD7C263C80",
];
const TRANSFER_AMOUNT = ethers.parseUnits("1");



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

    console.log("---------- Minting Tokens ----------");
    const mintTx = await myTokenContract.mint(wallet.address, MINT_VALUE);
    await mintTx.wait();
    console.log(
        `Minted ${MINT_VALUE.toString()} decimal units to account ${wallet.address}`);
    const tokenBalance = await myTokenContract.balanceOf(wallet.address);
    console.log(
        `Account ${wallet.address} has ${tokenBalance.toString()} decimal units of MyToken`);
    const votesAfterMint = await myTokenContract.getVotes(wallet.address);
    console.log(
        `Account ${wallet.address} has ${votesAfterMint.toString()} units of voting power after minting`);

    console.log("---------- Transfering Tokens ----------");
    for (const account of TRANSFER_ACCOUNT) {
        console.log(`Transfering ${TRANSFER_AMOUNT} MyTokens to ${account}...`)
        const TransferTx = await myTokenContract.transfer(account, TRANSFER_AMOUNT);
        await TransferTx.wait();
        const balanceBN = await myTokenContract.balanceOf(account);
        console.log(
            `Account ${account} has ${balanceBN.toString()} decimal units of MyTokens after Transfer`);
        const votesAfterTxDelegate = await myTokenContract.getVotes(account);
        console.log(
            `Account ${account} has ${votesAfterTxDelegate.toString()} units of voting power after Transfer \n`);
        
    }

    console.log("---------- new MyToken Balance ----------");
    const tokenBalanceAfterTransfer =  await myTokenContract.balanceOf(wallet.address);
    console.log(
        `Account ${wallet.address} has ${tokenBalanceAfterTransfer.toString()} decimal units of MyToken after Transfer`);
}

main().catch((error) => {
    console.log(`Failed.`);
    console.error(error);
    process.exitCode = 1;
});