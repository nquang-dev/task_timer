


import AsyncStorage from '@react-native-async-storage/async-storage';


const STORAGE_KEY = '@pomodoro_history';

/**
 
 * @param {Object} session 
 */
export const saveSession = async (session) => {
  try {
    
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    
    
    const history = existingData ? JSON.parse(existingData) : [];
    
    
    history.unshift(session);
    
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    
    console.log('✅ Session đã được lưu:', session);
  } catch (error) {
    console.error('❌ Lỗi khi lưu session:', error);
  }
};

/**

 * @returns {Array} Mảng các session đã hoàn thành
 */
export const getHistory = async () => {
  try {
    
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    
    
    const history = data ? JSON.parse(data) : [];
    
    console.log(`📚 Đã tải ${history.length} session từ lịch sử`);
    return history;
  } catch (error) {
    console.error('❌ Lỗi khi đọc lịch sử:', error);
    return []; 
  }
};


export const clearHistory = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ Đã xóa toàn bộ lịch sử');
  } catch (error) {
    console.error('❌ Lỗi khi xóa lịch sử:', error);
  }
};
