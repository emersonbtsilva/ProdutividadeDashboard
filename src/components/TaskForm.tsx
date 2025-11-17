import React, { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
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
    startedAt?: Date;
    completedAt?: Date;
  }) => Promise<{ success: boolean; error?: string }>;
  isLoading?: boolean;
  onSuccess?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, isLoading = false, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('média');
  const [category, setCategory] = useState<TaskCategory>('outros');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDateInput, setStartDateInput] = useState('');
  const [completedDateInput, setCompletedDateInput] = useState('');

  const DatePickerField: React.FC<{
    label: string;
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
  }> = ({ label, value, onChange, disabled }) => {
    const [open, setOpen] = useState(false);
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          onPress={() => !disabled && setOpen(true)}
          style={[styles.dateButton, disabled && styles.inputDisabled]}
          disabled={disabled}
        >
          <Text style={styles.dateButtonText}>
            {value ? new Date(value + 'T00:00:00').toLocaleDateString() : 'Selecionar data'}
          </Text>
        </TouchableOpacity>
        <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
          <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <View style={{ backgroundColor:'#fff', borderRadius:12, overflow:'hidden' }}>
              <Calendar
                markedDates={ value ? { [value]: { selected: true } } : undefined }
                onDayPress={d => { onChange(d.dateString); setOpen(false); }}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const handleAdd = useCallback(async () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'Por favor, insira um título para a tarefa');
      return;
    }

    setIsSubmitting(true);
    try {
      const parseDate = (s: string) => (s ? new Date(`${s}T00:00:00`) : undefined);
      const result = await onAddTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category,
        startedAt: parseDate(startDateInput),
        completedAt: parseDate(completedDateInput),
      });

      if (result.success) {
        // Limpar formulário após sucesso
        setTitle('');
        setDescription('');
        setPriority('média');
        setCategory('outros');
        setStartDateInput('');
        setCompletedDateInput('');
        onSuccess?.();
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

      {/* Datas com calendário */}
      <DatePickerField
        label="Início"
        value={startDateInput}
        onChange={setStartDateInput}
        disabled={isFormDisabled}
      />
      <DatePickerField
        label="Conclusão"
        value={completedDateInput}
        onChange={setCompletedDateInput}
        disabled={isFormDisabled}
      />

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
