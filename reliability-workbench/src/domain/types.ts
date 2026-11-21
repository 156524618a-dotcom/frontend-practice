export interface Project {
  id: string;
  name: string;
  code: string;
  description: string;
}

export interface AllocationTask {
  id: string;
  projectId: string;
  name: string;
  code: string;
  description: string;
  modelId?: string;
  modelName: string;
  modelType: string;
}

export type RouteKey =
  | 'allocation' | 'projects' | 'modeling' | 'prediction' | 'fta'
  | 'weibull-projects' | 'life-data' | 'life-results'
  | 'mtbf-projects' | 'test-design' | 'test-results'
  | 'assessment-projects' | 'assessment' | 'archive';

export const ROUTE_TITLES: Record<RouteKey, string> = {
  allocation: '可靠性分配', projects: '项目管理', modeling: '可靠性建模',
  prediction: '可靠性预计', fta: '故障树分析', 'weibull-projects': 'Weibull 项目管理',
  'life-data': '寿命数据分析', 'life-results': '寿命结果应用',
  'mtbf-projects': 'MTBF 项目管理', 'test-design': '试验设计', 'test-results': '结果评估',
  'assessment-projects': '可靠性评估项目管理', assessment: '指标评估', archive: '报告归档',
};

export function routeFromHash(): RouteKey {
  const key = window.location.hash.replace(/^#\/?/, '');
  return Object.hasOwn(ROUTE_TITLES, key) ? key as RouteKey : 'allocation';
}
