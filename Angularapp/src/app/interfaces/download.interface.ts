export interface Download {
  state: 'PENDING' | 'IN PROGRESS' | 'DONE';
  progress: number;
  content: Blob | null;
}
