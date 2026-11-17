import { useState } from 'react';
import { App as AntApp, Breadcrumb, Button, Descriptions, Empty, Layout, Modal, Table, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { WorkbenchHeader } from './components/WorkbenchHeader';
import { WorkbenchSidebar } from './components/WorkbenchSidebar';
import { TaskOverview } from './features/allocation/TaskOverview';
import { TaskPreparation } from './features/allocation/TaskPreparation';
import { ProjectDialogs } from './features/projects/ProjectDialogs';
import { ALLOCATION_TASKS } from './data/fixtures';
import { ROUTE_TITLES, type AllocationTask, type Project, type RouteKey } from './domain/types';
import { loadProjects, saveProjects } from './services/projectStore';
import { useRoute } from './hooks/useRoute';

export default function App() {
  const { message } = AntApp.useApp();
  const { route, navigate } = useRoute();
  const [projects, setProjects] = useState(loadProjects);
  const [projectId, setProjectId] = useState(() => projects[0].id);
  const [projectDialog, setProjectDialog] = useState<'new' | 'open' | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<AllocationTask | null>(null);
  const project = projects.find((item) => item.id === projectId)!;
  const tasks = ALLOCATION_TASKS.filter((task) => task.projectId === projectId);

  function goTo(next: RouteKey) {
    setActiveTask(null);
    navigate(next);
  }

  function openProject(id: string) {
    setProjectId(id);
    setActiveTask(null);
    setProjectDialog(null);
    navigate('allocation');
  }

  function createProject(values: Omit<Project, 'id'>) {
    const newProject = { ...values, id: crypto.randomUUID() };
    const next = [...projects, newProject];
    setProjects(next);
    const stored = saveProjects(next);
    openProject(newProject.id);
    if (stored) message.success('项目已创建并保存到本机');
    else message.warning('项目已创建，但本机存储不可用，刷新后不会保留');
  }

  const isProjectPage = ['projects', 'weibull-projects', 'mtbf-projects', 'assessment-projects'].includes(route);
  const parentTitle = route.startsWith('life-') || route === 'weibull-projects' ? 'Weibull分析'
    : ['mtbf-projects', 'test-design', 'test-results'].includes(route) ? 'MTBF验证试验设计与评估'
      : ['assessment-projects', 'assessment', 'archive'].includes(route) ? '可靠性评估' : '可靠性分析';

  return <Layout className="workbench">
    <WorkbenchSidebar project={project} route={route} onNavigate={goTo}
      onNewProject={() => setProjectDialog('new')} onOpenProject={() => setProjectDialog('open')} onHelp={() => setHelpOpen(true)} />
    <Layout className="workbench-body"><WorkbenchHeader route={route} onNavigate={goTo} />
      <main className="main-content" id="main-content">
        <div className="context-bar"><Breadcrumb items={[{ title: parentTitle }, { title: ROUTE_TITLES[route] }, ...(activeTask && route === 'allocation' ? [{ title: activeTask.code }] : [])]} /><span className="local-label">本地原型 · 演示数据</span></div>
        {route === 'allocation' ? <div className={activeTask ? 'list-hidden' : ''}>
          <TaskOverview key={project.id} tasks={tasks} onStart={setActiveTask} />
        </div> : null}
        {route === 'allocation' && activeTask && <TaskPreparation task={activeTask} project={project} onBack={() => setActiveTask(null)} />}
        {isProjectPage && <section className="allocation-page project-page"><h1>{ROUTE_TITLES[route]}</h1><div className="detail-panel"><div className="project-page-heading"><h2>项目总览</h2><Button type="primary" onClick={() => setProjectDialog('new')}>新建项目</Button></div>
          <Table<Project> rowKey="id" dataSource={projects} pagination={{ pageSize: 8, showSizeChanger: false }} columns={[
            { title: '项目名称', dataIndex: 'name' }, { title: '项目编号', dataIndex: 'code', width: 120 }, { title: '项目说明', dataIndex: 'description' },
            { title: '操作', key: 'action', width: 100, render: (_, item) => <Button type="link" onClick={() => openProject(item.id)}>进入项目</Button> },
          ]} /></div></section>}
        {route !== 'allocation' && !isProjectPage && <section className="allocation-page reserved-page"><h1>{ROUTE_TITLES[route]}</h1><div className="detail-panel"><Empty description={<><strong>{ROUTE_TITLES[route]}工作区预留</strong><p>当前阶段实现软件框架与可靠性分配任务总览，此模块将在后续阶段接入。</p></>}><Button icon={<ArrowLeftOutlined aria-hidden="true" />} onClick={() => goTo('allocation')}>返回可靠性分配</Button></Empty></div></section>}
        <footer className="workspace-status"><span>当前项目：{project.name}</span><span>界面原型 v0.1 · 本地运行</span></footer>
      </main>
    </Layout>
    <ProjectDialogs mode={projectDialog} projects={projects} activeId={projectId} onClose={() => setProjectDialog(null)} onCreate={createProject} onSelect={openProject} />
    <Modal title="帮助与导航" open={helpOpen} onCancel={() => setHelpOpen(false)} footer={<Button type="primary" onClick={() => setHelpOpen(false)}>知道了</Button>} width={640}>
      <Descriptions column={1} items={[
        { key: 'project', label: '切换项目', children: '点击左侧“打开项目”，选择需要查看的项目。' },
        { key: 'search', label: '查找任务', children: '在任务总览输入任务名称，可直接筛选；清空搜索恢复列表。' },
        { key: 'select', label: '选择任务', children: '点击行或单选框选择任务，再点击“开始分配分析”核对任务信息。' },
        { key: 'scope', label: '当前范围', children: '新建任务、模型选择、优化计算、建模和预计等工作区将在后续阶段实现。' },
        { key: 'data', label: '数据保存', children: '示例任务用于界面演示；新建的项目保存在此浏览器的本机存储中。' },
      ]} /><Tag color="blue">React + Ant Design 6</Tag>
    </Modal>
  </Layout>;
}
