import { View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import { SafeAreaView } from 'react-native';


export default function App() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View  className="flex-1 relative" >
        <HomeScreen />
      </View>
    </SafeAreaView>
  );
}
