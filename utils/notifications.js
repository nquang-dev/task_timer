import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('❌ Không được cấp quyền thông báo');
    return false;
  }

  console.log('✅ Đã được cấp quyền thông báo');
  return true;
};

export const scheduleNotification = async (seconds, mode) => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: mode === 'work' ? '🎉 Work Session Complete!' : '☕ Break Time Over!',
        body: mode === 'work' 
          ? 'Great job! Time for a break.' 
          : 'Break is over. Ready to focus again?',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        seconds: seconds,
      },
    });
    
    console.log('📬 Notification scheduled with ID:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('❌ Lỗi khi schedule notification:', error);
    return null;
  }
};

export const cancelNotification = async (notificationId) => {
  if (notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('🚫 Notification cancelled:', notificationId);
    } catch (error) {
      console.error('❌ Lỗi khi cancel notification:', error);
    }
  }
};

export const sendImmediateNotification = async (mode) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: mode === 'work' ? '🎉 Work Session Complete!' : '☕ Break Time Over!',
        body: mode === 'work' 
          ? 'Great job! Time for a break.' 
          : 'Break is over. Ready to focus again?',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null,
    });
    console.log('📬 Immediate notification sent');
  } catch (error) {
    console.error('❌ Lỗi khi gửi notification:', error);
  }
};
