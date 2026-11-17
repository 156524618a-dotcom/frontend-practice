import type { AllocationTask, Project } from '../domain/types';

// 仅为任务总览的本地演示数据，不包含真实计算结果。
export const INITIAL_PROJECTS: Project[] = [
  { id: 'platform', name: '平台可靠性基线', code: 'PRJ-001', description: '平台系统可靠性分析与设计基线。' },
  { id: 'power', name: '机载电源可靠性分析', code: 'PRJ-002', description: '机载电源系统的可靠性分析项目。' },
  { id: 'controller', name: '控制器方案评审', code: 'PRJ-003', description: '控制器设计方案评审，尚未建立分配任务。' },
];

const platformTasks = [
  ['系统可靠性分配', '项目背景、设计阶段与系统总体指标分配。', '系统模型-01', '串联'],
  ['汽车部件可靠性分配', '汽车部件方案设计及可靠性指标分解。', '系统模型-02', '串并联'],
  ['电源分系统指标分配', '电源分系统详细设计阶段的目标指标分配。', '电源分系统-RBD', '并联'],
  ['控制单元可靠性分配', '控制单元方案对比与改进目标分析。', '控制单元-RBD', '串联'],
  ['通信模块可靠性分配', '通信模块初步设计与接口边界确认。', '通信模块-RBD', '表决'],
  ['传感器组件可靠性分配', '传感器组件设计评审与分配方案准备。', '传感器-RBD', '串并联'],
  ['执行机构可靠性分配', '执行机构目标指标分解与设计基线复核。', '执行机构-RBD', '串联'],
  ['辅助系统可靠性分配', '辅助系统可靠性设计任务准备。', '辅助系统-RBD', '备用冗余'],
];

export const ALLOCATION_TASKS: AllocationTask[] = [
  ...platformTasks.map(([name, description, modelName, modelType], index) => ({
    id: `platform-task-${index + 1}`, projectId: 'platform', name,
    code: `P${String(index + 1).padStart(3, '0')}`, description, modelName, modelType,
  })),
  { id: 'power-task-1', projectId: 'power', name: 'DC/DC 电源可靠性分配', code: 'PW001',
    description: '机载电源初步设计阶段的分配任务。', modelName: 'DC/DC电源-RBD', modelType: '串并联' },
  { id: 'power-task-2', projectId: 'power', name: '输入保护模块可靠性分配', code: 'PW002',
    description: '输入保护模块可靠性指标复核。', modelName: '输入保护-RBD', modelType: '串联' },
];
