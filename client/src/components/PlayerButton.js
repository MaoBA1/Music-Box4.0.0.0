//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {AntDesign} from 'react-native-vector-icons';
import Colors from '../Utitilities/AppColors';

// create a component
const PlayerButton = (props) => {
    const {
        iconType,
        iconColor = Colors.grey6,
        onPress  ,
        size  
    } = props;

    const getIconName = (type) => {
        switch(type) {
            case 'PLAY':
                return 'pausecircle'
            case 'PAUSE':
                return 'playcircleo' 
            case 'NEXT':
                return 'forward'
            case 'PREV':
                return 'banckward'             
        }
    }
    return (

        <AntDesign
            {...props}
            onPress={onPress}
            name={getIconName(iconType)}
            size={size}
            color={iconColor}
            
        />
    );
};

export default PlayerButton;
