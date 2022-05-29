// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PeerMap.sol";

contract Tracker is Ownable, Pausable {
    using PeerMap for PeerMap.Peers;
    uint16 public interval = 300;
    uint16 public timeout = 600;

    bytes20[] public torrents;
    mapping(bytes20 => PeerMap.Peers) private _peers;

    function peers(bytes20 infoHash)
        public
        view
        returns (PeerMap.Peer[] memory)
    {
        return _peers[infoHash].values();
    }

    function size(bytes20 infoHash) external view returns (uint256) {
        return _peers[infoHash].size();
    }

    function announce(
        bytes20 infoHash,
        PeerMap.Peer memory peer
    ) public whenNotPaused {
        if (!_exists(infoHash)) torrents.push(infoHash);
        peer.updated = uint64(block.timestamp);
        _peers[infoHash].update(peer);
    }

    function announce(
        bytes20 infoHash,
        bytes20 oldPeerId,
        PeerMap.Peer memory peer
    ) public whenNotPaused {
        require(_exists(infoHash), "Torrent must exist.");
        PeerMap.Peer memory oldPeer = _peers[infoHash].get(oldPeerId);
        require(
            oldPeer.updated + timeout < block.timestamp,
            "Peer must be timed out."
        );
        peer.updated = uint64(block.timestamp);
        _peers[infoHash].exchange(oldPeerId, peer);
    }

    function setInterval(uint16 _interval) public onlyOwner {
        interval = _interval;
    }

    function setTimeout(uint16 _timeout) public onlyOwner {
        timeout = _timeout;
    }

    function _exists(bytes20 infoHash) private view returns (bool) {
        return _peers[infoHash].size() != 0;
    }
}
