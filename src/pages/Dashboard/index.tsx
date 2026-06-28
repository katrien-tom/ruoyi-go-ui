import { Card, Col, Row } from 'antd';

const Dashboard = () => {
  return (
    <div>
      <h2>首页</h2>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>用户总数</Card>
        </Col>
        <Col span={6}>
          <Card>在线用户</Card>
        </Col>
        <Col span={6}>
          <Card>角色数量</Card>
        </Col>
        <Col span={6}>
          <Card>操作日志</Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
