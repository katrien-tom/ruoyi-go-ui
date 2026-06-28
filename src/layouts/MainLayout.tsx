import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu, theme, Spin, Dropdown, Avatar, Space } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  LogoutOutlined,
  ProfileOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

import useAuthStore from '../stores/useAuthStore';
import Breadcrumb from '../components/Breadcrumb';
import TagsView from '../components/TagsView';

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: '首页',
  },
  {
    key: '/user',
    icon: <UserOutlined />,
    label: '用户管理',
  },
  {
    key: '/role',
    icon: <TeamOutlined />,
    label: '角色管理',
  },
];

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const { token, userInfo, fetchUserInfo, logout } = useAuthStore();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (token && !userInfo) {
      fetchUserInfo().finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [token, userInfo, fetchUserInfo]);

  if (!ready) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout hasSider style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsed={collapsed}
        theme="dark"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'sticky',
          insetInlineStart: 0,
          top: 0,
          scrollbarWidth: 'thin',
          scrollbarGutter: 'stable',
        }}
      >
        <div
          style={{
            height: 48,
            margin: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              color: '#fff',
              fontSize: collapsed ? 14 : 18,
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {collapsed ? 'RuoYi' : 'RuoYi-Go'}
          </span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/']}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout style={{ background: '#f0f2f5' }}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Header
            style={{
              padding: '0 16px',
              background: colorBgContainer,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Space>
              <span
                onClick={() => setCollapsed(!collapsed)}
                style={{ cursor: 'pointer', fontSize: 16 }}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </span>
              <Breadcrumb />
            </Space>
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    icon: <ProfileOutlined />,
                    label: '个人中心',
                    onClick: () => navigate('/profile'),
                  },
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: '退出登录',
                    onClick: () => {
                      logout();
                      navigate('/login');
                    },
                  },
                ],
              }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  size="small"
                  src={userInfo?.avatar || undefined}
                  icon={<UserOutlined />}
                />
                <span>{userInfo?.nickName || '管理员'}</span>
              </Space>
            </Dropdown>
          </Header>
          <TagsView />
        </div>
        <Content
          style={{
            margin: '12px 16px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
