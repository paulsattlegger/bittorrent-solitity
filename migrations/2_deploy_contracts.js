const Tracker = artifacts.require("Tracker");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Tracker);
  const tracker = await Tracker.deployed();

  if (network === "prod") {
    // make the person at `addresses.getPublic(94)` an OWNER of the bar
    tracker.grantRole(await tracker.OWNER(), "0x8913AB7bfa69159A4D40Ea9B0F231647d53aEa9F", {from: accounts[0]});
  }
};
