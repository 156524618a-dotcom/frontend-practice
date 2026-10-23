import React, { useState } from 'react';

// 改写自 React「快速入门 / 更新界面」的计数按钮。
// 两个组件分别保存自己的 state，互不影响。
function BasicCounter() {
  const [count, setCount] = useState(0);

  return (
    <section className="experiment basic" aria-labelledby="basic-title">
      <div className="panel-top"><span className="step">01 / BEFORE</span><span className="badge">基础版本</span></div>
      <h2 id="basic-title">从一次点击开始</h2>
      <p className="panel-description">复现文档中的核心行为：点击按钮，让数字加一。</p>
      <div className="basic-stage">
        <span className="count-label">已点击次数</span>
        <output className="basic-count" aria-label="基础版计数" aria-live="polite">{count}</output>
        <button className="basic-button" onClick={() => setCount((previous) => previous + 1)}>点击加一 <span aria-hidden="true">↗</span></button>
      </div>
      <div className="code-note"><span className="code-dot" aria-hidden="true" /><code>useState(0)</code><span>给组件一份记忆</span></div>
    </section>
  );
}

function ImprovedCounter() {
  // count 是当前值；setCount 用于通知 React 更新状态和界面。
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('准备好了？试着点击「加一」。');
  // 从已有状态直接计算条件，不需要额外创建一份 state。
  const isZero = count === 0;

  function handleIncrement() {
    setCount((previous) => previous + 1);
    setMessage('已加一，继续观察数字的变化。');
  }

  function handleDecrement() {
    // 按钮禁用之外，再在更新逻辑中保证数字不小于零。
    setCount((previous) => Math.max(0, previous - 1));
    setMessage('已减一；数字为 0 时不能继续减少。');
  }

  function handleReset() {
    setCount(0);
    setMessage('已重置，回到起点也可以重新开始。');
  }

  return (
    <section className="experiment improved" aria-labelledby="improved-title">
      <div className="panel-top"><span className="step">02 / AFTER</span><span className="badge badge-green">我的修改版</span></div>
      <h2 id="improved-title">多一点自己的想法</h2>
      <p className="panel-description">加入减一、重置和边界限制，让交互更完整。</p>
      <div className="counter-stage">
        <div className="stage-heading"><span className="count-label">当前计数</span><span className="state-label">{isZero ? '从零开始' : '正在累积'}</span></div>
        <output className="main-count" aria-label="修改版计数" aria-live="polite">{count}</output>
        <div className="controls">
          <button className="subtract-button" onClick={handleDecrement} disabled={isZero} aria-describedby="boundary-note"><span aria-hidden="true">−</span>减一</button>
          <button className="add-button" onClick={handleIncrement}><span aria-hidden="true">＋</span>加一</button>
        </div>
        <button className="reset-button" onClick={handleReset}><span aria-hidden="true">↺</span>重置计数</button>
      </div>
      <div className="feedback" role="status">{message}</div>
      <p className="boundary-note" id="boundary-note"><span aria-hidden="true">◎</span>{isZero ? '已到下限：「减一」暂不可用。' : '计数下限为 0，两个版本的数字互不影响。'}</p>
    </section>
  );
}

export default function App() {
  return (
    <div className="page">
      <header className="site-header"><a className="brand" href="#main"><span aria-hidden="true">&lt;/&gt;</span>前端学习手记</a><span className="edition">LEARNING BY DOING / 002</span></header>
      <main id="main">
        <div className="intro"><span className="eyebrow">REACT · STATE & EVENTS</span><h1>计数器实验室<span>。</span></h1><p>运行一个例子，做一点修改，理解每一次变化。</p></div>
        <div className="experiments"><BasicCounter /><ImprovedCounter /></div>
        <section className="learning" aria-labelledby="learning-title">
          <div className="learning-heading"><h2 id="learning-title">这次，留意三个知识点</h2><span>边点边想，更容易记住</span></div>
          <div className="learning-grid">
            <div><span className="concept">01 · 状态</span><h3><code>useState</code></h3><p>保存当前数字。更新状态后，React 会更新页面。</p></div>
            <div><span className="concept">02 · 事件</span><h3><code>onClick</code></h3><p>把处理函数交给按钮，点击时才执行。</p></div>
            <div><span className="concept">03 · 条件</span><h3><code>disabled</code></h3><p>根据数字决定按钮能否使用，守住零的边界。</p></div>
          </div>
        </section>
        <p className="challenge"><span>动手挑战</span>打开 <code>src/App.jsx</code>，试着把「加一」改成「加二」。</p>
      </main>
      <footer className="site-footer"><span>小步练习，每一步都算数。</span><a href="https://zh-hans.react.dev/learn#updating-the-screen" target="_blank" rel="noopener noreferrer">示例来源：React 快速入门 <span aria-hidden="true">↗</span></a></footer>
    </div>
  );
}
