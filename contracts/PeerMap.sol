// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

library PeerMap {
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

    function get(Peers storage self, bytes20 peerId)
        internal
        view
        returns (Peer memory peer)
    {
        require(exists(self, peerId), "Peer must exist.");
        uint256 index = self.indices[peerId];
        return self.values[index];
    }

    function update(Peers storage self, Peer memory peer) internal {
        bytes20 peerId = peer.peerId;
        if (!exists(self, peerId)) {
            self.values.push(peer);
            // The value is stored at length-1, but we add 1 to all indexes
            // and use 0 as a sentinel value
            self.indices[peerId] = self.values.length;
        } else {
            uint256 index = self.indices[peerId];
            self.values[index] = peer;
        }
    }

    function exchange(
        Peers storage self,
        bytes20 oldPeerId,
        Peer memory peer
    ) internal {
        require(exists(self, oldPeerId), "Peer must exist.");
        bytes20 peerId = peer.peerId;
        uint256 index = self.indices[oldPeerId];
        delete self.indices[oldPeerId];
        self.values[index] = peer;
        self.indices[peerId] = index;
    }

    function exists(Peers storage self, bytes20 peerId)
        internal
        view
        returns (bool)
    {
        return self.indices[peerId] != 0;
    }
}
