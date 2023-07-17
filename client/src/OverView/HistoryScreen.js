import React, { useState, useEffect, useCallback } from 'react';
import { 
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Modal, Platform,
    ActivityIndicator,
    KeyboardAvoidingView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import baseIpRequest from '../ServerDev';
import Colors from '../Utitilities/AppColors';
import Style from './Style/HistoryStyle';


const HistyoryScreen = props => {
    return(
        <ImageBackground 
                source={ require('../../assets/AppAssets/Logo.png') }
                resizeMode="cover" 
                style={Style.backgroundContainer}
                imageStyle={{opacity: 0.3}}
        >
            <View style={Style.mainContainer}>
                <Text>History</Text>
            </View>

        </ImageBackground>
    )
}


export const screenOptions = navData => {
    return {
        headerShown: false,
        tabBarLabel:'History',
        tabBarLabelStyle: {
            fontFamily: 'Baloo2-Medium',
            fontSize:25
        },
        tabBarIcon:({focused,color,size}) => {
            const iconColor = focused? Colors.red3 : '#ffffff'
            const iconSzie = focused? 24 : 22
            return(
            <Fontisto name={'history'} color={iconColor} size={iconSzie} />
            )

        } 
    }
}


export default HistyoryScreen;