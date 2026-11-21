import type { AllocationTask } from '../domain/types';

export interface DemoComponent {
  id: string;
  name: string;
  baseline: number;
}

export interface DemoModel {
  id: string;
  name: string;
  type: '串联';
  components: DemoComponent[];
}

export const BASELINE_HOURS = 1000;

function seriesModel(id: string, name: string, samples: [name: string, baseline: number][]): DemoModel {
  return {
    id, name, type: '串联',
    components: samples.map(([name, baseline], index) => ({ id: `block-${index + 1}`, name, baseline })),
  };
}

export const DEMO_MODELS = [
  seriesModel('system-01', '系统模型-01', [['输入模块', 0.981], ['电源模块', 0.975], ['控制模块', 0.988], ['输出模块', 0.970]]),
  seriesModel('controller', '控制单元-RBD', [['采集单元', 0.992], ['处理单元', 0.979], ['接口单元', 0.984]]),
  seriesModel('input-protection', '输入保护-RBD', [['滤波模块', 0.981], ['保护模块', 0.987]]),
];

export function getDemoModel(task: AllocationTask) {
  return DEMO_MODELS.find((model) => task.modelId
    ? model.id === task.modelId
    : model.name === task.modelName && model.type === task.modelType);
}
