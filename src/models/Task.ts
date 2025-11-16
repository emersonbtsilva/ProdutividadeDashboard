export type TaskStatus = 'concluída' | 'em andamento' | 'excluída';
export type TaskPriority = 'baixa' | 'média' | 'alta' | 'urgente';
export type TaskCategory = 'trabalho' | 'pessoal' | 'estudos' | 'saúde' | 'outros';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  dueDate?: Date;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  category?: TaskCategory[];
  searchText?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  deleted: number;
  overdue: number;
  byPriority: Record<TaskPriority, number>;
  byCategory: Record<TaskCategory, number>;
}
