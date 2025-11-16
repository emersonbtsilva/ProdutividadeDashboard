import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { TaskFilters, TaskStatus, TaskPriority, TaskCategory } from '../models/Task';
import { APP_CONFIG } from '../constants/config';
import { styles } from './TaskFilters.styles';

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  onClearFilters: () => void;
  taskCounts?: {
    total: number;
    filtered: number;
  };
}

const TaskFiltersComponent: React.FC<TaskFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  taskCounts
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState(filters.searchText || '');

  const handleSearchTextChange = useCallback((text: string) => {
    setSearchText(text);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      onFiltersChange({
        ...filters,
        searchText: text.trim() || undefined
      });
    }, APP_CONFIG.UI.DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [filters, onFiltersChange]);

  const toggleStatusFilter = useCallback((status: TaskStatus) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    onFiltersChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined
    });
  }, [filters, onFiltersChange]);

  const togglePriorityFilter = useCallback((priority: TaskPriority) => {
    const currentPriorities = filters.priority || [];
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter(p => p !== priority)
      : [...currentPriorities, priority];
    
    onFiltersChange({
      ...filters,
      priority: newPriorities.length > 0 ? newPriorities : undefined
    });
  }, [filters, onFiltersChange]);

  const toggleCategoryFilter = useCallback((category: TaskCategory) => {
    const currentCategories = filters.category || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    onFiltersChange({
      ...filters,
      category: newCategories.length > 0 ? newCategories : undefined
    });
  }, [filters, onFiltersChange]);

  const hasActiveFilters = !!(
    filters.searchText ||
    (filters.status && filters.status.length > 0) ||
    (filters.priority && filters.priority.length > 0) ||
    (filters.category && filters.category.length > 0) ||
    filters.dateRange
  );

  const StatusFilterButton: React.FC<{ status: TaskStatus; label: string; color: string }> = ({ 
    status, 
    label, 
    color 
  }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filters.status?.includes(status) && { backgroundColor: color, opacity: 0.8 }
      ]}
      onPress={() => toggleStatusFilter(status)}
    >
      <Text style={[
        styles.filterButtonText,
        filters.status?.includes(status) && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const PriorityFilterButton: React.FC<{ priority: TaskPriority; label: string; color: string }> = ({ 
    priority, 
    label, 
    color 
  }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filters.priority?.includes(priority) && { backgroundColor: color, opacity: 0.8 }
      ]}
      onPress={() => togglePriorityFilter(priority)}
    >
      <Text style={[
        styles.filterButtonText,
        filters.priority?.includes(priority) && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const CategoryFilterButton: React.FC<{ category: TaskCategory; label: string; icon: string }> = ({ 
    category, 
    label, 
    icon 
  }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filters.category?.includes(category) && styles.filterButtonActive
      ]}
      onPress={() => toggleCategoryFilter(category)}
    >
      <Text style={styles.filterButtonIcon}>{icon}</Text>
      <Text style={[
        styles.filterButtonText,
        filters.category?.includes(category) && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar tarefas..."
          value={searchText}
          onChangeText={handleSearchTextChange}
          clearButtonMode="while-editing"
        />
        <TouchableOpacity
          style={styles.filterToggleButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.filterToggleIcon}>⚙️</Text>
          {hasActiveFilters && <View style={styles.activeFilterIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Contador de resultados */}
      {taskCounts && (
        <View style={styles.resultsCounter}>
          <Text style={styles.resultsText}>
            {hasActiveFilters 
              ? `${taskCounts.filtered} de ${taskCounts.total} tarefas`
              : `${taskCounts.total} tarefas`
            }
          </Text>
          {hasActiveFilters && (
            <TouchableOpacity onPress={onClearFilters}>
              <Text style={styles.clearFiltersText}>Limpar filtros</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Modal de filtros */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtros</Text>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Filtros de Status */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Status</Text>
              <View style={styles.filterRow}>
                <StatusFilterButton status="em andamento" label="Em Andamento" color="#FF9800" />
                <StatusFilterButton status="concluída" label="Concluídas" color="#4CAF50" />
                <StatusFilterButton status="excluída" label="Excluídas" color="#666" />
              </View>
            </View>

            {/* Filtros de Prioridade */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Prioridade</Text>
              <View style={styles.filterRow}>
                {APP_CONFIG.PRIORITIES.map(priority => (
                  <PriorityFilterButton
                    key={priority.key}
                    priority={priority.key}
                    label={priority.label}
                    color={priority.color}
                  />
                ))}
              </View>
            </View>

            {/* Filtros de Categoria */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Categoria</Text>
              <View style={styles.filterColumn}>
                {APP_CONFIG.CATEGORIES.map(category => (
                  <CategoryFilterButton
                    key={category.key}
                    category={category.key}
                    label={category.label}
                    icon={category.icon}
                  />
                ))}
              </View>
            </View>

            {/* Botão limpar filtros */}
            {hasActiveFilters && (
              <TouchableOpacity
                style={styles.clearAllButton}
                onPress={() => {
                  onClearFilters();
                  setSearchText('');
                  setIsModalVisible(false);
                }}
              >
                <Text style={styles.clearAllButtonText}>Limpar Todos os Filtros</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default TaskFiltersComponent;