


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { saveSession, getSettings } from '../utils/storage';
import { scheduleNotification, cancelNotification, sendImmediateNotification } from '../utils/notifications';
import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

export default function TimerScreen() {
  const DEFAULT_WORK_DURATION = 25 * 60;
  const DEFAULT_BREAK_DURATION = 5 * 60;
  
  const [WORK_DURATION, setWorkDuration] = useState(DEFAULT_WORK_DURATION);
  const [BREAK_DURATION, setBreakDuration] = useState(DEFAULT_BREAK_DURATION);
  
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work');
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const intervalRef = useRef(null);
  const notificationIdRef = useRef(null);

  const loadSettings = useCallback(async () => {
    const settings = await getSettings();
    if (settings) {
      setWorkDuration(settings.workDuration);
      setBreakDuration(settings.breakDuration);
      
      if (!isRunning) {
        if (mode === 'work') {
          setTimeRemaining(settings.workDuration);
        } else {
          setTimeRemaining(settings.breakDuration);
        }
      }
      console.log('⚙️ Settings loaded:', settings);
    }
  }, [mode, isRunning]);

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [loadSettings])
  );

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      activateKeepAwakeAsync();
      
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
      deactivateKeepAwake();
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      deactivateKeepAwake();
    };
  }, [isRunning, timeRemaining]);

  const handleSessionComplete = async () => {
    console.log('⏰ Timer completed!');
    
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    await sendImmediateNotification(mode);
    
    if (!sessionStartTime) {
      console.log('⚠️ Không có sessionStartTime, bỏ qua việc lưu');
      return;
    }

    const endTime = Date.now();
    const sessionDuration = mode === 'work' ? WORK_DURATION : BREAK_DURATION;
    const session = {
      id: endTime.toString(),
      mode: mode,
      startTime: sessionStartTime,
      endTime: endTime,
      duration: sessionDuration,
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

  const handleStart = async () => {
    console.log('▶️ Start button pressed');
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (!sessionStartTime) {
      setSessionStartTime(Date.now());
      console.log('🕐 Session bắt đầu:', new Date().toLocaleTimeString());
    }
    
    if (notificationIdRef.current) {
      await cancelNotification(notificationIdRef.current);
    }
    
    const notificationId = await scheduleNotification(timeRemaining, mode);
    notificationIdRef.current = notificationId;
    
    setIsRunning(true);
  };

  const handlePause = async () => {
    console.log('⏸️ Pause button pressed');
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (notificationIdRef.current) {
      await cancelNotification(notificationIdRef.current);
      notificationIdRef.current = null;
    }
    
    setIsRunning(false);
  };

  const handleReset = async () => {
    console.log('🔄 Reset button pressed');
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (notificationIdRef.current) {
      await cancelNotification(notificationIdRef.current);
      notificationIdRef.current = null;
    }
    
    setIsRunning(false);
    const newDuration = mode === 'work' ? WORK_DURATION : BREAK_DURATION;
    setTimeRemaining(newDuration);
    setSessionStartTime(null);
  };

  const toggleMode = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const newMode = mode === 'work' ? 'break' : 'work';
    setMode(newMode);
    setIsRunning(false);
    
    if (notificationIdRef.current) {
      await cancelNotification(notificationIdRef.current);
      notificationIdRef.current = null;
    }
    
    const newDuration = newMode === 'work' ? WORK_DURATION : BREAK_DURATION;
    setTimeRemaining(newDuration);
    setSessionStartTime(null);
  };

  const isWorkMode = mode === 'work';
  const backgroundColor = isWorkMode ? '#E3F2FD' : '#FFF3E0';
  const primaryColor = isWorkMode ? '#1976D2' : '#F57C00';
  const timerColor = timeRemaining < 60 ? '#D32F2F' : primaryColor;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.modeToggleContainer}>
        <TouchableOpacity 
          style={[styles.modeButton, isWorkMode && styles.modeButtonActive]}
          onPress={toggleMode}
          activeOpacity={0.7}
        >
          <Text style={[styles.modeButtonText, isWorkMode && styles.modeButtonTextActive]}>
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeButton, !isWorkMode && styles.modeButtonActive]}
          onPress={toggleMode}
          activeOpacity={0.7}
        >
          <Text style={[styles.modeButtonText, !isWorkMode && styles.modeButtonTextActive]}>
            Break
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={[styles.modeText, { color: primaryColor }]}>
          {isWorkMode ? 'Work Time' : 'Break Time'}
        </Text>
        <Text style={[styles.modeSubtext, { color: primaryColor }]}>
          {isWorkMode ? 'Stay focused! 🎯' : 'Relax and recharge ☕'}
        </Text>
      </View>

      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, { color: timerColor }]}>
          {formatTime(timeRemaining)}
        </Text>
      </View>

      <View style={styles.controlsContainer}>
        {!isRunning ? (
          <TouchableOpacity 
            style={[styles.button, styles.startButton, { backgroundColor: primaryColor }]} 
            onPress={handleStart}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>▶ Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.button, styles.pauseButton]} 
            onPress={handlePause}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>⏸ Pause</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>↻ Reset</Text>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#E3F2FD',
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
  },
  modeButtonTextActive: {
    color: '#1976D2',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  modeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modeSubtext: {
    fontSize: 18,
    fontWeight: '500',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 64,
    paddingVertical: 40,
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 12,
    minWidth: 130,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  startButton: {
  },
  pauseButton: {
    backgroundColor: '#FF9800',
  },
  resetButton: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  runningDot: {
    backgroundColor: '#4CAF50',
  },
  pausedDot: {
    backgroundColor: '#9E9E9E',
  },
  statusText: {
    fontSize: 15,
    color: '#616161',
    fontWeight: '500',
  },
});
