// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, Logger, IFaucet {
    uint public numOfFunders;
    mapping(address => bool) public funders;
    mapping(uint => address) public lutFunders;

    modifier limitWithdraw(uint withdrawAmount) {
        require(
            withdrawAmount <= 100000000000000000,
            "Cannot withdraw more than 0.1 ETH."
        );
        _;
    }

    receive() external payable {}

    function emitLog() public pure override returns (bytes32) {
        return "Hello World";
    }

    function addFunds() external payable {
        address funder = msg.sender;

        if (!funders[funder]) {
            funders[funder] = true;
            lutFunders[numOfFunders++] = funder;
        }
    }

    function withdraw(
        uint withdrawAmount
    ) external limitWithdraw(withdrawAmount) {
        payable(msg.sender).transfer(withdrawAmount);
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
