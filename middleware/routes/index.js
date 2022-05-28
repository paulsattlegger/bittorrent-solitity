var express = require('express');
var router = express.Router();
var bencode = require('bencode');
var ip = require('ip');

const peers = {};

// https://www.bittorrent.org/beps/bep_0023.html
function toCompact(addr, port) {
  const buf = Buffer.allocUnsafe(6);
  buf.writeUint32BE(addr, 0);
  buf.writeUint16BE(port, 4);
  return buf;
}

// https://stackoverflow.com/a/8064441
function toSha1(infoHash) {
  const buf = Buffer.allocUnsafe(20);
  for (let i = 0, j = 0; i < 20; i++) {
    if (infoHash[j] === '%') {
      buf.write(infoHash.substring(j + 1, j + 3), i, 'hex');
      j += 3;
    } else {
      buf.write(infoHash[j++], i, 'ascii');
    }
  }
  return buf;
}

router.get('/announce', function (req, res) {
  console.log(`Request from ${req.header('User-Agent')} at ${req.socket.remoteAddress}:`)
  console.log(req.query);
  const result = {};

  // TODO implement req.query['event'] = started | completed | stopped
  // TODO implement req.query['uploaded'], req.query['downloaded'], req.query['left']
  if (ip.isV4Format(req.socket.remoteAddress)) {
    const infoHash = toSha1(req.query['info_hash']);
    const peer = toCompact(ip.toLong(req.socket.remoteAddress), +req.query.port);

    if (infoHash.toString() in peers) {
      if (!(peer in peers[infoHash.toString()])) {
        peers[infoHash.toString()].push(peer)
      }
    } else {
      peers[infoHash.toString()] = [peer]
    }

    // TODO implement result['complete'], result['incomplete']
    result['interval'] = 300;
    // TODO implement req.query['numwant']
    result['peers'] = Buffer.concat(peers[infoHash.toString()]);

    if (+req.query['compact'] === 0) {
      result['warning reason'] = 'Tracker supports only compact peer list format';
    }
  } else {
    result['failure reason'] = 'Tracker supports only IPv4 peers'
  }
  console.log('Response:')
  console.log(result);
  res.contentType('text/plain');
  // noinspection JSCheckFunctionSignatures
  res.send(bencode.encode(result));
});

module.exports = router;
