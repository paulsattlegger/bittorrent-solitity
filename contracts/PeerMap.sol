// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

library PeerMap {
    enum PeerState {
        Unknown,
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
        Peer[] _values;
        mapping(bytes20 => uint256) _indices;
    }

    function get(Peers storage self, bytes20 peerId)
        internal
        view
        returns (Peer memory peer)
    {
        require(exists(self, peerId), "Peer must exist");
        uint256 index = self._indices[peerId] - 1;
        return self._values[index];
    }

    function update(Peers storage self, Peer memory peer) internal {
        bytes20 peerId = peer.peerId;
        if (!exists(self, peerId)) {
            self._values.push(peer);
            // The value is stored at length-1, but we add 1 to all indexes
            // and use 0 as a sentinel value
            self._indices[peerId] = self._values.length;
        } else {
            uint256 index = self._indices[peerId] - 1;
            self._values[index] = peer;
        }
    }

    function exchange(
        Peers storage self,
        bytes20 oldPeerId,
        Peer memory newPeer
    ) internal {
        require(exists(self, oldPeerId), "Old peer must exist");
        bytes20 newPeerId = newPeer.peerId;
        require(!exists(self, newPeer.peerId), "New peer must not exist");
        uint256 oldIndex = self._indices[oldPeerId] - 1;
        delete self._indices[oldPeerId];
        self._values[oldIndex] = newPeer;
        self._indices[newPeerId] = oldIndex + 1;
    }

    function length(Peers storage self) internal view returns (uint256) {
        return self._values.length;
    }

    /**
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to be used by view accessors that are queried without any gas fees.
     */
    function values(Peers storage self) internal view returns (Peer[] memory) {
        return self._values;
    }

    function exists(Peers storage self, bytes20 peerId)
        internal
        view
        returns (bool)
    {
        return self._indices[peerId] != 0;
    }
}
