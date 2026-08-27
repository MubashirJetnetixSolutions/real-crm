export interface TopPerformerDTO {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  jobTitle: string | null;
  region: string | null;
  status: string;
  targetAmount: number;
  targetAmountFormatted: string;
  achievedAmount: number;
  achievedAmountFormatted: string;
  progressPercentage: number;
  isCompleted: boolean;
  isOverTarget: boolean;
  targetDeadlineDays: number;
  targetDeadlineFormatted: string;
  completionDays: number;
  completionDateFormatted: string;
  timeTakenFormatted: string;
  dealsClosed: number;
  totalDealValue: string;
  remainingOrOverFormatted: string;
  overTargetAmountFormatted: string | null;
  rank: number;
  yearlyStats?: {
    year: number;
    yearlyTarget: string;
    yearlyAchieved: string;
    yearlyProgress: number;
    targetsCompletedCount: number;
    completionRate: number;
    avgDaysToComplete: number;
  };
}

export interface YearlyTeamPerformanceDTO {
  year: number;
  topPerformer: TopPerformerDTO;
  totalYearlyTarget: string;
  totalYearlyAchieved: string;
  overallYearlyProgress: number;
  totalDealsClosed: number;
  avgCompletionDays: number;
  targetsCompletedCount: number;
  totalAgentsCount: number;
  completionRatePercentage: number;
  performers: TopPerformerDTO[];
}

export interface AgentDTO {
  id: number;
  name: string;
  email?: string;
  jobTitle: string | null;
  avatarUrl: string | null;
}
