var express = require('express');
var router = express.Router();
var bencode = require('bencode');
var ip = require('ip');
var Web3 = require('web3');

var web3 = new Web3('ws://localhost:7545')
var tracker = new web3.eth.Contract(require('../../public/abi/Tracker.json')['abi'], process.env.TRACKER_ADDRESS);

// https://www.bittorrent.org/beps/bep_0023.html
function toCompact(addr, port) {
  const buf = Buffer.allocUnsafe(6);
  buf.writeUint32BE(addr, 0);
  buf.writeUint16BE(port, 4);
  return Web3.utils.toHex(buf);
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
  return Web3.utils.toHex(buf);
}

function toState(state) {
  if (state === 'started') return '1';
  else if (state === 'stopped') return '2';
  else if (state === 'completed') return '3';
  else return '0';
}

function announce(infoHash, peer) {
  // noinspection JSUnresolvedFunction
  tracker.methods.announce(infoHash, peer).estimateGas().then(
    (gasAmount) => {
      // noinspection JSUnresolvedFunction
      tracker.methods.announce(infoHash, peer).send({
        from: process.env.SENDER_ADDRESS,
        gas: gasAmount
      }).on('receipt', receipt => {
        console.log('[Contract] Receipt:')
        console.log(receipt);
      });
    });
}

router.get('/announce', async function (req, res) {
    console.log(`[HTTP] Request from ${req.header('User-Agent')} at ${req.socket.remoteAddress}:`)
    console.log(req.query);
    const result = {};

    if (ip.isV4Format(req.socket.remoteAddress)) {
      const infoHash = fromProprietary(req.query['info_hash']);
      const peerId = fromProprietary(req.query['peer_id']);
      const peer = [
        peerId,
        toCompact(ip.toLong(req.socket.remoteAddress), +req.query.port),
        toState(req.query['event']),
        req.query['uploaded'],
        req.query['downloaded'],
        req.query['left'],
        '0'
      ];

      const timeout = +(await tracker.methods.timeout().call());
      const peers = await tracker.methods.peers(infoHash).call();
      const oldPeerId = peers.find(p => +p.updated + timeout <= Date.now() / 1000)?.peerId;
      const containsPeerId = !!peers.find(p => p.peerId === peerId);
      const paused = await tracker.methods.paused().call();

      if (paused) {
        result['warning reason'] = 'Tracker is currently paused'
      } else if (!containsPeerId && oldPeerId) {
        console.log(`[Contract] Announce ${infoHash} with peer (replacing ${oldPeerId}):`);
        console.log(peer);
        // noinspection JSUnresolvedFunction
        tracker.methods.announce(infoHash, oldPeerId, peer).estimateGas().then(
          (gasAmount) => {
            // noinspection JSUnresolvedFunction
            tracker.methods.announce(infoHash, oldPeerId, peer).send({
              from: process.env.SENDER_ADDRESS,
              gas: gasAmount
            }).on('receipt', receipt => {
              console.log('[Contract] Receipt:')
              console.log(receipt);
            }).on('error', () => {
              console.log(`[Contract] Announce ${infoHash} with peer:`);
              console.log(peer);
              announce(infoHash, peer);
            });
          });
      } else {
        console.log(`[Contract] Announce ${infoHash} with peer:`);
        console.log(peer);
        announce(infoHash, peer);
      }

      result['complete'] = peers.filter(p => +p.left === 0).length;
      result['incomplete'] = peers.length - result['complete'];
      result['peers'] = Buffer.concat(peers.map(p => Buffer.from(Web3.utils.hexToBytes(p.compact))).slice(0, +req.query['numwant']));
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
  }
);

module.exports = router;
