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
TODO - Title of your project

Addresses
---------
TODO - Write here on which addresses you have deployed the contracts on the LVA-Chain:

Contract1: 0x...      
Contract2: 0x...

Description
-----------
TODO - A description of your project...

Usage
-----
TODO - Short description of how to interact with your frontend/contracts

Implementation
--------------
TODO - Write about your implementation here...

Effort breakdown
------------------
TODO - Short breakdown of your work distribution (approx. 40h effort)...

Difficulties
------------
TODO - What difficulties did you face during development?

Proposal for future changes
---------------------------
TODO - Do you have any proposal how we could change this exercise in the future?
