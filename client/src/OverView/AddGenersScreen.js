import React, { useState, useCallback } from 'react';
import { 
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Platform, Keyboard,
    KeyboardAvoidingView, Image, FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import Style from './Style/AddGenersStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import GenerItem from "./components/GenerItem";


const AddGenersScreen = props => {
    const generSelector = useSelector(state => state.GenerReducer);
    const geners = generSelector?.GenerReducer?.AllGeners;
    const userDataSelector = useSelector(state => state.UserReducer);
    const userFavoriteGenersIDs = userDataSelector?.UserReducer?.account?.favoritesGeners;
    const [showNote, setShowNote] = useState(false);
    

    const checkNote = status => {
        setShowNote(status);
    }
    return (
        <ImageBackground 
                source={ require('../../assets/AppAssets/Logo.png') }
                resizeMode="cover" 
                style={Style.backgroundContainer}
                imageStyle={{opacity: 0.3}}
        >
            

            <View style={Style.mainContainer}>
            <TouchableOpacity onPress={props.func} style={Style.closeButtonContainer} >
                <FontAwesome
                    name='close'
                    size={25}
                    color={'#fff'}
                />
            </TouchableOpacity>
                
                <View style={Style.textContainer}>
                    <Text style={Style.subtitle}>Add geners to your favorites</Text>
                    {showNote && <Text style={Style.note}>You need at least one favorite</Text>}
                </View>
                <FlatList
                    numColumns={3}                    
                    data={geners}
                    keyExtractor={item => item._id}
                    renderItem = { gener => <GenerItem firstUse={false} gener={gener.item} token={props.token} showNote={checkNote}/>}                    
                />
            </View>
            

        </ImageBackground>
    )
}



export default AddGenersScreen;