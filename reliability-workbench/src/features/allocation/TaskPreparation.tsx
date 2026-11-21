import { Alert, Button, Descriptions } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getDemoModel } from '../../data/demoModels';
import type { AllocationTask, Project } from '../../domain/types';
import { EqualAllocationWorkspace } from './EqualAllocationWorkspace';

export function TaskPreparation({ task, project, onBack }: { task: AllocationTask; project: Project; onBack: () => void }) {
  const model = getDemoModel(task);

  return <section className="allocation-page"><div className="detail-heading"><h1>分配分析</h1><Button icon={<ArrowLeftOutlined aria-hidden="true" />} onClick={onBack}>返回任务总览</Button></div>
    <details className="analysis-task-info">
      <summary><span>当前任务信息</span><strong>{task.name}</strong><span>{task.code} · {task.modelName}</span></summary>
      <Descriptions size="small" bordered column={2} items={[
        { key: 'project', label: '所属项目', children: project.name }, { key: 'code', label: '任务编号', children: task.code },
        { key: 'model', label: '模型名称', children: task.modelName }, { key: 'type', label: '模型结构', children: task.modelType },
        { key: 'description', label: '任务说明', children: task.description, span: 2 },
      ]} />
    </details>
    {model ? <EqualAllocationWorkspace key={task.id} model={model} />
      : <Alert type="info" showIcon title="当前任务暂无可演示的模型数据"
        description="可返回总览选择“系统可靠性分配”等带有演示模型的任务，或新建任务并绑定列表中的示例模型。" />}
  </section>;
}
