import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Space } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import useAuthStore from '../../stores/useAuthStore';
import { authApi } from '../../api/auth';
import type { LoginRequest } from '../../api/auth';

const Login = () => {
  const navigate = useNavigate();
  const { setToken, fetchUserInfo } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [captchaImg, setCaptchaImg] = useState<string | null>(null);
  const [captchaUuid, setCaptchaUuid] = useState('');
  const [form] = Form.useForm();

  const fetchCaptcha = async () => {
    try {
      const res = await authApi.captcha();
      setCaptchaImg(res.data.img);
      setCaptchaUuid(res.data.uuid);
    } catch {
      // handled by interceptor
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    try {
      const res = await authApi.login({
        ...values,
        uuid: captchaUuid,
      });
      setToken(res.data.token);
      await fetchUserInfo();
      message.success('登录成功');
      navigate('/', { replace: true });
    } catch {
      fetchCaptcha();
      form.setFieldValue('code', '');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f0f2f5',
      }}
    >
      <Card title="RuoYi-Go 管理后台" style={{ width: 400 }}>
        <Form form={form} onFinish={onFinish} size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item
            name="code"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <Space style={{ display: 'flex' }} align="start">
              <Input
                prefix={<SafetyCertificateOutlined />}
                placeholder="验证码"
              />
              {captchaImg && (
                <img
                  src={captchaImg}
                  alt="验证码"
                  onClick={fetchCaptcha}
                  style={{
                    height: 40,
                    cursor: 'pointer',
                    border: '1px solid #d9d9d9',
                    borderRadius: 4,
                  }}
                />
              )}
            </Space>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
