Final Project
================

### Deadline: Thu, 16 June 2022, 23:55

Topic
---------
Choose a topic to your liking for your own project. If you have no preference for any topic, you may build on the TU
Wien Beer Bar by either replacing parts and/or extending the existing project. For example, this could be a pub quiz, an
extended beer supply or an extended voting board.

Grading
---------
We consider the following aspects:

- Documentation: Provide the documentation of your project by completing the project details in the README.md on git.
  Add further files as necessary.
- Complexity: The project should be non-trivial. Rather, it should make use of mappings, roles with RBAC, modifiers,
  Ether and tokens when reasonable. Moreover, it should provide a simple web interface for interaction with the
  contract.
- Correctness: The project should use correct math (big numbers, overflow), include test cases and ensure that neither
  any ether nor any tokens are lost.
- Security: Try to avoid that the contract can be depleted by any method used in the challenges.
- Originality: We would like your projects to be distinguishable from reproductions, clones, forgeries, or derivative
  works. On a side note: we've already seen too many casinos.

We place less value on a fancy WebUI, as it is not part of the LVA.

**Your project is complex enough if 40 hours of effort are understandable for us.**

Project Outline
---------------

### Deadline: Thu, 12 May 2022, 23:55.

Prepare and submit an outline for your chosen topic on TUWEL.
This should be a structured document (2 pages) that contains the following elements:

```
Title:
Short description of functionality:
Off-chain part - frontend design:
On-chain part - planned contracts:
Token concept incl. used standards:
Ether usage:
Roles:
Data structures:
Security considerations:
Used coding patterns in addition to roles (randomness, commitments, timeouts, deposits, or others):
```

Regarding the complexity of your project, please consider as a typical breakdown for your efforts:

- 15h Contract development
- 5h Contract test cases
- 5h Frontend development
- 5h Testing and deploying
- 10h Setup of GitLab, Truffle, etc.

Submission and Presentation
---------
Submit your project to your `master` branch on `git.sc.logic.at` and present it in the online review session on Thu, 23
June 2022. Reserve a time slot via TUWEL.

---------------------------

HOWTO
=====
Run `npm install` to install all dependencies.

This repository contains an initialized Truffle project.

Recommended web3.js version: v1.7.1

Truffle
-------
Implement your contracts in the `contracts/` folder. You can compile them with `npm run compile`

Implement your test cases in the `tests/` folder. You can run them with `npm run test`.

With `npm run dev` you can start a local truffle development chain.

You can deploy the project to the LVA-Chain via `npm run truffle deploy -- --network=prod` (requires running `geth`
client). If you use roles, please make us - the person at `addresses.getPublic(94)` - an owner/admin of the contract.

Web interface
-------------
You are free to implement your web interface to your liking. You can use static JavaScript files (similar to the BeerBar
Plain Version) or [Drizzle-React](https://github.com/trufflesuite/drizzle-react) (BeerBar React Version), or any other
suitable framework like [Angular](https://angular.io/)
, [Vue](https://vuejs.org/), [React](https://reactjs.org/).

If you use only static content, put your files into the `public/` folder.  
You can run a local webserver with `npm run start`.

If you use another framework, you will need to adjust the `build` command in `package.json`. Follow the documentation of
your framework for doing so.

The content of your `public/` folder will also be available via the URL <https://final.pages.sc.logic.at/e11810278>
.

---------------------------

Project details
===============
(Please do not change the headers or layout of this section)

Title
-----

BitTorrent Tracker

Addresses
---------
TODO - Write here on which addresses you have deployed the contracts on the LVA-Chain:

Contract1: 0x...      
Contract2: 0x...

Description
-----------

This project implements a [BitTorrent
tracker](https://en.wikipedia.org/wiki/BitTorrent_tracker) as a smart contract,
to combine the benefits of distributed hash tables (i.e., decentralized) with
the solidity of Ethereum. The smart contracts of the project are the `Tracker`
which contains the logic of the BitTorrent tracker, the `PeerMap` which is used
to manage an efficient data structure for the state of the tracker and the
`PeerMapMock` to test the implementation of the `PeerMap`.

As described in the project outline, BitTorrent trackers work primarily over
HTTP. Therefore, this project provides a middleware (see directory
`./middleware`) that accepts requests from BitTorrent clients (e.g.
Transmission, qBittorrent, Aria2), converts them into a storage-efficient
format, sends a transaction to the smart contract, and returns the response back
to the client. Furthermore, a web-interface (see directory `frontend`) is
provided to display the up-to-date contents of the data structures managed by
the smart contract, and adjust the contracts preferences.


Usage
-----

### Middleware

In order to use the BitTorrent Tracker, the middleware must first be cloned and
configured with the addresses of the Tracker and the account which should be
used for transactions. This can be done by creating a file `.env` in the
`middleware/` directory having the following contents:

```txt
SENDER_ADDRESS=
TRACKER_ADDRESS=
```

Next, the middleware can be installed and started by issuing following commands
in the `middleware/` directory:

```bash
cd middleware/
npm install
npm start
```

### Frontend

To use the frontend, navigate to its deployment at
<https://final.pages.sc.logic.at/e11810278/>. Then enter the address of the
`Tracker` contract you want to view. In order to change settings you further
need to add a sender address of an OWNER of the `Tracker` contract.

### BitTorrent Client

The main functionality of the project is that the tracker can be used together
with conventional BitTorrent clients. In the following, we will explain how the
Tracker can be used to coordinate the exchange of files. For the explanation, we
will use the BitTorrent client [qBittorrent](https://www.qbittorrent.org/).

First, we create a new torrent under `Tools` -> `Torrent Creator` with the
following settings:

- Path: `<path-to-file>`
- Settings:
    - `Private Torrent`
    - Start seeding immediately`.
- Fields:
    - `Tracker URLs`: `http://<ip>:3000/announce` (use e.g. `192.168.178.2` or
      even a public IP address, not `localhost`, as this field will be stored in
      the `.torrent` file).

After the `.torrent` file is created, we check if out client was announced
correctly. This can be done either in the client under `Trackers` or though
the output of the middleware.

Finally, we can download the torrent using, for example, `aria2c` with the
following command:

```bash
aria2c --enable-dht false debian-11.2.0-amd64-netinst.iso.torrent
```

**Note**: Observe the middleware output for everything that happens between the
contract and the BitTorrent client, and the frontend for a representation of the
data structures managed by the tracker contract.

Implementation
--------------

Below are some details on the implementation in list form:

- The `PeerMap` as a central data structure has basically two functions to add
  peers: `update` and `exchange`. Where `update` is comparable to setting a
  value in a mapping, and with `exchange` peers can be overwritten directly by
  other peers to ultimately save gas (2900 gas instead of 20000 gas per SSTORE
  instruction).
- Whether peers may be overwritten is checked by the `Tracker` contract
  depending on whether a peer has exceeded the timeout, here it is again
  important to note that the contract itself should not search for a timed out
  peer, since this would require iteration over an unbound and (possibly) large
  array, which involves unnecessary gas consumption and possibly the risk of a
  gas-block-limit attack.
- Updating a peer costs around 50.000 gas; replacing a peer costs around 70.000
  gas; adding a peer costs around 110.000 gas; creating a torrent costs around
  150.000 gas (w/ gas price 20 GWei).
- When peers are deleted, their last state in terms of upload/download volume is
  stored in the `PeerRemoved` event, since storing information in events is
  comparatively cheap compared to storage.
- To save space, the smallest possible data structures are used within the
  PeerMap, e.g. the values for the transported volume (uploaded, downloaded,
  left are `uint64`, i.e. have the size usually used in 64-bit clients), the
  timestamp is a `uint32` (which is sufficient until 02.07.2106) and IP address
  and port is stored together in a `byte6`.
- The `middleware` is written in Express JS and the frontend is written in
  Angular 13.
- The `Tracker` contract makes use of `AccessControl` and `Pausable` of the
  OpenZeppelin Project.
- The implementation of the `PeerMap` uses some tricks from the
  [EnumerableMap](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/structs/EnumerableMap.sol)
  , i.e., the mapping stores the index + 1 (and not the index directly) to refer
  to a value in the corresponding array such that the value 0 remains as sanity
  value, but still every slot of the array can be used.
- Due to the simplicity, functions of the ABIEncoderV2 are used in the Tracker
  and the PeerMap. Thus, whole arrays are returned via the views and structs are
  passed directly to the functions instead of individual variables. ABIEncoderV2
  is activated per default on Solidity v0.8.0 and above.

Effort breakdown
------------------
TODO - Short breakdown of your work distribution (approx. 40h effort)...

Difficulties
------------

- Some BitTorrent clients only connect to the peers supplied by the tracker
  after a few minutes or ignore peers with local IP addresses.
- Solidity does not support generics; therefore, I could not make use of the
  EnumerableMap from OpenZeppelin for the PeerMap implementation. However, the
  map had to be adjusted beyond that, which means it wouldn't have helped too
  much.
- Combining the architecture of Angular (which tends to be more about events
  coming from the browser and not the backend) and Web3/Smart Contracts I have
  found to be not easy and straight forward.

Proposal for future changes
---------------------------
TODO - Do you have any proposal how we could change this exercise in the future?
