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
        address sender;
        bytes6 compact;
        PeerState state;
        uint64 uploaded;
        uint64 downloaded;
        uint64 left;
        uint32 updated;
    }

    struct Peers {
        Peer[] _values;
        mapping(address => uint256) _indices;
    }

    function get(Peers storage self, address sender)
        internal
        view
        returns (Peer memory peer)
    {
        require(exists(self, sender), "Peer must exist");
        uint256 index = self._indices[sender] - 1;
        return self._values[index];
    }

    function update(Peers storage self, Peer memory peer) internal {
        address sender = peer.sender;
        if (!exists(self, sender)) {
            self._values.push(peer);
            // The value is stored at length-1, but we add 1 to all indexes
            // and use 0 as a sentinel value
            self._indices[sender] = self._values.length;
        } else {
            uint256 index = self._indices[sender] - 1;
            self._values[index] = peer;
        }
    }

    function exchange(
        Peers storage self,
        address oldSender,
        Peer memory newPeer
    ) internal {
        require(
            exists(self, oldSender),
            "Old sender must exist for this torrent"
        );
        address newSender = newPeer.sender;
        require(
            !exists(self, newSender),
            "New sender must not exist for this torrent"
        );
        uint256 oldIndex = self._indices[oldSender] - 1;
        delete self._indices[oldSender];
        self._values[oldIndex] = newPeer;
        self._indices[newSender] = oldIndex + 1;
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

    function exists(Peers storage self, address sender)
        internal
        view
        returns (bool)
    {
        return self._indices[sender] != 0;
    }
}
