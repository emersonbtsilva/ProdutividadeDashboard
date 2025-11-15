import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../models/Task';

const TASKS_KEY = '@ProdutividadeDashboard:tasks';

export const getTasks = async (): Promise<Task[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error reading tasks from AsyncStorage', e);
    return [];
  }
};

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(TASKS_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving tasks to AsyncStorage', e);
  }
};
