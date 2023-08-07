import { JsonRpcProvider, Wallet, ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();


function setupProvider() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    return provider;
}

function setupWallet(provider: JsonRpcProvider) {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    return wallet;
}


async function main() {
    const proposals = process.argv.slice(2);
    console.log({proposals}); 
    console.log("Deploying smart contract");
    console.log("Proposals: ");
    proposals.forEach((element, index) => {
        console.log(`Proposal N. ${index + 1}: ${element}`);
    });

    const provider = setupProvider();
    const wallet = setupWallet(provider);

    const ballotFactory = new Ballot__factory(wallet);
    const ballotContract = await ballotFactory.deploy(
        proposals.map(ethers.encodeBytes32String)
    );
    await ballotContract.waitForDeployment();

    const address = await ballotContract.getAddress();
    console.log(`Contract deployed to the address ${address}`);

    for (let index = 0; index < proposals.length; index++) {
        const proposal = await ballotContract.proposals(index);
        const name = ethers.decodeBytes32String(proposal.name);
        console.log({ index, name, proposal});  
    } 
}

main().catch((error) => {
    console.log("Failed to deploy contract.")
    console.error(error);
    process.exitCode = 1;
});