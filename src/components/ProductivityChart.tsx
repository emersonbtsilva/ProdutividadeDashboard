import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { Task } from '../models/Task';
import { styles } from './ProductivityChart.styles';
import { colors } from '../styles/global';

interface ProductivityChartProps {
  tasks: Task[];
}

const ProductivityChart: React.FC<ProductivityChartProps> = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.status === 'concluída').length;
  const pendingTasks = tasks.length - completedTasks;

  const data = [
    {
      key: 1,
      amount: completedTasks,
      svg: { fill: colors.success },
      name: 'Concluídas'
    },
    {
      key: 2,
      amount: pendingTasks,
      svg: { fill: colors.danger },
      name: 'Em Andamento'
    }
  ];

  const pieData = data.filter(value => value.amount > 0);

  const Legend = () => (
    <View style={styles.legendContainer}>
      {data.map(item => (
        <View key={item.key} style={styles.legendItem}>
          <View style={[styles.legendColorBox, { backgroundColor: item.svg.fill }]} />
          <Text style={styles.legendText}>{`${item.name} (${item.amount})`}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo de Tarefas</Text>
      {tasks.length > 0 ? (
        <PieChart
          style={{ height: 180, width: 180 }}
          data={pieData}
          valueAccessor={({ item }: { item: { amount: number } }) => item.amount}
          outerRadius={'95%'}
        />
      ) : (
        <Text>Nenhuma tarefa para exibir.</Text>
      )}
      <Legend />
    </View>
  );
};

export default ProductivityChart;
