// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract LandRegistry {
    struct LandTransaction {
        address buyer;
        address seller;
        uint256 price;
        uint256 timestamp;
    }

    // Track land transactions by landId
    mapping(uint256 => LandTransaction) public transactions;

    // Track ownership
    mapping(uint256 => address) public ownerOf;

    // Event emitted on purchase
    event LandPurchased(
        uint256 indexed landId,
        address indexed buyer,
        address indexed seller,
        uint256 price,
        uint256 timestamp
    );

    // Function to buy land
    function buyLand(uint256 landId, address seller) external payable {
        require(ownerOf[landId] == address(0), "Land already sold");

        uint256 price = msg.value;
        require(price > 0, "Price must be greater than 0");

        // Transfer ETH to seller
        payable(seller).transfer(price);

        // Save transaction
        transactions[landId] = LandTransaction({
            buyer: msg.sender,
            seller: seller,
            price: price,
            timestamp: block.timestamp
        });

        // Assign ownership
        ownerOf[landId] = msg.sender;

        emit LandPurchased(landId, msg.sender, seller, price, block.timestamp);
    }

    // Optional: View transaction
    function getTransaction(uint256 landId)
        public
        view
        returns (address, address, uint256, uint256)
    {
        LandTransaction memory txData = transactions[landId];
        return (txData.buyer, txData.seller, txData.price, txData.timestamp);
    }
}
