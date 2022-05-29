// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PeerMap.sol";

contract Tracker is Ownable, Pausable {
    using PeerMap for PeerMap.Peers;
    uint16 public interval = 300;
    uint16 public timeout = 600;

    bytes20[] public _torrents;
    mapping(bytes20 => PeerMap.Peers) private _peers;

    /**
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to be used by view accessors that are queried without any gas fees.
     */
    function torrents() public view returns (bytes20[] memory) {
        return _torrents;
    }

    /**
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to be used by view accessors that are queried without any gas fees.
     */
    function peers(bytes20 infoHash)
        public
        view
        returns (PeerMap.Peer[] memory)
    {
        return _peers[infoHash].values();
    }

    function announce(bytes20 infoHash, PeerMap.Peer memory peer)
        public
        whenNotPaused
    {
        if (!exists(infoHash)) _torrents.push(infoHash);
        peer.updated = uint64(block.timestamp);
        _peers[infoHash].update(peer);
    }

    function announce(
        bytes20 infoHash,
        bytes20 oldPeerId,
        PeerMap.Peer memory newPeer
    ) public whenNotPaused {
        require(exists(infoHash), "Torrent must exist");
        PeerMap.Peer memory oldPeer = _peers[infoHash].get(oldPeerId);
        require(
            oldPeer.updated + timeout < block.timestamp,
            "Peer must be timed out"
        );
        newPeer.updated = uint64(block.timestamp);
        _peers[infoHash].exchange(oldPeerId, newPeer);
    }

    function exists(bytes20 infoHash) public view returns (bool) {
        return _peers[infoHash].length() != 0;
    }

    function setInterval(uint16 _interval) public onlyOwner {
        interval = _interval;
    }

    function setTimeout(uint16 _timeout) public onlyOwner {
        timeout = _timeout;
    }
}
