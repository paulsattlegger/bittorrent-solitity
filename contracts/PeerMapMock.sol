// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../contracts/PeerMap.sol";

contract PeerMapMock {
    using PeerMap for PeerMap.Peers;

    PeerMap.Peers private _peers;

    function get(address sender) public view returns (PeerMap.Peer memory) {
        return _peers.get(sender);
    }

    function update(PeerMap.Peer memory peer) public {
        _peers.update(peer);
    }

    function exchange(address oldSender, PeerMap.Peer memory peer) public {
        _peers.exchange(oldSender, peer);
    }

    function length() public view returns (uint256) {
        return _peers.length();
    }

    function values() public view returns (PeerMap.Peer[] memory) {
        return _peers.values();
    }

    function exists(address sender) public view returns (bool) {
        return _peers.exists(sender);
    }
}
