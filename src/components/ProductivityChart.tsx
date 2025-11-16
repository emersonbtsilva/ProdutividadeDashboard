import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PieChart, BarChart, LineChart } from 'react-native-svg-charts';
import { TaskStats } from '../models/Task';
import { APP_CONFIG } from '../constants/config';
import { styles } from './ProductivityChart.styles';
import { colors } from '../styles/global';

interface ProductivityChartProps {
  stats: TaskStats;
  isLoading?: boolean;
}

const ProductivityChart: React.FC<ProductivityChartProps> = ({ stats, isLoading }) => {
  // Dados do gráfico de pizza
  const pieData = useMemo(() => {
    const data = [
      {
        key: 1,
        amount: stats.completed,
        svg: { fill: colors.success },
        name: 'Concluídas',
        percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
      },
      {
        key: 2,
        amount: stats.pending,
        svg: { fill: '#FF9800' },
        name: 'Em Andamento',
        percentage: stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0
      },
      {
        key: 3,
        amount: stats.deleted,
        svg: { fill: colors.textSecondary },
        name: 'Excluídas',
        percentage: stats.total > 0 ? Math.round((stats.deleted / stats.total) * 100) : 0
      }
    ];

    return data.filter(item => item.amount > 0);
  }, [stats]);

  // Dados do gráfico de prioridades
  const priorityData = useMemo(() => {
    return APP_CONFIG.PRIORITIES.map((priority, index) => ({
      value: stats.byPriority[priority.key] || 0,
      svg: { fill: priority.color },
      key: index,
      label: priority.label
    }));
  }, [stats.byPriority]);

  // Dados do gráfico de categorias
  const categoryData = useMemo(() => {
    return APP_CONFIG.CATEGORIES.map((category, index) => ({
      value: stats.byCategory[category.key] || 0,
      svg: { fill: colors.primary },
      key: index,
      label: category.label,
      icon: category.icon
    }));
  }, [stats.byCategory]);

  // Taxa de conclusão
  const completionRate = useMemo(() => {
    const activeTasks = stats.total - stats.deleted;
    return activeTasks > 0 ? Math.round((stats.completed / activeTasks) * 100) : 0;
  }, [stats]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando estatísticas...</Text>
        </View>
      </View>
    );
  }

  const StatCard: React.FC<{ 
    title: string; 
    value: number; 
    icon: string; 
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statCardHeader}>
        <Text style={styles.statCardIcon}>{icon}</Text>
        <View>
          <Text style={styles.statCardValue}>{value}</Text>
          <Text style={styles.statCardTitle}>{title}</Text>
          {subtitle && <Text style={styles.statCardSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );

  const Legend: React.FC<{ data: Array<{ svg: { fill: string }; name: string; amount: number; percentage: number }> }> = ({ data }) => (
    <View style={styles.legendContainer}>
      {data.map(item => (
        <View key={item.name} style={styles.legendItem}>
          <View style={[styles.legendColorBox, { backgroundColor: item.svg.fill }]} />
          <Text style={styles.legendText}>
            {`${item.name} (${item.amount}) - ${item.percentage}%`}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header com estatísticas principais */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard de Produtividade</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total"
            value={stats.total}
            icon="📊"
            color={colors.primary}
          />
          <StatCard
            title="Conclusão"
            value={completionRate}
            icon="✅"
            color={colors.success}
            subtitle={`${completionRate}%`}
          />
          <StatCard
            title="Pendentes"
            value={stats.pending}
            icon="⏳"
            color="#FF9800"
          />
          <StatCard
            title="Atrasadas"
            value={stats.overdue}
            icon="🚨"
            color={colors.danger}
          />
        </View>
      </View>

      {/* Gráfico principal de status */}
      {stats.total > 0 ? (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Status das Tarefas</Text>
          <View style={styles.chartContainer}>
            <PieChart
              style={styles.pieChart}
              data={pieData}
              valueAccessor={({ item }: { item: any }) => item.amount}
              outerRadius="90%"
              innerRadius="30%"
            />
            <View style={styles.centerLabel}>
              <Text style={styles.centerLabelValue}>{stats.total}</Text>
              <Text style={styles.centerLabelText}>Tarefas</Text>
            </View>
          </View>
          <Legend data={pieData} />
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📝</Text>
          <Text style={styles.emptyStateText}>
            Adicione tarefas para ver estatísticas
          </Text>
        </View>
      )}
    </View>
  );
};

export default ProductivityChart;
