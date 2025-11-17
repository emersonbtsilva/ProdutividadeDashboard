import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { PieChart, BarChart, LineChart } from 'react-native-svg-charts';
import { Task, TaskStats } from '../models/Task';
import { APP_CONFIG } from '../constants/config';
import { styles } from './ProductivityChart.styles';
import { colors } from '../styles/global';

interface ProductivityChartProps {
  stats: TaskStats;
  isLoading?: boolean;
  tasks?: Task[];
}

const ProductivityChart: React.FC<ProductivityChartProps> = ({ stats, isLoading, tasks = [] }) => {
  const [rangeDays, setRangeDays] = React.useState<7 | 14 | 30>(7);
  const [cardWidthPerc, setCardWidthPerc] = React.useState<string>('48%');

  React.useEffect(() => {
    const compute = () => {
      const w = Dimensions.get('window').width;
      if (w >= 1200) setCardWidthPerc('31%');
      else if (w >= 700) setCardWidthPerc('48%');
      else setCardWidthPerc('100%');
    };
    compute();
    const sub = Dimensions.addEventListener('change', compute);
    return () => {
      // @ts-ignore RN old signature compatibility
      sub?.remove?.();
    };
  }, []);
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

  const averageTimeLabel = useMemo(() => {
    if (stats.averageCompletionTimeHours == null) return '—';
    const hours = stats.averageCompletionTimeHours;
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    }
    if (hours < 24) return `${hours.toFixed(1)}h`;
    const days = Math.floor(hours / 24);
    const remH = Math.round(hours % 24);
    return remH > 0 ? `${days}d ${remH}h` : `${days}d`;
  }, [stats.averageCompletionTimeHours]);

  const onTimeRate = useMemo(() => {
    const sample = stats.onTimeCompleted + stats.lateCompleted;
    if (sample === 0) return 0;
    return Math.round((stats.onTimeCompleted / sample) * 100);
  }, [stats.onTimeCompleted, stats.lateCompleted]);

  // Trend series based on selected range
  const trendSeries = useMemo(() => {
    const tail = stats.byDayCompletedLast30.slice(-rangeDays);
    return tail.map(d => d.count);
  }, [stats.byDayCompletedLast30, rangeDays]);

  // Next deadlines (top 3 upcoming)
  const nextDeadlines = useMemo(() => {
    const now = new Date();
    return tasks
      .filter(t => t.status !== 'concluída' && t.status !== 'excluída' && t.dueDate && (t.dueDate as Date) >= now)
      .sort((a, b) => (a.dueDate as Date).getTime() - (b.dueDate as Date).getTime())
      .slice(0, 3);
  }, [tasks]);

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
    style?: any;
  }> = ({ title, value, icon, color, subtitle, style }) => (
    <View style={[styles.statCard, { borderLeftColor: color }, style ]}>
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
            style={{ width: cardWidthPerc }}
          />
          <StatCard
            title="Conclusão"
            value={completionRate}
            icon="✅"
            color={colors.success}
            subtitle={`${completionRate}%`}
            style={{ width: cardWidthPerc }}
          />
          <StatCard
            title="Pendentes"
            value={stats.pending}
            icon="⏳"
            color="#FF9800"
            style={{ width: cardWidthPerc }}
          />
          <StatCard
            title="Atrasadas"
            value={stats.overdue}
            icon="🚨"
            color={colors.danger}
            style={{ width: cardWidthPerc }}
          />
          <StatCard
            title="Hoje"
            value={stats.completedToday}
            icon="📅"
            color={colors.primary}
            style={{ width: cardWidthPerc }}
          />
          <StatCard
            title="7 dias"
            value={stats.completedLast7Days}
            icon="🗓️"
            color={colors.primary}
            style={{ width: cardWidthPerc }}
          />
          <StatCard
            title="30 dias"
            value={stats.completedLast30Days}
            icon="📆"
            color={colors.primary}
            style={{ width: cardWidthPerc }}
          />
          <StatCard
            title="Tempo médio"
            value={stats.averageCompletionTimeHours ? Math.round(stats.averageCompletionTimeHours) : 0}
            icon="⏱️"
            color={colors.accent}
            subtitle={averageTimeLabel}
            style={{ width: cardWidthPerc }}
          />
          <StatCard
            title="No prazo"
            value={onTimeRate}
            icon="🟢"
            color={colors.success}
            subtitle={`${onTimeRate}%`}
            style={{ width: cardWidthPerc }}
          />
        </View>
      </View>

      {/* Seletor de período e tendência */}
      <View style={styles.chartSection}>
        <View style={styles.rangeHeader}>
          <Text style={styles.sectionTitle}>Tendência de Conclusões</Text>
          <View style={styles.rangeToggle}>
            {[7, 14, 30].map((n) => (
              <TouchableOpacity
                key={n}
                onPress={() => setRangeDays(n as 7 | 14 | 30)}
                style={[styles.rangeBtn, rangeDays === n && styles.rangeBtnActive]}
              >
                <Text style={[styles.rangeBtnText, rangeDays === n && styles.rangeBtnTextActive]}>
                  {n}d
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => {
              const tail = stats.byDayCompletedLast30.slice(-rangeDays);
              const csv = ['date,count', ...tail.map(d => `${d.date},${d.count}`)].join('\n');
              if (Platform.OS === 'web') {
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `produtividade_${rangeDays}d.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              } else {
                console.log('CSV Export:\n' + csv);
              }
            }}
            style={styles.rangeBtn}
          >
            <Text style={styles.rangeBtnText}>Exportar CSV</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.trendChartContainer}>
          <LineChart
            style={styles.trendChart}
            data={trendSeries.length ? trendSeries : [0]}
            svg={{ stroke: colors.primary, strokeWidth: 2 }}
            contentInset={{ top: 10, bottom: 10 }}
          />
        </View>
      </View>

      {/* Próximos prazos */}
      {nextDeadlines.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Próximos prazos</Text>
          {nextDeadlines.map(t => (
            <View key={t.id} style={styles.deadlineItem}>
              <Text style={styles.deadlineTitle}>{t.title}</Text>
              <Text style={styles.deadlineDate}>{new Date(t.dueDate as Date).toLocaleDateString()}</Text>
            </View>
          ))}
        </View>
      )}

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

      {/* Por Prioridade */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Por Prioridade</Text>
        <BarChart
          style={styles.barChart}
          data={priorityData.map(p => p.value)}
          svg={{ fill: colors.primary }}
          contentInset={{ top: 10, bottom: 10 }}
          spacingInner={0.3}
        />
        <View style={styles.barLabelsRow}>
          {priorityData.map(p => (
            <Text key={p.key} style={styles.barLabel}>{p.label}</Text>
          ))}
        </View>
      </View>

      {/* Por Categoria */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Por Categoria</Text>
        <BarChart
          style={styles.barChart}
          data={categoryData.map(c => c.value)}
          svg={{ fill: colors.accent }}
          contentInset={{ top: 10, bottom: 10 }}
          spacingInner={0.3}
        />
        <View style={styles.barLabelsRow}>
          {categoryData.map(c => (
            <Text key={c.key} style={styles.barLabel}>{c.label}</Text>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ProductivityChart;
