import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Colors from '../../../Utitilities/AppColors'
import Ionicons from 'react-native-vector-icons/Ionicons';


const FeedHeadr = props => {
    return <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
            <TouchableOpacity onPress={() => props.openModal(true)} style={{
                shadowColor:'#000', shadowOffset:{width:0, height:3}, shadowOpacity:0.5, justifyContent: 'center',
                shadowRadius :5, backgroundColor:Colors.red3, width:80, alignItems: 'center', height:30,
                borderRadius:50, borderWidth:2, borderColor:'#fff'
            }}>
                <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>New Post</Text>   
            </TouchableOpacity>
        </View>
}


export default FeedHeadr;