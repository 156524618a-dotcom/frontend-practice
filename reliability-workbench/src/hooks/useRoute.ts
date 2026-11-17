import { useEffect, useState } from 'react';
import { routeFromHash, type RouteKey } from '../domain/types';

// 使用 hash 保存当前模块，支持刷新、浏览器前进和后退。
export function useRoute() {
  const [route, setRoute] = useState<RouteKey>(routeFromHash);
  useEffect(() => {
    const onChange = () => setRoute(routeFromHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  function navigate(next: RouteKey) {
    window.location.hash = `/${next}`;
    setRoute(next);
  }

  return { route, navigate };
}
