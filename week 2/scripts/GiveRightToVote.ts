import { ethers, JsonRpcProvider, Wallet } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dontenv from "dotenv";
dontenv.config();

const CONTRACT_ADDRESS = "0xA38580EF3196d01020970cc1a98A1759C15F79F0";

function setupProvider() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    return provider
}

function setupWallet(provider: JsonRpcProvider) {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider)
    return wallet
}

function setupContract(wallet: Wallet, contract_address=CONTRACT_ADDRESS) {
    const contractFactory = new Ballot__factory(wallet);
    const contract = contractFactory.attach(contract_address) as Ballot;
    return contract
}

async function main() {
    const newVoter = process.argv[2];
    console.log(`Give Voting Right to ${newVoter}...`);

    const provider = setupProvider();
    const wallet = setupWallet(provider);
    const ballotContract = setupContract(wallet);

    await ballotContract.giveRightToVote(newVoter);
    const address = await ballotContract.getAddress();
    console.log(`Successful, ${newVoter} now has the right to vote at contract ${address}`);
}

main().catch((error) => {
    console.log(`Failed to give the right to vote to the assigned voter.`);
    console.error(error);
    process.exitCode = 1;
});