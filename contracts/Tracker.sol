// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Tracker is Ownable, Pausable {
    uint16 public interval = 300;
    uint16 public timeout = 600;

    enum PeerState {
        Started,
        Stopped,
        Completed
    }

    struct Peer {
        bytes20 peerId;
        bytes6 compact;
        PeerState state;
        uint64 uploaded;
        uint64 downloaded;
        uint64 left;
        uint64 updated;
    }

    struct Peers {
        Peer[] values;
        mapping(bytes20 => uint256) indices;
    }

    mapping(bytes20 => Peers) private _peers;

    bytes20[] public torrents;

    function announce(
        bytes20 _infoHash,
        bytes20 _peerId,
        bytes6 _compact,
        PeerState _state,
        uint64 _uploaded,
        uint64 _downloaded,
        uint64 _left
    ) external whenNotPaused {
        if (!_torrentExists(_infoHash)) {
            torrents.push(_infoHash);
        }
        Peer memory peer = Peer(
            _peerId,
            _compact,
            _state,
            _uploaded,
            _downloaded,
            _left,
            uint64(block.timestamp)
        );
        if (!_peerExists(_infoHash, _peerId)) {
            // Create (new) peer
            _peers[_infoHash].values.push(peer);
            // The value is stored at length-1, but we add 1 to all indexes
            // and use 0 as a sentinel value
            _peers[_infoHash].indices[_peerId] = _peers[_infoHash]
            .values
            .length;
        } else {
            // Update (existing) peer
            uint256 index = _peers[_infoHash].indices[_peerId];
            _peers[_infoHash].values[index] = peer;
        }
    }

    function announce(
        bytes20 _infoHash,
        bytes20 _peerId,
        uint256 _index,
        bytes6 _compact,
        PeerState _state,
        uint64 _uploaded,
        uint64 _downloaded,
        uint64 _left
    ) external whenNotPaused {
        require(_torrentExists(_infoHash), "Torrent must exist.");
        require(
            _peers[_infoHash].values[_index].updated + timeout <
            block.timestamp,
            "Peer must be timed out."
        );
        // Overwrite timed-out peer
        _peers[_infoHash].values[_index] = Peer(
            _peerId,
            _compact,
            _state,
            _uploaded,
            _downloaded,
            _left,
            uint64(block.timestamp)
        );
    }

    function peers(bytes20 _infoHash) external view returns (Peer[] memory) {
        return _peers[_infoHash].values;
    }

    function peersLength(bytes20 _infoHash)
    external
    view
    returns (uint256 length)
    {
        return _peers[_infoHash].values.length;
    }

    function _torrentExists(bytes20 _infoHash) private view returns (bool) {
        return _peers[_infoHash].values.length != 0;
    }

    function _peerExists(bytes20 _infoHash, bytes20 _peerId)
    private
    view
    returns (bool)
    {
        return _peers[_infoHash].indices[_peerId] != 0;
    }
}
