'use client';

import { useState, useEffect } from 'react';
import { Card, Table, Spin, Alert, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AppLayout from '../components/AppLayout';

interface ItemData {
  id: string;
  name: string;
  data?: {
    color?: string;
    capacity?: string;
    price?: number;
    generation?: string;
    year?: number;
    'CPU model'?: string;
    'Hard disk size'?: string;
    'Strap Colour'?: string;
    'Case Size'?: string;
    Description?: string;
    'Capacity GB'?: number;
    [key: string]: any;
  } | null;
}

export default function ItemsPage() {
  const [items, setItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://api.restful-api.dev/objects');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const columns: ColumnsType<ItemData> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Color',
      key: 'color',
      width: 120,
      render: (_, record) => {
        const color = record.data?.color;
        return color ? (
          <Tag color={color.toLowerCase() === 'black' ? 'default' : color.toLowerCase()}>
            {color}
          </Tag>
        ) : (
          <span style={{ color: '#999' }}>-</span>
        );
      },
    },
    {
      title: 'Capacity',
      key: 'capacity',
      width: 120,
      render: (_, record) => {
        const capacity = record.data?.capacity || record.data?.['Capacity GB'];
        return capacity ? (
          <span>{capacity}</span>
        ) : (
          <span style={{ color: '#999' }}>-</span>
        );
      },
    },
    {
      title: 'Price',
      key: 'price',
      width: 120,
      render: (_, record) => {
        const price = record.data?.price;
        return price ? (
          <span style={{ color: '#52c41a', fontWeight: 500 }}>${price}</span>
        ) : (
          <span style={{ color: '#999' }}>-</span>
        );
      },
    },
    {
      title: 'Additional Info',
      key: 'info',
      render: (_, record) => {
        if (!record.data) return <span style={{ color: '#999' }}>No data available</span>;

        const info: string[] = [];
        if (record.data.generation) info.push(`Gen: ${record.data.generation}`);
        if (record.data.year) info.push(`Year: ${record.data.year}`);
        if (record.data['CPU model']) info.push(`CPU: ${record.data['CPU model']}`);
        if (record.data['Hard disk size']) info.push(`HDD: ${record.data['Hard disk size']}`);
        if (record.data['Strap Colour']) info.push(`Strap: ${record.data['Strap Colour']}`);
        if (record.data['Case Size']) info.push(`Case: ${record.data['Case Size']}`);

        return info.length > 0 ? (
          <span style={{ fontSize: '12px', color: '#666' }}>{info.join(' | ')}</span>
        ) : (
          <span style={{ color: '#999' }}>-</span>
        );
      },
    },
  ];

  return (
    <AppLayout>
      <div>
        <h1 style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 24 }}>Items</h1>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Card>
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={items}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} items`,
              }}
              scroll={{ x: 1000 }}
            />
          </Spin>
        </Card>
      </div>
    </AppLayout>
  );
}
