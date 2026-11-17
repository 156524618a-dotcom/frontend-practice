import { Button, Form, Input, Modal, Table } from 'antd';
import type { Project } from '../../domain/types';

interface Props {
  mode: 'new' | 'open' | null;
  projects: Project[]; activeId: string;
  onClose: () => void; onCreate: (values: Omit<Project, 'id'>) => void;
  onSelect: (id: string) => void;
}

export function ProjectDialogs({ mode, projects, activeId, onClose, onCreate, onSelect }: Props) {
  const [form] = Form.useForm<Omit<Project, 'id'>>();
  return <>
    <Modal title="新建项目" open={mode === 'new'} onCancel={onClose} okText="创建项目" cancelText="取消"
      onOk={() => form.submit()} destroyOnHidden afterOpenChange={(open) => { if (!open) form.resetFields(); }}>
      <Form form={form} layout="vertical" onFinish={(values) => onCreate({ name: values.name.trim(), code: values.code.trim(), description: values.description?.trim() || '' })}>
        <Form.Item label="项目名称" name="name" rules={[{ required: true, whitespace: true, message: '请输入项目名称' }]}><Input maxLength={60} placeholder="请输入项目名称" /></Form.Item>
        <Form.Item label="项目编号" name="code" rules={[
          { required: true, whitespace: true, message: '请输入项目编号' },
          { validator: (_, value) => !value || !projects.some((project) => project.code.toLowerCase() === value.trim().toLowerCase()) ? Promise.resolve() : Promise.reject(new Error('项目编号已存在')) },
        ]}><Input maxLength={30} placeholder="例如 PRJ-004" /></Form.Item>
        <Form.Item label="项目说明" name="description"><Input.TextArea maxLength={300} rows={3} showCount placeholder="填写项目背景与适用范围" /></Form.Item>
      </Form>
    </Modal>
    <Modal title="打开项目" open={mode === 'open'} onCancel={onClose} footer={<Button onClick={onClose}>取消</Button>} width={760}>
      <p className="dialog-hint">选择项目后，侧栏和任务总览会切换到该项目。</p>
      <Table<Project> rowKey="id" dataSource={projects} pagination={{ pageSize: 5, showSizeChanger: false }} size="small" columns={[
        { title: '项目名称', dataIndex: 'name' }, { title: '项目编号', dataIndex: 'code', width: 120 },
        { title: '操作', key: 'action', width: 85, render: (_, project) => <Button type="link" disabled={project.id === activeId} aria-label={`打开项目：${project.name}`} onClick={() => onSelect(project.id)}>{project.id === activeId ? '当前项目' : '打开'}</Button> },
      ]} />
    </Modal>
  </>;
}
