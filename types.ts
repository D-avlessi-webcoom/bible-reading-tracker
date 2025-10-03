export enum Testament {
  Old = 'Ancien Testament',
  New = 'Nouveau Testament',
}

export interface Book {
  id: number;
  name: string;
  chapters: number;
  testament: Testament;
}

export interface CalculationResults {
  remainingInBible: number;
  remainingInOT: number;
  remainingInNT: number;
  daysLeft: number;
  dailyGoalForBible: number;
  dailyGoalForOT: number;
  dailyGoalForNT: number;
  endDate: string;
}
