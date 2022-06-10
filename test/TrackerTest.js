const {reverts, eventEmitted} = require("truffle-assertions")

const Tracker = artifacts.require("Tracker");

contract("Tracker", async accounts => {
  const infoHash1 = "0x4eae8dbac2397e30de8bcbb206e269254cbe76be";
  const id1 = accounts[1];
  const id2 = accounts[2];
  const empty = "0x0000000000000000000000000000000000000000";
  // 127.0.0.1:6881
  const compact = "0x7f0000011ae1";
  // id, compact, state, uploaded, downloaded, left, updated
  const peer1 = [id1, compact, "0", "0", "0", "100", "0"];
  const peer2 = [id2, compact, "0", "0", "0", "100", "0"];

  beforeEach(async () => {
    this.tracker = await Tracker.new();
  });

  it("announce should add torrent", async () => {
    await this.tracker.announce(infoHash1, peer1, {from: id1});
    const [first] = await this.tracker.torrents();
    assert.equal(first, infoHash1);
  });

  it("announce should emit TorrentAdded event", async () => {
    const result = await this.tracker.announce(infoHash1, peer1, {from: id1});

    eventEmitted(result, 'TorrentAdded', (ev) => {
      return ev['infoHash'] === infoHash1;
    }, 'TorrentAdded should be emitted with correct parameters');
  });

  it("announce should add peer", async () => {
    await this.tracker.announce(infoHash1, peer1, {from: id1});
    const [first] = await this.tracker.peers(infoHash1);
    assert.equal(first["id"], id1);
  });

  it("announce should emit PeerUpdated event", async () => {
    const result = await this.tracker.announce(infoHash1, peer1, {from: id1});

    eventEmitted(result, 'PeerUpdated', (ev) => {
      return ev['infoHash'] === infoHash1 &&
        ev['id'] === id1;
    }, 'PeerUpdated should be emitted with correct parameters');
  });

  it("announce with timed-out oldPeerId should replace peer", async () => {
    await this.tracker.setTimeout(0);
    await this.tracker.announce(infoHash1, peer1, {from: id1});
    await this.tracker.methods['announce(bytes20,address,(address,bytes6,uint8,uint64,uint64,uint64,uint32))'](infoHash1, id1, peer2, {from: id2});
    const [first] = await this.tracker.peers(infoHash1);
    assert.equal(first["id"], id2);
  });

  it("announce with timed-out oldPeerId should emit PeerRemoved and PeerUpdated event", async () => {
    await this.tracker.setTimeout(0);
    await this.tracker.announce(infoHash1, peer1, {from: id1});
    const result = await this.tracker.methods['announce(bytes20,address,(address,bytes6,uint8,uint64,uint64,uint64,uint32))'](infoHash1, id1, peer2, {from: id2});

    eventEmitted(result, 'PeerUpdated', (ev) => {
      return ev['infoHash'] === infoHash1 &&
        ev['id'] === id2;
    }, 'PeerUpdated should be emitted with correct parameters');

    eventEmitted(result, 'PeerRemoved', (ev) => {
      return ev['infoHash'] === infoHash1 &&
        ev['id'] === id1;
    }, 'PeerUpdated should be emitted with correct parameters');
  });

  it("announce with not (yet) timed-out oldPeerId should revert", async () => {
    await this.tracker.announce(infoHash1, peer1, {from: id1});
    await reverts(this.tracker.methods['announce(bytes20,address,(address,bytes6,uint8,uint64,uint64,uint64,uint32))'](infoHash1, id1, peer2, {from: id2}))
  });

  it("announce with timed-out oldPeerId should be cheaper than announce", async () => {
    await this.tracker.setTimeout(0);
    const gas1 = await this.tracker.announce.estimateGas(infoHash1, peer1, {from: id1});
    await this.tracker.announce(infoHash1, peer1, {from: id1});
    const gas2 = await this.tracker.methods['announce(bytes20,address,(address,bytes6,uint8,uint64,uint64,uint64,uint32))'].estimateGas(infoHash1, id1, peer2, {from: id2});
    assert.isBelow(gas2, gas1);
  });

  it("announce should ignore peer.updated and use block.timestamp instead", async () => {
    const before = Math.floor(Date.now() / 1000);
    await this.tracker.announce(infoHash1, peer1, {from: id1});
    const [first] = await this.tracker.peers(infoHash1);
    assert.isAtLeast(+first["updated"], before);
  });

  it("announce with timed-out oldPeerId should ignore peer.updated and use block.timestamp instead", async () => {
    await this.tracker.setTimeout(0);
    await this.tracker.announce(infoHash1, peer1, {from: id1});
    const before = Math.floor(Date.now() / 1000);
    await this.tracker.methods['announce(bytes20,address,(address,bytes6,uint8,uint64,uint64,uint64,uint32))'](infoHash1, id1, peer2, {from: id2});
    const [first] = await this.tracker.peers(infoHash1);
    assert.isAtLeast(+first["updated"], before);
  });

  it("announce should ignore peer.id and use msg.sender instead", async () => {
    const peer1 = [empty, compact, "0", "0", "0", "100", "0"];
    await this.tracker.announce(infoHash1, peer1, {from: id1});
    const [first] = await this.tracker.peers(infoHash1);
    assert.equal(+first["id"], id1);
  });

  it("announce with timed-out oldPeerId should ignore peer.id and use msg.sender instead", async () => {
    const peer2 = [empty, compact, "0", "0", "0", "100", "0"];
    await this.tracker.setTimeout(0);
    await this.tracker.announce(infoHash1, peer1, {from: id1});
    await this.tracker.methods['announce(bytes20,address,(address,bytes6,uint8,uint64,uint64,uint64,uint32))'](infoHash1, id1, peer2, {from: id2});
    const [first] = await this.tracker.peers(infoHash1);
    assert.equal(+first["id"], id2);
  });
});
