import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import exp from "constants";
import { parseUnits, toBigInt, toNumber } from "ethers";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.encodeBytes32String(array[index]));
    }
    return bytes32Array;
}

async function deployContract() {
    const ballotFactory = await ethers.getContractFactory("Ballot");
    const ballotContract = await ballotFactory.deploy(
        PROPOSALS.map(ethers.encodeBytes32String)
    );
    await ballotContract.waitForDeployment();
    return ballotContract;
}

describe("Ballot", async() => {
    let ballotContract: Ballot;
    let accounts: HardhatEthersSigner[];

    describe("When the contract is deployed", async () => {
        beforeEach(async () => {
            ballotContract = await loadFixture(deployContract);
            accounts = await ethers.getSigners();
        });

        it("has the provided proposals", async () => {
            for (let index = 0; index < PROPOSALS.length; index++) {
                const proposal = await ballotContract.proposals(index);
                expect(ethers.decodeBytes32String(proposal.name)).to.eq(
                    PROPOSALS[index]
                );
            }
        });
 
        it("has zero votes for all proposals", async () => {
            for (let index = 0; index < PROPOSALS.length; index++) {
                const proposal = await ballotContract.proposals(index);
                expect(proposal.voteCount).to.eq(0);
                
            }
        });

        it("sets the voting weight for the chairperson as 1", async () => {
            const deployerAddress = accounts[0].address;
            const chairpersonVoter = await ballotContract.voters(deployerAddress);
            expect(chairpersonVoter.weight).to.eq(1);
        });

        it("sets the deployer address as chairperson", async () => {
            const deployerAddress = accounts[0].address;
            const chairperson = await ballotContract.chairperson();
            expect(chairperson).to.eq(deployerAddress); 
        });
    });

    describe("when the chairperson interacts with the giveRightToVote function in the contract", async () => {
        beforeEach(async () => {
            ballotContract = await deployContract();
            accounts = await ethers.getSigners();
        });

        it("gives right to vote for another address", async () => {
            const newAddr = accounts[1];
            await ballotContract.giveRightToVote(newAddr.address);
            const Voter = await ballotContract.voters(newAddr.address);
            expect(Voter.weight).to.equal(1);
        });
        it("cannot give right to vote for someone that has voted", async () => {
            const newAddr = accounts[1];
            await ballotContract.giveRightToVote(newAddr.address);
            await ballotContract.connect(newAddr).vote(0);
            await expect(
                ballotContract.giveRightToVote(newAddr.address)
                ).to.be.revertedWith("The voter already voted.");
        });
        it("cannot give right to vote for someone that has already been given right to vote", async () => {
            const newAddr = accounts[1];
            await ballotContract.giveRightToVote(newAddr.address);
            await expect(
                ballotContract.giveRightToVote(newAddr.address)
            ).to.be.reverted;
        });
  });

    describe("when the voter interacts with the vote function in the contract", async () => {
        beforeEach(async () => {
            ballotContract = await deployContract();
            accounts = await ethers.getSigners();
        });
        it("should register the vote", async () => {
            const newAddr = accounts[1]
            await ballotContract.giveRightToVote(newAddr.address);
            await ballotContract.connect(newAddr).vote(0);
            const proposal = await ballotContract.proposals(0);
            expect(proposal.voteCount).to.eq(1);
        });
    });

    describe("when the voter interacts with the delegate function in the contract", async () => {
        beforeEach(async () => {
            ballotContract = await deployContract();
            accounts = await ethers.getSigners();
        });
        it("should transfer voting power", async () => {
            const newAddr1 = accounts[1];
            const newAddr2 = accounts[2];
            await ballotContract.giveRightToVote(newAddr1.address);
            await ballotContract.giveRightToVote(newAddr2.address);
            await ballotContract.connect(newAddr1).delegate(newAddr2.address);
            const voter2 = await ballotContract.voters(newAddr2.address);
            expect(voter2.weight).to.eq(2);
        });
  });

    describe("when an account other than the chairperson interacts with the giveRightToVote function in the contract", async () => {
        beforeEach(async () => {
            ballotContract = await deployContract();
            accounts = await ethers.getSigners();
        });
        it("should reverts", async () => {
            const newAddr1 = accounts[1];
            const newAddr2 = accounts[2];
            await expect(
                ballotContract.connect(newAddr1).giveRightToVote(newAddr2.address)
            ).to.be.revertedWith("Only chairperson can give right to vote.");
        });
    });

    describe("when an account without right to vote interacts with the vote function in the contract", async () => {
        beforeEach(async () => {
            ballotContract = await deployContract();
            accounts = await ethers.getSigners();
        });
        it("should reverts", async () => {
            const newAddr = accounts[1];
            await expect(ballotContract.connect(newAddr).vote(0)
            ).to.be.revertedWith("Has no right to vote");
        });
    });

    describe("when an account without right to vote interact with the delegate function in the contract", async () => {
        beforeEach(async () => {
            ballotContract = await deployContract();
            accounts = await ethers.getSigners();
        });
        it("should reverts", async () => {
            const newAddr1 = accounts[1];
            const newAddr2 = accounts[2];
            await expect(ballotContract.connect(newAddr1).delegate(newAddr2.address)
            ).to.be.revertedWith("You have no right to vote");
        });
    });

    describe("when someone interacts with the winningProposal function before any vote has been casted", async () => {
        beforeEach(async () => {
            ballotContract = await deployContract();
            accounts = await ethers.getSigners();
        });
        it("should return 0", async () => {
            expect(await ballotContract.winningProposal()).to.eq(0);
        });
    });

    describe("when someone interacts with the winnerName function before any votes are cast", async () => {
        beforeEach(async () => {
            ballotContract = await deployContract();
            accounts = await ethers.getSigners();
        });
        it("should return name of proposal 0", async () => {
            const winnerName = ethers.decodeBytes32String(await ballotContract.winnerName());
            expect(winnerName).to.eq(PROPOSALS[0]);
        });
    });

    describe("when someone interacts with the winnerName function after one vote is cast for the first proposal", async () => {
        beforeEach(async () => {
            ballotContract = await deployContract();
            accounts = await ethers.getSigners();
        });
        it("should return name of proposal 0", async () => {
            const newAddr = accounts[1];
            await ballotContract.giveRightToVote(newAddr.address);
            await ballotContract.connect(newAddr).vote(0);
            const winnerName = ethers.decodeBytes32String(await ballotContract.winnerName());
            expect(winnerName).to.eq(PROPOSALS[0]);
        });
    });

    describe("when someone interacts with the winningProposal function and winnerName after 5 random votes are cast for the proposals", async () => {
        beforeEach(async () => {
            ballotContract = await deployContract();
            accounts = await ethers.getSigners();
        });
        it("should return the correct winner", async () => {
            for (let i = 1; i < 6; i++) {
                const newAddr = accounts[i];
                await ballotContract.giveRightToVote(newAddr);
                await ballotContract.connect(newAddr).vote(
                    Math.floor(Math.random() * PROPOSALS.length));
            }

            let winningProposal = -1;
            let winningVoteCount = -1;
            for (var index in PROPOSALS) {
                const voteCount = toNumber((await ballotContract.proposals(index)).voteCount);
                if (voteCount > winningVoteCount) {
                    winningProposal = toNumber(index);
                    winningVoteCount = voteCount;
                }
            }

            expect(await ballotContract.winnerName()).to.eq(
                (await ballotContract.proposals(winningProposal)).name);
        });
    });
});
