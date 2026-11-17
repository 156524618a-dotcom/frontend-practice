import { Alert, Button, Descriptions } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { AllocationTask, Project } from '../../domain/types';

export function TaskPreparation({ task, project, onBack }: { task: AllocationTask; project: Project; onBack: () => void }) {
  return <section className="allocation-page"><div className="detail-heading"><h1>分配分析</h1><Button icon={<ArrowLeftOutlined aria-hidden="true" />} onClick={onBack}>返回任务总览</Button></div>
    <div className="detail-panel"><h2>当前任务信息</h2><Descriptions bordered column={1} items={[
      { key: 'project', label: '所属项目', children: project.name }, { key: 'name', label: '任务名称', children: task.name },
      { key: 'code', label: '任务编号', children: task.code }, { key: 'description', label: '任务说明', children: task.description },
      { key: 'model', label: '模型名称', children: task.modelName }, { key: 'type', label: '模型结构', children: task.modelType },
    ]} />
    <Alert type="info" showIcon title="任务已选定，分析工作区待接入" description="本阶段已完成软件框架与任务总览。分配方法、参数编辑和优化计算将在后续阶段实现；当前页面用于核对所选任务信息。" />
    </div></section>;
}
