import React, { useState, useCallback, useMemo } from 'react';
import { SafeAreaView, View, Text, ScrollView, Alert, RefreshControl, Platform, KeyboardAvoidingView, TouchableOpacity, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import TaskFilters from '../components/TaskFilters';
import { useTasks } from '../hooks/useTasks';
import { TaskFilters as ITaskFilters } from '../models/Task';
import { styles } from './TasksScreen.styles';

const TasksScreen = () => {
  const {
    tasks,
    filteredTasks,
    isLoading,
    error,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    purgeDeleted,
    setFilters,
    clearFilters,
    refreshTasks,
    clearError,
  } = useTasks();

  const [filters, setLocalFilters] = useState<ITaskFilters>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'lista' | 'agenda' | 'lixeira'>('lista');
  const [addModalVisible, setAddModalVisible] = useState(false);

  // Locale pt-br for calendar
  LocaleConfig.locales['pt-br'] = {
    monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
    monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
    dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
    dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
    today: 'Hoje'
  };
  LocaleConfig.defaultLocale = 'pt-br';

  const toDateStr = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  // Mark dates with due dates and completed dates
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    tasks.forEach(t => {
      if (t.dueDate) {
        const key = toDateStr(new Date(t.dueDate));
        marks[key] = {
          ...(marks[key] || {}),
          dots: [ ...(marks[key]?.dots || []), { color: '#6200ee' } ],
        };
      }
      if (t.completedAt) {
        const key = toDateStr(new Date(t.completedAt));
        marks[key] = {
          ...(marks[key] || {}),
          dots: [ ...(marks[key]?.dots || []), { color: '#4CAF50' } ],
        };
      }
      if (t.startedAt) {
        const key = toDateStr(new Date(t.startedAt));
        marks[key] = {
          ...(marks[key] || {}),
          dots: [ ...(marks[key]?.dots || []), { color: '#FF9800' } ],
        };
      }
    });
    if (selectedDate) {
      marks[selectedDate] = { ...(marks[selectedDate] || {}), selected: true };
    }
    return marks;
  }, [tasks, selectedDate]);

  // handler will be defined after handleFiltersChange

  const handleFiltersChange = useCallback((newFilters: ITaskFilters) => {
    setLocalFilters(newFilters);
    setFilters(newFilters);
  }, [setFilters]);

  const handleClearFilters = useCallback(() => {
    setLocalFilters({});
    clearFilters();
  }, [clearFilters]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshTasks();
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshTasks]);

  const handleSelectDay = useCallback((day: { dateString: string }) => {
    const newDate = day.dateString;
    if (selectedDate === newDate) {
      setSelectedDate(null);
      handleFiltersChange({ ...filters, dateRange: undefined });
      return;
    }
    setSelectedDate(newDate);
    const start = new Date(newDate + 'T00:00:00');
    const end = new Date(newDate + 'T23:59:59');
    handleFiltersChange({ ...filters, dateRange: { start, end } });
  }, [selectedDate, handleFiltersChange, filters]);

  const handleAddTask = useCallback(async (taskData: {
    title: string;
    description?: string;
    priority?: any;
    category?: any;
    dueDate?: Date;
    startedAt?: Date;
    completedAt?: Date;
  }) => {
    const result = await addTask(taskData);
    if (!result.success) {
      Alert.alert('Erro', result.error || 'Erro ao adicionar tarefa');
    }
    return result;
  }, [addTask]);

  const handleUpdateTask = useCallback(async (id: string, updates: any) => {
    const result = await updateTask(id, updates);
    if (!result.success) {
      Alert.alert('Erro', result.error || 'Erro ao atualizar tarefa');
    }
    return result;
  }, [updateTask]);

  const handleUpdateTaskStatus = useCallback(async (id: string, status: any) => {
    const result = await updateTaskStatus(id, status);
    if (!result.success) {
      Alert.alert('Erro', result.error || 'Erro ao atualizar status da tarefa');
    }
    return result;
  }, [updateTaskStatus]);

  const handleDeleteTask = useCallback(async (id: string) => {
    if (Platform.OS === 'web') {
      const ok = (typeof window !== 'undefined' && typeof window.confirm === 'function')
        ? window.confirm('Tem certeza que deseja excluir esta tarefa?')
        : true;
      if (ok) {
        const result = await deleteTask(id);
        if (!result.success) {
          Alert.alert('Erro', result.error || 'Erro ao excluir tarefa');
        }
      }
      return;
    }
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

  React.useEffect(() => {
    if (error) {
      Alert.alert('Erro', error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [error, clearError]);

  const emptyMessage = Object.keys(filters).length > 0 && (filters.searchText || filters.status?.length || filters.priority?.length || filters.category?.length)
    ? "Nenhuma tarefa encontrada com os filtros aplicados"
    : "Você ainda não tem tarefas. Adicione uma nova tarefa abaixo!";

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        >
          {/* Top bar with view toggle */}
          <View style={styles.topBar}>
            <Text style={styles.listHeaderTitle}>Gerenciador de Tarefas</Text>
            <View style={styles.viewToggle}>
              {(['lista','agenda','lixeira'] as const).map(mode => (
                <TouchableOpacity
                  key={mode}
                  style={[styles.toggleBtn, viewMode === mode && styles.toggleBtnActive]}
                  onPress={() => setViewMode(mode)}
                >
                  <Text style={[styles.toggleText, viewMode === mode && styles.toggleTextActive]}>
                    {mode === 'lista' ? 'Lista' : mode === 'agenda' ? 'Agenda' : 'Lixeira'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {tasks.some(t => t.status === 'excluída') && (
              <TouchableOpacity
                onPress={() => {
                  Alert.alert('Esvaziar lixeira', 'Remover permanentemente tarefas excluídas?', [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Esvaziar', style: 'destructive', onPress: async () => {
                      const r = await purgeDeleted();
                      if (!r.success) Alert.alert('Erro', r.error || 'Não foi possível esvaziar a lixeira');
                    }}
                  ]);
                }}
              >
                <Text style={{ color: '#F44336', fontWeight: '600', marginLeft: 8 }}>Esvaziar lixeira</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Calendário */}
          {viewMode === 'lista' && (
            <View style={{ marginBottom: 12 }}>
              <Calendar
                markingType="multi-dot"
                markedDates={markedDates}
                onDayPress={handleSelectDay}
              />
            </View>
          )}

          <TaskFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            taskCounts={{
              total: tasks.length,
              filtered: filteredTasks.length
            }}
          />
          {/* Agenda mode */}
          {viewMode === 'agenda' && (
            <View style={{ marginVertical: 8 }}>
              <Text style={[styles.listHeaderTitle, { paddingHorizontal: 16, paddingBottom: 8 }]}>Agenda</Text>
              {/* Lista simples por dia selecionado ou por dueDate */}
              <Text style={{ paddingHorizontal: 16, marginBottom: 8 }}>
                Toque em um dia no calendário (modo Lista) para filtrar. No modo Agenda exibimos todas por data.
              </Text>
              {Object.entries(
                filteredTasks.reduce((acc: Record<string, any[]>, t) => {
                  const baseDate = t.dueDate || t.startedAt || t.createdAt;
                  const key = `${new Date(baseDate).getFullYear()}-${String(new Date(baseDate).getMonth()+1).padStart(2,'0')}-${String(new Date(baseDate).getDate()).padStart(2,'0')}`;
                  acc[key] = acc[key] || [];
                  acc[key].push(t);
                  return acc;
                }, {})
              ).sort(([a],[b]) => a.localeCompare(b)).map(([date, tasksOfDay]) => (
                <View key={date} style={{ backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 8, padding: 12, borderRadius: 8 }}>
                  <Text style={{ fontWeight: '600', marginBottom: 6 }}>{new Date(date + 'T00:00:00').toLocaleDateString()}</Text>
                  {tasksOfDay.map(t => (
                    <View key={t.id} style={{ paddingVertical: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <TouchableOpacity onPress={() => handleUpdateTaskStatus(t.id, t.status === 'concluída' ? 'em andamento' : 'concluída')}>
                        <Text>• {t.title} {t.status === 'concluída' ? '✅' : ''}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteTask(t.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Text>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Lixeira */}
          {viewMode === 'lixeira' && (
            <View style={{ marginVertical: 8 }}>
              <Text style={[styles.listHeaderTitle, { paddingHorizontal: 16, paddingBottom: 8 }]}>Lixeira</Text>
              {tasks.filter(t => t.status === 'excluída').length === 0 ? (
                <Text style={{ paddingHorizontal: 16 }}>Nenhuma tarefa na lixeira.</Text>
              ) : (
                tasks.filter(t => t.status === 'excluída').map(t => (
                  <View key={t.id} style={{ backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 8, padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text numberOfLines={1} style={{ flex: 1, marginRight: 12 }}>🗑️ {t.title}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableOpacity onPress={() => updateTask(t.id, { status: 'em andamento' })}>
                        <Text style={{ color: '#4CAF50', fontWeight: '600' }}>Restaurar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
          {viewMode !== 'lixeira' && (
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
          )}
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setAddModalVisible(true)}
          accessibilityLabel="Adicionar tarefa"
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        {/* Modal de Adição */}
        <Modal
          visible={addModalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setAddModalVisible(false)}
        >
          <View style={{ flex: 1 }}>
            <BlurView intensity={35} tint="dark" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
            <View style={[styles.modalContainer, { marginTop: 60, borderTopLeftRadius: 16, borderTopRightRadius: 16 }] }>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Nova Tarefa</Text>
                <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                  <Text style={styles.modalClose}>Fechar</Text>
                </TouchableOpacity>
              </View>
              <ScrollView>
                <View style={{ paddingBottom: 40 }}>
                  <TaskForm onAddTask={handleAddTask} isLoading={isLoading} onSuccess={() => setAddModalVisible(false)} />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TasksScreen;
