import React, { useState } from "react";
import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../Utitilities/AppColors';
import Style from '../Style';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import baseIpRequest from '../../ServerDev';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from '../../ApiCalls';



const GenerItem = props => {
    const dispatch = useDispatch();
    const gener = props.gener;
    const generId = gener._id
    const [isClicked, setIsClicked] = useState(false);

    const addGenerToFavorites = async () => {
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
        if(!userToken) {
            return;
        }
        try{
            const request = await fetch(baseIpRequest.ServerAddress + '/accounts/addGenerToFavorite/' + generId, {
                method:'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                }            
            })
            
            const response = await request.json();
            console.log(response);
            if(response.status){                
                setIsClicked(response.status);
                getUserData(dispatch, userToken);
            }
        } catch(error){
            console.log(error);
            console.log(isClicked);
        }
        
    }

    const removeGenerFromFavorites = async () => {
        try{
            const jsonToken = await AsyncStorage.getItem('Token');
            const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
            if(!userToken) {
                return;
            }
            const request = await fetch(baseIpRequest.ServerAddress + '/accounts/removeGenerFromFavorites/' + generId, {
                method:'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                }            
            })
            const response = await request.json();
            if(response.status){
                setIsClicked(!response.status);
                getUserData(dispatch, userToken);
            }
        } catch(error) {
            console.log(error);
        }
        
    }
    
    return(
        <TouchableOpacity onPress={isClicked? removeGenerFromFavorites : addGenerToFavorites} style={{margin:3}}>
            <ImageBackground
                source={{uri: gener.generImage}}
                style={{width:120, height:80, alignItems:'center', justifyContent:'center'}}
                opacity={isClicked? 0.4 : 1}  
            >
                {isClicked && <FontAwesome name="check" size={30} color={'#000'}/>}
            </ImageBackground>
        </TouchableOpacity>
    )
}

export default GenerItem;