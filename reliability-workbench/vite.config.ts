import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    rolldownOptions: {
      onLog(level, log, handler) {
        // 本项目是纯浏览器应用，不使用服务端组件；只忽略依赖中的此类指令提示。
        if (log.code === 'MODULE_LEVEL_DIRECTIVE' && log.message.includes('use client')) return;
        handler(level, log);
      },
    },
  },
});
