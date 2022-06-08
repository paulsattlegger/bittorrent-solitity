// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./PeerMap.sol";

contract Tracker is AccessControl, Pausable {
    using PeerMap for PeerMap.Peers;

    bytes32 public constant OWNER = keccak256("OWNER");
    uint32 public interval;
    uint32 public timeout;

    constructor() {
        _grantRole(OWNER, msg.sender);
        _setRoleAdmin(OWNER, OWNER);
        interval = 3600;
        timeout = 7800;
    }

    bytes20[] private _torrents;
    mapping(bytes20 => PeerMap.Peers) private _peers;

    event TorrentAdded(bytes20 infoHash);

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

    event PeerUpdated(bytes20 infoHash, bytes20 peerId);

    function announce(bytes20 infoHash, PeerMap.Peer memory peer)
        public
        whenNotPaused
    {
        if (!exists(infoHash)) {
            _torrents.push(infoHash);
            emit TorrentAdded(infoHash);
        }
        peer.updated = uint32(block.timestamp);
        _peers[infoHash].update(peer);
        emit PeerUpdated(infoHash, peer.peerId);
    }

    event PeerRemoved(
        bytes20 infoHash,
        bytes20 peerId,
        uint64 uploaded,
        uint64 downloaded
    );

    function announce(
        bytes20 infoHash,
        bytes20 oldPeerId,
        PeerMap.Peer memory newPeer
    ) public whenNotPaused {
        require(exists(infoHash), "Torrent must exist");
        PeerMap.Peer memory oldPeer = _peers[infoHash].get(oldPeerId);
        require(
            oldPeer.updated + timeout <= block.timestamp,
            "Peer must be timed out"
        );
        newPeer.updated = uint32(block.timestamp);
        _peers[infoHash].exchange(oldPeerId, newPeer);
        emit PeerRemoved(
            infoHash,
            oldPeer.peerId,
            oldPeer.uploaded,
            oldPeer.downloaded
        );
        emit PeerUpdated(infoHash, newPeer.peerId);
    }

    function exists(bytes20 infoHash) public view returns (bool) {
        return _peers[infoHash].length() != 0;
    }

    function setInterval(uint16 _interval) public onlyRole(OWNER) {
        interval = _interval;
    }

    function setTimeout(uint16 _timeout) public onlyRole(OWNER) {
        timeout = _timeout;
    }

    function pause() public onlyRole(OWNER) {
        _pause();
    }

    function unpause() public onlyRole(OWNER) {
        _unpause();
    }
}
