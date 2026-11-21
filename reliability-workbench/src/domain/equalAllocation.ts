import { BASELINE_HOURS, type DemoModel } from '../data/demoModels';

export const ALLOCATION_UNITS = [
  { label: '分 (min)', value: 'minute' },
  { label: '小时 (h)', value: 'hour' },
  { label: '天 (d)', value: 'day' },
  { label: '年 (a)', value: 'year' },
  { label: '循环', value: 'cycle' },
  { label: '公里 (km)', value: 'kilometer' },
] as const;

export interface AllocationParameters {
  target: number;
  duration: number;
  unit: typeof ALLOCATION_UNITS[number]['value'];
}

const hoursPerUnit = { minute: 1 / 60, hour: 1, day: 24, year: 365 * 24, cycle: null, kilometer: null };
const product = (values: number[]) => values.reduce((total, reliability) => total * reliability, 1);

export function seriesBaseline(model: DemoModel, hours = BASELINE_HOURS) {
  const reliabilities = model.components.map(({ baseline }) => baseline ** (hours / BASELINE_HOURS));
  return {
    system: product(reliabilities),
    rows: model.components.map((component, index) => ({
      ...component, current: reliabilities[index],
      importance: product(reliabilities.filter((_, position) => position !== index)),
    })),
  };
}

// 教学示例：串联系统、固定失效率，未参与组件维持当前可靠度。
export function runEqualAllocation(model: DemoModel, input: AllocationParameters, participants: string[]) {
  const factor = hoursPerUnit[input.unit];
  if (factor === null) return { error: '该示例模型以时间为自变量，请选择分、小时、天或年。' };

  const baseline = seriesBaseline(model, input.duration * factor);
  if (baseline.system <= 0 || baseline.rows.some(({ current }) => current >= 1)) {
    return { error: '任务时间超出本示例可展示的数值范围，请调整后重试。' };
  }

  const fixed = product(baseline.rows.filter(({ id }) => !participants.includes(id)).map(({ current }) => current));
  if (input.target >= fixed) {
    return { error: '仅提升所选组件无法达到该系统目标，请增加参与组件或降低目标可靠度。' };
  }
  const target = (input.target / fixed) ** (1 / participants.length);
  const after = product(baseline.rows.map(({ id, current }) => participants.includes(id) ? Math.max(current, target) : current));
  return { baseline, target, after };
}
