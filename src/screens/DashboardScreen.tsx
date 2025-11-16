import React, { useState, useCallback } from 'react';
import { SafeAreaView, View, Text, ScrollView, Alert, RefreshControl, Platform, KeyboardAvoidingView } from 'react-native';
import ProductivityChart from '../components/ProductivityChart';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import TaskFilters from '../components/TaskFilters';
import { useTasks } from '../hooks/useTasks';
import { TaskFilters as ITaskFilters } from '../models/Task';
import { styles } from './DashboardScreen.styles';

const DashboardScreen = () => {
  const {
    tasks,
    filteredTasks,
    stats,
    isLoading,
    error,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    setFilters,
    clearFilters,
    refreshTasks,
    clearError,
  } = useTasks();

  const [filters, setLocalFilters] = useState<ITaskFilters>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: ITaskFilters) => {
    setLocalFilters(newFilters);
    setFilters(newFilters);
  }, [setFilters]);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setLocalFilters({});
    clearFilters();
  }, [clearFilters]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshTasks();
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshTasks]);

  // Handle add task with enhanced parameters
  const handleAddTask = useCallback(async (taskData: {
    title: string;
    description?: string;
    priority?: any;
    category?: any;
    dueDate?: Date;
  }) => {
    const result = await addTask(taskData);
    
    if (!result.success) {
      Alert.alert('Erro', result.error || 'Erro ao adicionar tarefa');
    }
    
    return result;
  }, [addTask]);

  // Handle update task
  const handleUpdateTask = useCallback(async (id: string, updates: any) => {
    const result = await updateTask(id, updates);
    
    if (!result.success) {
      Alert.alert('Erro', result.error || 'Erro ao atualizar tarefa');
    }
    
    return result;
  }, [updateTask]);

  // Handle status update
  const handleUpdateTaskStatus = useCallback(async (id: string, status: any) => {
    const result = await updateTaskStatus(id, status);
    
    if (!result.success) {
      Alert.alert('Erro', result.error || 'Erro ao atualizar status da tarefa');
    }
    
    return result;
  }, [updateTaskStatus]);

  // Handle delete task
  const handleDeleteTask = useCallback(async (id: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteTask(id);
            if (!result.success) {
              Alert.alert('Erro', result.error || 'Erro ao excluir tarefa');
            }
          }
        }
      ]
    );
  }, [deleteTask]);

  // Clear error when user acknowledges it
  React.useEffect(() => {
    if (error) {
      Alert.alert(
        'Erro',
        error,
        [
          {
            text: 'OK',
            onPress: clearError
          }
        ]
      );
    }
  }, [error, clearError]);

  const emptyMessage = Object.keys(filters).length > 0 && (filters.searchText || filters.status?.length || filters.priority?.length || filters.category?.length)
    ? "Nenhuma tarefa encontrada com os filtros aplicados"
    : "Você ainda não tem tarefas. Adicione uma nova tarefa acima!";

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#6200ee']}
              tintColor="#6200ee"
            />
          }
        >
          {/* Filtros */}
          <TaskFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            taskCounts={{
              total: tasks.length,
              filtered: filteredTasks.length
            }}
          />

          {/* Gráficos e estatísticas */}
          <ProductivityChart 
            stats={stats} 
            isLoading={isLoading}
          />

          {/* Formulário para adicionar tarefas */}
          <View style={styles.formSection}>
            <TaskForm onAddTask={handleAddTask} isLoading={isLoading} />
          </View>

          {/* Lista de tarefas */}
          <View style={styles.listSection}>
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderTitle}>
                Suas Tarefas ({filteredTasks.length})
              </Text>
            </View>
            
            <TaskList
              tasks={filteredTasks}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              isLoading={isLoading}
              emptyMessage={emptyMessage}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
