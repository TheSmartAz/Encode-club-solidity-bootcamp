# Week 3 Projects

Deployed a tokenized ballot contract (written in Solidity and Typescript) on the Sepolia testnet.

MyToken Address: 0xf4a534fcd05f1732e0658060585c660e06445012 ([Etherscan link](https://sepolia.etherscan.io/address/0xf4a534fcd05f1732e0658060585c660e06445012))

Tokenized Ballot Address: 0xb6A3C1C08a978990803b82746317199472950031 ([Etherscan link](https://sepolia.etherscan.io/address/0xb6A3C1C08a978990803b82746317199472950031))

# Token Contract Deployment

By calling the DeployTokens.ts scripts, the contract was deployed on the chain. ([Etherscan link](https://sepolia.etherscan.io/tx/0xcd275386a03fc77c4cc32c6253c580f8b4643084570f188eb9e4aac289a894ad))


# Mint Tokens and Transfer Tokens to other accounts (wallet address)

By calling the MintTokensAndTransfer.ts, 12 Units of MyTokens were minted and 10 of them were equally transfered to 5 different accounts, each account received 2 units of MyTokens.([Etherscan link](https://sepolia.etherscan.io/address/0xf4a534fcd05f1732e0658060585c660e06445012))


# Self Delegation

By calling the SelfDelegate.ts, 2 Units of MyTokens were turned into voting power using the ERC20 delegate() method. ([Etherscan link](https://sepolia.etherscan.io/tx/0x4647d9cfa0777812a4e525489eb2e45ec9fb5276c9f84a7871feb9a35a161731))


# Deploy Ballot

At this time, the tokenized ballot was ready to be deployed. By calling the DeployedBallot.ts, the tokenized ballot was deployed on the chain with proposals ["Red", "Green", "Yellow", "Blue"], and the blocknumber was provided by calling the getBlockNumber() method. ([Etherscan link](https://sepolia.etherscan.io/tx/0x69a5080abc80893ad1bcd67d0f87fcd565842abf749a4d65475d6ba670629fad))


# Check Voting Power

After deploying the tokenized ballot, we can call CheckVotePower.ts following the wallet address to check the account's current voting power and balance.


# Voting

By calling the Voting.ts, one can cast vote to a selected proposal with specific amount of voting power. ([Etherscan link](https://sepolia.etherscan.io/tx/0xe8257ab2be556702ca1d629aaedd5380b994d57834fef3c3e31ccd13c517467a))


# Winning Proposal and Winner Name

By calling the winnerName.ts, it would show the ballot's winner proposal and its name.

