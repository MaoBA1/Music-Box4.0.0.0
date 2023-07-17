//import liraries
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ImageBackground, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import MusicGeneralHeader from '../../../OverView/artist/components/MusicGeneralHeder';
import Colors from '../../../Utitilities/AppColors';
import { useDispatch, useSelector } from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Audio } from 'expo-av';
import { play, pause, resume, playNext } from '../../../../audioController';
import { 
    playInTheFirstTimeAction,
    pauseSongAction,
    resumeSongAction,
    playNextSongAction,
    preperNextSongAction,
    setPostAuthorProfileAction,
    handleSeeBarAction,
} from '../../../../store/actions/appActions';
import {
    getAllUserPlaylist,
    getSongsByUserFavoriteGeners,
    getAllSearchResults,
    getArtistPlayLists,
    getArtistLatestRealeases,
    getArtistTop5,
    getAllArtistSongs,
    getAllArtistAlbums,
    deleteArtistPlaylist,
    deleteArtistAlbum,
    deleteSongFromUserPlaylist,
    deleteUserPlaylist,
} from '../../../ApiCalls';
import { deleteSongByArtistChosenAction, deleteUserPlaylistAction, deleteSongFromUserPlaylistAction } from '../../../../store/actions/artistActions';
import AsyncStorage from '@react-native-async-storage/async-storage';




const MusicBoardPlaylistScreen = (props) => {
    const dispatch = useDispatch();
    const { screenName, songsList } = props.route.params;
    const optionToDelete = props.route.params.optionToDelete;
    const isRegularUserPlaylist = props.route.params.isRegularUserPlaylist;
    const deletFrom = props.route.params.deletFrom;
    const appBackGroundSelector = useSelector(state => state.AppReducer);
    const [deletPostVisible, setDeletePostVisible] = useState(false);
    const [songToDelete, setSongToDelete] = useState(null);
    const {
        SongIndexReducer,
        SongOnBackGroundReducer,
        currentAudio,
        isPlaying,
        playbackDuration,
        playbackObj,
        playbackPosition,
        soundObj,
        isLoading,
        MusicOnForGroundReducer
    } = appBackGroundSelector;
    
    useEffect(() => {
        const onPlaybackStatusUpdate = async(playbackStatus) => {
            if(playbackStatus.isLoaded && playbackStatus.isPlaying) {
                dispatch(handleSeeBarAction({
                    playbackPosition: playbackStatus.positionMillis,
                    playbackDuration: playbackStatus.durationMillis
                }))
            }


            if(playbackStatus.didJustFinish) {
                try{
                    const nextAudioIndex = (SongIndexReducer + 1) % SongOnBackGroundReducer?.length;
                    const audio = SongOnBackGroundReducer[nextAudioIndex];
                    dispatch(preperNextSongAction({
                        currentAudio: audio,
                        isPlaying: false,
                        index: nextAudioIndex,
                        isLoading: true
                    }))
                    const status = await playNext(playbackObj, audio.trackUri);
                
                    return dispatch(playNextSongAction({
                        status: status,
                        currentAudio: audio,
                        isPlaying: true,
                        index: nextAudioIndex,
                        isLoading: false,
                        MusicOnForGroundReducer: MusicOnForGroundReducer,
                        list: SongOnBackGroundReducer 
                    }))
                }catch(error) {
                    console.log(error.message);
                }
            }
        }

        if(playbackObj) {
            playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
        }
    },[
        SongIndexReducer,
        SongOnBackGroundReducer,                
        playbackObj,        
        MusicOnForGroundReducer
    ]);

    const handleAudioPress = async (audio, index, list) => { 
        if(isLoading) {
            return;
        }    
        if(soundObj === null) {
            try{
                dispatch(preperNextSongAction({
                    currentAudio: audio,
                    isPlaying: false,
                    index: index,
                    isLoading: true
                }))
                const playbackObj = new Audio.Sound();
                const status = await play(playbackObj, audio.trackUri);
                return dispatch(playInTheFirstTimeAction({
                    playbackObj: playbackObj,
                    status: status,
                    currentAudio: audio,
                    isPlaying: true,
                    index: index,
                    list: list,
                    musicOnBackGround: true,
                    isLoading: false,
                    MusicOnForGroundReducer: false
                }))
            } catch(error){
                console.log(error.message);
            }
           
        }

        if(soundObj?.isLoaded && soundObj?.isPlaying && currentAudio?._id === audio._id) {
            console.log('2');            
           const status = await pause(playbackObj)
           try {
            return dispatch(pauseSongAction({
                status: status,
                isPlaying: false                
            }))
           }catch(error) {
            console.log(error.message);
           }           
        }

        if(soundObj?.isLoaded && !soundObj?.isPlaying && currentAudio?._id === audio._id) {
            console.log('3');
            try{
                const status = await resume(playbackObj);            
                return dispatch(resumeSongAction({
                    status: status,
                    isPlaying: true  
                }));
                
            }catch(error) {
                console.log(error.message);
            }
            
        }
        
        if(soundObj?.isLoaded && currentAudio?._id !== audio._id){
            console.log('4');
            try{
                dispatch(preperNextSongAction({
                    currentAudio: audio,
                    isPlaying: false,
                    index: index,
                    isLoading: true
                }))
                const status = await playNext(playbackObj, audio.trackUri);
                return dispatch(playNextSongAction({
                    status: status,
                    currentAudio: audio,
                    isPlaying: true,
                    index: index,
                    isLoading: false,
                    MusicOnForGroundReducer: false,
                    list: list
                }))
            } catch {
                console.log(error.message);
            }
             
        }
    }

    const openDeleteModal = (song) => {
        setSongToDelete(song);
        setDeletePostVisible(true);
    }

    const deleteSongFromArtistList = async() => {
        const jsonToken = await AsyncStorage.getItem('Token');        
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
        if(userToken) {
            if(songsList.length <= 1 && deletFrom != 'singels') {
                switch(deletFrom) {
                    case 'album':
                        deleteArtistAlbum(dispatch, userToken, songToDelete.artistId || props.route.params.artistId, props.route.params?.albumId)
                        .then(() => {
                            getAllArtistAlbums(dispatch, userToken, songToDelete.artistId || props.route.params.artistId);
                            return props.navigation.goBack(null);
                        })
                        
                        break;
                    case 'playlist':
                        deleteArtistPlaylist(dispatch, userToken, songToDelete.artistId || props.route.params.artistId, props.route.params?.playlistId)
                        .then(() => {
                            getArtistPlayLists(dispatch, userToken);
                            return props.navigation.goBack(null);
                        })
                        
                        break;
                    default: return;
                }
                
            } else {
                let action = deleteSongByArtistChosenAction(userToken, songToDelete.artistId || props.route.params.artistId, songToDelete._id, deletFrom);
                try {
                    await dispatch(action)
                    .then(() => {
                        if(deletFrom === 'playlist') {
                            getArtistPlayLists(dispatch, userToken);
                        } else {
                            getAllUserPlaylist(dispatch, userToken);
                            getSongsByUserFavoriteGeners(dispatch, userToken);
                            getAllSearchResults(dispatch, userToken);
                            getAllArtistSongs(dispatch, userToken, songToDelete.artistId);
                            getArtistTop5(dispatch, userToken, songToDelete.artistId);
                            getArtistLatestRealeases(dispatch, userToken, songToDelete.artistId);
                            getArtistPlayLists(dispatch, userToken);
                            getAllArtistAlbums(dispatch, userToken, songToDelete.artistId);
                        }
                        props.navigation.goBack(null);
                    })
                }catch(error) {
                    console.log(error.message);
                }
            }
        }
    }

    const deleteFromUserPlaylist = async() => {
        const jsonToken = await AsyncStorage.getItem('Token');        
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
        if(userToken) {
            if(songsList.length <= 1) {
                deleteUserPlaylist(dispatch, userToken, props.route.params.playlistId)
                .then(() => {
                    getAllUserPlaylist(dispatch, userToken);
                })
                
            } else {
                deleteSongFromUserPlaylist(dispatch, userToken, props.route.params.playlistId, songToDelete.trackName)
                .then(() => {
                    getAllUserPlaylist(dispatch, userToken);
                })
            }
            return props.navigation.goBack(null);
        }
    }

    

    return (
        <View style={{flex: 1, backgroundColor:Colors.grey1}}>
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
                            <Text style={{fontFamily:'Baloo2-Bold', fontSize:14, color: '#fff'}}>Are you sure you want delete this song?</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity onPress={() => setDeletePostVisible(false)} style={{width:'50%', borderRightWidth:0.5, borderTopWidth:1, alignItems: 'center', justifyContent:'center', padding:5}}>
                                <Text style={{fontFamily:'Baloo2-Bold', fontSize:14, color: '#fff'}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={isRegularUserPlaylist? deleteFromUserPlaylist : deleteSongFromArtistList} style={{width:'50%', borderLeftWidth:0.5, borderTopWidth:1, alignItems: 'center', justifyContent:'center', padding:5}}>
                                <Text style={{fontFamily:'Baloo2-Bold', fontSize:14, color: '#fff'}}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <ScrollView>
                {
                    songsList.map((item, index) =>
                        <TouchableOpacity key={index} style={{
                            width: '100%',
                            padding: 10,
                            borderBottomWidth: 0.5,
                            borderColor: Colors.grey3,
                            flexDirection:'row',
                        }} onPress={() => handleAudioPress(item, index, songsList)}>
                            <ImageBackground
                                style={{width: 70, height: 70, alignItems: 'center', justifyContent: 'center'}}
                                imageStyle={{resizeMode:'stretch'}}
                                source={{uri: item?.trackImage}}
                            >
        
                            {
                                    item._id === currentAudio._id &&
                                    <>
                                        {
                                            isPlaying?
                                            (
                                                <FontAwesome5
                                                    name="pause"
                                                    size={20}
                                                    color={Colors.red3}
                                                />
                                            )
                                            :
                                            (
                                                <>
                                                    {
                                                        isLoading?
                                                        (
                                                            <ActivityIndicator color={Colors.red3}/>
                                                        )
                                                        :
                                                        (
                                                            <FontAwesome5
                                                                name="play"
                                                                size={20}
                                                                color={Colors.red3}
                                                            />
                                                        )
                                                    }
                                                    
                                                </>
                                            )
                                        }
                                        
                                    </>
                                }
        
                            </ImageBackground>
                            <View style={{width: optionToDelete === true ? '50%' : '65%', alignItems: 'flex-start', justifyContent: 'center'}}>
                                <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', fontSize:16, left:10}}>
                                    {item.trackName}
                                </Text>
                                <Text style={{fontFamily:'Baloo2-Medium', color:Colors.grey3, fontSize:14, left:10}}>
                                    {item?.artist?.artistName}
                                </Text>
                            </View>
                            <View style={{width:'19%', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{fontFamily:'Baloo2-Medium', color:Colors.grey3, fontSize:14}}>
                                    {item.trackLength}
                                </Text>
                            </View>
                            {
                                optionToDelete === true && 
                                <TouchableOpacity style={{
                                    backgroundColor:Colors.red3,
                                    width:55,
                                    height:25,
                                    alignSelf:'center',
                                    borderRadius:10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    right:5
                                }} onPress={() => openDeleteModal(item)}>
                                    <Text style={{fontFamily:'Baloo2-Bold', color:'#fff'}}>Delete</Text>
                                </TouchableOpacity>
                            }
                        </TouchableOpacity>
                    )
                }
            </ScrollView>
        </View>
    );
};


export const screenOptions = ({navigation, route}) => {
    const { screenName } = route.params;
    const moveToFeedScreen = () => {
        navigation.navigate("ArtistFeed")
    }
    return {        
        title: screenName,
        headerStyle:{backgroundColor:Colors.grey1, borderBottomWidth:2, borderBottomColor:Colors.grey3},
        headerTitleStyle:{
            color:"#FFFFFF",
            fontFamily:"Baloo2-ExtraBold",
            fontSize:20
        },
        headerTitleAlign: 'center',
        presentation:"transparentModal",
        headerLeft: () => {
            return <TouchableOpacity onPress={navigation.goBack} style={{ marginLeft:10 }}>
                <AntDesign name="arrowleft" size={24} color="#ffffff"/>
            </TouchableOpacity>
        },
    }
}


export default MusicBoardPlaylistScreen;
