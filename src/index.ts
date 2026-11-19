#!/usr/bin/env node
/**
 * SHAE TypeScript CLI Project Manager
 * Production-grade project management CLI
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(os.homedir(), '.local', 'share', 'shae-pm');
const DATA_FILE = path.join(DATA_DIR, 'projects.json');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadProjects(): Project[] {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveProjects(projects: Project[]): void {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function formatTable(projects: Project[]): string {
  if (projects.length === 0) return 'No projects found.';
  
  const colWidths = {
    id: 12,
    name: 20,
    status: 12,
    updated: 20
  };
  
  const header = `${'ID'.padEnd(colWidths.id)} ${'NAME'.padEnd(colWidths.name)} ${'STATUS'.padEnd(colWidths.status)} ${'UPDATED'.padEnd(colWidths.updated)}`;
  const separator = '-'.repeat(header.length);
  
  const rows = projects.map(p => 
    `${p.id.padEnd(colWidths.id)} ${p.name.padEnd(colWidths.name)} ${p.status.padEnd(colWidths.status)} ${new Date(p.updatedAt).toLocaleString().padEnd(colWidths.updated)}`
  );
  
  return [header, separator, ...rows].join('\n');
}

const program = new Command();

program
  .name('shae-pm')
  .description('SHAE Project Manager - CLI tool for managing projects')
  .version('1.0.0');

program
  .command('add <name>')
  .description('Add a new project')
  .option('-d, --description <text>', 'Project description')
  .option('-s, --status <status>', 'Initial status (todo|in-progress|done)', 'todo')
  .action((name, options) => {
    const projects = loadProjects();
    const validStatuses = ['todo', 'in-progress', 'done'] as const;
    const status = validStatuses.includes(options.status as any) ? options.status : 'todo';
    
    const project: Project = {
      id: generateId(),
      name,
      description: options.description || '',
      status: status as Project['status'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    projects.push(project);
    saveProjects(projects);
    console.log(`Created project: ${project.id} - ${project.name} [${project.status}]`);
  });

program
  .command('list')
  .description('List all projects')
  .option('-s, --status <status>', 'Filter by status')
  .action((options) => {
    let projects = loadProjects();
    if (options.status) {
      projects = projects.filter(p => p.status === options.status);
    }
    console.log(formatTable(projects));
  });

program
  .command('status <id> <newStatus>')
  .description('Update project status')
  .action((id, newStatus) => {
    const validStatuses = ['todo', 'in-progress', 'done'] as const;
    if (!validStatuses.includes(newStatus as any)) {
      console.error('Invalid status. Use: todo, in-progress, done');
      process.exit(1);
    }
    
    const projects = loadProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) {
      console.error(`Project not found: ${id}`);
      process.exit(1);
    }
    
    projects[index].status = newStatus;
    projects[index].updatedAt = new Date().toISOString();
    saveProjects(projects);
    console.log(`Updated ${id} status to ${newStatus}`);
  });

program
  .command('delete <id>')
  .description('Delete a project')
  .action((id) => {
    const projects = loadProjects();
    const filtered = projects.filter(p => p.id !== id);
    if (filtered.length === projects.length) {
      console.error(`Project not found: ${id}`);
      process.exit(1);
    }
    saveProjects(filtered);
    console.log(`Deleted project: ${id}`);
  });

program
  .command('show <id>')
  .description('Show project details')
  .action((id) => {
    const projects = loadProjects();
    const project = projects.find(p => p.id === id);
    if (!project) {
      console.error(`Project not found: ${id}`);
      process.exit(1);
    }
    console.log(`ID:          ${project.id}`);
    console.log(`Name:        ${project.name}`);
    console.log(`Description: ${project.description || '(none)'}`);
    console.log(`Status:      ${project.status}`);
    console.log(`Created:     ${new Date(project.createdAt).toLocaleString()}`);
    console.log(`Updated:     ${new Date(project.updatedAt).toLocaleString()}`);
  });

program.parse();
