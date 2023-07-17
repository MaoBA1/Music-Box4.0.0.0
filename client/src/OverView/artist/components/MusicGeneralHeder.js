import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Platform
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../../../Utitilities/AppColors';

const MusicGeneralHeader = props => {
    
    return(
        <View style={{width: '100%', backgroundColor: Colors.grey1, height: Platform.OS == 'ios' ? 100 : 80, flexDirection:'column-reverse'}}>
            <View style={{flexDirection:'row', width:'100%', top:10}}>
                    <TouchableOpacity style={{
                            shadowColor: '#171717',
                            shadowOffset: {width: 0, height: 10},
                            shadowOpacity: 0.5,
                            shadowRadius: 3,
                            width:'10%',
                            alignItems: 'center'
                        }} 
                        onPress={props.goBack}
                    >
                        <FontAwesome
                            name='close'
                            size={25}
                            color={'#fff'}
                        />
                    </TouchableOpacity>
                    <View 
                        style={{
                            width:'80%', alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: '#171717',
                            shadowOffset: {width: 0, height: 10},
                            shadowOpacity: 0.5,
                            shadowRadius: 3,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'Baloo2-ExtraBold', fontSize:25,
                                color: Colors.grey2,
                                textShadowColor: Colors.red3,
                                textShadowOffset: {width: 0, height:2},
                                textShadowRadius:10
                            }}
                        >
                            {props.title}
                        </Text>
                    </View>
            </View>
        </View>
    )
}

export default MusicGeneralHeader;