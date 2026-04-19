export type MomentType = 'text' | 'voice' | 'photo';

export interface Moment {
  id: string;
  type: MomentType;
  content: string;
  tags: string[];
  createdAt: string;
}

export interface DailySummary {
  date: string;
  summaryText: string;
  keyMoments: string[];
  actionableInsights: string[];
}
