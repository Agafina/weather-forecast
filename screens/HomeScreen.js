import { StatusBar } from 'expo-status-bar';
import {  Image, Text, StyleSheet, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { theme, weatherImages } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline'
import {CalendarDaysIcon, MapPinIcon} from 'react-native-heroicons/solid'
import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { fetchLocations, fetchWeatherForecast } from '../api/weather';
import * as Progress from 'react-native-progress';
import { getData, setData } from '../utils/localStorage';



const HomeScreen = () => {

    const [showsearch, setShowSeach] = useState(false);
    const [locations, setLocations] = useState([1,2,3])
    const [weather, setWeather] = useState({})
    const [loading, setLoading] = useState(false)

    const handleLocation =(loc) => {
        console.log('location is', loc)
        setLocations([])
        setShowSeach(false)
        setLoading(true)
        fetchWeatherForecast({
            cityName:loc.name,
            days: '7'
        }).then(data => {
            setWeather(data)
            setData('city', loc.name)
            setLoading(false)
        })
    }
    const handleSearch = (value) => {
        if(value.length>2){
            fetchLocations({cityName: value}).then(data => {
                console.log('got location', data)
                setLocations(data)
            })
        }
    }
    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [])

    useEffect(() => {
        fetchMyWeatherData()
        
    },[])
    const fetchMyWeatherData = async() =>{
        let myCity = await getData('city')
        let myCityName = 'Buea'
        if(myCity) myCityName = myCity;
        fetchWeatherForecast({
            cityName:'Buea',
            days:'7'
        }).then(data => {
            setWeather(data)
        })
    }
    const { current, location} = weather;
    return ( 
        <View  className="flex-1 relative"  >
            <StatusBar style="light" />
            <Image blurRadius={70} source={require('../assets/images/bg.png')}
            className="absolute h-full w-full"
            />
        {
            loading? (
                <View className="flex-1 flex-row justify-center items-center ">
                    <Progress.CircleSnail size={140} thickness={20} color='#0bb3b2'/>
                </View>
            ): 
            (
        <SafeAreaView className="flex flex-1"  >
      {/*search section */}
      <View style={{ height: '7%' }} className="mx-4 relative z-50">
    <View className="flex-row justify-end items-center rounded-full"
        style={{ backgroundColor: showsearch ? theme.bgWhite(0.2) : 'transparent' }}
    >
        {showsearch ? <TextInput
            onChangeText={handleTextDebounce}
            placeholder='Search City'
            placeholderTextColor={'lightgray'}
            className="pl-6 flex-1 text-base h-10 text-white "
        /> : null}

        <TouchableOpacity onPress={() => setShowSeach(!showsearch)} style={{ backgroundColor: theme.bgWhite(0.3) }} className='rounded-full p-3 m-1'>
            <MagnifyingGlassIcon size='25' color='white' />
        </TouchableOpacity>
    </View>
    {showsearch && locations.length > 0 ? (
        <View className='absolute w-full bg-gray-300 top-16 rounded-3xl'>
            {
                locations.map((loc, index) => {
                    let showBorder = index + 1 !== locations.length
                    let borderClass = showBorder ? 'border-b-2 border-b-gray-400' : ''
                    return (
                        <TouchableOpacity
                            onPress={() => handleLocation(loc)}
                            key={index}
                            className={"flex-row border-0 p-3 px-4 mb-1 " + borderClass}
                        >
                            <MapPinIcon size='25' color='gray' />
                            <Text className="text-black text-lg ml-2">{loc?.name}, {loc?.country}</Text>
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    ) : null}
</View>

      {/*Forecase Section*/}
      <View className="mx-4 flex-1 justify-around flex mb-2">
            <Text className= "text-white text-center text-2xl font-bold">{location?.name}, 
                <Text className= "text-lg font-semibold text-gray-300">{" "+location?.country}</Text>
            </Text>
        {/*Add Weather Image here*/}
        <View className="flex-row justify-center">
            <Image
            source={weatherImages[current?.condition?.text]}
            className='w-52 h-52'
            />
        </View>
        {/*Degree Celcius*/}
        <View className='space-y-2'>
            <Text className="text-center font-bold text-white text-6xl ml-5">{current?.temp_c}&#176;</Text>
            <Text className="text-center tracking-widest text-white text-xl ">{current?.condition?.text}</Text>
        </View>
        {/* Other Stats*/}
        <View className="flex-row justify-around mx-4">
            <View className="flex-row space-x-2 items-center">
                <Image source={require('../assets/icons/wind.png')} className="h-6 w-6"/>
                <Text className="text-white font-semibold text-base">{current?.wind_kph}km</Text>
            </View>
            <View className="flex-row space-x-2 items-center">
                <Image source={require('../assets/icons/drop.png')} className="h-6 w-6"/>
                <Text className="text-white font-semibold text-base">{current?.humidity}%</Text>
            </View>
            <View className="flex-row space-x-2 items-center">
                <Image source={require('../assets/icons/sun.png')} className="h-6 w-6"/>
                <Text className="text-white font-semibold text-base">6:05 AM</Text>
            </View>
        </View>
      </View>
      {/*ForeCast Section for the Next day*/}
      <View className="mb-2 space-y-3">
            <View className="flex-row items-center mx-5 space-x-2">
                <CalendarDaysIcon size='22' color='white'/>
                <Text className="text-white text-base">Daily forecast</Text>
            </View>
            <ScrollView 
            horizontal
            contentContainerStyle={{paddingHorizontal: 15}}
            showsHorizontalScrollIndicator={false}
            >
                {
                    weather?.forecast?.forecastday?.map((item, index) => {
                        let data = new Date(item.date)
                        let option = {weekday: 'long'};
                        let dayName = data.toLocaleDateString('en-US', option)
                        return(
                                <View key={index} className="flex justify-center items-center w-24 rounded-3xl mx-5 py-3 space-y-1 mr-4"
                                style={{backgroundColor:theme.bgWhite(0.15)}}>
                                    <Image source={weatherImages[current?.condition?.text]} className='w-11 h-11'/>
                                    <Text className="text-white">{dayName}</Text>
                                    <Text className="text-white text-xl font-semibold">{item?.day?.avgtemp_c}&#176;</Text>
                                </View>
                        )
                    })
                }
                
             </ScrollView> 
      </View>
    </SafeAreaView>
            )
        }
    </View>
     );
}


export default HomeScreen;