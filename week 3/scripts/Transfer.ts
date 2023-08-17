import { ethers, JsonRpcProvider, Wallet } from "ethers";
import { MyToken, MyToken__factory } from "../typechain-types";
import * as dontenv from "dotenv";
dontenv.config();

const MYTOKEN_CONTRACT_ADDRESS = process.env.MYTOKEN_ADDRESS ?? "";
const TRANSFER_ACCOUNT = [
    "0x5Fd1C6398785c4ee270AE2EE567CfA316d96Bcf1",
    "0x6875A2d992Fc47fB991506e4A5CDf2684be9F905", 
    "0x642c17127fE9313A05207F60Ee888a5FE8286863",
    "0x5f96ddb952233c1cC7F8946385E0762573810daE",
    "0xC577E96DFB02fC3D2E4cDc1aF9D84BfD7C263C80",
];

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
    const amount = ethers.parseUnits("1");
    
    for (const account of TRANSFER_ACCOUNT) {
        const TransferTx = await myTokenContract.transfer(account, amount);
        await TransferTx.wait();
        const balanceBN = await myTokenContract.balanceOf(account);
        console.log(
            `Account ${account} has ${balanceBN.toString()} units of MyTokens after Transfer\n`);
        const votesAfterTxDelegate = await myTokenContract.getVotes(account);
        console.log(
            `Account ${account} has ${votesAfterTxDelegate.toString()} units of voting power after Transfer\n`);
        
    }


}

main().catch((error) => {
    console.log("Failed.");
    console.error(error);
    process.exitCode = 1;
});