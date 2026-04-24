import { spawn } from "node:child_process";
import process from "node:process";

function run(name, command, args, color) {
  const child = spawn(command, args, {
    stdio: ["inherit", "pipe", "pipe"],
    env: process.env,
  });

  const prefix = `${color}[${name}]\x1b[0m`;

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`${prefix} ${chunk}`);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(`${prefix} ${chunk}`);
  });

  child.on("exit", (code) => {
    if (stopping) return;
    stopping = true;
    stopAll(code ?? 0);
  });

  return child;
}

const children = [];
let stopping = false;

function stopAll(exitCode = 0) {
  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGINT");
    }
  }

  setTimeout(() => process.exit(exitCode), 250);
}

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

children.push(run("api", process.execPath, ["server/index.mjs"], "\x1b[36m"));
children.push(run("web", npmCommand, ["run", "dev:web"], "\x1b[35m"));

process.on("SIGINT", () => {
  if (stopping) return;
  stopping = true;
  stopAll(0);
});

process.on("SIGTERM", () => {
  if (stopping) return;
  stopping = true;
  stopAll(0);
});
