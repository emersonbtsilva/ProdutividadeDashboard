import React from 'react';
import { SafeAreaView } from 'react-native';
import ProductivityChart from '../components/ProductivityChart';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useTasks } from '../hooks/useTasks';
import { styles } from './DashboardScreen.styles';

const DashboardScreen = () => {
  const { tasks, addTask, updateTaskStatus, deleteTask } = useTasks();

  return (
    <SafeAreaView style={styles.container}>
      <ProductivityChart tasks={tasks} />
      <TaskForm onAddTask={addTask} />
      <TaskList tasks={tasks} onUpdateTask={updateTaskStatus} onDeleteTask={deleteTask} />
    </SafeAreaView>
  );
};

export default DashboardScreen;
