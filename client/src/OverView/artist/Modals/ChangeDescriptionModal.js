import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    TextInput
} from 'react-native';
import Colors from '../../../Utitilities/AppColors';
import Style from './Style/ChangeImageModalStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { changeArtistDescriptionAction } from '../../../../store/actions/artistActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getArtistData } from '../../../ApiCalls';


const ChangeDescriptionModal = props => {
    const dispatch = useDispatch();
    const [newDesc, setNewDesc] = useState('');

    const changeArtistDescription = async() => {
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
        if(userToken) {
            let action = changeArtistDescriptionAction(userToken, {description:newDesc})
            try{
                await dispatch(action)
                .then(result => {
                    getArtistData(dispatch, userToken);
                    props.func(false);
                })
            }catch(error) {
                console.log(error.message);
            }
        }
    }
    
    return(
        
        <Modal
            visible={true}
            transparent={true}
            animationType='slide'
        >
            <View style={{flex: 1, width: '100%', height:'100%', backgroundColor:Colors.grey3, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{width: '80%', backgroundColor:Colors.grey1, alignItems: 'center', justifyContent: 'center', padding:20, shadowColor:'#000', shadowOffset:{width:0, height:3}, shadowOpacity:0.5, shadowRadius :5, borderRadius:30}}>
                    <Text style={{fontFamily:'Baloo2-Bold', fontSize:18, color:'#fff'}}>Edit your about statment</Text>
                    <View style={{margin:10}}>
                        <Text style={{fontFamily:'Baloo2-Medium', fontSize:16, color:Colors.red3}}>{props.desc}</Text>
                    </View>
                    <TextInput
                        style={{width: '80%', height: 100, backgroundColor:'#fff', paddingHorizontal:10, borderRadius:20, fontFamily:'Baloo2-Medium', color:Colors.red3}}
                        placeholder="New Descriptions"
                        multiline
                        autoCorrect={false}
                        autoComplete={false}  
                        value={newDesc}
                        onChangeText={text => setNewDesc(text)}                      
                    />
                    <View style={{width:'100%', flexDirection:'row', justifyContent: 'center', marginTop:10}}>
                        {
                            newDesc.length > 0?
                            (
                                <TouchableOpacity onPress={changeArtistDescription} style={{margin:5 , width:80, backgroundColor:Colors.red3, alignItems: 'center', justifyContent: 'center', padding:5, borderRadius:50, borderWidth:2, borderColor:'#fff'}}>
                                    <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Eddit</Text>
                                </TouchableOpacity>
                            )
                            :
                            (
                                <View style={{opacity:0.7 ,margin:5 , width:80, backgroundColor:Colors.red3, alignItems: 'center', justifyContent: 'center', padding:5, borderRadius:50, borderWidth:2, borderColor:'#fff'}}>
                                    <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Eddit</Text>
                                </View>
                            )
                        }
                        <TouchableOpacity onPress={() => props.func(false)} style={{margin:5, width:80, backgroundColor:Colors.red3, alignItems: 'center', justifyContent: 'center', padding:5, borderRadius:50, borderWidth:2, borderColor:'#fff'}}>
                            <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>                
            </View>

            
        </Modal>
        
        
    )
}

export default ChangeDescriptionModal;