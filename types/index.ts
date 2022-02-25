export interface TimeSpan {
  day: number;
  timeBegin: number;
  timeEnd: number;
}

export interface Lecture {
  id: string;
  times: TimeSpan[];
  name: string;
  color: string;
}
