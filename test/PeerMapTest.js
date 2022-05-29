const {reverts} = require("truffle-assertions")

const PeerMap = artifacts.require("PeerMapMock");

contract("PeerMap", async () => {
  // qBittorrent 4.2.5.0
  const peerId1 = web3.utils.asciiToHex("-qB4250-aUKMjQy!7F*Y");
  const peerId2 = peerId1;
  // Vuze 2.2.0.0
  const peerId3 = web3.utils.asciiToHex("-AZ2200-6wfG2wk6wWLc");
  // 127.0.0.1:6881
  const compact = "0x7f0000011ae1";
  // peerId, compact, state, uploaded, downloaded, left, updated
  const peer1 = [peerId1, compact, "0", "0", "0", "100", "0"];
  const peer2 = [peerId2, compact, "2", "0", "100", "0", "0"];
  const peer3 = [peerId3, compact, "0", "0", "0", "100", "0"]

  beforeEach(async () => {
    this.peers = await PeerMap.new();
  });

  it("starts empty", async () => {
    assert.equal(await this.peers.length(), 0);
  });

  it("get on non-existing peer should revert", async () => {
    await reverts(this.peers.get(peerId1));
  });

  it("get on existing peer should return peer", async () => {
    await this.peers.update(peer1);
    assert.deepStrictEqual(await this.peers.get(peerId1), peer1);
  });

  it("update on empty map should insert peer", async () => {
    let length = await this.peers.length();
    await this.peers.update(peer1);
    assert.equal(await this.peers.length() - length, 1);
  });

  it("update on existing peer should not increase length", async () => {
    let length = await this.peers.length();
    await this.peers.update(peer1);
    await this.peers.update(peer1);
    assert.equal(await this.peers.length() - length, 1);
  });

  it("update on existing peer should update peer", async () => {
    await this.peers.update(peer1);
    await this.peers.update(peer2);
    assert.deepStrictEqual(await this.peers.get(peerId1), peer2);
  });

  it("exchange on existing peer should not increase length", async () => {
    let length = await this.peers.length();
    await this.peers.update(peer1);
    await this.peers.exchange(peerId1, peer3);
    assert.equal(await this.peers.length() - length, 1);
  });

  it("exchange on existing peer should remove index to old peer", async () => {
    await this.peers.update(peer1);
    await this.peers.exchange(peerId1, peer3);
    await reverts(this.peers.get(peerId1));
  });

  it("exchange on existing peer should update peer", async () => {
    await this.peers.update(peer1);
    await this.peers.exchange(peerId1, peer3);
    assert.deepEqual(await this.peers.get(peerId3), peer3);
  });

  it("exists on existing peer should return true", async () => {
    await this.peers.update(peer1);
    assert.equal(await this.peers.exists(peerId1), true);
  });

  it("exists on non-existing peer should return false", async () => {
    assert.equal(await this.peers.exists(peerId1), false);
  });
});
