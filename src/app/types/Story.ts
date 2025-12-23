export interface IStory {
  id: number;
  title: string;
  by: string;
  url?: string;
  score: number;
  time: number;
  descendants?: number;
  kids?: number[];
}

