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
    const args = process.argv.slice(2); 
    const proposal = Number(args[0]);
    const amount = ethers.parseUnits(args[1]);

    const provider = setupProvider();
    const wallet = setupWallet(provider);
    const tokenizedBallotContract = setupTokenizedBallotContract(wallet);

    const votingPower = await tokenizedBallotContract.votingPower(wallet.address);
    console.log(
        `Account ${wallet.address} has ${votingPower.toString()} units of voting power\n`);

    const voteTx = await tokenizedBallotContract.vote(proposal, amount);
    await voteTx.wait();
    const proposalSelected = await tokenizedBallotContract.proposals(proposal); 
    console.log(`Successful, You voted for proposal No.${proposal}: ${ethers.decodeBytes32String(proposalSelected.name)}\n`);
    console.log(`Proposal ${ethers.decodeBytes32String(proposalSelected.name)} now has ${proposalSelected.voteCount} vote counts`)

}

main().catch((error) => {
    console.log(`Unable to cast vote.`);
    console.error(error);
    process.exitCode = 1;
});