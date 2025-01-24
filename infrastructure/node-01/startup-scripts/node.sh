#!/bin/sh

DATADIR="/data"

if [ ! -d "$DATADIR/geth" ]; then
    echo "Initializing the blockchain for the node..."
    geth --datadir $DATADIR init /genesis.json
else
    echo "Blockchain already initialized."
fi

echo "Starting Ethereum node..."
geth --datadir $DATADIR \
    --networkid 12345 \
    --port 30303 \
    --http \
    --http.addr "0.0.0.0" \
    --http.port 8545 \
    --http.api "eth,net,web3" \
    --ipcdisable \
    --allow-insecure-unlock
