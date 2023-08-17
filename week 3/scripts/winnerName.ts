import { ethers, JsonRpcProvider, Wallet } from "ethers";
import { TokenizedBallot__factory } from "../typechain-types";
import * as dontenv from "dotenv";
dontenv.config();

const TOKENIZEDBALLOT_CONTRACT_ADDRESS = process.env.TOKENIZEDBALLOT_ADDRESS ?? "";

function setupProvider() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    return provider;
}

function setupWallet(provider: JsonRpcProvider) {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider)
    return wallet.connect(provider);
}

function setupTokenizedBallotContract(wallet: Wallet, address=TOKENIZEDBALLOT_CONTRACT_ADDRESS) {
    return TokenizedBallot__factory.connect(address, wallet);

}

async function main() {

    const provider = setupProvider();
    const wallet = setupWallet(provider);
    const tokenizedBallotContract = setupTokenizedBallotContract(wallet);
    const winningProposal = await tokenizedBallotContract.proposals(await tokenizedBallotContract.winningProposal());
    console.log(`The winning proposal is ${ethers.decodeBytes32String(winningProposal.name)}, vote counts: ${winningProposal.voteCount}. \n`);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});