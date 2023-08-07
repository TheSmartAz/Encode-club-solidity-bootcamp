import { ethers, JsonRpcProvider, Wallet } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dontenv from "dotenv";
dontenv.config();

function setupProvider() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    return provider
}

function setupWallet(provider: JsonRpcProvider) {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider)
    return wallet
}

function setupContract(wallet: Wallet, contract_address: string) {
    const contractFactory = new Ballot__factory(wallet);
    const contract = contractFactory.attach(contract_address) as Ballot;
    return contract
}

async function main() {
    const contract_address = process.argv[2];

    const provider = setupProvider();
    const wallet = setupWallet(provider);
    const ballotContract = setupContract(wallet, contract_address);
    
    const winningProposalIndex = await ballotContract.winningProposal();
    const winningProposal = await ballotContract.proposals(winningProposalIndex);
    const winnerName = ethers.decodeBytes32String(winningProposal.name); 
    console.log(`The winning proposal is No.${winningProposalIndex}: ${winnerName}, Vote count: ${winningProposal.voteCount}.`)
}

main().catch((error) => {
    console.log(`Failed to retrieve information.`);
    console.error(error);
    process.exitCode = 1;
});