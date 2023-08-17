import { ethers, JsonRpcProvider, Wallet } from "ethers";
import { MyToken, MyToken__factory, TokenizedBallot, TokenizedBallot__factory } from "../typechain-types";
import * as dontenv from "dotenv";
dontenv.config();

const MYTOKEN_CONTRACT_ADDRESS = process.env.MYTOKEN_ADDRESS ?? "";
const TOKENIZEDBALLOT_CONTRACT_ADDRESS = process.env.TOKENIZEDBALLOT_ADDRESS ?? "";

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

function setupTokenizedBallotContract(wallet: Wallet, address=TOKENIZEDBALLOT_CONTRACT_ADDRESS) {
    const tokenizedBallotFactory = new TokenizedBallot__factory(wallet);
    const tokenizedBallotContract = tokenizedBallotFactory.attach(address) as TokenizedBallot;
    return tokenizedBallotContract;
}

async function main() {
    // const account = process.argv[2];
    const account = "0xf2CdB68fB07C0A8661dF1ABdd9a8c6463c207E3f";

    const provider = setupProvider();
    const wallet = setupWallet(provider);
    const myTokenContract = setupContract(wallet);
    const tokenizedBallotContract = setupTokenizedBallotContract(wallet);

    const accountBalance = await myTokenContract.balanceOf(account);
    const accountVotePower = await tokenizedBallotContract.votingPower(account);
    console.log(`Account ${account} has`);
    console.log(`MyToken: ${accountBalance.toString()} decimal units`);
    console.log(`Voting Power: ${accountVotePower.toString()} decimal units \n`);
    
}

main().catch((error) => {
    console.log(`Failed.`);
    console.error(error);
    process.exitCode = 1;
});