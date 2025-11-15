import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { styles } from './TaskForm.styles';

interface TaskFormProps {
  onAddTask: (title: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    onAddTask(title);
    setTitle('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nova tarefa"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <Button title="Adicionar" onPress={handleAdd} />
    </View>
  );
};

export default TaskForm;
