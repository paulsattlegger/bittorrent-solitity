var express = require('express');
var router = express.Router();
var bencode = require('bencode');
var ip = require('ip');
var Web3 = require('web3');

// TODO do not use truffle files directly
var web3 = new Web3('ws://localhost:7545')
var build = require('../../build/contracts/Tracker.json')
var tracker = new web3.eth.Contract(build['abi'], build['networks']['5777']['address']);

// https://www.bittorrent.org/beps/bep_0023.html
function toCompact(addr, port) {
  const buf = Buffer.allocUnsafe(6);
  buf.writeUint32BE(addr, 0);
  buf.writeUint16BE(port, 4);
  return buf;
}

// https://stackoverflow.com/a/8064441
function fromProprietary(encoded) {
  const buf = Buffer.allocUnsafe(20);
  for (let i = 0, j = 0; i < 20; i++) {
    if (encoded[j] === '%') {
      buf.write(encoded.substring(j + 1, j + 3), i, 'hex');
      j += 3;
    } else {
      buf.write(encoded[j++], i, 'ascii');
    }
  }
  return buf;
}

function toState(state) {
  if (state === 'started') return '1';
  else if (state === 'stopped') return '2';
  else if (state === 'completed') return '3';
  else return '0';
}

router.get('/announce', async function (req, res) {
  console.log(`[HTTP] Request from ${req.header('User-Agent')} at ${req.socket.remoteAddress}:`)
  console.log(req.query);
  const result = {};

  if (ip.isV4Format(req.socket.remoteAddress)) {
    const infoHash = fromProprietary(req.query['info_hash']);
    const peer = [
      fromProprietary(req.query['peer_id']),
      toCompact(ip.toLong(req.socket.remoteAddress), +req.query.port),
      toState(req.query['event']),
      req.query['uploaded'],
      req.query['downloaded'],
      req.query['left'],
      '0'
    ];
    console.log(`[Contract] Announce ${req.query['info_hash']} with peer:`);
    console.log(peer);

    tracker.methods.announce(infoHash, peer).estimateGas().then(
      (gasAmount) => {
        tracker.methods.announce(infoHash, peer).send({
          // TODO fill with accounts[0]
          from: "",
          gas: gasAmount
        }).on('receipt', receipt => {
          console.log('[Contract] Receipt:')
          console.log(receipt);
        });
      });

    const peers = await tracker.methods.peers(infoHash).call();
    result['complete'] = peers.filter(p => +p.left === 0).length;
    result['incomplete'] = peers.length - result['complete'];
    result['peers'] = Buffer.concat(peers.map(p => Buffer.from(web3.utils.hexToBytes(p.compact))).slice(0, +req.query['numwant']));
    result['interval'] = +(await tracker.methods.interval().call());

    if (+req.query['compact'] === 0) {
      result['warning reason'] = 'Tracker supports only compact peer list format';
    }
  } else {
    result['failure reason'] = 'Tracker supports only IPv4 peers'
  }
  console.log('[HTTP] Response:')
  console.log(result);
  res.contentType('text/plain');
  // noinspection JSCheckFunctionSignatures
  res.send(bencode.encode(result));
});

module.exports = router;
