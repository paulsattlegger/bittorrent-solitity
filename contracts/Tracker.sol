// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./PeerMap.sol";

contract Tracker is AccessControl, Pausable {
    bytes32 public constant OWNER = keccak256("OWNER");
    using PeerMap for PeerMap.Peers;

    uint32 public interval;
    uint32 public timeout;

    constructor() {
        _grantRole(OWNER, msg.sender);
        _setRoleAdmin(OWNER, OWNER);
        interval = 3600; // 1 hour
        timeout = 1_209_600; // 14 days
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

    event PeerUpdated(bytes20 infoHash, address id);

    function announce(
        bytes20 infoHash,
        bytes6 compact,
        PeerMap.PeerState state,
        uint64 uploaded,
        uint64 downloaded,
        uint64 left
    ) public whenNotPaused {
        if (!existsTorrent(infoHash)) {
            _torrents.push(infoHash);
            emit TorrentAdded(infoHash);
        }
        PeerMap.Peer memory peer = PeerMap.Peer(
            msg.sender,
            compact,
            state,
            uploaded,
            downloaded,
            left,
            uint32(block.timestamp)
        );
        _peers[infoHash].update(peer);
        emit PeerUpdated(infoHash, peer.id);
    }

    event PeerRemoved(
        bytes20 infoHash,
        address id,
        uint64 uploaded,
        uint64 downloaded
    );

    function announce(
        bytes20 infoHash,
        address oldId,
        bytes6 compact,
        PeerMap.PeerState state,
        uint64 uploaded,
        uint64 downloaded,
        uint64 left
    ) public whenNotPaused {
        require(existsTorrent(infoHash), "Torrent must exist");
        PeerMap.Peer memory oldPeer = _peers[infoHash].get(oldId);
        require(
            oldPeer.updated + timeout <= block.timestamp,
            "Peer must be timed out"
        );
        PeerMap.Peer memory peer = PeerMap.Peer(
            msg.sender,
            compact,
            state,
            uploaded,
            downloaded,
            left,
            uint32(block.timestamp)
        );
        _peers[infoHash].exchange(oldId, peer);
        emit PeerRemoved(
            infoHash,
            oldPeer.id,
            oldPeer.uploaded,
            oldPeer.downloaded
        );
        emit PeerUpdated(infoHash, peer.id);
    }

    function existsTorrent(bytes20 infoHash) public view returns (bool) {
        return _peers[infoHash].length() != 0;
    }

    function existsPeer(bytes20 infoHash) public view returns (bool) {
        return _peers[infoHash].exists(msg.sender);
    }

    function setInterval(uint32 _interval) public onlyRole(OWNER) {
        interval = _interval;
    }

    function setTimeout(uint32 _timeout) public onlyRole(OWNER) {
        timeout = _timeout;
    }

    function pause() public onlyRole(OWNER) {
        _pause();
    }

    function unpause() public onlyRole(OWNER) {
        _unpause();
    }

    receive() external payable {
        revert();
    }
}
