export interface BusinessImpactMetric {
  label: string;
  value: string;
  change: string;
  description: string;
  trend: number[];
  tone: 'good' | 'warn' | 'neutral';
}

export const businessImpactMetrics: BusinessImpactMetric[] = [
  {
    label: 'Reduction in blind trust',
    value: '63%',
    change: '+18 pts',
    description: 'Fewer AI outputs acted on without independent validation.',
    trend: [22, 31, 38, 46, 54, 58, 63],
    tone: 'good',
  },
  {
    label: 'Human review prioritization',
    value: '41%',
    change: '+12 pts',
    description: 'Review effort focused on outputs with actual risk signals.',
    trend: [18, 24, 29, 33, 36, 39, 41],
    tone: 'good',
  },
  {
    label: 'Evaluation coverage',
    value: '94%',
    change: '+21 pts',
    description: 'Share of generated outputs evaluated before action.',
    trend: [55, 61, 70, 78, 84, 90, 94],
    tone: 'good',
  },
  {
    label: 'Confidence trend',
    value: '87%',
    change: '+9 pts',
    description: 'Median trusted-output confidence after calibration.',
    trend: [71, 73, 76, 78, 81, 84, 87],
    tone: 'neutral',
  },
  {
    label: 'Unsafe recommendations prevented',
    value: '38',
    change: '+11',
    description: 'Outputs blocked before reaching operational execution.',
    trend: [4, 7, 13, 19, 24, 31, 38],
    tone: 'warn',
  },
  {
    label: 'Template adoption',
    value: '7',
    change: '+4',
    description: 'Use cases running on reusable evaluation templates.',
    trend: [1, 2, 3, 4, 5, 6, 7],
    tone: 'good',
  },
  {
    label: 'Learning loop effectiveness',
    value: '29%',
    change: '+8 pts',
    description: 'Reduction in repeated failure patterns after feedback.',
    trend: [9, 12, 15, 18, 22, 26, 29],
    tone: 'good',
  },
];
