const fs = require('fs');
const { exec } = require('child_process');

// Define node configurations
const nodes = [
  { id: "node-01", port: 30303, rpcPort: 8545, wsPort: 8551 },
  { id: "node-02", port: 30304, rpcPort: 8546, wsPort: 8552 },
  { id: "node-03", port: 30305, rpcPort: 8547, wsPort: 8553 }
];

// Generate enode URLs
const enodeUrls = nodes.map(node => `enode://<${node.id}>@127.0.0.1:${node.port}`);

// Save static-nodes.json
const staticNodesPath = './static-nodes.json';
fs.writeFileSync(staticNodesPath, JSON.stringify(enodeUrls, null, 2));
console.log(`Saved static-nodes.json to ${staticNodesPath}`);

// Command to launch a Geth node
const startGethNode = (node) => {
  const cmd = `
    geth --datadir ./data/${node.id} \
         --port ${node.port} \
         --http --http.addr "0.0.0.0" --http.port ${node.rpcPort} \
         --ws --ws.addr "0.0.0.0" --ws.port ${node.wsPort} \
         --jwt-secret ./jwtsecret \
         --bootnodes ${enodeUrls.join(',')} \
         --networkid 1234
  `;
  console.log(`Starting ${node.id}...`);
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error starting ${node.id}:`, err);
    } else {
      console.log(`Started ${node.id}:\n${stdout}`);
    }
  });
};

// Start all nodes
nodes.forEach(startGethNode);
