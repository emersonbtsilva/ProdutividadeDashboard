import { useState, useEffect } from 'react';
import { Task } from '../models/Task';
import { getTasks, saveTasks } from '../services/storage';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      const storedTasks = await getTasks();
      setTasks(storedTasks);
    };
    loadTasks();
  }, []);

  const addTask = async (title: string) => {
    if (!title.trim()) return; // Não adiciona tarefas vazias
    
    const newTask: Task = {
      id: new Date().toISOString(),
      title,
      status: 'em andamento',
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const updateTaskStatus = async (id: string, status: 'concluída' | 'em andamento') => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, status } : task
    );
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const deleteTask = async (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  return {
    tasks,
    addTask,
    updateTaskStatus,
    deleteTask,
  };
};
