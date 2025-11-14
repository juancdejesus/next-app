'use client';

import { Card } from 'antd';
import AppLayout from '../components/AppLayout';

export default function UploadPage() {
  return (
    <AppLayout>
      <div>
        <h1 style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 24 }}>Upload</h1>
        <Card>
          <p>Upload page content will go here.</p>
        </Card>
      </div>
    </AppLayout>
  );
}
