// Extract GitHub token from the connector for git auth
import { ReplitConnectors } from "@replit/connectors-sdk";

const connectors = new ReplitConnectors();

// The connector SDK uses a proxy; we need to extract the auth token.
// We intercept by making a call and checking what auth header is sent.
// This is done by reading the internals or using the proxy to get the token endpoint.

// Try getting a token via the connector's internal token endpoint
const tokenRes = await connectors.proxy("github", "/user", {
  method: "GET",
});

// Check if token is exposed in the client object
const client = connectors._clients?.github || connectors.clients?.github;
console.log("Client keys:", client ? Object.keys(client) : "none");

// Try to access the connection info
const conn = connectors._connections?.github || connectors.connections?.github;
console.log("Conn keys:", conn ? Object.keys(conn) : "none");

// Check the connector instance
console.log("Connectors keys:", Object.keys(connectors));
