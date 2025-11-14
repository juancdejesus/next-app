'use client';

import { Card } from 'antd';
import AppLayout from '../components/AppLayout';

export default function ApprovalsPage() {
  return (
    <AppLayout>
      <div>
        <h1 style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 24 }}>Approvals</h1>
        <Card>
          <p>Approvals page content will go here.</p>
        </Card>
      </div>
    </AppLayout>
  );
}
