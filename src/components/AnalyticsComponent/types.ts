export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  description?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface LineChartProps {
  data: ChartDataPoint[];
  title: string;
  description?: string;
  className?: string;
}

export interface BarChartProps {
  data: ChartDataPoint[];
  title: string;
  description?: string;
  className?: string;
}

export interface PieChartProps {
  data: ChartDataPoint[];
  title: string;
  description?: string;
  className?: string;
}

export interface AnalyticsFilterProps {
  onFilterChange: (filter: string) => void;
  activeFilter: string;
  className?: string;
}

export interface MetricCardListProps {
  metrics: MetricCardProps[];
  className?: string;
}
