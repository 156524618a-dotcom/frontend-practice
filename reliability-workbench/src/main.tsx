import React from 'react';
import { createRoot } from 'react-dom/client';
import { App as AntApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import App from './App';
import 'antd/dist/reset.css';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} theme={{
      token: { colorPrimary: '#087bc7', colorText: '#253748', colorBgLayout: '#fff', borderRadius: 6,
        fontFamily: '"Microsoft YaHei", "Segoe UI", sans-serif', fontSize: 14, controlHeight: 36 },
      components: {
        Table: { headerBg: '#f2f7fb', headerColor: '#344a5c', rowSelectedBg: '#e6f4ff', rowSelectedHoverBg: '#d9efff', cellPaddingBlock: 12 },
        Menu: { darkItemBg: '#0674bb', darkSubMenuItemBg: '#0674bb', darkItemColor: '#f3f9ff',
          darkItemSelectedBg: '#ffffff24', darkItemSelectedColor: '#ffe06c', itemHeight: 34, subMenuItemSelectedColor: '#ffe06c' },
      },
    }}><AntApp><App /></AntApp></ConfigProvider>
  </React.StrictMode>,
);
