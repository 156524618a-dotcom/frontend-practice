import { useState } from 'react';
import { Button, Empty, Input, Pagination, Space, Table, Tooltip } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, InfoCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import type { AllocationTask } from '../../domain/types';

interface Props { tasks: AllocationTask[]; onStart: (task: AllocationTask) => void }

const columns: TableColumnsType<AllocationTask> = [
  { title: '任务名称', dataIndex: 'name', key: 'name', width: '28%', render: (name) => <span className="task-name">{name}</span> },
  { title: '任务编号', dataIndex: 'code', key: 'code', width: 110 },
  { title: '任务说明', dataIndex: 'description', key: 'description', ellipsis: { showTitle: false },
    render: (description: string) => <Tooltip title={description} placement="topLeft"><span>{description}</span></Tooltip> },
  { title: '模型名称', dataIndex: 'modelName', key: 'modelName', width: '23%' },
];

export function TaskOverview({ tasks, onStart }: Props) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const pageSize = 5;
  const keyword = query.trim().toLowerCase();
  const filtered = tasks.filter((task) => task.name.toLowerCase().includes(keyword));
  const pageTasks = filtered.slice((page - 1) * pageSize, page * pageSize);
  const selectedTask = filtered.find((task) => task.id === selectedId);

  function changeSearch(value: string) {
    setQuery(value);
    setPage(1);
    setSelectedId(null);
  }

  return (
    <section className="allocation-page" aria-labelledby="allocation-title">
      <h1 id="allocation-title">可靠性分配</h1>
      <section className="task-overview" aria-labelledby="overview-title">
        <div className="overview-heading"><h2 id="overview-title">任务总览</h2>
          <Tooltip title="新建任务与模型选择将在下一阶段实现"><span><Button type="primary" icon={<PlusOutlined aria-hidden="true" />} disabled>新建</Button></span></Tooltip>
        </div>
        <label className="sr-only" htmlFor="task-search">按任务名称搜索</label>
        <Input id="task-search" placeholder="请输入任务名称" suffix={<SearchOutlined aria-hidden="true" />} allowClear
          value={query} onChange={(event) => changeSearch(event.target.value)} className="task-search" />
        <div className="task-table-area">
          <Table<AllocationTask> rowKey="id" columns={columns} dataSource={pageTasks} pagination={false} tableLayout="fixed"
            rowClassName={(task) => task.id === selectedId ? 'selected-task-row' : ''}
            rowSelection={{ type: 'radio', selectedRowKeys: selectedTask ? [selectedTask.id] : [],
              onChange: (keys) => setSelectedId(keys[0] as string),
              getCheckboxProps: (task) => ({ 'aria-label': `选择任务：${task.name}` }),
            }}
            onRow={(task) => ({ onClick: () => setSelectedId(task.id) })}
            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={tasks.length === 0 ? '当前项目暂无分配任务' : '未找到匹配的任务'}>
              {query && <Button type="link" onClick={() => changeSearch('')}>清空搜索</Button>}
              {tasks.length === 0 && <p className="empty-hint">后续可通过“新建任务”关联已建立的可靠性模型。</p>}
            </Empty> }} />
          <div className="table-pagination"><span className="table-count" role="status">共 {filtered.length} 项任务{keyword ? ' · 已筛选' : ''}</span>
            <Pagination current={page} pageSize={pageSize} total={filtered.length} onChange={setPage} size="small" showSizeChanger={false}
              itemRender={(_, type, original) => type === 'prev' ? <ArrowLeftOutlined aria-hidden="true" /> : type === 'next' ? <ArrowRightOutlined aria-hidden="true" /> : original} />
          </div>
        </div>
      </section>
      <div className="overview-footer"><p className="selection-summary" aria-live="polite"><InfoCircleOutlined aria-hidden="true" />{selectedTask ? `已选择：${selectedTask.name}` : '请选择一项任务，再开始分配分析'}</p>
        <Space><Button type="primary" disabled={!selectedTask} onClick={() => selectedTask && onStart(selectedTask)}>开始分配分析</Button></Space>
      </div>
    </section>
  );
}
