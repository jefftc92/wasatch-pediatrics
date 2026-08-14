// One-time script to create the GitHub repo and set up the remote
import { ReplitConnectors } from "@replit/connectors-sdk";

const connectors = new ReplitConnectors();

// Get authenticated user
const userRes = await connectors.proxy("github", "/user", { method: "GET" });
if (!userRes.ok) {
  const text = await userRes.text();
  console.error("Failed to get user:", userRes.status, text);
  process.exit(1);
}
const user = await userRes.json();
console.log("Authenticated as:", user.login);

// Create the repo
const repoRes = await connectors.proxy("github", "/user/repos", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "wasatch-pediatrics",
    description: "Wasatch Pediatrics web project",
    private: false,
    auto_init: false,
  }),
});

if (repoRes.status === 422) {
  // Repo may already exist
  const body = await repoRes.json();
  console.log("Repo may already exist:", JSON.stringify(body));
} else if (!repoRes.ok) {
  const text = await repoRes.text();
  console.error("Failed to create repo:", repoRes.status, text);
  process.exit(1);
} else {
  const repo = await repoRes.json();
  console.log("Created repo:", repo.full_name);
  console.log("Clone URL:", repo.clone_url);
  console.log("SSH URL:", repo.ssh_url);
}

// Print the expected repo URL regardless
console.log(`\nExpected remote URL: https://github.com/${user.login}/wasatch-pediatrics.git`);
console.log(`SSH remote URL: git@github.com:${user.login}/wasatch-pediatrics.git`);
