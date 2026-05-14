#!/usr/bin/env node

import fs from "node:fs";
import { analyzeMessageNextStep, formatReport } from "../src/index.js";

function printHelp() {
  console.log(`message-next-step

Usage:
  message-next-step "text to analyze"
  cat message.txt | message-next-step
  message-next-step --file message.txt
  message-next-step --json "Can we talk later?"
`);
}

function parseArgs(argv) {
  const args = [...argv];
  let json = false;
  let file = null;
  const textParts = [];

  while (args.length) {
    const arg = args.shift();
    if (arg === "--help" || arg === "-h") {
      return { help: true };
    }
    if (arg === "--json") {
      json = true;
      continue;
    }
    if (arg === "--file") {
      file = args.shift();
      continue;
    }
    textParts.push(arg);
  }

  return { help: false, json, file, text: textParts.join(" ").trim() };
}

async function readStdin() {
  if (process.stdin.isTTY) {
    return "";
  }
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data.trim()));
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    process.exit(0);
  }

  let input = options.text;
  if (options.file) {
    input = fs.readFileSync(options.file, "utf8").trim();
  }
  if (!input) {
    input = await readStdin();
  }
  if (!input) {
    printHelp();
    process.exit(1);
  }

  const result = analyzeMessageNextStep(input);
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  console.log(formatReport(result));
}

main().catch((error) => {
  console.error(`message-next-step: ${error.message}`);
  process.exit(1);
});
