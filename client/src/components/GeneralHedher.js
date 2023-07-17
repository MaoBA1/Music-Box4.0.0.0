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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Colors from '../Utitilities/AppColors';
import Style from './Style/HeaderStyle';


const GeneralHeader = props => {
    return(
        <View style={[props.size == 'short' ? {height:70, flexDirection:'row'}: Style.generalHeaderContainer, Style.shadowProp]}>
                <View style={Style.generalIconContainer}>
                    <TouchableOpacity onPress={props.goBack}>
                        <FontAwesome
                            name='close'
                            size={25}
                            color={'#fff'}
                        />
                    </TouchableOpacity>
                </View>
                <View style={Style.generalTitleContainer}>
                    <Text style={Style.title}>{props.title}</Text>
                </View>
        </View>
    )
}

export default GeneralHeader;