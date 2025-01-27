import Web3 from 'web3'; // Importing Web3 using ES6 module syntax

// Connect to the local Ethereum node
const web3 = new Web3('http://localhost:8545');

// Check synchronization status
web3.eth.isSyncing()
  .then(syncStatus => {
    if (syncStatus === false) {
      console.log('The node is fully synchronized.');
    } else {
      console.log('Syncing: Current block:', syncStatus.currentBlock, 'Highest block:', syncStatus.highestBlock);
    }
  })
  .catch(error => console.error('Error checking sync status:', error));

// Check current block number
web3.eth.getBlockNumber()
  .then(blockNumber => {
    console.log('Current block number:', blockNumber);
  })
  .catch(error => console.error('Error getting block number:', error));
