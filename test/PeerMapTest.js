const {reverts} = require("truffle-assertions")

const PeerMap = artifacts.require("PeerMapMock");

contract("PeerMap", async accounts => {
  const id1 = accounts[1];
  const id2 = id1;
  const id3 = accounts[3];
  // 127.0.0.1:6881
  const compact = "0x7f0000011ae1";
  // id, compact, state, uploaded, downloaded, left, updated
  const peer1 = [id1, compact, "0", "0", "0", "100", "0"];
  const peer2 = [id2, compact, "2", "0", "100", "0", "0"];
  const peer3 = [id3, compact, "0", "0", "0", "100", "0"]

  beforeEach(async () => {
    this.peers = await PeerMap.new();
  });

  it("starts empty", async () => {
    assert.equal(await this.peers.length(), 0);
  });

  it("get on non-existing peer should revert", async () => {
    await reverts(this.peers.get(id1));
  });

  it("get on existing peer should return peer", async () => {
    await this.peers.update(peer1);
    assert.deepStrictEqual(await this.peers.get(id1), peer1);
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
    assert.deepStrictEqual(await this.peers.get(id1), peer2);
  });

  it("exchange on existing peer should not increase length", async () => {
    let length = await this.peers.length();
    await this.peers.update(peer1);
    await this.peers.exchange(id1, peer3);
    assert.equal(await this.peers.length() - length, 1);
  });

  it("exchange on existing peer should remove index to old peer", async () => {
    await this.peers.update(peer1);
    await this.peers.exchange(id1, peer3);
    await reverts(this.peers.get(id1));
  });

  it("exchange on existing peer should update peer", async () => {
    await this.peers.update(peer1);
    await this.peers.exchange(id1, peer3);
    assert.deepEqual(await this.peers.get(id3), peer3);
  });

  it("exists on existing peer should return true", async () => {
    await this.peers.update(peer1);
    assert.equal(await this.peers.exists(id1), true);
  });

  it("exists on non-existing peer should return false", async () => {
    assert.equal(await this.peers.exists(id1), false);
  });
});
