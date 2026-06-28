import { useEffect, useState } from 'react';
import { Card, Tabs, Form, Input, Button, Avatar, Row, Col, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import useAuthStore from '../../stores/useAuthStore';
import { userApi } from '../../api/user';
import type { UserProfile } from '../../api/user';

const Profile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const { userInfo, setUserInfo } = useAuthStore();

  useEffect(() => {
    userApi.getProfile().then((res) => {
      setUserProfile(res.data);
    }).catch(() => {
      // 兜底用 store 中已有的数据
      if (userInfo) {
        setUserProfile({
          userId: userInfo.userId,
          deptId: userInfo.deptId,
          userName: userInfo.userName,
          nickName: userInfo.nickName,
          userType: userInfo.userType,
          email: userInfo.email,
          phonenumber: userInfo.phonenumber,
          sex: userInfo.sex,
          avatar: userInfo.avatar,
          status: userInfo.status,
          remark: userInfo.remark,
        });
      }
    });
  }, [userInfo]);

  const profile = userProfile || userInfo;

  const handleSaveProfile = async () => {
    message.info('功能开发中');
  };

  const handleChangePassword = async (values: { oldPassword: string; newPassword: string }) => {
    message.info('功能开发中');
  };

  const tabItems = [
    {
      key: 'profile',
      label: '基本资料',
      children: (
        <Row justify="center" style={{ marginTop: 24 }}>
          <Col xs={24} sm={16} md={12} lg={8}>
            <Form
              layout="vertical"
              initialValues={{
                nickName: profile?.nickName,
                phonenumber: profile?.phonenumber,
                email: profile?.email,
                sex: profile?.sex,
              }}
              onFinish={handleSaveProfile}
            >
              <Form.Item label="用户昵称" name="nickName">
                <Input />
              </Form.Item>
              <Form.Item label="手机号码" name="phonenumber">
                <Input />
              </Form.Item>
              <Form.Item label="邮箱" name="email">
                <Input />
              </Form.Item>
              <Form.Item label="性别" name="sex">
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      ),
    },
    {
      key: 'password',
      label: '修改密码',
      children: (
        <Row justify="center" style={{ marginTop: 24 }}>
          <Col xs={24} sm={16} md={12} lg={8}>
            <Form layout="vertical" onFinish={handleChangePassword}>
              <Form.Item
                label="旧密码"
                name="oldPassword"
                rules={[{ required: true, message: '请输入旧密码' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="新密码"
                name="newPassword"
                rules={[{ required: true, message: '请输入新密码' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="确认密码"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: '请确认新密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  修改密码
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div>
      <Row justify="center" style={{ marginBottom: 24 }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Card>
            <Avatar
              size={80}
              src={profile?.avatar || undefined}
              icon={<UserOutlined />}
            />
            <h2 style={{ marginTop: 16, marginBottom: 4 }}>{profile?.nickName || '管理员'}</h2>
            <p style={{ color: '#999' }}>{profile?.userName || ''}</p>
          </Card>
        </Col>
      </Row>
      <Card>
        <Tabs items={tabItems} />
      </Card>
    </div>
  );
};

export default Profile;
