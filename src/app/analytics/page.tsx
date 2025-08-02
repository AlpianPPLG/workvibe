import { Metadata } from 'next';
import { AnalyticsComponent } from '@/components/AnalyticsComponent';

export const metadata: Metadata = {
  title: 'Analytics Dashboard',
  description: 'Track and analyze your application metrics',
};

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-6">
      <AnalyticsComponent />
    </div>
  );
}
