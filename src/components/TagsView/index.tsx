import { useCallback, useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, Dropdown } from 'antd';
import {
  ReloadOutlined,
  CloseOutlined,
  ColumnWidthOutlined,
  MinusOutlined,
  LeftOutlined,
  RightOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import useTagsStore from '../../stores/useTagsStore';

const pathTitleMap: Record<string, string> = {
  '/': '首页',
  '/profile': '个人中心',
  '/user': '用户管理',
  '/role': '角色管理',
};

const TagsView = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { visitedViews, addView, delView, delOthersViews, delAllViews } =
    useTagsStore();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const navWrapRef = useRef<HTMLElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const checkScroll = useCallback(() => {
    const el = containerRef.current?.querySelector('.ant-tabs-nav-wrap') as HTMLElement | null;
    if (!el) return;
    navWrapRef.current = el;
    const gap = 2;
    setCanScrollLeft(el.scrollLeft > gap);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - gap);
  }, []);

  // 监听 tabs 数量变化，检测是否需要滚动箭头
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // 初始检测稍延迟，等 Tabs 内部 DOM 渲染完
    const t = setTimeout(checkScroll, 0);
    const ro = new ResizeObserver(checkScroll);
    ro.observe(container);
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, [visitedViews, checkScroll]);

  // 监听 tab bar 滚动
  useEffect(() => {
    const el = navWrapRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    return () => el.removeEventListener('scroll', checkScroll);
  });

  // 全屏状态监听
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const scrollLeft = () => {
    navWrapRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    navWrapRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  useEffect(() => {
    const title = pathTitleMap[pathname] || pathname;
    addView({ path: pathname, title, affix: pathname === '/' });
  }, [pathname, addView]);

  const handleTabChange = useCallback(
    (key: string) => {
      navigate(key);
    },
    [navigate],
  );

  const handleTabRemove = useCallback(
    (targetPath: string) => {
      const idx = visitedViews.findIndex((v) => v.path === targetPath);
      if (idx === -1) return;

      delView(targetPath);

      if (pathname === targetPath) {
        const nextIdx = idx >= visitedViews.length - 1 ? idx - 1 : idx + 1;
        const next = visitedViews[nextIdx];
        if (next) navigate(next.path);
      }
    },
    [pathname, visitedViews, delView, navigate],
  );

  const contextMenuItems = useCallback(
    (targetPath: string): MenuProps['items'] => [
      {
        key: 'refresh',
        icon: <ReloadOutlined />,
        label: <span style={{ fontSize: 13 }}>刷新页面</span>,
        onClick: () => navigate(targetPath, { replace: true }),
      },
      { type: 'divider' },
      {
        key: 'close-current',
        icon: <CloseOutlined />,
        label: <span style={{ fontSize: 13 }}>关闭当前</span>,
        onClick: () => handleTabRemove(targetPath),
      },
      {
        key: 'close-others',
        icon: <ColumnWidthOutlined />,
        label: <span style={{ fontSize: 13 }}>关闭其他</span>,
        onClick: () => delOthersViews(targetPath),
      },
      {
        key: 'close-all',
        icon: <MinusOutlined />,
        label: <span style={{ fontSize: 13 }}>关闭所有</span>,
        onClick: () => {
          delAllViews();
          navigate('/');
        },
      },
    ],
    [handleTabRemove, delOthersViews, delAllViews, navigate],
  );

  const items = visitedViews.map((view) => ({
    key: view.path,
    label: (
      <Dropdown menu={{ items: contextMenuItems(view.path) }} trigger={['contextMenu']}>
        <span style={{ display: 'inline-block', padding: '0 4px' }}>{view.title}</span>
      </Dropdown>
    ),
    closable: !view.affix,
  }));

  const btnStyle = (disabled?: boolean): React.CSSProperties => ({
    cursor: disabled ? 'default' : 'pointer',
    border: 'none',
    background: 'none',
    padding: 0,
    color: disabled ? '#ccc' : '#666',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    height: 32,
    width: 32,
    justifyContent: 'center',
  });

  const tabActiveBg = '#1890ff';

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        borderTop: '1px solid #f0f0f0',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
      }}
    >
      <style>{`
        .tags-view-tabs.ant-tabs-editable-card .ant-tabs-tab.ant-tabs-tab-active {
          background: ${tabActiveBg} !important;
          border-color: ${tabActiveBg} !important;
        }
        .tags-view-tabs.ant-tabs-editable-card .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #fff !important;
        }
        .tags-view-tabs.ant-tabs-editable-card .ant-tabs-tab.ant-tabs-tab-active .anticon-close {
          color: #fff !important;
        }
      `}</style>
      <button
        style={{
          ...btnStyle(!canScrollLeft),
          borderLeft: '1px solid #f0f0f0',
          borderRight: '1px solid #f0f0f0',
        }}
        onClick={canScrollLeft ? scrollLeft : undefined}
      >
        <LeftOutlined style={{ fontSize: 12 }} />
      </button>
      <Tabs
        className="tags-view-tabs"
        type="editable-card"
        hideAdd
        activeKey={pathname}
        items={items}
        onChange={handleTabChange}
        onEdit={(targetKey) => {
          if (typeof targetKey === 'string') handleTabRemove(targetKey);
        }}
        size="small"
        style={{ flex: 1, marginBottom: 0, overflow: 'hidden' }}
        tabBarStyle={{ marginBottom: 0 }}
      />
      <button
        style={{
          ...btnStyle(!canScrollRight),
          borderLeft: '1px solid #f0f0f0',
          borderRight: '1px solid #f0f0f0',
        }}
        onClick={canScrollRight ? scrollRight : undefined}
      >
        <RightOutlined style={{ fontSize: 12 }} />
      </button>
      <span style={{ width: 1, background: '#f0f0f0', height: 20, flexShrink: 0 }} />
      <button style={btnStyle(false)} onClick={toggleFullscreen} title={isFullscreen ? '退出全屏' : '全屏'}>
        {isFullscreen ? <FullscreenExitOutlined style={{ fontSize: 14 }} /> : <FullscreenOutlined style={{ fontSize: 14 }} />}
      </button>
    </div>
  );
};

export default TagsView;
