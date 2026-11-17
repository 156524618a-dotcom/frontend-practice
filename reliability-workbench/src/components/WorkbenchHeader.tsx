import { DownOutlined, AuditOutlined, BarChartOutlined, ExperimentOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import type { RouteKey } from '../domain/types';

interface Props { route: RouteKey; onNavigate: (route: RouteKey) => void }

export function WorkbenchHeader({ route, onNavigate }: Props) {
  const analysisActive = ['allocation', 'projects', 'modeling', 'prediction', 'fta'].includes(route);
  return (
    <header className="workbench-header" aria-label="顶栏模块导航">
      <Dropdown trigger={['click']} menu={{
        selectedKeys: [route],
        items: [
          { key: 'projects', label: '项目管理' }, { key: 'modeling', label: '可靠性建模' },
          { key: 'prediction', label: '可靠性预计' }, { key: 'allocation', label: '可靠性分配' },
          { key: 'fta', label: '故障树分析' },
        ],
        onClick: ({ key }) => onNavigate(key as RouteKey),
      }}>
        <button className={`module-button ${analysisActive ? 'active' : ''}`} aria-label="可靠性分析模块菜单">
          <AuditOutlined aria-hidden="true" /><span>可靠性分析</span><DownOutlined aria-hidden="true" className="module-chevron" />
        </button>
      </Dropdown>
      <button className={`module-button ${route.startsWith('life-') || route === 'weibull-projects' ? 'active' : ''}`} onClick={() => onNavigate('life-data')}>
        <BarChartOutlined aria-hidden="true" /><span>Weibull分析</span>
      </button>
      <button className={`module-button ${['mtbf-projects', 'test-design', 'test-results'].includes(route) ? 'active' : ''}`} onClick={() => onNavigate('test-design')}>
        <ExperimentOutlined aria-hidden="true" /><span>MTBF验证试验设计与评估</span>
      </button>
      <button className={`module-button ${['assessment-projects', 'assessment', 'archive'].includes(route) ? 'active' : ''}`} onClick={() => onNavigate('assessment')}>
        <SafetyCertificateOutlined aria-hidden="true" /><span>可靠性评估</span>
      </button>
    </header>
  );
}
