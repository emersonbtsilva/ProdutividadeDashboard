import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../models/Task';
import { APP_CONFIG } from '../constants/config';

export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class StorageError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'StorageError';
  }
}

// Migração de dados legados
const migrateTaskData = (rawTask: any): Task => {
  const now = new Date();
  
  return {
    id: rawTask.id || new Date().toISOString(),
    title: rawTask.title || 'Sem título',
    description: rawTask.description || undefined,
    status: rawTask.status || 'em andamento',
    priority: rawTask.priority || 'média',
    category: rawTask.category || 'outros',
    createdAt: rawTask.createdAt ? new Date(rawTask.createdAt) : now,
    updatedAt: rawTask.updatedAt ? new Date(rawTask.updatedAt) : now,
    completedAt: rawTask.completedAt ? new Date(rawTask.completedAt) : undefined,
    startedAt: rawTask.startedAt ? new Date(rawTask.startedAt) : undefined,
    dueDate: rawTask.dueDate ? new Date(rawTask.dueDate) : undefined,
  };
};

export const getTasks = async (): Promise<StorageResult<Task[]>> => {
  try {
    const jsonValue = await AsyncStorage.getItem(APP_CONFIG.STORAGE_KEYS.TASKS);
    
    if (!jsonValue) {
      return { success: true, data: [] };
    }

    const rawTasks = JSON.parse(jsonValue);
    
    if (!Array.isArray(rawTasks)) {
      throw new StorageError('Dados de tarefas corrompidos');
    }

    // Migrar dados e validar
    const tasks = rawTasks.map(migrateTaskData);
    
    // Validar limite de tarefas
    if (tasks.length > APP_CONFIG.TASK_LIMITS.MAX_TASKS_PER_USER) {
      console.warn(`Muitas tarefas encontradas: ${tasks.length}`);
    }

    return { success: true, data: tasks };
    
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao carregar tarefas';
    console.error('Error reading tasks from AsyncStorage:', error);
    
    return { 
      success: false, 
      error: message,
      data: [] // Fallback seguro
    };
  }
};

export const saveTasks = async (tasks: Task[]): Promise<StorageResult<void>> => {
  try {
    // Validações antes de salvar
    if (!Array.isArray(tasks)) {
      throw new StorageError('Dados inválidos: esperado array de tarefas');
    }

    if (tasks.length > APP_CONFIG.TASK_LIMITS.MAX_TASKS_PER_USER) {
      throw new StorageError(`Limite de ${APP_CONFIG.TASK_LIMITS.MAX_TASKS_PER_USER} tarefas excedido`);
    }

    // Serializar com tratamento de datas
    const jsonValue = JSON.stringify(tasks, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    });

    // Verificar tamanho dos dados
    const dataSize = new Blob([jsonValue]).size;
    if (dataSize > 1024 * 1024) { // 1MB limit
      console.warn('Dados muito grandes, considere otimização');
    }

    await AsyncStorage.setItem(APP_CONFIG.STORAGE_KEYS.TASKS, jsonValue);
    
    return { success: true };
    
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao salvar tarefas';
    console.error('Error saving tasks to AsyncStorage:', error);
    
    return { 
      success: false, 
      error: message 
    };
  }
};

export const clearAllData = async (): Promise<StorageResult<void>> => {
  try {
    await AsyncStorage.removeItem(APP_CONFIG.STORAGE_KEYS.TASKS);
    await AsyncStorage.removeItem(APP_CONFIG.STORAGE_KEYS.USER_PREFERENCES);
    
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao limpar dados';
    return { success: false, error: message };
  }
};

export const getStorageInfo = async (): Promise<StorageResult<{
  tasksCount: number;
  storageSize: number;
}>> => {
  try {
    const result = await getTasks();
    if (!result.success) {
      throw new Error(result.error);
    }

    const tasksJson = await AsyncStorage.getItem(APP_CONFIG.STORAGE_KEYS.TASKS);
    const storageSize = tasksJson ? new Blob([tasksJson]).size : 0;

    return {
      success: true,
      data: {
        tasksCount: result.data?.length || 0,
        storageSize
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao obter informações'
    };
  }
};
