export type TodoLocal = {
  id: string;
  text: string;
  createdAt: number;
  updatedAt?: number;
  completed?: boolean;
  selected?: boolean;
};

export type FilterTab = 'all' | 'active' | 'completed';
