import React, { useState, useEffect, useCallback } from 'react';
import { 
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Modal, Platform,
    ActivityIndicator,
    KeyboardAvoidingView ,
    FlatList, Animated
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Colors from '../Utitilities/AppColors';
import Style from './Style/HeaderStyle';


const Header = props => {
    const blessing = () => {
        const currentTime = new Date().getHours();
        if(currentTime >= 5 && currentTime<12) {
            return "Good Morning";
        } else if(currentTime >= 12 && currentTime<18) {
            return "Good After Noon";
        } else if(currentTime >= 18 && currentTime<22) {
            return "Good Evening";
        } else {
            return "Good Night";
        }
    }    

    return(
        <View style={[Style.container, Style.shadowProp]}>
            <View style={Style.iconContainer}>
                <TouchableOpacity onPress={props.func}>
                    <Entypo
                        name='menu'
                        size={25}
                        color={'#fff'}
                    />
                </TouchableOpacity>
            </View>
            <View style={Style.titleContainer}>
                <Text style={Style.title}>Music Box</Text>
            </View>
            <View style={Style.blessingContainer}>
                <Text style={Style.blassing}>{blessing()}</Text> 
            </View>
        </View>
    )
}

export default Header;