// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Faucet {
    uint public numOfFunders;
    mapping(address => bool) public funders;
    mapping(uint => address) public lutFunders;

    receive() external payable {}

    function addFunds() external payable {
        address funder = msg.sender;

        if (!funders[funder]) {
            funders[funder] = true;
            lutFunders[numOfFunders++] = funder;
        }
    }

    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);
        for (uint256 ii = 0; ii < numOfFunders; ii++) {
            _funders[ii] = lutFunders[ii];
        }
        return _funders;
    }

    function getFunderAtIndex(uint8 index) external view returns (address) {
        return lutFunders[index];
    }
}
