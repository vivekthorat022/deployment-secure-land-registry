// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LandRegistry {
    struct LandTransaction {
        address buyer;
        address seller;
        uint256 price;
        uint256 timestamp;
    }

    mapping(uint256 => LandTransaction) public transactions;
    uint256 public transactionCount;

    event TransactionCreated(
        uint256 indexed transactionId,
        address indexed buyer,
        address indexed seller,
        uint256 price,
        uint256 timestamp
    );

    function createTransaction(address _buyer, address _seller) external payable {
        require(msg.value > 0, "Payment required");
        require(msg.sender == _buyer, "Only buyer can send payment");

        payable(_seller).transfer(msg.value);

        transactions[transactionCount] = LandTransaction({
            buyer: _buyer,
            seller: _seller,
            price: msg.value,
            timestamp: block.timestamp
        });

        emit TransactionCreated(transactionCount, _buyer, _seller, msg.value, block.timestamp);
        transactionCount++;
    }

    function getTransaction(uint256 _id) public view returns (
        address buyer,
        address seller,
        uint256 price,
        uint256 timestamp
    ) {
        LandTransaction memory txData = transactions[_id];
        return (txData.buyer, txData.seller, txData.price, txData.timestamp);
    }
}
