import React from 'react';
import { SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import ProductivityChart from '../components/ProductivityChart';
import { useTasks } from '../hooks/useTasks';
import { styles } from './HomeScreen.styles';

const HomeScreen = () => {
  const { stats, isLoading, refreshTasks } = useTasks();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshTasks();
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshTasks]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#6200ee']}
            tintColor="#6200ee"
          />
        }
      >
        <ProductivityChart stats={stats} isLoading={isLoading} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
