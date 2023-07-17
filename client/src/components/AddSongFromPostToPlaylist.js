import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { View, Text, Platform, Modal, Image } from 'react-native';
import Colors from '../Utitilities/AppColors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import {Audio} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNewPlaylistAction, getAllUserPlaylistsAction, addSongTouserPlaylistAction, getUserDataAction } from '../../store/actions/userActions'
import { useDispatch, useSelector } from 'react-redux';
import {getUserData} from '../ApiCalls';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const ThisModalHeader = ({
    newPlaylist,
    existPlaylist,
    setTrackName,
}) => {
    const moveToAdd = () => {
        setTrackName('');
        existPlaylist();        
    }

    const moveToNew = () => {
        setTrackName('');
        newPlaylist();
    }
    return(
        <>
                {Platform.OS == 'ios' && <View style={{width: '100%', height:'4%', backgroundColor: Colors.grey4}}></View>}
                <View
                    style={{
                        width: '100%',
                        flexDirection:'row',
                        backgroundColor: Colors.grey4,
                        borderBottomLeftRadius:50,
                        borderBottomRightRadius:50
                    }}
                >
                    <TouchableOpacity
                        style={{
                            width: '50%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection:'row',
                            padding:10,
                            borderRightWidth: 0.5
                        }}
                        onPress={moveToNew}
                    >
                        <Text
                            style={{
                                fontFamily: 'Baloo2-Bold', 
                                fontSize:16,
                                color:'#fff'
                            }}
                        >
                            Create New Playlist
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            width: '50%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection:'row',
                            padding:10,
                            borderLeftWidth:0.5
                        }}
                        onPress={moveToAdd}
                    >
                        <Text
                            style={{
                                fontFamily: 'Baloo2-Bold', 
                                fontSize:16,
                                color:'#fff'
                            }}
                        >
                            Add To Exist Playlist
                        </Text>
                    </TouchableOpacity>

                </View>
                </>
    )
}

export const CreateNewPlaylist = ({
    track,
    playlistImage,
    setPlaylistImage,
    playlistName,
    setPlaylistName,
    trackName,
    setTrackName,
    trackLength,
    setTrackLength
}) => {
    

    
    
    useEffect(() => {
        const calculatePlaybackDuration = async() => {
            try{
                const audio = await new Audio.Sound().loadAsync({uri:track.trackUri},{shouldPlay: false});
                var milliseconds = parseInt((audio.durationMillis % 1000) / 100),
                    seconds = Math.floor((audio.durationMillis / 1000) % 60),
                    minutes = Math.floor((audio.durationMillis / (1000 * 60)) % 60),
                    hours = Math.floor((audio.durationMillis / (1000 * 60 * 60)) % 24);
        
                    hours = (hours == 0) ? null : hours;
                    if(hours != null) {
                        hours = (hours < 10) ? "0" + hours : hours;
                    }            
                    minutes = (minutes < 10) ? "0" + minutes : minutes;
                    seconds = (seconds < 10) ? "0" + seconds : seconds;
                    if(hours != null) {
                        return setTrackLength(hours + ":" + minutes + ":" + seconds);
                    }
                    return setTrackLength(minutes + ":" + seconds);
            }catch(error) {
                console.log(error.message);
            }
            
                
        }
        if(trackLength == ''){
            calculatePlaybackDuration();
        }
    },[trackLength])

    let selectImageFromGallery = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("We need Your permmission to open your media library");
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        });
        if(!pickerResult.cancelled){
            setPlaylistImage(pickerResult.uri);
        } 
    };

    
    let takeImageWithcamra = async () => {
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("We need Your permmission to open your media library");
            return;
        }
        let pickerResult = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9]
        });        
        if(!pickerResult.cancelled){
            setPlaylistImage(pickerResult.uri);
        } 
    };

    return(
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <View
                style={{
                    width: '95%',
                    height: Platform.OS == 'ios'? '70%':'90%',
                    backgroundColor:Colors.grey5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius:50,
                    //bottom:50,
                    shadowColor:'#000',
                    shadowOffset:{width:0, height:3},
                    shadowOpacity:0.5,
                    shadowRadius :5,
                    paddingVertical:10,
                    position: 'absolute'
                }}
            >
                <Text
                    style={{
                        fontFamily: 'Baloo2-Bold',
                        color:'#fff',
                        fontSize:18,
                    }}
                >
                    Name your playlist
                </Text>
                <TextInput
                    style={{
                        width:'70%',
                        backgroundColor:'#fff',
                        padding:5,
                        paddingHorizontal:10,
                        borderRadius:50,
                        color:Colors.red3,
                        fontFamily: 'Baloo2-Bold',
                        fontSize:14
                    }}
                    placeholder="Playlist name"
                    returnKeyType='done'
                    value={playlistName}
                    onChangeText={text => setPlaylistName(text)}
                />

                <Text
                    style={{
                        fontFamily: 'Baloo2-Bold',
                        color:'#fff',
                        fontSize:18,
                        marginTop:10,
                    }}
                >
                    Name the chosen song / track
                </Text>
                <TextInput
                    style={{
                        width:'70%',
                        backgroundColor:'#fff',
                        padding:5,
                        paddingHorizontal:10,
                        borderRadius:50,
                        color:Colors.red3,
                        fontFamily: 'Baloo2-Bold',
                        fontSize:14
                    }}
                    placeholder="song / track name"
                    returnKeyType='done'
                    value={trackName}
                    onChangeText={text => setTrackName(text)}
                />

                <View style={{width:'100%', paddingHorizontal:20, marginTop:20, alignItems: 'center'}}>
                    <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', fontSize:18}}>Would you like to add playlist picture?</Text>
                </View>
                <View style={{width:'100%', alignItems: 'center', justifyContent: 'center', marginTop:10}}>
                    <View style={{borderWidth:2, borderColor:'#fff', width:'85%', backgroundColor:Colors.grey4, padding:10, borderRadius:20, flexDirection:'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <View>
                            <TouchableOpacity onPress={takeImageWithcamra}style={{width:40, height:40, alignItems: 'center', justifyContent: 'center', backgroundColor:Colors.red3, padding:10, borderRadius:50, borderWidth:2, borderColor:'#fff',margin:5}}>
                                <FontAwesome
                                    name='camera'
                                    size={15}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={selectImageFromGallery} style={{width:40, height:40, alignItems: 'center', justifyContent: 'center', backgroundColor:Colors.red3, padding:10, borderRadius:50, borderWidth:2, borderColor:'#fff',margin:5}}>
                                <FontAwesome5
                                    name='images'
                                    size={15}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{width:'70%', alignItems: 'center', justifyContent: 'center', padding:10}}>
                            <Image
                                source={playlistImage == ''? require('../../assets/noimage.jpg') : {uri:playlistImage}}
                                style={{width:150, height:120, borderRadius:20}}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export const AddToExistPlaylist = ({
    isLoading,
    setIsLoading,
    trackName,
    setTrackName,
    track,
    trackLength,
    setTrackLength,
    close
}) => {
    const dispatch = useDispatch();
    const playlistsSelector = useSelector(state => state.UserReducer.UserPlaylists);
    const userPlaylists = playlistsSelector?.Playlists;

    let song = {
        trackName: trackName,
        trackUri: track.trackUri,
        trackLength: trackLength,
        artist: track.artist,
        creatAdt: track.creatAdt
    }
    
   const getUserPlaylists = async() => {
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
        if(userToken) {
            let action = getAllUserPlaylistsAction(userToken)
            try{
                await dispatch(action);
            }catch (error) {
                console.log(error.message);
            }
        }
    }


    useEffect(() => {
        if(!playlistsSelector) {
            getUserPlaylists();
        }
        const calculatePlaybackDuration = async() => {
            try{
                const audio = await new Audio.Sound().loadAsync({uri:track.trackUri},{shouldPlay: false});
                var milliseconds = parseInt((audio.durationMillis % 1000) / 100),
                    seconds = Math.floor((audio.durationMillis / 1000) % 60),
                    minutes = Math.floor((audio.durationMillis / (1000 * 60)) % 60),
                    hours = Math.floor((audio.durationMillis / (1000 * 60 * 60)) % 24);
        
                    hours = (hours == 0) ? null : hours;
                    if(hours != null) {
                        hours = (hours < 10) ? "0" + hours : hours;
                    }            
                    minutes = (minutes < 10) ? "0" + minutes : minutes;
                    seconds = (seconds < 10) ? "0" + seconds : seconds;
                    if(hours != null) {
                        return setTrackLength(hours + ":" + minutes + ":" + seconds);
                    }
                    return setTrackLength(minutes + ":" + seconds);
            }catch(error) {
                console.log(error.message);
            }
            
                
        }
        if(trackLength == ''){
            calculatePlaybackDuration();
        }
    },[trackLength])

    const addSongToUserPlaylist = async(playlistId) => {
        setIsLoading(true);
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
        if(userToken) {
            let action = addSongTouserPlaylistAction(userToken, song, playlistId)
            try{
                await dispatch(action)
                .then(() => {
                    getUserPlaylists(userToken);
                    getUserData(dispatch, userToken);
                    setIsLoading(false);
                    close(false);
                })
            }catch(error){
                console.log(error.message);
            }
        }
    }
    
    return(
        <View style={{
            flex: 1,
            alignItems: 'center', 
            justifyContent: 'center'
        }}>
            <View
                style={{
                    width: '95%',
                    height: Platform.OS == 'ios'? '70%':'90%',
                    backgroundColor:Colors.grey5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius:50,
                    shadowColor:'#000',
                    shadowOffset:{width:0, height:3},
                    shadowOpacity:0.5,
                    shadowRadius :5,
                    paddingVertical:10,
                    position: 'absolute'
                }}
            >
                {
                    !userPlaylists || userPlaylists?.length === 0?
                    (
                        <View>
                            <Text
                                style={{fontFamily:'Baloo2-ExtraBold', color:'#fff', fontSize:16}}
                            >
                                It looks like you don't have any playlists yet . . .
                            </Text>
                        </View>
                    )
                    :
                    (
                        <>
                            <Text
                                style={{
                                    fontFamily: 'Baloo2-Bold',
                                    color:'#fff',
                                    fontSize:18,
                                    marginTop:10,
                                }}
                            >
                                Name the chosen song / track
                            </Text>
                            <TextInput
                                style={{
                                    width:'70%',
                                    backgroundColor:'#fff',
                                    padding:5,
                                    paddingHorizontal:10,
                                    borderRadius:50,
                                    color:Colors.red3,
                                    fontFamily: 'Baloo2-Bold',
                                    fontSize:14
                                }}
                                placeholder="song / track name"
                                returnKeyType='done'
                                value={trackName}
                                onChangeText={text => setTrackName(text)}
                            />

                        <View style={{width: '100%', height:30, alignItems: 'center'}}>
                            {isLoading &&<ActivityIndicator color={Colors.red3}/>}
                        </View>
                        <FlatList
                            data={userPlaylists}
                            keyExtractor={item => item._id}
                            renderItem={({item, index}) => 
                                isLoading || trackName.length === 0?
                                (
                                    <View
                                        style={{
                                            width: 300,
                                            backgroundColor:Colors.grey4,
                                            padding:10,
                                            borderRadius:50,
                                            flexDirection:'row',
                                            opacity:0.7,
                                            marginBottom:10
                                        }}
                                    >
                                        <View style={{width:'20%'}}>
                                            <Image
                                                source={{uri:item.playlistImage}}
                                                style={{width:40, height:40, borderRadius:50}}
                                            />
                                        </View>
                                        <View style={{width:'80%', flexDirection:'row', justifyContent:'space-between'}}>
                                            <View style={{width:'40%', justifyContent: 'center'}}>
                                                <Text numberOfLines={1} style={{
                                                    fontFamily: 'Baloo2-Bold',
                                                    color:'#fff',
                                                    fontSize:16
                                                }}>
                                                    {item.playlistName}</Text>
                                            </View>
                                            <View style={{width:'30%', justifyContent: 'center'}}>
                                                <Text numberOfLines={1} style={{
                                                    fontFamily: 'Baloo2-Medium',
                                                    color:Colors.grey3,
                                                }}>
                                                    {item.songs.length} tracks</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                                :
                                (
                                    <TouchableOpacity
                                        style={{
                                            width: 300,
                                            backgroundColor:Colors.grey4,
                                            padding:10,
                                            borderRadius:50,
                                            flexDirection:'row',
                                            marginBottom:10
                                        }}
                                        onPress={() => addSongToUserPlaylist(item._id)}
                                    >
                                        <View style={{width:'20%'}}>
                                            <Image
                                                source={{uri:item.playlistImage}}
                                                style={{width:40, height:40, borderRadius:50}}
                                            />
                                        </View>
                                        <View style={{width:'80%', flexDirection:'row', justifyContent:'space-between'}}>
                                            <View style={{width:'40%', justifyContent: 'center'}}>
                                                <Text numberOfLines={1} style={{
                                                    fontFamily: 'Baloo2-Bold',
                                                    color:'#fff',
                                                    fontSize:16
                                                }}>
                                                    {item.playlistName}</Text>
                                            </View>
                                            <View style={{width:'30%', justifyContent: 'center'}}>
                                                <Text numberOfLines={1} style={{
                                                    fontFamily: 'Baloo2-Medium',
                                                    color:Colors.grey3,
                                                }}>
                                                    {item.songs.length} tracks</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )

                            }
                        />
                        </>
                    )
                }
                
            </View>
        </View>
    )
}

const AddSongFromPostToPlaylist = props => {
    const dispatch = useDispatch();
    const [createNewPlaylist, setCreateNewPlaylist] = useState(false);
    const [playlistImage, setPlaylistImage] = useState('');
    const [playlistName, setPlaylistName] = useState('');
    const [trackName, setTrackName] = useState('');
    const [trackLength, setTrackLength] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getUserPlaylists = async() => {
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
        if(userToken) {
            let action = getAllUserPlaylistsAction(userToken)
            try{
                await dispatch(action);
            }catch (error) {
                console.log(error.message);
            }
        }
    }

    let newPlaylist = {
        playlistName: playlistName,
        song:{
                trackName: trackName,
                trackUri: props.track.trackUri,
                trackLength: trackLength,
                artist: props.track.artist,
                creatAdt: props.track.creatAdt
            }
        
    }
    
    const HandleImageUpload = async () => {
        const response = await fetch(playlistImage);
        const blob = await response.blob();
        const imageRef = ref(storage, "playlistImages/" + `${playlistImage.split("/")[playlistImage.split("/").length - 1]}`);
        const uploadFile = await uploadBytes(imageRef, blob);
        return getDownloadURL(uploadFile.ref);
    }

    const creatNewPlaylistCollection = async() => {
        setIsLoading(true);
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
        if(userToken) {
            if(playlistImage.length > 0) {
                 HandleImageUpload()
                .then(async imageUri => {
                    newPlaylist = {...newPlaylist, playlistImage: imageUri}
                    let action = createNewPlaylistAction(userToken, newPlaylist);
                    try{
                        await dispatch(action)
                        .then(() => {
                            getUserPlaylists(userToken);
                            getUserData(dispatch, userToken);
                            props.close(false)
                            setIsLoading(false);
                        })

                    } catch (error) {
                        console.log(error.message);
                    }
                })
            } else {
                let action = createNewPlaylistAction(userToken, newPlaylist);
                try{
                    await dispatch(action)
                    .then(() => {
                        getUserPlaylists(userToken);
                        getUserData(dispatch, userToken);
                        props.close(false)
                        setIsLoading(false);
                    })

                } catch (error) {
                    console.log(error.message);
                }
            }
        }
        
    }

    

    return (
        <Modal
            visible={true}
            transparent={true}
            animationType='slide'
        >
            <View style={{
                flex: 1,
                backgroundColor: Colors.grey1
            }}>
                <ThisModalHeader
                    newPlaylist={() => setCreateNewPlaylist(true)}
                    existPlaylist={() => setCreateNewPlaylist(false)}
                    setTrackName={setTrackName} 
                />
                {
                    createNewPlaylist ? 
                    (
                        <CreateNewPlaylist 
                            track={props.track}
                            playlistImage={playlistImage}
                            playlistName={playlistName}
                            trackName={trackName}
                            trackLength={trackLength}
                            setPlaylistImage={setPlaylistImage}
                            setPlaylistName={setPlaylistName}
                            setTrackName={setTrackName}
                            setTrackLength={setTrackLength}
                        />
                    )
                    :
                    (
                        <AddToExistPlaylist
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            trackName={trackName}
                            setTrackName={setTrackName} 
                            track={props.track}
                            trackLength={trackLength}
                            setTrackLength={setTrackLength}
                            close={props.close}
                        />
                    )
                }

                <View
                    style={{
                        
                        flexDirection:'row',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bottom: Platform.OS == 'ios' ? 80 : 10
                    }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.red3,
                            paddingHorizontal:10,
                            paddingVertical:5,
                            width:100,
                            alignItems: 'center',
                            borderRadius:50,
                            borderWidth:2,
                            borderColor:'#fff',
                            margin:5
                        }}
                        onPress={() => props.close(false)}
                    >
                        <Text
                            style={{
                                fontFamily: 'Baloo2-Bold',
                                color:'#fff'
                            }}
                        >
                            Close
                        </Text>
                    </TouchableOpacity>

                    {
                        createNewPlaylist?
                        (
                            <>
                                {
                                    playlistName === '' || trackName === ''?
                                    (
                                        <View
                                            style={{
                                                backgroundColor: Colors.red3,
                                                paddingHorizontal:10,
                                                paddingVertical:5,
                                                width:150,
                                                alignItems: 'center',
                                                borderRadius:50,
                                                borderWidth:2,
                                                borderColor:'#fff',
                                                margin:5,
                                                opacity:0.5
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Baloo2-Bold',
                                                    color:'#fff'
                                                }}
                                            >
                                                Create new playlist
                                            </Text>
                                        </View>
                                    )
                                    :
                                    (
                                        <>
                                            {
                                                isLoading?
                                                (
                                                    <View
                                                        style={{
                                                            backgroundColor: Colors.red3,
                                                            paddingHorizontal:10,
                                                            paddingVertical:5,
                                                            width:150,
                                                            alignItems: 'center',
                                                            borderRadius:50,
                                                            borderWidth:2,
                                                            borderColor:'#fff',
                                                            margin:5
                                                        }}
                                                    >
                                                        <ActivityIndicator color={'#fff'} />
                                                    </View>
                                                )
                                                :
                                                (
                                                    <TouchableOpacity
                                                        style={{
                                                            backgroundColor: Colors.red3,
                                                            paddingHorizontal:10,
                                                            paddingVertical:5,
                                                            width:150,
                                                            alignItems: 'center',
                                                            borderRadius:50,
                                                            borderWidth:2,
                                                            borderColor:'#fff',
                                                            margin:5
                                                        }}
                                                        onPress={creatNewPlaylistCollection}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontFamily: 'Baloo2-Bold',
                                                                color:'#fff'
                                                            }}
                                                        >
                                                            Create new playlist
                                                        </Text>
                                                    </TouchableOpacity>
                                                )
                                            }                                            
                                        </>
                                    )
                                }
                            </>
                        )
                        :
                        (
                            <View></View>
                        )
                    }
                </View>
            </View>
        </Modal>
    );
};


export default AddSongFromPostToPlaylist;
