'use client';

import { Card } from 'antd';
import AppLayout from '../components/AppLayout';

export default function HelpPage() {
  return (
    <AppLayout>
      <div>
        <h1 style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 24 }}>Help</h1>
        <Card>
          <p>Help page content will go here.</p>
        </Card>
      </div>
    </AppLayout>
  );
}
