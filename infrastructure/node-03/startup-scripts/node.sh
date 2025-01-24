#!/bin/sh

DATADIR="/data"

if [ ! -d "$DATADIR/geth" ]; then
    echo "Initializing the blockchain for node-03..."
    geth --datadir $DATADIR init /genesis.json
else
    echo "Blockchain already initialized for node-03."
fi

echo "Starting Ethereum node-03..."
geth --datadir $DATADIR \
    --networkid 12345 \
    --port 30305 \
    --http \
    --http.addr "0.0.0.0" \
    --http.port 8547 \
    --http.api "eth,net,web3" \
    --ipcdisable \
    --allow-insecure-unlock
