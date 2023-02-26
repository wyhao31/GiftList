const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

// Take input from user.
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

const serverUrl = 'http://localhost:1225';

const merkleTree = new MerkleTree(niceList);
const root = merkleTree.getRoot();

async function main() {
  let count = 0;
  while (1) {
    console.log(`=============Round ${++count}=============`)
    const name = await prompt("What's the name who wants to get gift: ");
    let index = niceList.findIndex(n => n === name);
    if (index == -1) {
      console.log(`${name} is not in gift list.`)
      const other_name = await prompt("Use other name to get the proof, and try to fool the server: ");
      const other_index = niceList.findIndex(n => n === other_name);
      if (other_index == -1) {
        console.log(`${name} cannot receive gift.`)
        continue;
      }
      index = other_index;
    }
    const proof = merkleTree.getProof(index);
    const { data: gift } = await axios.post(`${serverUrl}/gift`, {
      name: name,
      proof: proof,
    });

    console.log({ gift });
  }
}

main();