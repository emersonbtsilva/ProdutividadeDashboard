import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Task } from '../models/Task';
import { styles } from './TaskList.styles';
import { Button } from 'react-native';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, status: 'concluída' | 'em andamento') => void;
  onDeleteTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateTask, onDeleteTask }) => {

  const handleDelete = (id: string) => {
    Alert.alert(
      "Excluir Tarefa",
      "Você tem certeza que deseja excluir esta tarefa?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { text: "Excluir", onPress: () => onDeleteTask(id), style: 'destructive' }
      ]
    );
  };

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.taskItem}>
          <TouchableOpacity 
            style={{ flex: 1 }}
            onPress={() => onUpdateTask(item.id, item.status === 'concluída' ? 'em andamento' : 'concluída')}
          >
            <Text style={[styles.taskTitle, item.status === 'concluída' && { textDecorationLine: 'line-through', color: 'gray' }]}>
              {item.title}
            </Text>
            <Text style={styles.taskStatus}>{item.status}</Text>
          </TouchableOpacity>
          <Button title="Excluir" color="red" onPress={() => handleDelete(item.id)} />
        </View>
      )}
      style={styles.list}
    />
  );
};

export default TaskList;
