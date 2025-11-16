import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography } from '../styles/global';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  
  // Loading
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 12,
  },
  
  // Header
  header: {
    backgroundColor: colors.surface,
    padding: 16,
    marginBottom: 8,
  },
  
  title: {
    ...typography.h2,
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  
  // Stat cards
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: (width - 48) / 2, // 2 columns with margins
  },
  
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  statCardIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  
  statCardValue: {
    ...typography.h2,
    fontSize: 24,
    color: colors.text,
    fontWeight: 'bold',
  },
  
  statCardTitle: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 12,
  },
  
  statCardSubtitle: {
    ...typography.body,
    color: colors.primary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  
  // Chart sections
  chartSection: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  sectionTitle: {
    ...typography.body,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  
  pieChart: {
    height: 180,
    width: 180,
  },
  
  centerLabel: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -20 }],
    alignItems: 'center',
  },
  
  centerLabelValue: {
    ...typography.h1,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  
  centerLabelText: {
    ...typography.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
  
  // Legend
  legendContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  
  legendColorBox: {
    width: 14,
    height: 14,
    marginRight: 8,
    borderRadius: 3,
  },
  
  legendText: {
    ...typography.body,
    fontSize: 13,
    color: colors.text,
    flex: 1,
  },
  
  // Empty state
  emptyState: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  
  emptyStateText: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
