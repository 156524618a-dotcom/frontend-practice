// 本地模拟数据：价格仅用于学习演示，不代表真实售价。
// id 用作 React 列表的 key，新增商品时请使用新的唯一 id。
export const PRODUCTS = [
  { id: 'apple', name: '红富士苹果', englishName: 'Apple', category: '水果', price: 8.8, unit: '500g', stocked: true, note: '清甜脆爽，给日常一点新鲜。' },
  { id: 'banana', name: '香甜香蕉', englishName: 'Banana', category: '水果', price: 6.5, unit: '500g', stocked: false, note: '软糯香甜，早餐好搭档。' },
  { id: 'orange', name: '鲜橙', englishName: 'Orange', category: '水果', price: 12, unit: '500g', stocked: true, note: '饱满多汁，享受明亮的滋味。' },
  { id: 'carrot', name: '胡萝卜', englishName: 'Carrot', category: '蔬菜', price: 4.8, unit: '500g', stocked: true, note: '一抹橙色，让餐桌更丰富。' },
  { id: 'tomato', name: '新鲜番茄', englishName: 'Tomato', category: '蔬菜', price: 7.5, unit: '500g', stocked: false, note: '酸甜鲜美，家常菜的好伙伴。' },
  { id: 'broccoli', name: '西兰花', englishName: 'Broccoli', category: '蔬菜', price: 9.9, unit: '份', stocked: true, note: '一朵小小的绿色，装点一餐。' },
  { id: 'tea', name: '茉莉绿茶', englishName: 'Jasmine Tea', category: '饮品', price: 5.9, unit: '瓶', stocked: true, note: '淡淡花香，给自己片刻放松。' },
  { id: 'milk', name: '纯牛奶', englishName: 'Milk', category: '饮品', price: 4.5, unit: '盒', stocked: true, note: '简单醇香，开启新的一天。' },
];

// 分类由数据生成，增加新分类时不需要手动改分类按钮。
export const CATEGORIES = ['全部', ...new Set(PRODUCTS.map((product) => product.category))];

// 三个条件同时满足，商品才会显示。筛选不会改动原始数组。
export function filterProducts(products, query, category, onlyInStock) {
  const keyword = query.trim().toLowerCase();
  return products.filter((product) => {
    const matchesQuery = `${product.name} ${product.englishName}`.toLowerCase().includes(keyword);
    const matchesCategory = category === '全部' || product.category === category;
    const matchesStock = !onlyInStock || product.stocked;
    return matchesQuery && matchesCategory && matchesStock;
  });
}
