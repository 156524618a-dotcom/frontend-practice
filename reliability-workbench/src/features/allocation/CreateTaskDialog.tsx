import { useState } from 'react';
import { Empty, Form, Input, Modal, Table, type TableColumnsType } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { DEMO_MODELS, type DemoModel } from '../../data/demoModels';
import { seriesBaseline } from '../../domain/equalAllocation';
import type { AllocationTask } from '../../domain/types';
import { ModelPreview } from './ModelPreview';

export interface NewTaskValues {
  name: string;
  code: string;
  description: string;
  modelId: string;
}

const modelColumns: TableColumnsType<DemoModel> = [
  { title: '模型名称', dataIndex: 'name' },
  { title: '系统可靠度', key: 'reliability', width: 92, align: 'center', render: (_, model) => seriesBaseline(model).system.toFixed(4) },
  { title: '结构', dataIndex: 'type', width: 55, align: 'center' },
  { title: '模块数', key: 'count', width: 62, align: 'center', render: (_, model) => model.components.length },
];

function ModelPicker({ value, onChange, id }: { value?: string; onChange?: (id: string) => void; id?: string }) {
  const [query, setQuery] = useState('');
  const keyword = query.trim().toLowerCase();
  const visibleModels = DEMO_MODELS.filter((model) => model.name.toLowerCase().includes(keyword));
  const selected = DEMO_MODELS.find((model) => model.id === value);
  const { status, errors } = Form.Item.useStatus();

  return <div id={id} tabIndex={-1} className="model-picker-field" role="group" aria-label="模型选择"
    aria-invalid={status === 'error'} aria-describedby={errors.length ? `${id}_help` : undefined}>
    <div className="model-picker">
      <section className="model-list" aria-labelledby="model-list-title">
        <div className="model-list-heading"><h3 id="model-list-title">模型列表</h3><span>示例模型</span></div>
        <Input aria-label="按模型名称搜索" placeholder="请输入模型名称" suffix={<SearchOutlined aria-hidden="true" />} allowClear
          value={query} onChange={(event) => setQuery(event.target.value)} />
        <Table<DemoModel> rowKey="id" dataSource={visibleModels} columns={modelColumns} size="small" pagination={false} tableLayout="fixed"
          rowSelection={{ type: 'radio', columnWidth: 32, selectedRowKeys: selected ? [selected.id] : [],
            onChange: (keys) => { if (typeof keys[0] === 'string') onChange?.(keys[0]); },
            getCheckboxProps: (model) => ({ 'aria-label': `选择模型：${model.name}` }),
          }}
          onRow={(model) => ({ onClick: () => onChange?.(model.id) })}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="未找到匹配的模型" /> }} />
        <p className="model-selection" aria-live="polite">{selected ? `已选择：${selected.name}` : '请选择一个模型'}</p>
      </section>
      <ModelPreview key={selected?.id ?? 'empty'} model={selected} />
    </div>
  </div>;
}

export function CreateTaskDialog({ open, tasks, onClose, onCreate }: {
  open: boolean;
  tasks: AllocationTask[];
  onClose: () => void;
  onCreate: (values: NewTaskValues) => void;
}) {
  const [form] = Form.useForm<NewTaskValues>();

  return <Modal title="新建任务" open={open} width={1108} centered destroyOnHidden className="create-task-dialog" onCancel={onClose}
    okText="创建任务" cancelText="取消" onOk={() => form.submit()}>
    <Form<NewTaskValues> form={form} name="create-allocation-task" layout="vertical" clearOnDestroy
      scrollToFirstError={{ focus: true }} onFinish={(values) => onCreate({
        ...values, name: values.name.trim(), code: values.code.trim(), description: values.description.trim(),
      })}>
      <div className="create-task-fields">
        <Form.Item name="name" label="任务名称" rules={[{ required: true, whitespace: true, message: '请输入任务名称' }]}>
          <Input maxLength={60} placeholder="请输入任务名称" />
        </Form.Item>
        <Form.Item name="code" label="任务编号" validateTrigger="onBlur" rules={[
          { required: true, whitespace: true, message: '请输入任务编号' },
          { validator: async (_, value?: string) => {
            if (value?.trim() && tasks.some((task) => task.code.toLowerCase() === value.trim().toLowerCase())) {
              throw new Error('当前项目中已有此任务编号');
            }
          } },
        ]}><Input maxLength={24} placeholder="请输入任务编号" /></Form.Item>
        <Form.Item name="description" label="任务说明" rules={[{ required: true, whitespace: true, message: '请输入任务说明' }]}>
          <Input.TextArea rows={2} maxLength={240} placeholder="填写工程背景、设计阶段或适用范围" />
        </Form.Item>
      </div>
      <Form.Item name="modelId" className="model-picker-item" rules={[{
        validator: (_, value: string | undefined) => DEMO_MODELS.some((model) => model.id === value)
          ? Promise.resolve() : Promise.reject(new Error('请先选择一个模型')),
      }]}>
        <ModelPicker />
      </Form.Item>
    </Form>
  </Modal>;
}
