import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb as AntBreadcrumb } from 'antd';

const pathTitleMap: Record<string, string> = {
  '/': '首页',
  '/profile': '个人中心',
  '/user': '用户管理',
  '/role': '角色管理',
};

const Breadcrumb = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const items = useMemo(() => {
    const segments = pathname === '/' ? ['/'] : pathname.split('/');
    const breadcrumbs: { title: string; path: string }[] = [];

    let accumulated = '';
    for (const seg of segments) {
      if (!seg) continue;
      accumulated = accumulated === '/' ? `/${seg}` : `${accumulated}/${seg}`;
      const title = pathTitleMap[accumulated];
      if (title) {
        breadcrumbs.push({ title, path: accumulated });
      }
    }

    // 如果第一条不是首页，前置补上首页
    if (breadcrumbs.length === 0 || breadcrumbs[0].path !== '/') {
      breadcrumbs.unshift({ title: '首页', path: '/' });
    }

    return breadcrumbs.map((item, index) => ({
      title:
        index < breadcrumbs.length - 1 ? (
          <a onClick={() => navigate(item.path)}>{item.title}</a>
        ) : (
          <span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>{item.title}</span>
        ),
    }));
  }, [pathname, navigate]);

  return <AntBreadcrumb items={items} />;
};

export default Breadcrumb;
