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
    FlatList, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../Utitilities/AppColors';
import {deleteUserPlaylist, getAllUserPlaylist} from '../../ApiCalls';


const LibraryScreen = props => {
    const dispatch = useDispatch();
    const userDataSelector = useSelector(state => state.UserReducer);
    const userPlaylists = userDataSelector?.UserPlaylists?.Playlists;
    const [deletPostVisible, setDeletePostVisible] = useState(false);
    const [playlistToDelete, setPlaylistToDelete] = useState(null);

    const openDeleteModal = (playlist) => {
        setPlaylistToDelete(playlist);
        setDeletePostVisible(true);
    }

    const deleteUserPlaylistFromLibrary = async() => {
        const jsonToken = await AsyncStorage.getItem('Token');        
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
        if(userToken) {
            deleteUserPlaylist(dispatch, userToken, playlistToDelete._id)
            .then(() => {
                getAllUserPlaylist(dispatch, userToken);
                setDeletePostVisible(false);
            })
        }
    }


    return(
        <ImageBackground 
                source={ require('../../../assets/AppAssets/Logo.png') }
                resizeMode="cover" 
                style={{flex:1, backgroundColor:Colors.grey1}}
                imageStyle={{opacity: 0.3}}
        >
            
            <Modal
                visible={deletPostVisible}
                transparent={true}
                animationType='fade'
            >
                <View style={{flex:1, padding:10, alignItems: 'center', justifyContent:'center'}}>
                        <View style={{
                            width:'80%',
                            alignItems: 'center',
                            borderRadius:10,
                            backgroundColor: Colors.red3
                        }}>
                            <View style={{padding:20}}>
                                <Text style={{fontFamily:'Baloo2-Bold', fontSize:14, color: '#fff'}}>
                                    Are you sure you want delete this playlist?
                                </Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <TouchableOpacity 
                                    onPress={() => setDeletePostVisible(false)} 
                                    style={{
                                        width:'50%',
                                        borderRightWidth:0.5,
                                        borderTopWidth:1,
                                        alignItems: 'center',
                                        justifyContent:'center',
                                        padding:5
                                    }}>
                                    <Text style={{fontFamily:'Baloo2-Bold', fontSize:14, color: '#fff'}}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => deleteUserPlaylistFromLibrary()} 
                                    style={{
                                        width:'50%',
                                        borderLeftWidth:0.5,
                                        borderTopWidth:1,
                                        alignItems: 'center',
                                        justifyContent:'center',
                                        padding:5
                                    }}>
                                    <Text style={{fontFamily:'Baloo2-Bold', fontSize:14, color: '#fff'}}>Yes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                </View>
            </Modal>
            {
                userPlaylists && userPlaylists.length > 0?
                (
                    <FlatList
                        numColumns={2}   
                        data={userPlaylists}
                        keyExtractor={item => item._id}
                        renderItem={({item, index}) => 
                            <TouchableOpacity 
                                onPress={() => props.navigation.navigate("PlaylistScreen",
                                {songsList: item.songs, screenName: item.playlistName, 
                                optionToDelete: item.playlistName != 'Songs That You Liked',
                                isRegularUserPlaylist: true, playlistId: item._id})}  
                                style={{width:140 ,margin:25, alignItems: 'center'}}>
                               {
                                    item.playlistName !== 'Songs That You Liked' && 
                                    <Ionicons
                                        name='close'
                                        size={30}
                                        color={'#fff'}
                                        style={{
                                            backgroundColor:Colors.grey3,
                                            borderRadius:50,
                                            position: 'absolute',
                                            zIndex:1,
                                            right:135,
                                            bottom:190}}
                                        onPress={() => openDeleteModal(item)}
                                    />
                               }
                                <Image
                                    source={{uri:item.playlistImage}}
                                    style={{
                                        width:175,
                                        height:175,
                                        resizeMode:'stretch',
                                        borderRadius:10,
                                        borderWidth:2,
                                        borderColor:Colors.grey3,
                                        shadowColor: '#171717',
                                        shadowOffset: {width: 10, height: 10},
                                        shadowOpacity: 0.5,
                                        shadowRadius: 10,
                                    }}
                                />
                                <Text
                                    style={{
                                        fontFamily: 'Baloo2-Bold',
                                        fontSize:20,
                                        color: '#fff'
                                    }}
                                    numberOfLines={1}
                                >
                                    {item?.playlistName}
                                </Text>
                            </TouchableOpacity>    
                        }
                    />
                )
                :
                (
                    <View 
                        style={{
                            flex:1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'Baloo2-Bold',
                                fontSize:20,
                                color: '#fff'
                            }}
                            numberOfLines={1}
                        >
                            You don't have any playlists yet 
                        </Text>
                    </View>
                )
            }
        </ImageBackground>
    )
}


export const screenOptions = ({ navigation }) => {
    return {
        tabBarLabel:'Library',
        title:'Library',
        headerStyle:{backgroundColor:Colors.grey1, height:Platform.OS === 'ios' ? 110 : 90, borderBottomWidth:2, borderBottomColor:Colors.grey3},
        headerTitleStyle:{
            color:"#FFFFFF",
            fontFamily:"Baloo2-ExtraBold",
            fontSize:25
        },
        headerTitleAlign: 'center',
        headerLeft: () => {return <></>},
        tabBarIcon:({focused,color,size}) => {
            const iconColor = focused? Colors.red3 : '#ffffff'
            const iconSzie = focused? 24 : 22
            return(
            <Ionicons name={'library'} color={iconColor} size={iconSzie} />
            )

        } 
    }
}

export default LibraryScreen;