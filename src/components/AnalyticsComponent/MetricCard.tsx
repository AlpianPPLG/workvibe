'use client';

import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCardProps } from './types';

export function MetricCard({
  title,
  value,
  change,
  icon,
  description,
}: MetricCardProps) {
  const isPositive = change ? change > 0 : null;
  const isNeutral = change === 0;
  const changeText = change ? `${Math.abs(change)}%` : '';

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {isPositive ? (
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
            ) : isNeutral ? (
              <Minus className="h-3 w-3 text-yellow-500 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            {changeText} {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function MetricCardList({ metrics, className }: { metrics: MetricCardProps[]; className?: string }) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}
