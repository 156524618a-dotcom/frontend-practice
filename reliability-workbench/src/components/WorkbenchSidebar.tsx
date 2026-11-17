import { Button, Menu } from 'antd';
import { DoubleRightOutlined, FolderOpenOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { Project, RouteKey } from '../domain/types';

interface Props {
  project: Project; route: RouteKey;
  onNavigate: (route: RouteKey) => void;
  onNewProject: () => void; onOpenProject: () => void; onHelp: () => void;
}

const leaf = (key: RouteKey, label: string) => ({ key, label, icon: <PlusOutlined aria-hidden="true" /> });
const items: MenuProps['items'] = [
  { key: 'analysis-group', label: '可靠性分析', icon: <DoubleRightOutlined aria-hidden="true" />, children: [
    leaf('projects', '项目管理'), leaf('modeling', '可靠性建模'),
    { key: 'analysis-tools', label: '可靠性预计·分配·FTA', icon: <PlusOutlined aria-hidden="true" />, children: [
      leaf('prediction', '可靠性预计'), leaf('allocation', '可靠性分配'), leaf('fta', '故障树分析'),
    ] },
  ] },
  { key: 'weibull-group', label: 'Weibull分析', icon: <DoubleRightOutlined aria-hidden="true" />, children: [
    leaf('weibull-projects', '项目管理'), leaf('life-data', '寿命数据分析'), leaf('life-results', '结果应用'),
  ] },
  { key: 'mtbf-group', label: 'MTBF验证试验', icon: <DoubleRightOutlined aria-hidden="true" />, children: [
    leaf('mtbf-projects', '项目管理'), leaf('test-design', '试验设计'), leaf('test-results', '结果评估'),
  ] },
  { key: 'assessment-group', label: '可靠性评估', icon: <DoubleRightOutlined aria-hidden="true" />, children: [
    leaf('assessment-projects', '项目管理'), leaf('assessment', '指标评估'), leaf('archive', '报告归档'),
  ] },
];

export function WorkbenchSidebar({ project, route, onNavigate, onNewProject, onOpenProject, onHelp }: Props) {
  return (
    <aside className="workbench-sidebar" aria-label="项目与功能导航">
      <a className="brand" href="#/allocation" aria-label="可靠性数据分析软件首页">
        <div className="brand-symbol" aria-hidden="true"><svg viewBox="0 0 50 42"><circle cx="25" cy="19" r="15" /><circle cx="25" cy="19" r="10" /><path d="M4 37h42M11 37V13l14-9 14 9v24M16 28l6-9 6 6 7-13" /></svg><span>RDA</span></div>
        <span>可靠性数据<br />分析软件</span>
      </a>
      <div className="project-actions">
        <Button type="text" icon={<PlusOutlined aria-hidden="true" />} onClick={onNewProject}>新建项目</Button>
        <Button type="text" icon={<FolderOpenOutlined aria-hidden="true" />} onClick={onOpenProject}>打开项目</Button>
      </div>
      <div className="current-project"><span>当前项目</span><strong title={project.name}>{project.name}</strong></div>
      <nav className="sidebar-menu" aria-label="软件功能菜单"><Menu mode="inline" theme="dark" items={items}
        selectedKeys={[route]} defaultOpenKeys={['analysis-group', 'analysis-tools', 'weibull-group', 'mtbf-group', 'assessment-group']}
        onClick={({ key }) => onNavigate(key as RouteKey)} inlineIndent={13} /></nav>
      <Button type="text" className="help-button" icon={<QuestionCircleOutlined aria-hidden="true" />} onClick={onHelp}>帮助与导航</Button>
    </aside>
  );
}
