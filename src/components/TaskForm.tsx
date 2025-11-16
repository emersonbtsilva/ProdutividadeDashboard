import React, { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { TaskPriority, TaskCategory } from '../models/Task';
import { APP_CONFIG } from '../constants/config';
import { styles } from './TaskForm.styles';

interface TaskFormProps {
  onAddTask: (taskData: {
    title: string;
    description?: string;
    priority?: TaskPriority;
    category?: TaskCategory;
    dueDate?: Date;
  }) => Promise<{ success: boolean; error?: string }>;
  isLoading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, isLoading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('média');
  const [category, setCategory] = useState<TaskCategory>('outros');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = useCallback(async () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'Por favor, insira um título para a tarefa');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onAddTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category,
      });

      if (result.success) {
        // Limpar formulário após sucesso
        setTitle('');
        setDescription('');
        setPriority('média');
        setCategory('outros');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [title, description, priority, category, onAddTask]);

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Tarefa</Text>
      
      {/* Campo Título */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          placeholder="Digite o título da tarefa..."
          style={[styles.input, isFormDisabled && styles.inputDisabled]}
          value={title}
          onChangeText={setTitle}
          editable={!isFormDisabled}
          maxLength={APP_CONFIG.TASK_LIMITS.TITLE_MAX_LENGTH}
        />
        <Text style={styles.charCounter}>
          {title.length}/{APP_CONFIG.TASK_LIMITS.TITLE_MAX_LENGTH}
        </Text>
      </View>

      {/* Campo Descrição */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          placeholder="Descrição opcional..."
          style={[styles.textArea, isFormDisabled && styles.inputDisabled]}
          value={description}
          onChangeText={setDescription}
          editable={!isFormDisabled}
          multiline
          numberOfLines={3}
          maxLength={APP_CONFIG.TASK_LIMITS.DESCRIPTION_MAX_LENGTH}
        />
        <Text style={styles.charCounter}>
          {description.length}/{APP_CONFIG.TASK_LIMITS.DESCRIPTION_MAX_LENGTH}
        </Text>
      </View>

      {/* Seletor de Prioridade */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Prioridade</Text>
        <View style={styles.priorityRow}>
          {APP_CONFIG.PRIORITIES.map((priorityOption) => (
            <TouchableOpacity
              key={priorityOption.key}
              style={[
                styles.priorityButton,
                priority === priorityOption.key && styles.priorityButtonSelected,
                { borderColor: priorityOption.color }
              ]}
              onPress={() => setPriority(priorityOption.key)}
              disabled={isFormDisabled}
            >
              <Text
                style={[
                  styles.priorityButtonText,
                  priority === priorityOption.key && styles.priorityButtonTextSelected
                ]}
              >
                {priorityOption.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Seletor de Categoria */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoryGrid}>
          {APP_CONFIG.CATEGORIES.map((categoryOption) => (
            <TouchableOpacity
              key={categoryOption.key}
              style={[
                styles.categoryButton,
                category === categoryOption.key && styles.categoryButtonSelected
              ]}
              onPress={() => setCategory(categoryOption.key)}
              disabled={isFormDisabled}
            >
              <Text style={styles.categoryIcon}>{categoryOption.icon}</Text>
              <Text
                style={[
                  styles.categoryButtonText,
                  category === categoryOption.key && styles.categoryButtonTextSelected
                ]}
              >
                {categoryOption.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Botão Adicionar */}
      <TouchableOpacity
        style={[
          styles.addButton,
          isFormDisabled && styles.addButtonDisabled
        ]}
        onPress={handleAdd}
        disabled={isFormDisabled}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.addButtonText}>Adicionar Tarefa</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TaskForm;
