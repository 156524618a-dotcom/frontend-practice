import { INITIAL_PROJECTS } from '../data/fixtures';
import type { Project } from '../domain/types';

const STORAGE_KEY = 'reliability-workbench.projects.v1';

function isProject(value: unknown): value is Project {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return ['id', 'name', 'code', 'description'].every((key) => typeof item[key] === 'string')
    && typeof item.id === 'string' && !!item.id.trim()
    && typeof item.name === 'string' && !!item.name.trim()
    && typeof item.code === 'string' && !!item.code.trim();
}

export function loadProjects(): Project[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (Array.isArray(raw) && raw.length > 0 && raw.every(isProject)
      && new Set(raw.map((item) => item.id)).size === raw.length
      && new Set(raw.map((item) => item.code)).size === raw.length) return raw;
  } catch { /* 无效本地数据时安全回到示例项目。 */ }
  return INITIAL_PROJECTS.map((project) => ({ ...project }));
}

export function saveProjects(projects: Project[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return true;
  } catch {
    return false;
  }
}
