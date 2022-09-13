#!/usr/bin/env node

import { watch, readFileSync } from "fs";
import { ChildProcess, spawn } from "child_process";
import { resolve, join } from "path";

type Options = {
  include?: string;
  exclude?: string;
  exec?: string;
};

const args = process.argv.slice(2);
const dir = getDir(args);
const opts = parseOpts(args.slice(1));

let child: ChildProcess;
let command: string[];

if (opts.exec) {
  const execArgs = opts.exec.split(" ");
  child = spawn(execArgs[0], execArgs.slice(1), { stdio: "inherit" });
} else {
  command = getStartScript();
  child = spawn(command[0], command.slice(1), { stdio: "inherit" });
}

let fsWait: ReturnType<typeof setTimeout> | boolean = false;

watch(dir, { recursive: true }, (_, filename) => {
  if (!filename) return;
  if (fsWait) return;

  fsWait = setTimeout(() => {
    fsWait = false;
  }, 100);

  if (opts.include) {
    const regex = new RegExp(opts.include);
    if (!filename.match(regex)) return;
  }
  if (opts.exclude) {
    const regex = new RegExp(opts.exclude);
    if (filename.match(regex)) return;
  }

  restart();
});

function getDir(args: string[]): string {
  if (!args[0] || args[0].startsWith("--")) {
    args.unshift(resolve("."));
  }
  return resolve(args[0]);
}

function parseOpts(opts: string[]): Options {
  return opts.reduce((acc: Options, curr, i) => {
    if (!curr.startsWith("--")) return acc;

    if (!(opts.length > i + 1)) {
      console.error(`error: missing argument for "${curr}"`);
      process.exit(1);
    }

    const key = curr.replace("--", "");
    acc[key as keyof Options] = opts[i + 1];

    return acc;
  }, {});
}

function getStartScript(): string[] {
  const packageJSON = JSON.parse(readFileSync(join(String(process.env.PWD), "package.json"), "utf-8"));

  if (!packageJSON.scripts.start) {
    console.error("error: could not determine start script");
    process.exit(1);
  }

  return packageJSON.scripts.start.split(" ");
}

function restart(): void {
  if (opts.exec) {
    const execArgs = opts.exec.split(" ");
    spawn(execArgs[0], execArgs.slice(1), { stdio: "inherit" });
  } else {
    child.kill();
    setTimeout(() => {
      child = spawn(command[0], command.slice(1), { stdio: "inherit" });
    }, 500);
  }
}
