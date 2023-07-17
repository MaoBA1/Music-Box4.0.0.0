import React, { useState } from 'react';
import {
    Text,
    View,
    Image,
    FlatList,
    Modal,
    ImageBackground,
    TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../../../Utitilities/AppColors';
import { changeArtistMainGenerAction, addGenerToAdditionalAction, removeGenerFromAdditionalAction } from '../../../../store/actions/artistActions';
import { getArtistData } from '../../../ApiCalls';



const EdditGenersModal = props => {
    const artistSelector = useSelector(state => state.ArtistsReducer);
    const dispatch = useDispatch();
    const generSelector = useSelector(state => state.GenerReducer);
    const geners = generSelector?.GenerReducer?.AllGeners;
    const [mainGener, setMainGener] = useState(props.details.type == 'main'? props.details.gener : null);
    const artistAditionalGeners = artistSelector?.ArtistDataReducer?.additionalGener;
    
    const changeArtistMainGener = async(gener) => {
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
        if(userToken){
            let action = changeArtistMainGenerAction(userToken, {gener:gener})
            try{
                await dispatch(action);
                setMainGener(gener);
                getArtistData(dispatch, userToken);
            } catch(error) {
                console.log(error.message);
            }
        }
    }

    const isInTheAdditionalList = gener => {
        let flag = false;
        artistAditionalGeners?.forEach(generItem => {
            if(gener._id === generItem._id) {
                flag = true;
                
            }
        })
        return flag;
    }

    const addGenerToAdditional = async (gener) => {
        
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
        if(userToken) {
            let action = addGenerToAdditionalAction(userToken, {gener:gener});
            try{
                await dispatch(action);
                getArtistData(dispatch, userToken);
            } catch(error) {
                console.log(error.message);
            }
        }
    }

    const removeGenerFromAdditional = async (gener) => {
        
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
        if(userToken) {
            let action = removeGenerFromAdditionalAction(userToken, {gener:gener});
            try{
                await dispatch(action);
                getArtistData(dispatch, userToken);
            } catch(error) {
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
                <View style={{padding:20, alignItems: 'center', width:'90%', height:'60%', backgroundColor:Colors.grey1, borderRadius:20, shadowColor:'#000', shadowOffset:{width:0, height:3}, shadowOpacity:0.5, shadowRadius :5}}>
                    <View>
                        <Text style={{fontSize:20, fontFamily:'Baloo2-Bold', color: '#fff'}}>Edit your geners</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        {
                            props.details.type == 'main'?
                            (
                                <FlatList
                                    numColumns={3}
                                    data={geners}
                                    keyExtractor={item => item._id}
                                    renderItem={gener => 
                                        gener.item._id == mainGener?._id?
                                        (
                                            <ImageBackground
                                                style={{width:95, height:65, margin:5, alignItems: 'center', justifyContent: 'center', opacity:0.7}}
                                                source={{uri:gener.item.generImage}}
                                            >
                                                <FontAwesome
                                                    name={'check'}
                                                    size={25}
                                                />
                                            </ImageBackground>
                                        )
                                        :
                                        (
                                            <TouchableOpacity onPress={() => changeArtistMainGener(gener.item)}>
                                                <Image
                                                    style={{width:95, height:65, margin:5}}
                                                    source={{uri:gener.item.generImage}}
                                                />
                                            </TouchableOpacity>
                                        )
                                    }
                                />
                            )
                            :
                            (
                                <FlatList
                                    numColumns={3}
                                    data={geners}
                                    keyExtractor={item => item._id}
                                    renderItem={gener => 
                                        
                                        isInTheAdditionalList(gener.item)?
                                        (
                                            <TouchableOpacity onPress={() =>removeGenerFromAdditional(gener.item)}>
                                                <ImageBackground
                                                    style={{width:95, height:65, margin:5, alignItems: 'center', justifyContent: 'center', opacity:0.7}}
                                                    source={{uri:gener.item.generImage}}
                                                >
                                                    <FontAwesome
                                                        name={'check'}
                                                        size={25}
                                                    />
                                                </ImageBackground>
                                            </TouchableOpacity>
                                        )
                                        :
                                        (
                                            <TouchableOpacity onPress={() => addGenerToAdditional(gener.item)}>
                                                <Image
                                                    style={{width:95, height:65, margin:5}}
                                                    source={{uri:gener.item.generImage}}
                                                />
                                            </TouchableOpacity>
                                        )
                                    }
                                />
                            )                            
                        }
                        
                            <TouchableOpacity onPress={() => props.func(false)} style={{bottom:60, width:100, padding:5, alignItems: 'center', justifyContent: 'center', backgroundColor:Colors.red3, borderRadius:50, borderWidth:2, borderColor:'#fff'}}>
                                <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Done</Text>
                            </TouchableOpacity>
                                              
                    </View>
                </View>

            </View>
        </Modal>
    )
}


export default EdditGenersModal;