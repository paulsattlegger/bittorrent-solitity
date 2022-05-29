// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../contracts/PeerMap.sol";

contract PeerMapMock {
    using PeerMap for PeerMap.Peers;

    PeerMap.Peers private _peers;

    function get(bytes20 peerId) public view returns (PeerMap.Peer memory) {
        return _peers.get(peerId);
    }

    function update(PeerMap.Peer memory peer) public {
        _peers.update(peer);
    }

    function exchange(bytes20 oldPeerId, PeerMap.Peer memory peer) public {
        _peers.exchange(oldPeerId, peer);
    }

    function size() public view returns (uint256) {
        return _peers.size();
    }

    function values() public view returns (PeerMap.Peer[] memory) {
        return _peers.values();
    }

    function exists(bytes20 peerId) public view returns (bool) {
        return _peers.exists(peerId);
    }
}
