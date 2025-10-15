// TimerScreen.js - Màn hình chính với timer đếm ngược
// Phase 1: Chỉ hiển thị UI và logic đếm ngược cơ bản, chưa lưu lịch sử

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';

export default function TimerScreen() {
  // State quản lý thời gian còn lại (giây)
  const WORK_DURATION = 25 * 60; // 25 phút = 1500 giây
  const [timeRemaining, setTimeRemaining] = useState(WORK_DURATION);
  
  // State quản lý trạng thái chạy/dừng
  const [isRunning, setIsRunning] = useState(false);
  
  // State quản lý chế độ (work/break) - Phase 1 chỉ có Work mode
  const [mode, setMode] = useState('work');
  
  // Ref để lưu interval ID, tránh memory leak
  const intervalRef = useRef(null);

  // useEffect: Xử lý đếm ngược khi isRunning = true
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      // Tạo interval đếm ngược mỗi giây
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            // Khi hết giờ, dừng timer
            setIsRunning(false);
            console.log('⏰ Timer completed!');
            // Phase 2: Sẽ thêm logic lưu lịch sử ở đây
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      // Clear interval khi pause hoặc hết giờ
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    // Cleanup: Clear interval khi component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining]);

  // Format thời gian từ giây sang mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handler: Start/Resume timer
  const handleStart = () => {
    console.log('▶️ Start button pressed');
    setIsRunning(true);
  };

  // Handler: Pause timer
  const handlePause = () => {
    console.log('⏸️ Pause button pressed');
    setIsRunning(false);
  };

  // Handler: Reset timer về thời gian ban đầu
  const handleReset = () => {
    console.log('🔄 Reset button pressed');
    setIsRunning(false);
    setTimeRemaining(WORK_DURATION);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header: Hiển thị chế độ hiện tại */}
      <View style={styles.header}>
        <Text style={styles.modeText}>Work Time</Text>
        <Text style={styles.modeSubtext}>Stay focused! 🎯</Text>
      </View>

      {/* Timer Display: Hiển thị đồng hồ đếm ngược */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
      </View>

      {/* Control Buttons: Start, Pause, Reset */}
      <View style={styles.controlsContainer}>
        {!isRunning ? (
          <TouchableOpacity 
            style={[styles.button, styles.startButton]} 
            onPress={handleStart}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.button, styles.pauseButton]} 
            onPress={handlePause}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Status Indicator: Hiển thị trạng thái */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, isRunning ? styles.runningDot : styles.pausedDot]} />
        <Text style={styles.statusText}>
          {isRunning ? 'Running...' : 'Paused'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD', // Nền xanh nhạt theo SPEC
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  modeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976D2', // Xanh đậm theo SPEC
    marginBottom: 8,
  },
  modeSubtext: {
    fontSize: 16,
    color: '#64B5F6',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#1565C0',
    fontVariant: ['tabular-nums'], // Font monospace cho số
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 40,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
    // Shadow cho iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow cho Android
    elevation: 3,
  },
  startButton: {
    backgroundColor: '#1976D2',
  },
  pauseButton: {
    backgroundColor: '#F57C00', // Cam cho pause
  },
  resetButton: {
    backgroundColor: '#757575', // Xám cho reset
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  runningDot: {
    backgroundColor: '#4CAF50', // Xanh lá khi đang chạy
  },
  pausedDot: {
    backgroundColor: '#9E9E9E', // Xám khi pause
  },
  statusText: {
    fontSize: 14,
    color: '#616161',
  },
});
