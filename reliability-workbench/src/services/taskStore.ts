import type { AllocationTask } from '../domain/types';

const STORAGE_KEY = 'reliability-workbench.allocation-tasks.v1';

function isSavedTask(value: unknown): value is AllocationTask {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return ['id', 'projectId', 'name', 'code', 'description', 'modelId', 'modelName', 'modelType'].every((key) => {
    const field = item[key];
    return typeof field === 'string' && field.trim().length > 0;
  });
}

export function loadCreatedTasks(): AllocationTask[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (Array.isArray(raw) && raw.every(isSavedTask)
      && new Set(raw.map((task) => task.id)).size === raw.length) return raw;
  } catch { /* 保留内置示例，忽略无法读取的自建记录。 */ }
  return [];
}

export function saveCreatedTasks(tasks: AllocationTask[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
}
