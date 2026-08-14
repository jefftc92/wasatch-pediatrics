import { ReplitConnectors } from "@replit/connectors-sdk";
import { readFileSync } from "fs";

const connectors = new ReplitConnectors();
const pubKey = readFileSync("/home/runner/.ssh/id_ed25519.pub", "utf8").trim();

const res = await connectors.proxy("github", "/user/keys", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "wasatch-pediatrics-replit",
    key: pubKey,
  }),
});

const body = await res.json();
if (res.ok) {
  console.log("SSH key added! ID:", body.id);
} else if (res.status === 422 && JSON.stringify(body).includes("already in use")) {
  console.log("Key already exists on GitHub — OK");
} else {
  console.error("Failed:", res.status, JSON.stringify(body));
  process.exit(1);
}
