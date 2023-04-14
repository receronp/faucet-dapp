// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Faucet {
    uint public numOfFunders;
    mapping(uint => address) public funders;

    receive() external payable {}

    function addFunds() external payable {
        funders[numOfFunders++] = msg.sender;
    }

    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);
        for (uint256 ii = 0; ii < numOfFunders; ii++) {
            _funders[ii] = funders[ii];
        }
        return _funders;
    }

    function getFunderAtIndex(uint8 index) external view returns (address) {
        return funders[index];
    }
}
