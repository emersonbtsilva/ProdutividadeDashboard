import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, TaskStatus, TaskPriority, TaskCategory, TaskFilters, TaskStats } from '../models/Task';
import { getTasks, saveTasks, StorageResult } from '../services/storage';
import { validateTaskTitle, validateTaskDescription, sanitizeText } from '../utils/validation';
import { APP_CONFIG } from '../constants/config';

export interface TaskOperationResult {
  success: boolean;
  error?: string;
  taskId?: string;
}

export interface UseTasksReturn {
  // Estado
  tasks: Task[];
  filteredTasks: Task[];
  stats: TaskStats;
  isLoading: boolean;
  error: string | null;
  
  // Ações
  addTask: (params: {
    title: string;
    description?: string;
    priority?: TaskPriority;
    category?: TaskCategory;
    dueDate?: Date;
    startedAt?: Date;
    completedAt?: Date;
  }) => Promise<TaskOperationResult>;
  
  updateTask: (id: string, updates: Partial<Task>) => Promise<TaskOperationResult>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<TaskOperationResult>;
  deleteTask: (id: string) => Promise<TaskOperationResult>;
  purgeDeleted: () => Promise<TaskOperationResult>;
  
  // Filtros
  setFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;
  
  // Utilitários
  refreshTasks: () => Promise<void>;
  clearError: () => void;
}

const initialFilters: TaskFilters = {};

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calcular estatísticas
  const stats = useMemo((): TaskStats => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const daysAgo = (n: number) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - n);

    const byStatus = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<TaskStatus, number>);

    const byPriority = tasks.reduce((acc, task) => {
      if (task.status !== 'excluída') {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
      }
      return acc;
    }, {} as Record<TaskPriority, number>);

    const byCategory = tasks.reduce((acc, task) => {
      if (task.status !== 'excluída') {
        acc[task.category] = (acc[task.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<TaskCategory, number>);

    const overdue = tasks.filter(task => 
      task.status !== 'excluída' && 
      task.status !== 'concluída' && 
      task.dueDate && 
      task.dueDate < now
    ).length;

    // Tarefas concluídas com completedAt válido
    const completedTasks = tasks.filter(t => t.status === 'concluída' && t.completedAt);

    // Métricas de período
    const completedToday = completedTasks.filter(t => (t.completedAt as Date) >= startOfToday).length;
    const completedLast7Days = completedTasks.filter(t => (t.completedAt as Date) >= daysAgo(6)).length; // inclui hoje
    const completedLast30Days = completedTasks.filter(t => (t.completedAt as Date) >= daysAgo(29)).length;

    // Média de tempo para concluir (em horas)
    const completionDurationsHours: number[] = completedTasks
      .filter(t => t.createdAt)
      .map(t => {
        const finished = (t.completedAt as Date).getTime();
        const created = new Date(t.createdAt).getTime();
        return Math.max(0, (finished - created) / 36e5); // ms -> horas
      });
    const averageCompletionTimeHours = completionDurationsHours.length
      ? completionDurationsHours.reduce((a, b) => a + b, 0) / completionDurationsHours.length
      : null;

    // Concluídas no prazo vs. atrasadas (apenas quando há dueDate)
    let onTimeCompleted = 0;
    let lateCompleted = 0;
    completedTasks.forEach(t => {
      if (t.dueDate) {
        if ((t.completedAt as Date) <= t.dueDate) onTimeCompleted++;
        else lateCompleted++;
      }
    });

    // Série diária dos últimos 30 dias
    const byDayCompletedLast30: Array<{ date: string; count: number }> = [];
    for (let i = 29; i >= 0; i--) {
      const day = daysAgo(i);
      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999);
      const count = completedTasks.filter(t => {
        const c = t.completedAt as Date;
        return c >= dayStart && c <= dayEnd;
      }).length;
      const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
      byDayCompletedLast30.push({ date: dateStr, count });
    }

    return {
      total: tasks.length,
      completed: byStatus['concluída'] || 0,
      pending: byStatus['em andamento'] || 0,
      deleted: byStatus['excluída'] || 0,
      overdue,
      byPriority,
      byCategory,
      completedToday,
      completedLast7Days,
      completedLast30Days,
      averageCompletionTimeHours,
      onTimeCompleted,
      lateCompleted,
      byDayCompletedLast30,
    };
  }, [tasks]);

  // Filtrar tarefas
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filtro por status
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status!.includes(task.status));
    }

    // Filtro por prioridade
    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority!.includes(task.priority));
    }

    // Filtro por categoria
    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(task => filters.category!.includes(task.category));
    }

    // Busca textual
    if (filters.searchText && filters.searchText.trim()) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por data
    if (filters.dateRange) {
      filtered = filtered.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate >= filters.dateRange!.start && taskDate <= filters.dateRange!.end;
      });
    }

    return filtered;
  }, [tasks, filters]);

  // Carregar tarefas
  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getTasks();
      
      if (result.success && result.data) {
        setTasks(result.data);
      } else {
        setError(result.error || 'Erro ao carregar tarefas');
        setTasks([]); // Fallback seguro
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado';
      setError(errorMsg);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar tarefas com otimistic updates
  const saveTasksOptimistically = useCallback(async (
    newTasks: Task[], 
    rollbackTasks: Task[]
  ): Promise<StorageResult<void>> => {
    try {
      const result = await saveTasks(newTasks);
      
      if (!result.success) {
        // Rollback em caso de erro
        setTasks(rollbackTasks);
        return result;
      }
      
      return result;
    } catch (err) {
      // Rollback em caso de exceção
      setTasks(rollbackTasks);
      throw err;
    }
  }, []);

  // Adicionar tarefa
  const addTask = useCallback(async (params: {
    title: string;
    description?: string;
    priority?: TaskPriority;
    category?: TaskCategory;
    dueDate?: Date;
    startedAt?: Date;
    completedAt?: Date;
  }): Promise<TaskOperationResult> => {
    // Validação
    const titleValidation = validateTaskTitle(params.title);
    if (!titleValidation.isValid) {
      return { success: false, error: titleValidation.errors.join(', ') };
    }

    const descValidation = validateTaskDescription(params.description);
    if (!descValidation.isValid) {
      return { success: false, error: descValidation.errors.join(', ') };
    }

    try {
      const now = new Date();
      const newTask: Task = {
        id: `task_${now.getTime()}_${Math.random().toString(36).substr(2, 9)}`,
        title: sanitizeText(params.title),
        description: params.description ? sanitizeText(params.description) : undefined,
        status: params.completedAt ? 'concluída' : 'em andamento',
        priority: params.priority || 'média',
        category: params.category || 'outros',
        createdAt: now,
        updatedAt: now,
        dueDate: params.dueDate,
        startedAt: params.startedAt,
        completedAt: params.completedAt,
      };

      const previousTasks = [...tasks];
      const updatedTasks = [...tasks, newTask];
      
      // Optimistic update
      setTasks(updatedTasks);
      
      const result = await saveTasksOptimistically(updatedTasks, previousTasks);
      
      if (!result.success) {
        return { success: false, error: result.error };
      }

      return { success: true, taskId: newTask.id };
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao adicionar tarefa';
      return { success: false, error: errorMsg };
    }
  }, [tasks, saveTasksOptimistically]);

  // Atualizar tarefa
  const updateTask = useCallback(async (
    id: string, 
    updates: Partial<Task>
  ): Promise<TaskOperationResult> => {
    try {
      const taskIndex = tasks.findIndex(task => task.id === id);
      if (taskIndex === -1) {
        return { success: false, error: 'Tarefa não encontrada' };
      }

      // Validações se necessário
      if (updates.title) {
        const validation = validateTaskTitle(updates.title);
        if (!validation.isValid) {
          return { success: false, error: validation.errors.join(', ') };
        }
        updates.title = sanitizeText(updates.title);
      }

      if (updates.description) {
        const validation = validateTaskDescription(updates.description);
        if (!validation.isValid) {
          return { success: false, error: validation.errors.join(', ') };
        }
        updates.description = sanitizeText(updates.description);
      }

      const previousTasks = [...tasks];
      const updatedTask = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date(),
        ...(updates.status === 'concluída' && !tasks[taskIndex].completedAt && !updates.completedAt ? 
          { completedAt: new Date() } : {})
      };

      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = updatedTask;

      // Optimistic update
      setTasks(updatedTasks);

      const result = await saveTasksOptimistically(updatedTasks, previousTasks);
      
      if (!result.success) {
        return { success: false, error: result.error };
      }

      return { success: true, taskId: id };
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar tarefa';
      return { success: false, error: errorMsg };
    }
  }, [tasks, saveTasksOptimistically]);

  // Atualizar status da tarefa
  const updateTaskStatus = useCallback(async (
    id: string, 
    status: TaskStatus
  ): Promise<TaskOperationResult> => {
    return updateTask(id, { status });
  }, [updateTask]);

  // Deletar tarefa (soft delete)
  const deleteTask = useCallback(async (id: string): Promise<TaskOperationResult> => {
    return updateTask(id, { status: 'excluída' });
  }, [updateTask]);

  // Remover permanentemente tarefas com status 'excluída'
  const purgeDeleted = useCallback(async (): Promise<TaskOperationResult> => {
    try {
      const previousTasks = [...tasks];
      const updatedTasks = tasks.filter(t => t.status !== 'excluída');
      setTasks(updatedTasks);
      const result = await saveTasksOptimistically(updatedTasks, previousTasks);
      if (!result.success) {
        return { success: false, error: result.error };
      }
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao esvaziar lixeira';
      return { success: false, error: errorMsg };
    }
  }, [tasks, saveTasksOptimistically]);

  // Atualizar filtros
  const setTaskFilters = useCallback((newFilters: TaskFilters) => {
    setFilters(newFilters);
  }, []);

  // Limpar filtros
  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  // Refresh manual
  const refreshTasks = useCallback(async () => {
    await loadTasks();
  }, [loadTasks]);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Carregar tarefas na inicialização
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    filteredTasks,
    stats,
    isLoading,
    error,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  purgeDeleted,
    setFilters: setTaskFilters,
    clearFilters,
    refreshTasks,
    clearError,
  };
};
