import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Reading string value
const getDataString = async (key_storage) => {
    try {
        const value = await AsyncStorage.getItem(key_storage);
        if (value !== null) {
            return value;
        } else {
            console.log('Value from AsyncStorage is null');
            return '';
        }
    } catch (e) {
        // error reading value
        Alert.alert('error reading value from AsyncStorage');
    }
};

// Storing string value
const storeDataString = async (key_storage, value) => {
    try {
        await AsyncStorage.setItem(key_storage, value);
    } catch (e) {
        // saving error
        Alert.alert('error save value to AsyncStorage');
        console.log('error save value to AsyncStorage', e);
    }
};

// Storing string value
const storeObjectValue = async (key_storage, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key_storage, jsonValue);
    } catch (e) {
        // saving error
        Alert.alert('error save value to AsyncStorage');
        console.log('error save value to AsyncStorage', e);
    }
};

const getDataObject = async (key_storage) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key_storage);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
        Alert.alert('error reading value from AsyncStorage');
    }
};

const removeValueOfKey = async (key_storage) => {
    try {
        await AsyncStorage.removeItem(key_storage);
    } catch (e) {
        // remove error
        Alert.alert('remove error from AsyncStorage');
    }
};
export { getDataString, storeDataString, storeObjectValue, getDataObject, removeValueOfKey };
