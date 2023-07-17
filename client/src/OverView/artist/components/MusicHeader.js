import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Colors from '../../../Utitilities/AppColors'
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const MusicHeader = props => {
    return (
        <View style={{width: '100%', padding: 10, paddingVertical:15, backgroundColor:Colors.grey1, borderBottomWidth:2, borderBottomColor:Colors.grey3, flexDirection:'row' }}>
            <View style={{width:'20%', justifyContent: 'center'}}>
                    <TouchableOpacity style={{
                            shadowColor: '#171717',
                            shadowOffset: {width: 0, height: 10},
                            shadowOpacity: 0.5,
                            shadowRadius: 3,
                        }} 
                        onPress={props.goBack}
                    >
                        <FontAwesome
                            name='close'
                            size={25}
                            color={'#fff'}
                        />
                    </TouchableOpacity>
            </View>
            <View style={{
                    width:'60%', alignItems: 'center', justifyContent: 'center',
                    shadowColor: '#171717',
                    shadowOffset: {width: 0, height: 10},
                    shadowOpacity: 0.5,
                    shadowRadius: 3,
                }}>
                <Text 
                    style={{
                        fontFamily: 'Baloo2-ExtraBold', fontSize:25,
                        color: Colors.grey2,
                        textShadowColor: Colors.red3,
                        textShadowOffset: {width: 0, height:2},
                        textShadowRadius:10
                    }}
                >
                    Your Music
                </Text>
            </View>            
        </View>
    )
}


export default MusicHeader;