'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  DollarSign, 
  Activity} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCardList } from './MetricCard';
import { LineChartComponent, BarChartComponent, PieChartComponent } from './Charts';
import { AnalyticsFilter } from './AnalyticsFilter';
import { ChartDataPoint } from './types';
import { cn } from '@/lib/utils';

// Mock data for the charts
const generateLineData = (count: number): ChartDataPoint[] => {
  return Array.from({ length: count }, (_, i) => ({
    name: `Week ${i + 1}`,
    value: Math.floor(Math.random() * 1000) + 500,
  }));
};

const generateBarData = (): ChartDataPoint[] => {
  const categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return categories.map(category => ({
    name: category,
    value: Math.floor(Math.random() * 1000) + 100,
  }));
};

const generatePieData = (): ChartDataPoint[] => [
  { name: 'Desktop', value: 400 },
  { name: 'Mobile', value: 300 },
  { name: 'Tablet', value: 200 },
  { name: 'Other', value: 100 },
];

export function AnalyticsComponent() {
  const [timeRange, setTimeRange] = useState('week');
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, you would fetch this data based on the selected timeRange
  const metrics = [
    {
      title: 'Total Users',
      value: '12,345',
      change: 12.5,
      icon: <Users className="h-4 w-4" />,
      description: 'vs last week',
    },
    {
      title: 'Active Sessions',
      value: '1,234',
      change: 8.2,
      icon: <Activity className="h-4 w-4" />,
      description: 'vs last week',
    },
    {
      title: 'Avg. Session',
      value: '2m 45s',
      change: -2.1,
      icon: <Clock className="h-4 w-4" />,
      description: 'vs last week',
    },
    {
      title: 'Revenue',
      value: '$24,780',
      change: 18.3,
      icon: <DollarSign className="h-4 w-4" />,
      description: 'vs last week',
    },
  ];

  const lineData = generateLineData(12);
  const barData = generateBarData();
  const pieData = generatePieData();

  const handleFilterChange = (filter: string) => {
    setIsLoading(true);
    setTimeRange(filter);
    // Simulate data loading
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Track and analyze your application metrics
          </p>
        </div>
        <AnalyticsFilter 
          activeFilter={timeRange} 
          onFilterChange={handleFilterChange} 
          className="mt-2 sm:mt-0"
        />
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          <MetricCardList metrics={metrics} />
          
          <div className="grid gap-6 md:grid-cols-2">
            <LineChartComponent 
              data={lineData} 
              title="User Growth" 
              description="Number of new users over time"
            />
            <BarChartComponent 
              data={barData} 
              title="Weekly Activity" 
              description="User activity by day of week"
            />
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
                <p className="text-xs text-muted-foreground">Key performance indicators</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Page Load Time', value: '1.2s', change: -5 },
                    { label: 'Server Response', value: '320ms', change: -12 },
                    { label: 'API Requests', value: '1,234', change: 8 },
                    { label: 'Error Rate', value: '0.8%', change: -23 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{item.value}</span>
                        <span 
                          className={cn(
                            'text-xs',
                            item.change > 0 ? 'text-green-500' : 'text-red-500'
                          )}
                        >
                          {item.change > 0 ? '+' : ''}{item.change}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <PieChartComponent 
              data={pieData} 
              title="Devices" 
              description="Traffic by device type"
            />
          </div>
        </>
      )}
    </div>
  );
}
