// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract LandRegistry {
    struct LandTransaction {
        address buyer;
        address seller;
        uint256 price;
        uint256 timestamp;
    }

    mapping(uint256 => LandTransaction) public transactions;

    event TransactionCompleted(
        uint256 indexed transactionId,
        address indexed buyer,
        address indexed seller,
        uint256 price,
        uint256 timestamp
    );

    function completeTransaction(
        uint256 transactionId,
        address buyer,
        address seller,
        uint256 price
    ) external payable {
        require(msg.sender == buyer, "Only buyer can complete transaction");
        require(msg.value == price, "Incorrect payment amount");

        payable(seller).transfer(msg.value);

        transactions[transactionId] = LandTransaction({
            buyer: buyer,
            seller: seller,
            price: msg.value,
            timestamp: block.timestamp
        });

        emit TransactionCompleted(
            transactionId,
            buyer,
            seller,
            msg.value,
            block.timestamp
        );
    }

    function getTransaction(
        uint256 transactionId
    )
        public
        view
        returns (
            address buyer,
            address seller,
            uint256 price,
            uint256 timestamp
        )
    {
        LandTransaction memory txData = transactions[transactionId];
        return (txData.buyer, txData.seller, txData.price, txData.timestamp);
    }
}
