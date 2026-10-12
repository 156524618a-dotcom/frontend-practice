import React, { useState } from 'react';

// 先修改这里，再把这张名片变成你自己的。
const profile = {
  name: '前端学习者',
  greeting: '你好，很高兴认识你。',
  introduction: '正在学习把想法变成网页。从一张小小的名片开始，记录每一次尝试和进步。',
  interests: ['网页设计', '编程探索', '记录生活'],
  // 填写完整个人主页地址，例如 https://github.com/你的用户名。
  githubUrl: 'https://github.com/156524618a-dotcom',
  goals: [
    { title: '打好基础', description: '认识 HTML、CSS 和 JavaScript，写出清晰的页面。' },
    { title: '学会 React', description: '理解组件与状态，让页面能够响应点击。' },
    { title: '完成小作品', description: '把练习上传到 GitHub，慢慢积累自己的作品。' },
  ],
};

function ArrowIcon({ direction = 'right' }) {
  return (
    <svg className={`arrow arrow--${direction}`} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InterestTags({ interests }) {
  return <ul className="tags" aria-label="我的兴趣">{interests.map((interest) => <li key={interest}>{interest}</li>)}</ul>;
}

export default function App() {
  // state 保存展开状态；更新 state 后，React 会更新对应的界面。
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="page">
      <header className="site-header">
        <a className="brand" href="#profile"><span className="brand-mark" aria-hidden="true">&lt;/&gt;</span>我的学习手记</a>
        <span className="edition">FIRST PROJECT / 001</span>
      </header>

      <main id="profile">
        <div className="intro"><p className="eyebrow">A LITTLE ABOUT ME</p><h1>每一步，都算数<span>。</span></h1><p>我的第一张前端学习名片</p></div>

        <article className="profile-card" aria-labelledby="profile-name">
          <div className="card-cover"><span className="cover-caption">Hello, world.</span><span className="cover-symbol" aria-hidden="true">✳</span></div>
          <div className="card-body">
            <div className="identity-row"><img className="avatar" src={`${import.meta.env.BASE_URL}avatar.svg`} alt="戴眼镜的学习者插画头像" width="88" height="88" /><span className="status"><span aria-hidden="true" />正在学习中</span></div>
            <p className="role">FRONTEND EXPLORER</p>
            <h2 id="profile-name">{profile.name}</h2>
            <p className="greeting">{profile.greeting}</p>
            <p className="description">{profile.introduction}</p>
            <InterestTags interests={profile.interests} />

            <div className="goals-section">
              <button className="goals-toggle" aria-expanded={isExpanded} aria-controls="learning-goals" onClick={() => setIsExpanded((previous) => !previous)}>
                <span><span className="section-number">01</span>我的学习目标</span><span className="toggle-label">{isExpanded ? '收起' : '展开'}<ArrowIcon direction={isExpanded ? 'up' : 'down'} /></span>
              </button>
              <div id="learning-goals" hidden={!isExpanded}>
                <ol className="goals-list">{profile.goals.map((goal, index) => <li key={goal.title}><span className="goal-index">0{index + 1}</span><div><h3>{goal.title}</h3><p>{goal.description}</p></div></li>)}</ol>
              </div>
            </div>

            {profile.githubUrl ? <a className="github-link" href={profile.githubUrl} target="_blank" rel="noopener noreferrer">访问我的 GitHub<ArrowIcon /></a> : <a className="github-link" href="https://github.com/" target="_blank" rel="noopener noreferrer">探索 GitHub<ArrowIcon /></a>}
            <p className="card-note">保持好奇，慢慢生长。</p>
          </div>
        </article>
        <p className="below-card"><span aria-hidden="true">—</span> 从第一个组件，走向更多可能 <span aria-hidden="true">—</span></p>
      </main>

      <footer className="site-footer"><span>用 React 构建 · 用热爱坚持</span><span>学习旅程 / 第 01 站</span></footer>
    </div>
  );
}
