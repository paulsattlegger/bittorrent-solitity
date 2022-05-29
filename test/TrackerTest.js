const {reverts} = require("truffle-assertions")

const Tracker = artifacts.require("Tracker");

contract("Tracker", async () => {
  const infoHash1 = "0x4eae8dbac2397e30de8bcbb206e269254cbe76be";
  // qBittorrent 4.2.5.0
  const peerId1 = web3.utils.asciiToHex("-qB4250-aUKMjQy!7F*Y");
  // Vuze 2.2.0.0
  const peerId2 = web3.utils.asciiToHex("-AZ2200-6wfG2wk6wWLc");
  // 127.0.0.1:6881
  const compact = "0x7f0000011ae1";
  // peerId, compact, state, uploaded, downloaded, left, updated
  const peer1 = [peerId1, compact, "0", "0", "0", "100", "0"];
  const peer2 = [peerId2, compact, "0", "0", "0", "100", "0"];

  beforeEach(async () => {
    this.tracker = await Tracker.new();
  });

  it("announce should add torrent", async () => {
    await this.tracker.announce(infoHash1, peer1);
    const [first] = await this.tracker.torrents();
    assert.equal(first, infoHash1);
  });

  it("announce should add peer", async () => {
    await this.tracker.announce(infoHash1, peer1);
    const [first] = await this.tracker.peers(infoHash1);
    assert.equal(first["peerId"], peerId1);
  });

  it("announce with timed-out oldPeerId should replace peer", async () => {
    await this.tracker.setTimeout(0);
    await this.tracker.announce(infoHash1, peer1);
    await this.tracker.announce(infoHash1, peerId1, peer2);
    const [first] = await this.tracker.peers(infoHash1);
    assert.equal(first["peerId"], peerId2);
  });

  it("announce with not (yet) timed-out oldPeerId should revert", async () => {
    await this.tracker.announce(infoHash1, peer1);
    await reverts(this.tracker.announce(infoHash1, peerId1, peer2))
  });

  it("announce with timed-out oldPeerId should be cheaper than announce", async () => {
    await this.tracker.setTimeout(0);
    const gas1 = await this.tracker.announce.estimateGas(infoHash1, peer1);
    await this.tracker.announce(infoHash1, peer1);
    const gas2 = await this.tracker.announce.estimateGas(infoHash1, peerId1, peer2);
    assert.isBelow(gas2, gas1);
  });

  it("announce should ignore peer.updated and use block.timestamp instead", async () => {
    const before = Math.floor(Date.now() / 1000);
    await this.tracker.announce(infoHash1, peer1);
    const [first] = await this.tracker.peers(infoHash1);
    assert.isAtLeast(+first["updated"], before);
  });

  it("announce with timed-out oldPeerId should ignore peer.updated and use block.timestamp instead", async () => {
    await this.tracker.setTimeout(0);
    await this.tracker.announce(infoHash1, peer1);
    const before = Math.floor(Date.now() / 1000);
    await this.tracker.announce(infoHash1, peerId1, peer2);
    const [first] = await this.tracker.peers(infoHash1);
    assert.isAtLeast(+first["updated"], before);
  });
});
