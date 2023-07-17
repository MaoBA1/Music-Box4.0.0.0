import React,{ useCallback, useEffect } from "react";
import { View, Text, ImageBackground, FlatList, TouchableOpacity} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../Utitilities/AppColors';
import Style from './Style';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GenerItem from "./components/GenerItem";
import { getUserDataAction } from '../../store/actions/userActions';
import { getGenersAction } from '../../store/actions/genersActions';
import { getPosts } from '../ApiCalls';



const FirstUseScreen = props => {
    const dispatch = useDispatch();
    const userDataSelector = useSelector(state => state.UserReducer);
    const generSelector = useSelector(state => state.GenerReducer);
    const geners = generSelector?.GenerReducer?.AllGeners;
    const user = userDataSelector?.UserReducer?.account;
    const firstName = user?.firstName;
    const formattedUserFirstName = firstName? firstName[0].toUpperCase() +
    firstName?.substring(1,firstName?.length) : firstName;
    const token = props.route.params?.token;
    
   const MoveToHomePage = async() => {
        const jsonIsItFirstUse = JSON.stringify(false);
        await AsyncStorage.setItem('IsItFirstUse', jsonIsItFirstUse);
        const jsonToken = await AsyncStorage.getItem('Token');         
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
        if(userToken) {
            getPosts(dispatch, userToken);
            props.navigation.navigate('OverView')
        }
   }
    
    return(
        <ImageBackground 
            source={ require('../../assets/AppAssets/Logo.png') }
            resizeMode="cover" 
            style={Style.backgroundContainer}
            imageStyle={{opacity: 0.3}}
        >
            <View style={Style.mainContainer}>
                <View style={Style.textContainer}>
                    <Text style={Style.title}>Hi {formattedUserFirstName}</Text>
                    <Text style={Style.title}>Welcome To MusicBox</Text>
                </View>

                <View style={Style.textContainer}>
                    <Text style={Style.subtitle}>What kind of music Would</Text>
                    <Text style={Style.subtitle}>you like to hear?</Text>
                </View>
                
                <FlatList
                    numColumns={3}                    
                    data={geners}
                    keyExtractor={item => item._id}
                    renderItem = { gener => <GenerItem gener={gener.item} token={token}/>}                    
                />                
                
                {
                    user?.favoritesGeners?.length > 0 ? (
                        <TouchableOpacity onPress={MoveToHomePage} style={Style.buttonContainer}>
                            <Text style={Style.buttonText}>Continue</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={{opacity:0.7, width:'100%', alignItems:'center'}}>
                            <View style={Style.buttonContainer}>
                                <Text style={Style.buttonText}>Continue</Text>
                            </View>
                        </View>
                    )
                }
                
                
            </View>
            
        </ImageBackground>
    )
}

export const screenOptions = navData => {
    return {
        headerTitle:'Pick Geners',
        headerShown: false,
        gestureEnabled:false,        
    }
}

export default FirstUseScreen;