# Week 2 Homework Report

# Function Explanation

`setupProvider()`: This function returns a new ethers.JsonRpcProvider object, which is used to connect to the Ethereum network.

`setupWallet()`: This function creates a new ethers.Wallet object, which is used to store deployer's private key and used to sign transactions.

`setupContract()`: This function takes deployer's wallet address and the contract address as input, it creates a new instance of smart contract(so we can can manipulate it).

# Script Explanation

`DeployWithEthers.ts`: The script can take multiple parameters that are less than 32 bytes. It takes each of these parameter as proposals, store them in a smart contract, and deploy the contract on the Ehereum blockchain.

`GiveRightToVote.ts`: The script takes 1 parameter: wallet address, then it passes the address to the smart contract's function `giveRightToVote()`. If it satisfies the smart contract's function's requirement, it then grants the address the right to vote on this contract.

`Voting.ts`: The script takes 1 parameter: the index choice of the proposal, then it passes the index to the smart contract's function `vote()`. If it satisfies the smart contract's function requirement, it then casts the vote to the corresponding proposal.

`DelegateVote.ts`: This script takes 1 parameter: the address of delegate voter, then it passes the address to the smart contract's function `delegate()`. If it satisfies the smart contract's function requirement, it then delegates the message sender's vote to the delegate address.  

`WinningProposal.ts`: The script take 1 parameter: the contract address, it passes the address to the smart contract's `winnerName()` and  `winningProposal()` functions, it then returns the contract's winner proposal's name and the vote count for this proposal.

# Transaction

## Deploy the contract on the sepolia testnet

[Etherscan link](https://sepolia.etherscan.io/tx/0x12eda34d8185b125d09f667b4c24fa6d93e15a3c6afc6eace071b27334991689)

## Give right to vote

[Etherscan link](https://sepolia.etherscan.io/tx/0xcab40b516af84073c987224797ab9605ffab70392c7be8cd1a0adb58aed73d1e)

[Etherscan link](https://sepolia.etherscan.io/tx/0x4598f2c2fdc6752d02558433f25406a3e5b3326eb6d12d292ab1f049af61cef0)

[Etherscan link](https://sepolia.etherscan.io/tx/0x207d6f8678a47a75564dd33113d3101884a3e4e51ea893190e1bbdf96a0556c9)

There were two transaction failed (neither of them showed on the etherscan): 
The first one was trying to give the voting right to the address that had been granted the right to vote already.
The second one was trying to use an address other than the deployer's address to give another address the right to vote.

## Delegate Votes

[Etherscan link](https://sepolia.etherscan.io/tx/0xf49f5b770fe876c45c133118155f1abe893e25336d9046efbffda839bf8f346b)

There were two transaction failed (neither of them showed on the etherscan):
The first one was trying to delegate to the address that has casted the vote already.
The second one was trying to delegate after casting the vote. 

# Voting

[Etherscan link](https://sepolia.etherscan.io/tx/0x45b357c1493620cc07fee373c66c5f0ca0b721085799dcc857068c1947972ad1)

[Etherscan link](https://sepolia.etherscan.io/tx/0x00b8ab56729c82341cc6ae5add51759bd4283a2229a38bb9b5695cc61eb553c6)

[Etherscan link](https://sepolia.etherscan.io/tx/0xb475d7c696a6e2068a91bf450b7c55868868588fdd116a5762d92b6ce12206c3)

There were three transaction failed (none of them showed on the etherscan):
The first one was trying to vote, but the message sender did not have the right to vote. 
The second one was trying to vote after casting the vote.
The third one was trying to vote after delegating to another address.

# Winning proposal

The successful transaction correctly returns the winnning proposal and the vote counts, but it did not show on the etherscan.