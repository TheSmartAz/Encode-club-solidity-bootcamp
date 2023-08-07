<<<<<<< HEAD

# Contract Explanation

`consturctor()`: The constructor initializes the contract with the String value "Hello World" as `text` variable and address that creates the contract(message sender) as `owner` variable, and then deploys the contract on the chain.

`owner`:  `owner` is set public in the constructor, and thus it works as a getter() that returns the owner of the contract.

`onlyOwner` modifier: This modifier ensures that only the contract owner can execute the function that include this modifier. It compares the address of the caller and the address of contract's owner. If they are equal, then the modifier allows the caller to execute the function that include this modifier.

`helloWorld()`: This function returns the value of `text` variable. The function has public visibility, and thus can be called anyone. This function does not modify the state of the contract.

`setText(string)`: The function replace the string value in the `text` variable with the input `newText` string value. The function is public, so anyone can call this function, but the `onlyOwner` modifier restricts that only the owner of the contract can execute this function.

`transferOwnership(address newOwner)`: The function transfers ownership of the contract to a new address. This function is also public, but the `onlyOwner` modifier restricts that only the owner of the contract can execute this function.



# Transaction Report
  
The contract is initially deployed by the wallet with address 0x134F240827Dd4B047942589998a163A2A1002F1a.

The contract has the address 0x8A1084e3f14E60CD69C63048734C756B86EBC6D8, with the initial text value "Hello World".

[Etherscan link](https://sepolia.etherscan.io/address/0x8A1084e3f14E60CD69C63048734C756B86EBC6D8)

| current stage | address |
| :-----: | ----- |
|contract owner|0x134F240827Dd4B047942589998a163A2A1002F1a|




## First Transaction - setText(string newText) with input string value "send eth pls"

In order to successfully execute the `setText` method, the address of message sender needs to be equal to the address of the contract owner. 

In the first transaction, it happens to be the case that the address of message sender is equal to the address of the contract owner, and thus the method is able to execute, and the text variable is now changed to the newText String value "send eth pls".

[Etherscan link](https://sepolia.etherscan.io/tx/0xd75002589a109ea402ed7f2e95129c878419d04e79e05c6fbb8b8b5ce4167a5a)

| current stage | type | value |
| --- | --- | ---|
|contract owner| address |0x134F240827Dd4B047942589998a163A2A1002F1a|
|text(before transaction)|String|"Hello World"|
|message sender| address |0x134F240827Dd4B047942589998a163A2A1002F1a|
|text(after transaction)|String|"send eth pls"|




## Second Transaction(reverted) - setText(string newText) with input string value "no eth"


As explained in previous transaction, It requires that the message sender address is equal to the address of the contract owner's address to proceed the method, since the method has the `onlyOwner` keyword . 

In this transaction, the contract owner does not share the same address as the message sender, the verification step that the `onlyOwner` modifier requires fails, and thus the transaction fails.

[Etherscan link](https://sepolia.etherscan.io/tx/0x21b50d15dbe3112c93650237d7d9350e892612aac7901eb97dca47239ffb5cc1)

| current stage | type | value |
| --- | --- | ---|
|contract owner|address|0x134F240827Dd4B047942589998a163A2A1002F1a|
|message sender|address|0x96F3A28836454108f542D8Be888625375032aBD5|
|text(before transaction)|String|"send eth pls"|
|text(after transaction)|String|"send eth pls"|

  
  


## Third Transaction(reverted) - transferOwnership(address newOwner) with input address 0x96F3A28836454108f542D8Be888625375032aBD5



The `transferOwnership` method includes the `onlyOwner` modifier, and thus the message sender's address needs to be the exact match of the contract owner address to execute the method.

In the third transaction, the message sender address does not match the contract owner's address, the contract does not allow anyone other than the owner to execute the method, so the transaction fails as expected .

[Etherscan link](https://sepolia.etherscan.io/tx/0xa8f10ca859eb7ba45ad10565aed16bf986046eccd334f8071f0d21c634dd951f)

| current stage | type | value |
| --- | --- | ---|
|message sender|address|0x96F3A28836454108f542D8Be888625375032aBD5|
|text|String|"send eth pls"|
|contract owner(before transaction)|address|0x134F240827Dd4B047942589998a163A2A1002F1a|
|contract owner(after transaction)|address|0x134F240827Dd4B047942589998a163A2A1002F1a|


## Fourth Transaction - transferOwnership(address newOwner) with input address 0x96F3A28836454108f542D8Be888625375032aBD5

The `transferOwnership` method contains the keyword `onlyOwner`. The message sender's address and the contract owner address must be the same to execute the method.

In the fourth transaction, the message sender address is 0x134F240827Dd4B047942589998a163A2A1002F1a, which is same the contract owner's address before the transaction, and the smart contract passes the control of the method to the message sender, and thus the method can be executed correctly.

[Etherscan link](https://sepolia.etherscan.io/tx/0xf5f760d9ebe703bc0325b18075c68056fd91df09ed500b77249695b90faf413b)
  
| current stage | type | value |
| --- | --- | ---|
|contract owner(before transaction)|address|0x134F240827Dd4B047942589998a163A2A1002F1a|
|message sender|address|0x134F240827Dd4B047942589998a163A2A1002F1a|
|text|String|"send eth pls"|
|contract owner(after transaction)|address|0x96F3A28836454108f542D8Be888625375032aBD5|

=======

# Contract Explanation

`consturctor()`: The constructor initializes the contract with the String value "Hello World" as `text` variable and address that creates the contract(message sender) as `owner` variable, and then deploys the contract on the chain.

`owner`:  `owner` is set public in the constructor, and thus it works as a getter() that returns the owner of the contract.

`onlyOwner` modifier: This modifier ensures that only the contract owner can execute the function that include this modifier. It compares the address of the caller and the address of contract's owner. If they are equal, then the modifier allows the caller to execute the function that include this modifier.

`helloWorld()`: This function returns the value of `text` variable. The function has public visibility, and thus can be called anyone. This function does not modify the state of the contract.

`setText(string)`: The function replace the string value in the `text` variable with the input `newText` string value. The function is public, so anyone can call this function, but the `onlyOwner` modifier restricts that only the owner of the contract can execute this function.

`transferOwnership(address newOwner)`: The function transfers ownership of the contract to a new address. This function is also public, but the `onlyOwner` modifier restricts that only the owner of the contract can execute this function.



# Transaction Report
  
The contract is initially deployed by the wallet with address 0x134F240827Dd4B047942589998a163A2A1002F1a.

The contract has the address 0x8A1084e3f14E60CD69C63048734C756B86EBC6D8, with the initial text value "Hello World".

[Etherscan link](https://sepolia.etherscan.io/address/0x8A1084e3f14E60CD69C63048734C756B86EBC6D8)

| current stage | address |
| :-----: | ----- |
|contract owner|0x134F240827Dd4B047942589998a163A2A1002F1a|




## First Transaction - setText(string newText) with input string value "send eth pls"

In order to successfully execute the `setText` method, the address of message sender needs to be equal to the address of the contract owner. 

In the first transaction, it happens to be the case that the address of message sender is equal to the address of the contract owner, and thus the method is able to execute, and the text variable is now changed to the newText String value "send eth pls".

[Etherscan link](https://sepolia.etherscan.io/tx/0xd75002589a109ea402ed7f2e95129c878419d04e79e05c6fbb8b8b5ce4167a5a)

| current stage | type | value |
| --- | --- | ---|
|contract owner| address |0x134F240827Dd4B047942589998a163A2A1002F1a|
|text(before transaction)|String|"Hello World"|
|message sender| address |0x134F240827Dd4B047942589998a163A2A1002F1a|
|text(after transaction)|String|"send eth pls"|




## Second Transaction(reverted) - setText(string newText) with input string value "no eth"


As explained in previous transaction, It requires that the message sender address is equal to the address of the contract owner's address to proceed the method, since the method has the `onlyOwner` keyword . 

In this transaction, the contract owner does not share the same address as the message sender, the verification step that the `onlyOwner` modifier requires fails, and thus the transaction fails.

[Etherscan link](https://sepolia.etherscan.io/tx/0x21b50d15dbe3112c93650237d7d9350e892612aac7901eb97dca47239ffb5cc1)

| current stage | type | value |
| --- | --- | ---|
|contract owner|address|0x134F240827Dd4B047942589998a163A2A1002F1a|
|message sender|address|0x96F3A28836454108f542D8Be888625375032aBD5|
|text(before transaction)|String|"send eth pls"|
|text(after transaction)|String|"send eth pls"|

  
  


## Third Transaction(reverted) - transferOwnership(address newOwner) with input address 0x96F3A28836454108f542D8Be888625375032aBD5



The `transferOwnership` method includes the `onlyOwner` modifier, and thus the message sender's address needs to be the exact match of the contract owner address to execute the method.

In the third transaction, the message sender address does not match the contract owner's address, the contract does not allow anyone other than the owner to execute the method, so the transaction fails as expected .

[Etherscan link](https://sepolia.etherscan.io/tx/0xa8f10ca859eb7ba45ad10565aed16bf986046eccd334f8071f0d21c634dd951f)

| current stage | type | value |
| --- | --- | ---|
|message sender|address|0x96F3A28836454108f542D8Be888625375032aBD5|
|text|String|"send eth pls"|
|contract owner(before transaction)|address|0x134F240827Dd4B047942589998a163A2A1002F1a|
|contract owner(after transaction)|address|0x134F240827Dd4B047942589998a163A2A1002F1a|


## Fourth Transaction - transferOwnership(address newOwner) with input address 0x96F3A28836454108f542D8Be888625375032aBD5

The `transferOwnership` method contains the keyword `onlyOwner`. The message sender's address and the contract owner address must be the same to execute the method.

In the fourth transaction, the message sender address is 0x134F240827Dd4B047942589998a163A2A1002F1a, which is same the contract owner's address before the transaction, and the smart contract passes the control of the method to the message sender, and thus the method can be executed correctly.

[Etherscan link](https://sepolia.etherscan.io/tx/0xf5f760d9ebe703bc0325b18075c68056fd91df09ed500b77249695b90faf413b)
  
| current stage | type | value |
| --- | --- | ---|
|contract owner(before transaction)|address|0x134F240827Dd4B047942589998a163A2A1002F1a|
|message sender|address|0x134F240827Dd4B047942589998a163A2A1002F1a|
|text|String|"send eth pls"|
|contract owner(after transaction)|address|0x96F3A28836454108f542D8Be888625375032aBD5|

>>>>>>> a6111b0a185444684a43bb8b475c8259a1bc4957
