import { useState } from 'react';
import { Alert, Button, Checkbox, Form, InputNumber, Select, Table, Tag, type TableColumnsType } from 'antd';
import { CalculatorOutlined } from '@ant-design/icons';
import { BASELINE_HOURS, type DemoModel } from '../../data/demoModels';
import { ALLOCATION_UNITS, runEqualAllocation, seriesBaseline, type AllocationParameters } from '../../domain/equalAllocation';

type Result = Extract<ReturnType<typeof runEqualAllocation>, { after: number }>;
type ComponentRow = ReturnType<typeof seriesBaseline>['rows'][number];
const INITIAL_PARAMETERS: AllocationParameters = { target: 0.93, duration: BASELINE_HOURS, unit: 'hour' };
const METHODS = [
  { label: '等分配法', value: 'equal' },
  { label: '权重分配法（待接入）', value: 'weighted', disabled: true },
  { label: '成本最优分配法（待接入）', value: 'cost', disabled: true },
];

export function EqualAllocationWorkspace({ model }: { model: DemoModel }) {
  const [participants, setParticipants] = useState(() => model.components.map(({ id }) => id));
  const [result, setResult] = useState<Result | null>(null);
  const [stale, setStale] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const baseline = result?.baseline ?? seriesBaseline(model);

  function invalidateResult() {
    if (result) setStale(true);
    setResult(null);
    setError(null);
  }

  function changeParticipation(id: string, checked: boolean) {
    setParticipants((current) => checked ? [...current, id] : current.filter((item) => item !== id));
    invalidateResult();
  }

  function calculate(values: AllocationParameters) {
    if (!participants.length) {
      setError('请至少勾选一个参与分配的组件。');
      return;
    }
    const next = runEqualAllocation(model, values, participants);
    if (next.error !== undefined) {
      setError(next.error);
      return;
    }
    setError(null);
    setStale(false);
    setResult(next);
  }

  const columns: TableColumnsType<ComponentRow> = [
    { title: '参与', key: 'participates', width: 68, align: 'center', render: (_, row) =>
      <Checkbox aria-label={`参与分配：${row.name}`} checked={participants.includes(row.id)}
        onChange={(event) => changeParticipation(row.id, event.target.checked)} /> },
    { title: '块 / 组件', dataIndex: 'name' },
    { title: '当前可靠度', dataIndex: 'current', align: 'center', render: (value: number) => value.toFixed(4) },
    { title: '可靠度重要性', dataIndex: 'importance', align: 'center', render: (value: number) => value.toFixed(4) },
    { title: '目标可靠度', key: 'target', align: 'center', render: (_, row) =>
      result && participants.includes(row.id) ? result.target.toFixed(4) : '—' },
    { title: '状态', key: 'status', width: 106, align: 'center', render: (_, row) => {
      if (!participants.includes(row.id)) return '未参与';
      if (!result) return '—';
      return row.current < result.target ? <Tag color="orange">需提升</Tag> : <Tag color="green">无需提升</Tag>;
    } },
  ];

  return <section className="analysis-workspace" aria-label="等分配分析工作区">
    <div className="analysis-panel-heading">
      <h2>分配参数</h2>
      <Tag color="blue">示例计算 · 串联模型</Tag>
    </div>
    <Form<AllocationParameters> className="analysis-fields" name="equal-allocation" layout="vertical" initialValues={INITIAL_PARAMETERS}
      onValuesChange={invalidateResult} onFinish={calculate} scrollToFirstError={{ focus: true }}>
      <Form.Item label="分配方法" htmlFor="allocation-method">
        <Select id="allocation-method" value="equal" options={METHODS} />
      </Form.Item>
      <Form.Item name="target" label="目标可靠度" rules={[
        { required: true, message: '请输入目标可靠度' },
        { validator: async (_, value?: number) => {
          if (value != null && !(value > 0 && value < 1)) throw new Error('请输入大于 0 且小于 1 的值');
        } },
      ]}><InputNumber step={0.01} placeholder="0～1 之间" /></Form.Item>
      <Form.Item name="duration" label="任务时间" rules={[
        { required: true, message: '请输入任务时间' },
        { validator: async (_, value?: number) => {
          if (value != null && !(Number.isFinite(value) && value > 0)) throw new Error('请输入大于 0 的任务时间');
        } },
      ]}><InputNumber step={1} placeholder="请输入任务时间" /></Form.Item>
      <Form.Item name="unit" label="单位" rules={[{ required: true, message: '请选择单位' }]}>
        <Select options={ALLOCATION_UNITS.map((unit) => ({ ...unit }))} />
      </Form.Item>
      <Form.Item className="analysis-submit">
        <Button type="primary" htmlType="submit" icon={<CalculatorOutlined aria-hidden="true" />}>优化计算</Button>
      </Form.Item>
    </Form>
    {error && <Alert className="analysis-feedback" type="error" title={error} showIcon />}
    {stale && !error && <Alert className="analysis-feedback" type="warning" title="参数已修改，请重新计算。" showIcon />}
    <div className="analysis-table">
      <Table<ComponentRow> rowKey="id" columns={columns} dataSource={baseline.rows} pagination={false} tableLayout="fixed" />
    </div>
    <div className="analysis-summary" aria-live="polite">
      <div><span>当前系统可靠度</span><output aria-label="当前系统可靠度">{baseline.system.toFixed(4)}</output></div>
      <div><span>分配后系统可靠度</span><output aria-label="分配后系统可靠度">{result ? result.after.toFixed(4) : '—'}</output></div>
      <span className="analysis-summary-note">{result ? '按本次输入参数计算' : `当前值为模型基准（${BASELINE_HOURS} 小时）`}</span>
    </div>
    <p className="analysis-note">示例按串联结构和固定失效率计算。未参与的组件保留当前值，现有可靠度高于分配目标的组件维持原值。</p>
  </section>;
}
