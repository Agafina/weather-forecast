import AsyncStorage from "@react-native-async-storage/async-storage";

export const setData = async() => {
    try{
        await AsyncStorage.setItem(key, value)

    }catch(error){
        return('Error storing Value', error)
    }
}

export const getData = async() => {
    try{
        await AsyncStorage.getItem(key)
        return value;
    }catch(error){
        return('unable to return value', error)
    }
}