import { ethers, JsonRpcProvider, Wallet } from "ethers";
import { TokenizedBallot__factory } from "../typechain-types";
import * as dontenv from "dotenv";
dontenv.config();

const MYTOKEN_CONTRACT_ADDRESS = process.env.MYTOKEN_ADDRESS ?? "";
const PROPOSALS = ["Red", "Green", "Yellow", "Blue"];


function setupProvider() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    return provider;
}

function setupWallet(provider: JsonRpcProvider) {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider)
    return wallet.connect(provider);
}

async function deployTokenizedBallotContract(wallet: Wallet, proposals: string[], blockNumber: number, tokenContract=MYTOKEN_CONTRACT_ADDRESS) {
    const tokenizedBallotFactory = new TokenizedBallot__factory(wallet);
    const tokenizedBallotContract = await tokenizedBallotFactory.deploy(
        proposals.map((proposal) => ethers.encodeBytes32String(proposal)),
        tokenContract,
        blockNumber
    );
    await tokenizedBallotContract.waitForDeployment();
    return tokenizedBallotContract;
}

async function main() {
    const proposals = PROPOSALS;
    console.log("Deploying MyToken and TokenizedBallot...");
    console.log("Proposals: ");
    proposals.forEach((element, index) => {
        console.log(`Proposal N. ${index + 1}: ${element}`);
    });

    const provider = setupProvider();
    const wallet = setupWallet(provider);

    const blockNumber = await provider.getBlockNumber();
    const tokenizedBallotContract = await deployTokenizedBallotContract(wallet, proposals, blockNumber);
    const tokenizedBallotContractAddress = await tokenizedBallotContract.getAddress();
    console.log(`TokenizedBallotContract deployed at ${tokenizedBallotContractAddress}\n`);

}

main().catch((error) => {
    console.log(`Failed.`);
    console.error(error);
    process.exitCode = 1;
});