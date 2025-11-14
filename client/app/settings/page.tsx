'use client';

import { Card } from 'antd';
import AppLayout from '../components/AppLayout';

export default function SettingsPage() {
  return (
    <AppLayout>
      <div>
        <h1 style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 24 }}>Settings</h1>
        <Card>
          <p>Settings page content will go here.</p>
        </Card>
      </div>
    </AppLayout>
  );
}
