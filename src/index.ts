import * as fs from "fs";
import * as path from "path";
import * as os from "os";

type Status = "todo" | "in-progress" | "done";

interface Project {
  id: string;
  name: string;
  description: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(os.homedir(), ".local", "share", "shae-pm");
const DATA_FILE = path.join(DATA_DIR, "projects.json");

const VALID_STATUSES: Status[] = ["todo", "in-progress", "done"];

function ensureDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readProjects(): Project[] {
  ensureDir();
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeProjects(projects: Project[]): void {
  ensureDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2), "utf8");
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function isValidStatus(value: string): value is Status {
  return VALID_STATUSES.includes(value as Status);
}

function findProject(projects: Project[], idOrName: string): Project | undefined {
  return projects.find((p) => p.id === idOrName || p.name === idOrName);
}

function pad(s: string, width: number): string {
  return s + " ".repeat(Math.max(0, width - s.length));
}

function cmdAdd(args: string[]): void {
  const [name, description = "", status = "todo"] = args;
  if (!name) {
    throw new Error("usage: shae-pm add <name> [description] [status]");
  }
  if (!isValidStatus(status)) {
    throw new Error(`invalid status: ${status}`);
  }
  const projects = readProjects();
  const project: Project = {
    id: genId(),
    name,
    description,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  projects.push(project);
  writeProjects(projects);
  console.log(`added ${project.id}  ${name}`);
}

function cmdList(): void {
  const projects = readProjects();
  if (projects.length === 0) {
    console.log("no projects");
    return;
  }
  const idW = Math.max(...projects.map((p) => p.id.length), 2);
  const nameW = Math.max(...projects.map((p) => p.name.length), 4);
  const descW = Math.max(
    ...projects.map((p) => p.description.length),
    11
  );
  console.log(`${pad("id", idW)}  ${pad("name", nameW)}  ${pad("description", descW)}  status`);
  console.log(
    `${"-".repeat(idW)}  ${"-".repeat(nameW)}  ${"-".repeat(descW)}  ------`
  );
  for (const p of projects) {
    console.log(
      `${pad(p.id, idW)}  ${pad(p.name, nameW)}  ${pad(p.description, descW)}  ${p.status}`
    );
  }
}

function cmdStatus(args: string[]): void {
  const [idOrName, status] = args;
  if (!idOrName || !status) {
    throw new Error(
      "usage: shae-pm status <id|name> <todo|in-progress|done>"
    );
  }
  if (!isValidStatus(status)) {
    throw new Error(`invalid status: ${status}`);
  }
  const projects = readProjects();
  const p = findProject(projects, idOrName);
  if (!p) {
    throw new Error(`project not found: ${idOrName}`);
  }
  p.status = status;
  p.updatedAt = new Date().toISOString();
  writeProjects(projects);
  console.log(`updated ${p.id}  ${p.name} -> ${status}`);
}

function cmdDelete(args: string[]): void {
  const [idOrName] = args;
  if (!idOrName) {
    throw new Error("usage: shae-pm delete <id|name>");
  }
  const projects = readProjects();
  const idx = projects.findIndex(
    (p) => p.id === idOrName || p.name === idOrName
  );
  if (idx === -1) {
    throw new Error(`project not found: ${idOrName}`);
  }
  const removed = projects.splice(idx, 1)[0];
  writeProjects(projects);
  console.log(`deleted ${removed.id}  ${removed.name}`);
}

function cmdHelp(): void {
  console.log("shae-pm — SHAE CLI project manager");
  console.log("");
  console.log("usage: shae-pm <command> [args]");
  console.log("");
  console.log("commands:");
  console.log("  add <name> [description] [status]   add a project");
  console.log("  list                                list projects (table)");
  console.log(
    "  status <id|name> <todo|in-progress|done>  update a project's status"
  );
  console.log("  delete <id|name>                    delete a project");
  console.log("");
  console.log("statuses: todo, in-progress, done");
  console.log(`data file: ${DATA_FILE}`);
}

function main(): void {
  const args = process.argv.slice(2);
  const command = args[0];
  const rest = args.slice(1);
  try {
    switch (command) {
      case "add":
        cmdAdd(rest);
        break;
      case "list":
        cmdList();
        break;
      case "status":
        cmdStatus(rest);
        break;
      case "delete":
        cmdDelete(rest);
        break;
      case "help":
      case "--help":
      case "-h":
      case undefined:
        cmdHelp();
        break;
      default:
        throw new Error(`unknown command: ${command}`);
    }
  } catch (err) {
    console.error(
      `error: ${err instanceof Error ? err.message : String(err)}`
    );
    process.exit(1);
  }
}

main();
