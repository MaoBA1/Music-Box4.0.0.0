import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import baseIpRequest from '../../ServerDev';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData, getArtistsByUserFavoriteGeners, getSongsByUserFavoriteGeners, getPosts } from '../../ApiCalls';



const GenerItem = props => {
    const dispatch = useDispatch();
    const gener = props.gener;
    const generId = gener._id
    const [isClicked, setIsClicked] = useState(false);
    const userDataSelector = useSelector(state => state.UserReducer);
    const userFavoriteGenersIDs = userDataSelector?.UserReducer?.account?.favoritesGeners;

    const setLikeToUserFavorites = () => {
        userFavoriteGenersIDs.forEach(x => {
            if(x == generId){
                setIsClicked(true);
            }
        })
    }

    useEffect(() => {
        setLikeToUserFavorites();
    },[])


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
                getPosts(dispatch, userToken);
                getArtistsByUserFavoriteGeners(dispatch, userToken);
                getSongsByUserFavoriteGeners(dispatch, userToken);    
                setIsClicked(response.status);
                getUserData(dispatch, userToken)
                if(userFavoriteGenersIDs.length > 1) {
                    props.showNote(false); 
                }
                
            }
        } catch(error){
            console.log(error);
            console.log(isClicked);
        }
        
    }

    const removeGenerFromFavorites = async () => {
        if(userFavoriteGenersIDs.length == 1) {
            props.showNote(true);
            return;
        }
        
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
                getPosts(dispatch, userToken);
                getArtistsByUserFavoriteGeners(dispatch, userToken);
                getSongsByUserFavoriteGeners(dispatch, userToken);   
                setIsClicked(!response.status);
                getUserData(dispatch, userToken);
                props.showNote(false);
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