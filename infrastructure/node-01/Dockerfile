FROM ethereum/client-go

RUN apk add --no-cache bash curl jq

# Expose required ports
EXPOSE 30303 8545 8552

# Copy startup script
COPY ./startup-scripts/node.sh /startup-scripts/node.sh

# Ensure the script is executable
RUN chmod +x /startup-scripts/node.sh

# Set the entry point
ENTRYPOINT ["/bin/sh", "/startup-scripts/node.sh"]
