import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { TokenSale, ERC20, MyERC20, MyERC721 } from "../typechain-types";


const RATIO = 10;

describe("NFT Shop", async () => {
    let tokenSaleContract: TokenSale;
    let paymentTokenContract: MyERC20;
    let nftContract: MyERC721;
    let deployer: HardhatEthersSigner;
    let acc1: HardhatEthersSigner;
    let acc2: HardhatEthersSigner

    async function deployContracts() {
        // Deploying Token Contract to be used as payment token
        const paymentTokenContractFactory = await ethers.getContractFactory("MyERC20");
        const paymentTokenContract_ = await paymentTokenContractFactory.deploy();
        await paymentTokenContract_.waitForDeployment();
        const paymentTokenContractAddress = await paymentTokenContract_.getAddress();

        // Deploying Token Contract to be used as NFT collection
        const nftContractFactory = await ethers.getContractFactory("MyERC721");
        const nftContract_ = await nftContractFactory.deploy();
        await nftContract_.waitForDeployment();
        const nftContractAddress = await nftContract_.getAddress();

        // Deploying the Token Sale Contract
        const tokenSaleContractFactory = await ethers.getContractFactory("TokenSale");
        const tokenSaleContract_ = await tokenSaleContractFactory.deploy(RATIO, paymentTokenContractAddress);
        await tokenSaleContract_.waitForDeployment();

        //Giving Minter Role for Token Sale Contract in Payment Token Contract
        const tokenSaleContractAddress = await tokenSaleContractContract_.getAddress();
        const MINTER_ROLE = await paymentTokenContract_.MINTER_ROLE();
        const giveRoleTx = await paymentTokenContract_.grantRole(MINTER_ROLE, tokenSaleContractAddress);
        await giveRoleTx.wait();

        return {tokenSaleContract_, paymentTokenContract_};
    }

    beforeEach(async () => {
        [deployer, acc1, acc2] = await ethers.getSigners();
        const {tokenSaleContract_, paymentTokenContract_} = await loadFixture(deployContracts);
        tokenSaleContract = tokenSaleContract_;
        paymentTokenContract = paymentTokenContract_;
    });

    describe("When the Shop contract is deployed ", async () => {
        it("defines the ratio as provided in parameters", async () => {
            const ratio = await tokenSaleContract.ratio();
            expect(ratio).to.eq(RATIO);
        });

        it("uses a valid ERC20 as payment token", async () => {
            const paymentTokenAddress = await tokenSaleContract.paymentToken();
            const tokenContractFactory = await ethers.getContractFactory("ERC20");
            const paymentTokenContract = tokenContractFactory.attach(paymentTokenAddress) as ERC20;
            await expect(paymentTokenContract.balanceOf(ethers.ZeroAddress)).not.to.be.reverted;
            await expect(paymentTokenContract.totalSupply()).not.to.be.reverted;
        });
    });
    
    describe("When a user buys an ERC20 from the Token contract", async () => {
        const TEST_BUY_TOKENS_ETH_VALUE = ethers.parseUnits("1");
        const TEST_BUY_TOKENS_WEI_VALUE = 1;
        let ETH_BALANCE_BEFORE_TX:bigint;
        let ETH_BALANCE_AFTER_TX:bigint;
        let TOKEN_BALANCE_BEFORE_TX: bigint;
        let TOKEN_BALANCE_AFTER_TX: bigint;
        let GAS_FEES_PAID_IN_TX: bigint;

        beforeEach(async () => {
            TOKEN_BALANCE_BEFORE_TX = await paymentTokenContract.balanceOf(acc1.address);
            ETH_BALANCE_BEFORE_TX = await ethers.provider.getBalance(acc1.address);
            const buyTokensTx = await tokenSaleContract.connect(acc1).buyTokens({value: TEST_BUY_TOKENS_ETH_VALUE});
            const receipt = buyTokensTx.wait();
            
            const gasUsed =  receipt?.gasused ?? 0n;
            const gasPrice = receipt?.gasPrice ?? 0n;

            GAS_FEES_PAID_IN_TX = receipt?.gasUsed * receipt?.gasPrice;
            TOKEN_BALANCE_AFTER_TX = await paymentTokenContract.balanceOf(acc1.address);
            ETH_BALANCE_AFTER_TX = await ethers.provider.getBalance(acc1.address);
        });

        it("charges the correct amount of ETH", async() => {
            const diff = ETH_BALANCE_BEFORE_TX - ETH_BALANCE_AFTER_TX;
            const expctedDiff = TEST_BUY_TOKENS_ETH_VALUE * RATIO;
            expect(diff).to.eq(expctedDiff);
        });

        it("gives the correct amount of tokens", async() => {
            const diff = TOKEN_BALANCE_AFTER_TX - TOKEN_BALANCE_BEFORE_TX;
            const expctedDiff = TEST_BUY_TOKENS_ETH_VALUE * RATIO;
            expect(diff).to.eq(expctedDiff);
        });
    });

    describe("When a user burns their NFT at the Shop contract", async () => {
        it("gives the correct amount of ERC20 tokens", async () => {
            throw new Error("Not implemented");
        });
    });
    
    describe("When the owner withdraws from the Shop contract", async () => {
        it("recovers the right amount of ERC20 tokens", async () => {
             throw new Error("Not implemented");
        });
    
        it("updates the owner pool account correctly", async () => {
            throw new Error("Not implemented");
        });

    });
});