import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Task, TaskStatus } from '../models/Task';
import { APP_CONFIG } from '../constants/config';
import { formatDate } from '../utils/validation';
import { styles } from './TaskList.styles';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => Promise<{ success: boolean; error?: string }>;
  onUpdateTaskStatus?: (id: string, status: TaskStatus) => Promise<{ success: boolean; error?: string }>;
  onDeleteTask: (id: string) => Promise<void>;
  isLoading?: boolean;
  emptyMessage?: string;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onUpdateTask,
  onUpdateTaskStatus,
  onDeleteTask, 
  isLoading = false,
  emptyMessage = "Nenhuma tarefa encontrada",
}) => {

  const visibleTasks = useMemo(() => 
    tasks.filter(task => task.status !== 'excluída'),
    [tasks]
  );

  const handleStatusToggle = useCallback(async (task: Task) => {
    const newStatus: TaskStatus = task.status === 'concluída' ? 'em andamento' : 'concluída';
    
    if (onUpdateTaskStatus) {
      await onUpdateTaskStatus(task.id, newStatus);
    } else {
      await onUpdateTask(task.id, { status: newStatus });
    }
  }, [onUpdateTask, onUpdateTaskStatus]);

  const getPriorityColor = useCallback((priority: string) => {
    const priorityConfig = APP_CONFIG.PRIORITIES.find(p => p.key === priority);
    return priorityConfig?.color || '#666';
  }, []);

  const getCategoryInfo = useCallback((category: string) => {
    const categoryConfig = APP_CONFIG.CATEGORIES.find(c => c.key === category);
    return categoryConfig || { icon: '📝', label: 'Outros' };
  }, []);

  const isTaskOverdue = useCallback((task: Task) => {
    return task.dueDate && task.status !== 'concluída' && new Date(task.dueDate) < new Date();
  }, []);

  const renderTaskItem = useCallback(({ item: task }: { item: Task }) => {
    const categoryInfo = getCategoryInfo(task.category);
    const isOverdue = isTaskOverdue(task);
    const isCompleted = task.status === 'concluída';

    return (
      <TouchableOpacity
        style={[
          styles.taskItem,
          isCompleted && styles.taskItemCompleted,
          isOverdue && styles.taskItemOverdue,
        ]}
        onPress={() => handleStatusToggle(task)}
        activeOpacity={0.7}
      >
        {/* Header da tarefa */}
        <View style={styles.taskHeader}>
          <View style={styles.taskMainInfo}>
            <View style={styles.statusIndicator}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isCompleted ? '#4CAF50' : isOverdue ? '#F44336' : '#FF9800' }
                ]}
              />
              <Text style={[
                styles.taskTitle,
                isCompleted && styles.taskTitleCompleted
              ]}>
                {task.title}
              </Text>
            </View>
            
            {/* Badges */}
            <View style={styles.badgeContainer}>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                <Text style={styles.badgeText}>
                  {APP_CONFIG.PRIORITIES.find(p => p.key === task.priority)?.label}
                </Text>
              </View>
              
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryIcon}>{categoryInfo.icon}</Text>
                <Text style={styles.categoryText}>{categoryInfo.label}</Text>
              </View>
            </View>
          </View>

          {/* Botão de ação */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDeleteTask(task.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.actionButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>

        {/* Descrição */}
        {task.description && (
          <Text style={styles.taskDescription} numberOfLines={2}>
            {task.description}
          </Text>
        )}

        {/* Footer com informações de data */}
        <View style={styles.taskFooter}>
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>Criada:</Text>
            <Text style={styles.dateValue}>{formatDate(new Date(task.createdAt))}</Text>
          </View>

          {task.dueDate && (
            <View style={styles.dateInfo}>
              <Text style={[styles.dateLabel, isOverdue && styles.overdueText]}>
                {isOverdue ? 'Atrasada:' : 'Vence:'}
              </Text>
              <Text style={[styles.dateValue, isOverdue && styles.overdueText]}>
                {formatDate(new Date(task.dueDate))}
              </Text>
            </View>
          )}

          {task.completedAt && (
            <View style={styles.dateInfo}>
              <Text style={styles.dateLabel}>Concluída:</Text>
              <Text style={styles.dateValue}>{formatDate(new Date(task.completedAt))}</Text>
            </View>
          )}
        </View>

        {/* Status visual */}
        <View style={styles.statusBar}>
          <Text style={[
            styles.statusText,
            { color: isCompleted ? '#4CAF50' : isOverdue ? '#F44336' : '#FF9800' }
          ]}>
            {isCompleted ? '✅ Concluída' : isOverdue ? '⏰ Atrasada' : '⏳ Em Andamento'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, [handleStatusToggle, onDeleteTask, getCategoryInfo, getPriorityColor, isTaskOverdue]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Carregando tarefas...</Text>
      </View>
    );
  }

  if (visibleTasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyTitle}>Nenhuma tarefa</Text>
        <Text style={styles.emptyMessage}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {visibleTasks.map((task) => {
        const categoryInfo = getCategoryInfo(task.category);
        const isOverdue = isTaskOverdue(task);
        const isCompleted = task.status === 'concluída';

        return (
          <TouchableOpacity
            key={task.id}
            style={[
              styles.taskItem,
              isCompleted && styles.taskItemCompleted,
              isOverdue && styles.taskItemOverdue,
            ]}
            onPress={() => handleStatusToggle(task)}
            activeOpacity={0.7}
          >
            {/* Header da tarefa */}
            <View style={styles.taskHeader}>
              <View style={styles.taskMainInfo}>
                <View style={styles.statusIndicator}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: isCompleted ? '#4CAF50' : isOverdue ? '#F44336' : '#FF9800' }
                    ]}
                  />
                  <Text style={[
                    styles.taskTitle,
                    isCompleted && styles.taskTitleCompleted
                  ]}>
                    {task.title}
                  </Text>
                </View>
                
                {/* Badges */}
                <View style={styles.badgeContainer}>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                    <Text style={styles.badgeText}>
                      {APP_CONFIG.PRIORITIES.find(p => p.key === task.priority)?.label}
                    </Text>
                  </View>
                  
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryIcon}>{categoryInfo.icon}</Text>
                    <Text style={styles.categoryText}>{categoryInfo.label}</Text>
                  </View>
                </View>
              </View>

              {/* Botão de ação */}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onDeleteTask(task.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.actionButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>

            {/* Descrição */}
            {task.description && (
              <Text style={styles.taskDescription} numberOfLines={2}>
                {task.description}
              </Text>
            )}

            {/* Footer com informações de data */}
            <View style={styles.taskFooter}>
              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>Criada:</Text>
                <Text style={styles.dateValue}>{formatDate(new Date(task.createdAt))}</Text>
              </View>

              {task.dueDate && (
                <View style={styles.dateInfo}>
                  <Text style={[styles.dateLabel, isOverdue && styles.overdueText]}>
                    {isOverdue ? 'Atrasada:' : 'Vence:'}
                  </Text>
                  <Text style={[styles.dateValue, isOverdue && styles.overdueText]}>
                    {formatDate(new Date(task.dueDate))}
                  </Text>
                </View>
              )}

              {task.completedAt && (
                <View style={styles.dateInfo}>
                  <Text style={styles.dateLabel}>Concluída:</Text>
                  <Text style={styles.dateValue}>{formatDate(new Date(task.completedAt))}</Text>
                </View>
              )}
            </View>

            {/* Status visual */}
            <View style={styles.statusBar}>
              <Text style={[
                styles.statusText,
                { color: isCompleted ? '#4CAF50' : isOverdue ? '#F44336' : '#FF9800' }
              ]}>
                {isCompleted ? '✅ Concluída' : isOverdue ? '⏰ Atrasada' : '⏳ Em Andamento'}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TaskList;
