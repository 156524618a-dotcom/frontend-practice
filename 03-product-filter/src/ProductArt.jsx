import React from 'react';

// 本地 SVG 装饰插画，不依赖外部图片服务。商品名称已在卡片正文中展示。
export default function ProductArt({ kind }) {
  let artwork;
  switch (kind) {
    case 'apple':
      artwork = <><path d="M80 48c-20-15-42 0-39 24 3 23 17 39 29 33 7-3 12-3 19 0 13 6 28-15 29-35 1-24-21-36-38-22" fill="#b74f40" /><path d="M80 48q-2-15 8-22" stroke="#71513a" strokeWidth="5" fill="none" /><path d="M84 35q19-20 29-10-8 17-29 10" fill="#6d8b50" /><path d="M55 59q-5 10-2 19" stroke="#df8974" strokeWidth="5" strokeLinecap="round" fill="none" /></>;
      break;
    case 'banana':
      artwork = <><path d="M42 46q26 50 69 5-4 58-46 52Q34 96 32 61z" fill="#e8c46a" /><path d="M43 58q26 41 60 6" fill="none" stroke="#b69345" strokeWidth="3" /><path d="m41 46 1-9-10 3 1 17M108 51l6-8" fill="none" stroke="#756341" strokeWidth="5" /></>;
      break;
    case 'orange':
      artwork = <><circle cx="79" cy="76" r="36" fill="#d58b42" /><path d="M80 40q-4-15 4-21" stroke="#6f6646" strokeWidth="4" fill="none" /><path d="M82 33q18-17 31-5-14 17-31 5" fill="#708e56" /><path d="M57 61q-7 7-6 17" stroke="#edb976" strokeWidth="5" strokeLinecap="round" fill="none" /><circle cx="97" cy="86" r="2" fill="#bb752e" /></>;
      break;
    case 'carrot':
      artwork = <g transform="rotate(28 80 70)"><path d="M61 49q18-15 38 0L80 118z" fill="#d78b48" /><path d="m68 68 12 4m-6 14 9 2" stroke="#b46f34" strokeWidth="3" strokeLinecap="round" /><path d="M79 44q-27-9-22-25 23 2 22 25m2 0q-4-32 9-32 11 17-9 32m2 1q17-29 28-14-3 16-28 14" fill="#71915d" /></g>;
      break;
    case 'tomato':
      artwork = <><ellipse cx="80" cy="79" rx="42" ry="32" fill="#bc5b48" /><path d="m79 56-25-9 17-4 5-18 9 19 22-3-14 13 6 11-19-6-13 9z" fill="#658353" /><path d="M54 72q-4 9 0 15" stroke="#df927b" strokeWidth="4" strokeLinecap="round" fill="none" /></>;
      break;
    case 'broccoli':
      artwork = <><path d="m72 76-9 40h36L86 76" fill="#98af78" /><path d="m80 98-22-27m23 22 20-25" stroke="#98af78" strokeWidth="8" fill="none" /><g fill="#5f7e52"><circle cx="52" cy="65" r="23" /><circle cx="78" cy="45" r="26" /><circle cx="106" cy="65" r="23" /><circle cx="79" cy="70" r="26" /></g><path d="M63 41q10-10 22-8M39 61q0-9 10-12" stroke="#86a170" strokeWidth="4" strokeLinecap="round" fill="none" /></>;
      break;
    case 'tea':
      artwork = <><rect x="68" y="17" width="24" height="14" rx="3" fill="#647d57" /><path d="M68 31v10L57 56v54q0 9 9 9h28q9 0 9-9V56L92 41V31" fill="#c7d3a6" stroke="#99af7a" strokeWidth="2" /><rect x="58" y="66" width="44" height="34" fill="#f7f4e9" /><path d="M80 90q-19-19 0-17 19-2 0 17" fill="#789568" /><path d="M80 88V77" stroke="#f7f4e9" strokeWidth="2" /></>;
      break;
    case 'milk':
      artwork = <><path d="m57 39 12-19h26l10 19v79H57z" fill="#f5f4ec" stroke="#c5cbbd" strokeWidth="2" /><path d="M57 39h48L95 20H69z" fill="#9cb4b0" /><path d="M69 20v19m-12 0 12-19" stroke="#6f9490" strokeWidth="2" /><rect x="58" y="69" width="46" height="34" fill="#8ca8a2" /><path d="M81 76q-17 18 0 20 17-2 0-20" fill="#f5f4ec" /></>;
      break;
    default:
      artwork = <><path d="M45 49h70l-7 66H52z" fill="#c1cba9" /><path d="M63 49V37a17 17 0 0 1 34 0v12" stroke="#75885b" strokeWidth="5" fill="none" /><path d="m67 79 9 9 19-21" stroke="#75885b" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></>;
  }
  return <svg viewBox="0 0 160 140" aria-hidden="true" focusable="false"><ellipse cx="80" cy="124" rx="38" ry="5" fill="#253d3409" />{artwork}</svg>;
}
