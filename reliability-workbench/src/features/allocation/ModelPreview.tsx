import { useRef, useState, type PointerEvent } from 'react';
import { Button, Empty, Space } from 'antd';
import { ArrowRightOutlined, CompressOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { BASELINE_HOURS, type DemoModel } from '../../data/demoModels';

export function ModelPreview({ model }: { model?: DemoModel }) {
  const [zoom, setZoom] = useState(100);
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || event.pointerType !== 'mouse') return;
    const canvas = event.currentTarget;
    if (event.target === canvas) return;
    drag.current = { x: event.clientX, y: event.clientY, left: canvas.scrollLeft, top: canvas.scrollTop };
    canvas.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const { x, y, left, top } = drag.current;
    event.currentTarget.scrollTo(left + x - event.clientX, top + y - event.clientY);
  }

  function resetView() {
    setZoom(100);
    viewport.current?.scrollTo(0, 0);
  }

  return <section className="model-preview" aria-labelledby="model-preview-title">
    <h3 id="model-preview-title">模型预览{model ? `：${model.name}` : ''}</h3>
    {model ? <>
      <div className="preview-toolbar">
        <span>{model.type}可靠性框图 · {BASELINE_HOURS} 小时基准</span>
        <Space size={6}>
          <Button size="small" aria-label="缩小模型" icon={<ZoomOutOutlined />} disabled={zoom === 75} onClick={() => setZoom(zoom - 25)} />
          <span className="preview-scale" role="status">{zoom}%</span>
          <Button size="small" aria-label="放大模型" icon={<ZoomInOutlined />} disabled={zoom === 225} onClick={() => setZoom(zoom + 25)} />
          <Button size="small" aria-label="重置模型视图" icon={<CompressOutlined />} onClick={resetView} />
        </Space>
      </div>
      <div className="model-viewport" ref={viewport} tabIndex={0} role="region" aria-label="可靠性框图，可拖动或用方向键滚动"
        onPointerDown={startDrag} onPointerMove={moveDrag} onLostPointerCapture={() => { drag.current = null; }}>
        <div className="model-chain" style={{ fontSize: `${zoom / 100}rem` }}>
          {model.components.map((component, index) => <div className="model-chain-item" key={component.id}>
            {index > 0 && <span className="model-connector" aria-hidden="true"><ArrowRightOutlined /></span>}
            <div className="model-block"><strong>{component.name}</strong><span>R = {component.baseline.toFixed(4)}</span></div>
          </div>)}
        </div>
      </div>
      <p className="model-preview-hint">放大后拖动或滚动查看框图。</p>
    </> : <div className="model-preview-empty"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="从模型列表选择一个模型" /></div>}
  </section>;
}
