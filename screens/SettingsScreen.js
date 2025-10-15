import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getSettings, saveSettings } from '../utils/storage';

export default function SettingsScreen() {
  const [workDuration, setWorkDuration] = useState('25');
  const [breakDuration, setBreakDuration] = useState('5');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await getSettings();
    if (settings) {
      setWorkDuration((settings.workDuration / 60).toString());
      setBreakDuration((settings.breakDuration / 60).toString());
    }
  };

  const handleSave = async () => {
    const work = parseInt(workDuration);
    const breakTime = parseInt(breakDuration);

    if (isNaN(work) || isNaN(breakTime)) {
      Alert.alert('Invalid Input', 'Please enter valid numbers');
      return;
    }

    if (work < 1 || work > 120) {
      Alert.alert('Invalid Work Duration', 'Work duration must be between 1 and 120 minutes');
      return;
    }

    if (breakTime < 1 || breakTime > 60) {
      Alert.alert('Invalid Break Duration', 'Break duration must be between 1 and 60 minutes');
      return;
    }

    const settings = {
      workDuration: work * 60,
      breakDuration: breakTime * 60,
    };

    await saveSettings(settings);
    Alert.alert('Success', 'Settings saved! Go back to Timer tab to see changes.');
  };

  const handleReset = () => {
    setWorkDuration('25');
    setBreakDuration('5');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>⚙️ Settings</Text>
        <Text style={styles.subtitle}>Customize your Pomodoro timer</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Work Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            value={workDuration}
            onChangeText={setWorkDuration}
            keyboardType="number-pad"
            placeholder="25"
            maxLength={3}
          />
          <Text style={styles.hint}>Recommended: 25 minutes</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Break Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            value={breakDuration}
            onChangeText={setBreakDuration}
            keyboardType="number-pad"
            placeholder="5"
            maxLength={2}
          />
          <Text style={styles.hint}>Recommended: 5 minutes</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]} 
            onPress={handleSave}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>💾 Save Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.resetButton]} 
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>↻ Reset to Default</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ About Pomodoro Technique</Text>
          <Text style={styles.infoText}>
            The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontWeight: '600',
  },
  hint: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 12,
    marginBottom: 24,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#1976D2',
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  resetButton: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
