


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import { getHistory } from '../utils/storage';

export default function HistoryScreen() {
  
  const [history, setHistory] = useState([]);
  
  
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    loadHistory();
  }, []);

  
  const loadHistory = async () => {
    setIsLoading(true);
    const data = await getHistory();
    setHistory(data);
    setIsLoading(false);
  };

  
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  
  const renderItem = ({ item }) => {
    const isWorkMode = item.mode === 'work';
    
    return (
      <View style={styles.card}>
       
        <View style={[styles.iconContainer, isWorkMode ? styles.workIcon : styles.breakIcon]}>
          <Text style={styles.iconText}>{isWorkMode ? '💼' : '☕'}</Text>
        </View>
        
      
        <View style={styles.infoContainer}>
          <Text style={styles.modeText}>
            {isWorkMode ? 'Work Session' : 'Break Session'}
          </Text>
          <Text style={styles.durationText}>
            Duration: {formatDuration(item.duration)}
          </Text>
          <Text style={styles.dateText}>
            Completed: {formatDateTime(item.completedAt)}
          </Text>
        </View>
      </View>
    );
  };

  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyText}>Chưa có phiên nào</Text>
      <Text style={styles.emptySubtext}>
        Hoàn thành một phiên work để xem lịch sử
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
     
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch sử</Text>
        <Text style={styles.headerSubtitle}>
          {history.length} phiên đã hoàn thành
        </Text>
      </View>

      {/* FlatList hiển thị lịch sử */}
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', 
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  workIcon: {
    backgroundColor: '#E3F2FD', 
  },
  breakIcon: {
    backgroundColor: '#FFF3E0', 
  },
  iconText: {
    fontSize: 24,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  modeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  durationText: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#757575',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
});
