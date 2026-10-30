import React, { useState } from 'react';
import { PRODUCTS, CATEGORIES, filterProducts } from './products.js';
import ProductArt from './ProductArt.jsx';

const priceFormatter = new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 2 });

function SearchIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.6" /><path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
}

function BasicList({ products }) {
  return (
    <aside className="basic-panel" aria-labelledby="basic-title">
      <span className="eyebrow">01 / BEFORE</span>
      <h2 id="basic-title">先把数据展示出来</h2>
      <p className="aside-description">基础版 · 只展示，不筛选</p>
      <ul className="basic-list">{products.map((product) => <li key={product.id}><div><span className={!product.stocked ? 'unavailable-name' : ''}>{product.name}</span><small>{product.category} · {product.stocked ? '有库存' : '暂时缺货'}</small></div><span className="basic-price">{priceFormatter.format(product.price)}</span></li>)}</ul>
      <div className="aside-note"><code>products.map(...)</code><p>一份数组，生成一组列表。<br />每项使用唯一的 <code>id</code> 作为 <code>key</code>。</p></div>
      <div className="sample-note"><span aria-hidden="true">◎</span> 本地模拟数据，价格仅供演示。</div>
    </aside>
  );
}

function ProductCard({ product }) {
  return (
    <article className="product-card" aria-label={product.name}>
      <div className={`product-art art-${product.category}`}><span className={`stock-badge ${product.stocked ? '' : 'out-of-stock'}`}>{product.stocked ? '有库存' : '暂时缺货'}</span><ProductArt kind={product.id} /></div>
      <div className="product-info"><p className="product-category">{product.category} / {product.englishName}</p><h3>{product.name}</h3><p className="product-note">{product.note}</p><p className="product-price">{priceFormatter.format(product.price)}<span> / {product.unit}</span></p></div>
    </article>
  );
}

function FilterBar({ query, setQuery, category, setCategory, onlyInStock, setOnlyInStock, onReset }) {
  return (
    <div className="filter-bar">
      <label className="search-label" htmlFor="product-search">搜索商品</label>
      <div className="search-row"><div className="search-field"><SearchIcon /><input id="product-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索商品名称，如苹果 / apple" autoComplete="off" />{query && <button className="clear-search" onClick={() => setQuery('')} aria-label="清空搜索">×</button>}</div><button className="reset-button" onClick={onReset}>重置筛选</button></div>
      <div className="filter-options"><div className="category-buttons" role="group" aria-label="商品分类">{CATEGORIES.map((item) => <button key={item} aria-pressed={category === item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}<span>{item === '全部' ? PRODUCTS.length : PRODUCTS.filter((product) => product.category === item).length}</span></button>)}</div><label className="stock-toggle"><input type="checkbox" checked={onlyInStock} onChange={(event) => setOnlyInStock(event.target.checked)} />仅看有库存</label></div>
    </div>
  );
}

export default function App() {
  // 只存储用户能修改的三个条件。结果列表从这些条件计算得出。
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const visibleProducts = filterProducts(PRODUCTS, query, category, onlyInStock);

  function resetFilters() {
    setQuery('');
    setCategory('全部');
    setOnlyInStock(false);
  }

  return (
    <div className="page">
      <header className="site-header"><a className="brand" href="#main"><span aria-hidden="true">&lt;/&gt;</span>前端学习手记</a><span className="edition">LEARNING BY DOING / 003</span></header>
      <main id="main">
        <div className="intro"><div><span className="eyebrow">REACT · LISTS & FILTERS</span><h1>把喜欢的，筛选出来<span>。</span></h1><p>从一份商品清单，走向可以互动的小小市集。</p></div><span className="exercise-label">练习 03<span>商品列表与筛选</span></span></div>
        <div className="workspace"><BasicList products={PRODUCTS} /><section className="catalog" aria-labelledby="catalog-title">
          <div className="catalog-heading"><div><span className="eyebrow">02 / AFTER</span><h2 id="catalog-title">日常好物，小小市集</h2></div><span className="version-badge">我的修改版</span></div>
          <FilterBar query={query} setQuery={setQuery} category={category} setCategory={setCategory} onlyInStock={onlyInStock} setOnlyInStock={setOnlyInStock} onReset={resetFilters} />
          <div className="results-heading"><p role="status">找到 <strong>{visibleProducts.length}</strong> 件商品<span> / 共 {PRODUCTS.length} 件</span></p><span>{category === '全部' ? '全部分类' : category}{onlyInStock ? ' · 仅看有库存' : ''}</span></div>
          {visibleProducts.length > 0 ? <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><div className="empty-icon"><SearchIcon /></div><h3>还没找到这件好物</h3><p>试试其他关键词，或放宽分类和库存条件。</p><button className="restore-button" onClick={resetFilters}>清除条件，查看全部商品</button></div>}
        </section></div>
        <section className="learning" aria-labelledby="learning-title"><h2 id="learning-title">这次，理解数据如何变成界面</h2><div className="learning-grid"><div><span>01 / 记录输入</span><h3><code>useState</code></h3><p>保存搜索词、分类与库存开关。</p></div><div><span>02 / 筛选数据</span><h3><code>filter()</code></h3><p>保留同时满足三个条件的商品。</p></div><div><span>03 / 渲染列表</span><h3><code>map() + key</code></h3><p>将筛选结果转换为独立商品卡片。</p></div></div></section>
        <p className="challenge"><span>动手挑战</span>打开 <code>src/products.js</code>，添加一件你喜欢的商品。</p>
      </main>
      <footer className="site-footer"><span>小步练习，每一步都算数。</span><div><a href="https://zh-hans.react.dev/learn#rendering-lists" target="_blank" rel="noopener noreferrer">React 列表渲染 ↗</a><a href="https://zh-hans.react.dev/learn/thinking-in-react" target="_blank" rel="noopener noreferrer">React 哲学 ↗</a></div></footer>
    </div>
  );
}
