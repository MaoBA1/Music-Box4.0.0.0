import React, { useState } from 'react';
import {
    View,KeyboardAvoidingView, ImageBackground,
    Text, TouchableOpacity, Image, ActivityIndicator,
    FlatList, Modal, TextInput, Platform
} from 'react-native';
import Colors from '../../../Utitilities/AppColors';
import { Video } from 'expo-av';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import { uploadNewPostAction } from '../../../../store/actions/postActions';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
    getArtistPlayLists,
    addAdditionalSongsToArtistPlaylist,
    getAllSearchResults,
 } from '../../../ApiCalls';
import { uploadNewSongAction } from '../../../../store/actions/songActions';
import { createNewPlaylistAction } from '../../../../store/actions/artistActions';
import { storage } from '../../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


import SongItem from '../../components/SongItem';

const CreateNewPlaylistModal = props => {
    const dispatch = useDispatch();
    const [playlistImage, setPlaylistImage] = useState('');
    const [song, setSong] = useState('');
    const [playlistName, setPlaylistName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const artistSelector = useSelector(state => state.ArtistsReducer);
    const artistMainGener = artistSelector?.ArtistDataReducer?.mainGener;
    const artistId = artistSelector?.ArtistDataReducer?._id;
    const artistSongsSelector = useSelector(state => state.SongReducer);
    const allArtistSongs = artistSongsSelector?.ArtistSongsReducer;
    const [playlistSongsList, setPlaylistSongsList] = useState([]);
    const [noteVisible, setNoteVisible] = useState(false);
    const allArtistPlaylist = artistSelector?.ArtistPlaylistsReducer;
    

    

    const AddToSongsList = song => {
        let list = playlistSongsList;
        list.push(song);
        setPlaylistSongsList(list);
    }

    const removeSongFromList = song => {
        let list = playlistSongsList;
        list.splice(list.indexOf(song),list.indexOf(song)+1);        
        setPlaylistSongsList(list);
    }
    
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

    const HandleImageUpload = async () => {
        const response = await fetch(playlistImage);
        const blob = await response.blob();
        const imageRef = ref(storage, "playlistImages/" + `${playlistImage.split("/")[playlistImage.split("/").length - 1]}`);
        const uploadFile = await uploadBytes(imageRef, blob);
        return getDownloadURL(uploadFile.ref);
    }

    const createNewPlaylist = async() => {
        if(playlistSongsList.length == 0) {
            setNoteVisible(true);
            return;
        }
        setIsLoading(true);
        setNoteVisible(false);
        if(playlistImage != '') {
            HandleImageUpload()
            .then(async result => {
                let details = {
                    playlistName: playlistName,
                    playlistImage: result,
                    tracks: playlistSongsList
                }
                
                const jsonToken = await AsyncStorage.getItem('Token');        
                const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
                if(userToken) {
                    let action = createNewPlaylistAction(userToken, details)
                    try{
                        await dispatch(action)
                        setIsLoading(false);
                        getArtistPlayLists(dispatch, userToken);
                        props.close(false);
                    } catch(error) {
                        console.log(error.message);
                    }
                }
                
            })
        } else {
            let details = {
                playlistName: playlistName,
                tracks: playlistSongsList
            }
            
            const jsonToken = await AsyncStorage.getItem('Token');        
            const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
            if(userToken) {
                let action = createNewPlaylistAction(userToken, details)
                try{
                    await dispatch(action)
                    setIsLoading(false);
                    getArtistPlayLists(dispatch, userToken);
                    props.close(false);
                } catch(error) {
                    console.log(error.message);
                }
            }
        }
    }

    const [alreadyExistInPlaylistSongs, setSlreadyExistInPlaylistSong] = useState([]);
    const addSongsToExistPlaylist = async(playlist) => {
        setNoteVisible(false);
        setSlreadyExistInPlaylistSong([]);
        if(playlistSongsList.length == 0) {
            setNoteVisible(true);
            return;
        }
        const jsonToken = await AsyncStorage.getItem('Token');        
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
        if(userToken) {
            let list = [];
            playlistSongsList.forEach(x => {
                const findSong = playlist.tracks.find(y => y._id === x._id);
                if(findSong) {
                    list.push(findSong);
                }
            })
            if(list.length > 0) {
                setSlreadyExistInPlaylistSong(list);
                return
            }
            addAdditionalSongsToArtistPlaylist(dispatch, userToken, artistId, playlist._id, playlistSongsList)
            .then(() => {
                getArtistPlayLists(dispatch, userToken);
                getAllSearchResults(dispatch, userToken);
                props.close(false);
            })
        }
        
        
        
    }
    
    const [mode, setMode] = useState('create');

    return(
        <Modal
            visible={true}
            transparent={true}
            animationType='slide'
        >
            <View style={{flex: 1, width: '100%', height:'100%', backgroundColor:Colors.grey3, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{ 
                    flexDirection:'row',
                    borderWidth:1,
                    alignItems: 'center',
                    margin:10,
                    width: '100%',
                    shadowColor:'#000', shadowOffset:{width:0, height:3},
                    shadowOpacity:0.5, shadowRadius :5
                }}>
                    {
                        mode === 'create' ? 
                        (
                            <View style={{
                                backgroundColor:Colors.grey1,
                                padding:10,
                                width: '50%',
                                borderRightWidth: 0.5, 
                                alignItems: 'center',
                            }}>
                                <Text style={{
                                    fontFamily: 'Baloo2-Bold',
                                    color:'#fff'
                                }}>
                                    Create new playlist
                                </Text>
                            </View>
                        ) 
                        :
                        (
                            <TouchableOpacity style={{
                                backgroundColor:Colors.grey1,
                                padding:10,
                                width: '50%',
                                borderRightWidth: 0.5, 
                                alignItems: 'center',
                                opacity:0.7
                            }} onPress={() => setMode('create')}>
                                <Text style={{
                                    fontFamily: 'Baloo2-Bold',
                                    color:'#fff'
                                }}>
                                    Create new playlist
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                    {
                        mode === 'add' ? 
                        (
                            <View style={{
                                backgroundColor:Colors.grey1,
                                padding:10,
                                width: '50%',
                                borderLeftWidth: 0.5,
                                alignItems: 'center'
                            }}>
                                <Text style={{
                                    fontFamily: 'Baloo2-Bold',
                                    color:'#fff'
                                }}>
                                    Add song/s to exist playlist
                                </Text>
                            </View>
                        )
                        :
                        (
                            <TouchableOpacity style={{
                                backgroundColor:Colors.grey1,
                                padding:10,
                                width: '50%',
                                borderLeftWidth: 0.5,
                                alignItems: 'center',
                                opacity:0.7
                            }} onPress={() => setMode('add')}>
                                <Text style={{
                                    fontFamily: 'Baloo2-Bold',
                                    color:'#fff'
                                }}>
                                    Add song/s to exist playlist
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
                {
                    mode === 'create' &&
                    <View style={{
                        width: '95%', height: Platform.OS == 'ios'? '80%' : '90%', backgroundColor:Colors.grey1,borderRadius:20,
                        shadowColor:'#000', shadowOffset:{width:0, height:3},
                        shadowOpacity:0.5, shadowRadius :5, paddingVertical:10
                    }}
                    >
                        <View style={{width:'100%', alignItems: 'center', justifyContent: 'center', marginTop:30}}>
                            <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', fontSize:20}}>Create New Playlist</Text>
                        </View>
                        <View style={{width:'100%', paddingHorizontal:20, marginTop:20}}>
                            <Text style={{fontFamily:'Baloo2-Bold', color:'#fff'}}>Give name to your playlist</Text>
                            <TextInput
                                style={{
                                    width:'95%', height: 30, fontFamily:'Baloo2-Medium', color:Colors.red3,
                                    paddingHorizontal:10, backgroundColor:'#fff', borderWidth:2,
                                    marginTop:10, borderRadius:50, borderColor:Colors.grey5
                                }}
                                value={playlistName}
                                onChangeText={text => setPlaylistName(text)}
                                returnKeyType='done'
                            />
                        </View>
                        <View style={{width:'100%', paddingHorizontal:20, marginTop:20}}>
                            <Text style={{fontFamily:'Baloo2-Bold', color:'#fff'}}>Would you like to add playlist picture?</Text>
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
                                        source={playlistImage == ''? require('../../../../assets/noimage.jpg') : {uri:playlistImage}}
                                        style={{width:150, height:120, borderRadius:20}}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={{width:'100%', alignItems: 'center', justifyContent: 'center', marginTop:10}}>
                            <View style={{borderWidth:2, height:200, borderColor:'#fff', width:'85%', backgroundColor:Colors.grey4, padding:10, borderRadius:20, alignItems: 'center', justifyContent: 'space-between'}}>
                                <FlatList
                                    numColumns={3}
                                    data={allArtistSongs}
                                    keyExtractor={item => item._id}
                                    renderItem={song => 
                                        <SongItem
                                            song={song.item}
                                            add={AddToSongsList}
                                            remove={removeSongFromList}
                                        />
                                    }
                                />
                            </View>
                        </View>
                        {
                            noteVisible && 
                            <View style={{width:'100%', alignItems: 'center', justifyContent:'center'}}>
                                <Text style={{fontFamily:'Baloo2-Medium', color:Colors.red3}}>You have atleast one song to create playlist</Text>
                            </View>
                        }
                        
                        <View style={{width:'100%', flexDirection:'row', alignItems: 'center', justifyContent: 'center', marginTop:10}}>
                            <TouchableOpacity onPress={() => props.close(false)} 
                                style={{
                                    backgroundColor:Colors.red3, margin:5,
                                    padding:5, paddingHorizontal:15,
                                    borderRadius:50, borderWidth:2, borderColor: 'white',
                                }}
                            >
                                <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Cancel</Text>
                            </TouchableOpacity>
                            {
                                playlistName != ''?
                                (
                                    <View>
                                        {
                                            !isLoading?
                                            (
                                                <TouchableOpacity  
                                                    style={{
                                                        backgroundColor:Colors.red3, margin:5,
                                                        padding:5, paddingHorizontal:15,
                                                        borderRadius:50, borderWidth:2, borderColor: 'white',
                                                    }}
                                                    onPress={createNewPlaylist}
                                                >
                                                    <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Create new playlist</Text>
                                                </TouchableOpacity>
                                            )
                                            :
                                            (
                                                <View 
                                                    style={{
                                                        backgroundColor:Colors.red3, margin:5,
                                                        padding:5, paddingHorizontal:15,
                                                        borderRadius:50, borderWidth:2, borderColor: 'white',
                                                    }}
                                                >
                                                    <ActivityIndicator color={'#000'}/>
                                                </View>
                                            )
                                        }
                                        
                                    </View>
                                )
                                :
                                (
                                    <View 
                                        style={{
                                            backgroundColor:Colors.red3, margin:5,
                                            padding:5, paddingHorizontal:15, opacity:0.5,
                                            borderRadius:50, borderWidth:2, borderColor: 'white',
                                        }}
                                    >
                                        <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Create new playlist</Text>
                                    </View>
                                )
                            }
                        </View>
                        
                    </View>
                }

                {
                    mode === 'add' &&
                    <View style={{
                        width: '95%', height: Platform.OS == 'ios'? '80%' : '90%', backgroundColor:Colors.grey1,borderRadius:20,
                        shadowColor:'#000', shadowOffset:{width:0, height:3},
                        shadowOpacity:0.5, shadowRadius :5, paddingVertical:10,
                        justifyContent: 'center',
                    }}
                    >
                        <View style={{width:'100%', alignItems: 'center', justifyContent: 'center', marginTop:30}}>
                            <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', fontSize:20}}>Add song/s to playlist</Text>
                        </View>
                        
                        <View style={{width:'100%', alignItems: 'center', justifyContent: 'center', marginTop:10}}>
                            <View style={{borderWidth:2, height:200, borderColor:'#fff', width:'85%', backgroundColor:Colors.grey4, padding:10, borderRadius:20, alignItems: 'center', justifyContent: 'space-between'}}>
                                <FlatList
                                    numColumns={3}
                                    data={allArtistSongs}
                                    keyExtractor={item => item._id}
                                    renderItem={({item, index}) => 
                                        <SongItem
                                            song={item}
                                            add={AddToSongsList}
                                            remove={removeSongFromList}
                                        />
                                    }
                                />
                            </View>
                        </View>

                        <View style={{width:'100%', alignItems: 'center', justifyContent: 'center', marginTop:10}}>
                            <View style={{borderWidth:2, height:200, borderColor:'#fff', width:'85%', backgroundColor:Colors.grey4, padding:10, borderRadius:20, alignItems: 'center', justifyContent: 'space-between'}}>
                                <FlatList
                                    numColumns={3}
                                    data={allArtistPlaylist}
                                    keyExtractor={item => item._id}
                                    renderItem={({item, index}) => 
                                        <TouchableOpacity
                                            onPress={() => addSongsToExistPlaylist(item)}
                                        >
                                            <Image
                                                source={{uri: item.playlistImage}}
                                                style={{width:60, height: 60, borderRadius:20}}
                                            />
                                            <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>{item.playlistName}</Text>
                                        </TouchableOpacity>
                                    }
                                />
                            </View>
                        </View>
                        {
                            noteVisible && 
                            <View style={{width:'100%', alignItems: 'center', justifyContent:'center'}}>
                                <Text style={{fontFamily:'Baloo2-Medium', color:Colors.red3}}>You have atleast one song to continue</Text>
                            </View>
                        }
                        {
                            alreadyExistInPlaylistSongs.length > 0 &&
                            <View style={{width:'70%', alignSelf:'center', marginTop:15, alignItems: 'center'}}>
                                <Text style={{fontFamily:'Baloo2-Bold', color:Colors.red3}}>This song are already in the list:</Text>
                            <FlatList
                                                                
                                numColumns={3}
                                data={alreadyExistInPlaylistSongs}
                                keyExtractor={item => item._id}
                                renderItem={({item, index}) => 
                                    <View style={{width:`${100/2.5}%`, alignItems: 'center'}}>
                                        <Text 
                                           numberOfLines={1}
                                           style={{fontFamily:'Baloo2-Medium', color:Colors.red3}}
                                        >
                                            {item.trackName}
                                        </Text>
                                    </View>
                                }
                            />
                            </View>
                        }
                        <View style={{width:'100%', flexDirection:'row', alignItems: 'center', justifyContent: 'center', marginTop:10}}>
                            <TouchableOpacity onPress={() => props.close(false)} 
                                style={{
                                    backgroundColor:Colors.red3, margin:5,
                                    padding:5, paddingHorizontal:15,
                                    borderRadius:50, borderWidth:2, borderColor: 'white',
                                }}
                            >
                                <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                }
            </View>
        </Modal>
    )
}

export default CreateNewPlaylistModal;