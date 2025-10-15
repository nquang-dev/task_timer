


import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { saveSession } from '../utils/storage';

export default function TimerScreen() {
  
  const WORK_DURATION = 25 * 60; 
  const [timeRemaining, setTimeRemaining] = useState(WORK_DURATION);
  
  
  const [isRunning, setIsRunning] = useState(false);
  
  
  const [mode, setMode] = useState('work');
  
  
  const [sessionStartTime, setSessionStartTime] = useState(null);
  
  
  const intervalRef = useRef(null);

  
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            
            setIsRunning(false);
            handleSessionComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining]);

  
  const handleSessionComplete = async () => {
    console.log('⏰ Timer completed!');
    
    
    if (!sessionStartTime) {
      console.log('⚠️ Không có sessionStartTime, bỏ qua việc lưu');
      return;
    }

    
    const endTime = Date.now();
    const session = {
      id: endTime.toString(), 
      mode: mode, 
      startTime: sessionStartTime, 
      endTime: endTime, 
      duration: WORK_DURATION, 
      completedAt: new Date(endTime).toISOString(), 
    };

    
    await saveSession(session);
    console.log('💾 Session đã lưu vào lịch sử');
    
    
    setSessionStartTime(null);
  };

  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  
  const handleStart = () => {
    console.log('▶️ Start button pressed');
    
    
    if (!sessionStartTime) {
      setSessionStartTime(Date.now());
      console.log('🕐 Session bắt đầu:', new Date().toLocaleTimeString());
    }
    
    setIsRunning(true);
  };

  
  const handlePause = () => {
    console.log('⏸️ Pause button pressed');
    setIsRunning(false);
  };

  
  const handleReset = () => {
    console.log('🔄 Reset button pressed');
    setIsRunning(false);
    setTimeRemaining(WORK_DURATION);
    
    setSessionStartTime(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
 
      <View style={styles.header}>
        <Text style={styles.modeText}>Work Time</Text>
        <Text style={styles.modeSubtext}>Stay focused! 🎯</Text>
      </View>

     
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
      </View>

     
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
    backgroundColor: '#E3F2FD', 
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
    color: '#1976D2', 
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
    fontVariant: ['tabular-nums'], 
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
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    
    elevation: 3,
  },
  startButton: {
    backgroundColor: '#1976D2',
  },
  pauseButton: {
    backgroundColor: '#F57C00', 
  },
  resetButton: {
    backgroundColor: '#757575', 
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
    backgroundColor: '#4CAF50', 
  },
  pausedDot: {
    backgroundColor: '#9E9E9E', 
  },
  statusText: {
    fontSize: 14,
    color: '#616161',
  },
});
