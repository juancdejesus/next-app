'use client';

import { Card, Col, Row, Statistic, Table, Button, Tag, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, EyeOutlined, DownloadOutlined, CloudUploadOutlined, FileTextOutlined, CheckSquareOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AppLayout from './components/AppLayout';

interface JobRecord {
  key: string;
  jobId: string;
  template: string;
  submitted: string;
  status: string;
}

const columns: ColumnsType<JobRecord> = [
  {
    title: 'Job ID',
    dataIndex: 'jobId',
    key: 'jobId',
  },
  {
    title: 'Template',
    dataIndex: 'template',
    key: 'template',
  },
  {
    title: 'Submitted',
    dataIndex: 'submitted',
    key: 'submitted',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      let color = '';
      if (status === 'In Progress') color = 'blue';
      if (status === 'Completed') color = 'green';
      if (status === 'Failed') color = 'red';
      if (status === 'Awaiting Approval') color = 'orange';
      return <Tag color={color}>{status}</Tag>;
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    render: () => (
      <Space size="middle">
        <Button type="text" icon={<EyeOutlined />} />
        <Button type="text" icon={<DownloadOutlined />} />
      </Space>
    ),
  },
];

const data: JobRecord[] = [
  {
    key: '1',
    jobId: 'JOB-00124',
    template: 'Client Matter Update',
    submitted: '2023-10-27 14:30',
    status: 'In Progress',
  },
  {
    key: '2',
    jobId: 'JOB-00123',
    template: 'Vendor Rate Change',
    submitted: '2023-10-27 11:15',
    status: 'Completed',
  },
  {
    key: '3',
    jobId: 'JOB-00122',
    template: 'New GL Accounts',
    submitted: '2023-10-26 09:00',
    status: 'Failed',
  },
  {
    key: '4',
    jobId: 'JOB-00121',
    template: 'Employee Cost Center',
    submitted: '2023-10-25 17:45',
    status: 'Awaiting Approval',
  },
  {
    key: '5',
    jobId: 'JOB-00120',
    template: 'Client Address Bulk',
    submitted: '2023-10-25 16:20',
    status: 'Completed',
  },
];

export default function Home() {
  return (
    <AppLayout>
      <div>
        <h1 style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 24 }}>Dashboard</h1>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="My Active Jobs"
                value={8}
                valueStyle={{ color: '#3f8600' }}
                suffix={
                  <span style={{ fontSize: 16 }}>
                    <ArrowUpOutlined /> 5.2%
                  </span>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Pending Approval"
                value={3}
                valueStyle={{ color: '#fa8c16' }}
                suffix={<span style={{ fontSize: 14, color: '#fa8c16' }}>Warning</span>}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Completed This Month"
                value={45}
                valueStyle={{ color: '#1677ff' }}
                suffix={
                  <span style={{ fontSize: 16 }}>
                    <ArrowUpOutlined /> 15.0%
                  </span>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Failed Jobs"
                value={1}
                valueStyle={{ color: '#cf1322' }}
                suffix={
                  <span style={{ fontSize: 16 }}>
                    <ArrowDownOutlined /> 0.5%
                  </span>
                }
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={16}>
            <Card
              title="Recent Jobs"
              extra={<a href="#">View All Jobs</a>}
            >
              <Table columns={columns} dataSource={data} pagination={false} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Quick Actions">
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Button type="primary" icon={<CloudUploadOutlined />} block size="large">
                  Upload New File
                </Button>
                <Button icon={<FileTextOutlined />} block size="large">
                  Download Templates
                </Button>
                <Button
                  icon={<CheckSquareOutlined />}
                  block
                  size="large"
                  style={{
                    borderColor: '#fa8c16',
                    color: '#fa8c16',
                  }}
                >
                  View Approval Queue
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </AppLayout>
  );
}
