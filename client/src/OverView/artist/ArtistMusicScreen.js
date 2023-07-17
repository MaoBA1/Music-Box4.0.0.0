import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    Image,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Modal,
    Linking
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Style from './style/ArtistFeedStyle';
import Colors from '../../Utitilities/AppColors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { 
    getAllArtistSongs,
    getArtistTop5,
    getArtistLatestRealeases,
    getArtistPlayLists,
    getAllArtistAlbums,
    getAllSearchResults,
    deleteArtistPlaylist,
    deleteArtistAlbum
} from '../../ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
    playInTheFirstTimeAction,
    pauseSongAction,
    resumeSongAction,
    playNextSongAction,
    preperNextSongAction,
    handleSeeBarAction
} from '../../../store/actions/appActions';
import { getAllArtistAlbumsAction } from '../../../store/actions/albumsActions';
import { play, pause, resume, playNext } from '../../../audioController';
import { Audio } from 'expo-av';
import MusicHeader from './components/MusicHeader';
import UploadSongModal from './Modals/UploadSongModal';
import CreateNewPlaylistModal from './Modals/CreateNewPlaylistModal';
import CreateNewAlbumModal from './Modals/CreateNewAlbumModal';



const ArtistMusicScreen = props => {
    const dispatch = useDispatch();
    const artistSelector = useSelector(state => state.ArtistsReducer);
    const artistAlbumSelector = useSelector(state => state.AlbumReducers);
    const allArtistAlbums = artistAlbumSelector?.ArtistAlbumReducer?.ArtistAlbums;
    const artistId = artistSelector?.ArtistDataReducer?._id;
    const [uploadSongModalVisible, setUploadSongModalVisible] = useState(false);
    const [createNewPlaylistModalVisible, setCreateNewPlaylistModalVisible] = useState(false);  
    const [createNewAlbumModalVisible, setCreateNewAlbumModalVisible] = useState(false);    
    const artistSongsSelector = useSelector(state => state.SongReducer);
    const artistTop5 = artistSongsSelector?.ArtistTop5SongsReducer;
    const artistLatestRealeases = artistSongsSelector?.ArtistLatestReleasesReducer;
    const allArtistSongs = artistSongsSelector?.ArtistSongsReducer;
    const allArtistPlaylist = artistSelector?.ArtistPlaylistsReducer;
    const [deletPostVisible, setDeletePostVisible] = useState(false);
    const appBackGroundSelector = useSelector(state => state.AppReducer);
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
   
    const getArtistSongs = async () => {
        console.log('refresh');
        const jsonToken = await AsyncStorage.getItem('Token');        
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
        if(userToken) {            
            getAllArtistSongs(dispatch, userToken, artistId);
            getArtistTop5(dispatch, userToken, artistId);
            getArtistLatestRealeases(dispatch, userToken, artistId);
            getArtistPlayLists(dispatch, userToken);
            getAllArtistAlbums(dispatch, userToken, artistId);
        }
    }
    const [userToken, setUserToken] = useState(null)
    const getUserToken = async() => {
        const jsonToken = await AsyncStorage.getItem('Token');        
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
        if(userToken) { 
            setUserToken(userToken);
        }
    }

    useEffect(() => {
        getUserToken();
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
        getArtistSongs();

    },[
        SongIndexReducer,
        SongOnBackGroundReducer,                
        playbackObj,        
        MusicOnForGroundReducer,
    ])
     

    const handleAudioPress = async (audio, index, list) => {     
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

        if(soundObj.isLoaded && !soundObj.isPlaying && currentAudio._id === audio._id) {
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
        
        if(soundObj.isLoaded && currentAudio._id !== audio._id){
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
    const [deleteFrom, setDeleteFrom] = useState('');
    const [itemId, setItemId] = useState(null);
    const openDeleteModal = (deleteFrom, itemId) => {
        setDeleteFrom(deleteFrom);
        setItemId(itemId);
        setDeletePostVisible(true);
    }
    const deleteAlbumOrPlaylist = () => {
        switch(deleteFrom) {
            case 'album':
                deleteAlbum(itemId);
                setDeletePostVisible(false);
            case 'playlist':
                deletePlaylist(itemId);
                setDeletePostVisible(false);
            default: return;
        }
    }

    const deletePlaylist = async(playlistId) => {
        const jsonToken = await AsyncStorage.getItem('Token');        
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
        if(userToken) {
            deleteArtistPlaylist(dispatch, userToken, artistId, playlistId)
            .then(() => {
                getArtistPlayLists(dispatch, userToken);
                getAllSearchResults(dispatch, userToken);
            })
        }
    }


    const deleteAlbum = async(albumId) => {
        const jsonToken = await AsyncStorage.getItem('Token');        
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
        if(userToken) {
            deleteArtistAlbum(dispatch, userToken, artistId, albumId)
            .then(() => {
                getAllArtistAlbums(dispatch, userToken, artistId);
                getAllSearchResults(dispatch, userToken);
            })
        }
    }


    return(
        <ImageBackground 
                source={ require('../../../assets/AppAssets/Logo.png') }
                resizeMode="cover" 
                style={Style.backgroundContainer}
                imageStyle={{opacity: 0.3}}
        >
            {/* <MusicHeader goBack={() =>  props.navigation.navigate('Setting')}/> */}
            {uploadSongModalVisible && <UploadSongModal close={setUploadSongModalVisible}/>}
            {createNewPlaylistModalVisible && <CreateNewPlaylistModal close={setCreateNewPlaylistModalVisible}/>}
            {createNewAlbumModalVisible && <CreateNewAlbumModal close={setCreateNewAlbumModalVisible}/>}
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
                                <Text style={{fontFamily:'Baloo2-Bold', fontSize:14, color: '#fff'}}>Are you sure you want delete this {deleteFrom}?</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <TouchableOpacity onPress={() => setDeletePostVisible(false)} style={{width:'50%', borderRightWidth:0.5, borderTopWidth:1, alignItems: 'center', justifyContent:'center', padding:5}}>
                                    <Text style={{fontFamily:'Baloo2-Bold', fontSize:14, color: '#fff'}}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={deleteAlbumOrPlaylist} style={{width:'50%', borderLeftWidth:0.5, borderTopWidth:1, alignItems: 'center', justifyContent:'center', padding:5}}>
                                    <Text style={{fontFamily:'Baloo2-Bold', fontSize:14, color: '#fff'}}>Yes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                </View>
            </Modal>
            
            <View style={{width:'100%', flexDirection:'row',top:10}}>
                <TouchableOpacity onPress={() => setCreateNewAlbumModalVisible(true)} style={{backgroundColor:Colors.grey1, padding:10, width:`${100/3}%`, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderRightWidth:1, borderColor: Colors.grey3}}>
                    <MaterialIcons
                        name='album'
                        size={25}
                        color={Colors.red3}
                        style={{right:4}}                    
                    />
                    <View>
                        <Text style={{fontFamily:'Baloo2-Bold', color: '#fff', fontSize:12}}>Create Album/</Text>
                        <Text style={{fontFamily:'Baloo2-Bold', color: '#fff', fontSize:12}}>Add to Album</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCreateNewPlaylistModalVisible(true)} style={{backgroundColor:Colors.grey1, padding:10, width:`${100/2.5}%`, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                    <MaterialCommunityIcons
                        name='playlist-music'
                        size={25}
                        color={Colors.red3}                    
                        style={{right:4}}
                    />
                    <View>
                        <Text style={{fontFamily:'Baloo2-Bold', color: '#fff', fontSize:12}}>Create Playlist/</Text>
                        <Text style={{fontFamily:'Baloo2-Bold', color: '#fff', fontSize:12}}>Add to Playlist</Text>
                    </View>    
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL(`https://musicbox-uploadmediacenter.netlify.app`)} style={{backgroundColor:Colors.grey1, padding:10, width:`${100/4}%`, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderLeftWidth:1, borderColor:Colors.grey3}}>
                    <MaterialIcons
                        name='music-note'
                        size={25}
                        color={Colors.red3}                    
                    />
                    <Text style={{fontFamily:'Baloo2-Bold', color: '#fff', fontSize:12}}>Upload Song</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                onResponderEnd={getArtistSongs}
            >
                <View style={{marginTop:20}}>
                    <View style={{left:10}}>
                        <Text style={{fontFamily:'Baloo2-Bold', color: '#fff', fontSize:18}}>Top 5</Text>
                    </View>
                    <View style={{marginTop:10, width:'100%', borderTopWidth:2, borderBottomWidth:2, borderColor:'#fff', padding:10, backgroundColor:Colors.grey4}}>
                        {
                            !artistTop5 || artistTop5.length == 0 ?
                            (
                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{fontFamily:'Baloo2-Medium', color: Colors.red3, fontSize:15}}>Soon we will start to</Text>
                                    <Text style={{fontFamily:'Baloo2-Medium', color: Colors.red3, fontSize:15}}>understand what your most</Text>
                                    <Text style={{fontFamily:'Baloo2-Medium', color: Colors.red3, fontSize:15}}>successful songs</Text>
                                </View>
                            )
                            :
                            (
                                <ScrollView horizontal>
                                    {artistTop5.map((item, index) =>
                                        <View key={item._id}>
                                            {
                                                !isLoading?
                                                (
                                                    <View style={{width:80, margin:5, alignItems: 'center', justifyContent: 'center'}}>
                                                        <TouchableOpacity
                                                            onPress={() => handleAudioPress(item, index, artistTop5)}
                                                        >
                                                            <ImageBackground
                                                                source={{uri:item.trackImage}}
                                                                style={{
                                                                    width:40,
                                                                    height:40,
                                                                    resizeMode:'stretch',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    opacity:index === SongIndexReducer && item._id === currentAudio._id? 0.7 : 1
                                                                }}
                                                                imageStyle={{borderRadius:20}}
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
                                                        </TouchableOpacity>
                                                        <Text numberOfLines={1} style={{fontFamily:'Baloo2-Medium', color:'#fff', marginTop:5}}>{item.trackName}</Text>
                                                    </View>
                                                )
                                                :
                                                (
                                                    <View style={{width:80, margin:5, alignItems: 'center', justifyContent: 'center'}}>
                                                        <View
                                                            onPress={() => handleAudioPress(item, index, artistLatestRealeases)}
                                                        >
                                                            <ImageBackground
                                                                source={{uri:item.trackImage}}
                                                                style={{
                                                                    width:40,
                                                                    height:40,
                                                                    resizeMode:'stretch',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    opacity:index === SongIndexReducer && item._id === currentAudio._id? 0.7 : 1
                                                                }}
                                                                imageStyle={{borderRadius:20}}
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
                                                        </View>
                                                        <Text numberOfLines={1} style={{fontFamily:'Baloo2-Medium', color:'#fff', marginTop:5}}>{item.trackName}</Text>
                                                    </View>
                                                )
                                            }
                                        </View>
                                    )}
                                </ScrollView>
                            )
                        }
                    </View>
                </View>

                <View style={{marginTop:20}}>
                    <View style={{left:10}}>
                        <Text style={{fontFamily:'Baloo2-Bold', color: '#fff', fontSize:18}}>Latest Realeases</Text>
                    </View>
                    <View style={{marginTop:10, width:'100%', borderTopWidth:2, borderBottomWidth:2, borderColor:'#fff', padding:10, backgroundColor:Colors.grey4}}>
                        {
                            !artistLatestRealeases || artistLatestRealeases?.length == 0 ?
                            (
                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{fontFamily:'Baloo2-Medium', color: Colors.red3, fontSize:15}}>Come on, don't wait,</Text>
                                    <Text style={{fontFamily:'Baloo2-Medium', color: Colors.red3, fontSize:15}}>start uploading new songs</Text>
                                </View>
                            )
                            :
                            (
                                <View style={{width:'100%', justifyContent: 'center'}}>
                                    <FlatList
                                        horizontal
                                        data={artistLatestRealeases.slice(0,5)}
                                        keyExtractor={item => item._id}
                                        renderItem={({item, index}) => 
                                            
                                                !isLoading?
                                                (
                                                    <View style={{width:80, margin:5, alignItems: 'center', justifyContent: 'center'}}>
                                                        <TouchableOpacity
                                                            onPress={() => handleAudioPress(item, index, artistLatestRealeases)}
                                                        >
                                                            <ImageBackground
                                                                source={{uri:item.trackImage}}
                                                                style={{
                                                                    width:40,
                                                                    height:40,
                                                                    resizeMode:'stretch',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    opacity:index === SongIndexReducer && item._id === currentAudio._id? 0.7 : 1
                                                                }}
                                                                imageStyle={{borderRadius:20}}
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
                                                        </TouchableOpacity>
                                                        <Text numberOfLines={1} style={{fontFamily:'Baloo2-Medium', color:'#fff', marginTop:5}}>{item.trackName}</Text>
                                                    </View>
                                                )
                                                :
                                                (
                                                    <View style={{width:80, margin:5, alignItems: 'center', justifyContent: 'center'}}>
                                                        <View
                                                            onPress={() => handleAudioPress(item, index, artistLatestRealeases)}
                                                        >
                                                            <ImageBackground
                                                                source={{uri:item.trackImage}}
                                                                style={{
                                                                    width:40,
                                                                    height:40,
                                                                    resizeMode:'stretch',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    opacity:index === SongIndexReducer && item._id === currentAudio._id? 0.7 : 1
                                                                }}
                                                                imageStyle={{borderRadius:20}}
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
                                                        </View>
                                                        <Text numberOfLines={1} style={{fontFamily:'Baloo2-Medium', color:'#fff', marginTop:5}}>{item.trackName}</Text>
                                                    </View>
                                                )
                                            
                                        }
                                    />
                                </View>
                            )
                        }
                    </View>
                </View>

                <View style={{marginTop:20}}>
                    <View style={{left:10}}>
                        <Text style={{fontFamily:'Baloo2-Bold', color: '#fff', fontSize:18}}>Your Playlists</Text>
                    </View>
                    <View style={{marginTop:10, width:'100%', borderTopWidth:2, borderBottomWidth:2, borderColor:'#fff', padding:10, backgroundColor:Colors.grey4}}>
                        {
                            !allArtistPlaylist || allArtistPlaylist.length == 0 ?
                            (
                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{fontFamily:'Baloo2-Medium', color: Colors.red3, fontSize:15}}>Start creating playlists of your</Text>
                                    <Text style={{fontFamily:'Baloo2-Medium', color: Colors.red3, fontSize:15}}>singles by styles</Text>
                                </View>
                            )
                            :
                            (
                                <ScrollView horizontal style={{width:'100%'}}>
                                    {allArtistPlaylist?.map((item, index) =>
                                        <View key={index} style={{width:80, margin:5, alignItems: 'center', justifyContent: 'center'}}>
                                            <Ionicons
                                                name='close'
                                                size={15}
                                                color={'#fff'}
                                                style={{backgroundColor:Colors.grey3, borderRadius:50, position: 'absolute', zIndex:1, bottom:65, right:55}}
                                                onPress={() => openDeleteModal('playlist', item._id)}
                                            />
                                            <TouchableOpacity onPress={() => props.navigation.navigate("AllSingels", {songsList: item.tracks, screenName: item.playlistName, optionToDelete: true, deletFrom:'playlist', artistId: artistId, playlistId: item._id})}>
                                                <Image
                                                    source={{uri:item.playlistImage}}
                                                    style={{width:50, height:50, borderRadius:20, resizeMode:'stretch'}}
                                                />                                                
                                            </TouchableOpacity>
                                            <Text numberOfLines={1} style={{fontFamily:'Baloo2-Medium', color:'#fff', marginTop:5}}>{item.playlistName}</Text>
                                        </View>
                                    )}
                                </ScrollView>
                            )
                        }
                    </View>
                </View>

                <View style={{marginTop:20}}>
                    <View style={{left:10}}>
                        <Text style={{fontFamily:'Baloo2-Bold', color: '#fff', fontSize:18}}>Your Albums</Text>
                    </View>
                    <View style={{marginTop:10, width:'100%', borderTopWidth:2, borderBottomWidth:2, borderColor:'#fff', padding:10, backgroundColor:Colors.grey4}}>
                        {
                            !allArtistAlbums || allArtistAlbums.length == 0 ?
                            (
                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{fontFamily:'Baloo2-Medium', color: Colors.red3, fontSize:15}}>You haven't released any albums yet</Text>                                    
                                </View>
                            )
                            :
                            (
                                <View style={{width:'100%', justifyContent: 'center'}}>
                                    <FlatList
                                        horizontal
                                        data={allArtistAlbums}
                                        keyExtractor={item => item._id}
                                        renderItem={({item, index}) => 
                                            <View style={{width:80, margin:5, alignItems: 'center', justifyContent: 'center'}}>
                                                <Ionicons
                                                    name='close'
                                                    size={15}
                                                    color={'#fff'}
                                                    style={{backgroundColor:Colors.grey3, borderRadius:50, position: 'absolute', zIndex:1, bottom:65, right:55}}
                                                    onPress={() => openDeleteModal('album', item._id)}
                                                />
                                                <TouchableOpacity onPress={() => props.navigation.navigate("AllSingels", {songsList: item.tracks, screenName: item.albumName, optionToDelete: true, deletFrom:'album', albumId: item._id})}>
                                                    <Image
                                                        source={{uri:item.albumCover}}
                                                        style={{width:50, height:50, borderRadius:20, resizeMode:'stretch'}}
                                                    />                                                
                                                </TouchableOpacity>
                                                <Text numberOfLines={1} style={{fontFamily:'Baloo2-Medium', color:'#fff', marginTop:5}}>{item.albumName}</Text>
                                            </View>
                                        }
                                    />
                                </View>
                            )
                        }
                    </View>
                </View>

                {
                    allArtistSongs && allArtistSongs.length > 0 &&
                    <View style={{marginTop:20}}>
                         <View style={{left:10}}>
                             <Text style={{fontFamily:'Baloo2-Bold', color: '#fff', fontSize:18}}>Your Singles</Text>
                         </View>
                         <ScrollView style={{marginTop:10, width:'100%', borderTopWidth:2, borderBottomWidth:2, borderColor:'#fff', padding:10, backgroundColor:Colors.grey4}}>
                                    {allArtistSongs.sort((a, b) => (new Date(b.creatAdt) - new Date(a.creatAdt))).slice(0,5).map((item,index) => 
                                        
                                            !isLoading?
                                            (
                                                <TouchableOpacity 
                                                    key={item._id}
                                                    style={{
                                                        justifyContent: 'space-between',
                                                        width:'100%',
                                                        flexDirection: 'row',
                                                        marginVertical:3,
                                                        backgroundColor: Colors.grey1,
                                                        padding:10,
                                                        borderRadius:10
                                                    }}
                                                    onPress={() => handleAudioPress(item, index, allArtistSongs.sort((a, b) => (new Date(b.creatAdt) - new Date(a.creatAdt))))}
                                                >
                                                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                                                        <View>
                                                            <ImageBackground
                                                                source={{uri:item.trackImage}}
                                                                style={{
                                                                    width:40,
                                                                    height:40,
                                                                    resizeMode:'stretch',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    opacity:index === SongIndexReducer && item._id === currentAudio._id? 0.7 : 1
                                                                }}
                                                                imageStyle={{borderRadius:20}}
                                                            
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
                                                        </View>
                                                        <Text style={{fontFamily:'Baloo2-Medium', color: '#fff', marginLeft:10}}>{item.trackName}</Text>
                                                    </View>
                                                    <View style={{width:'12%', flexDirection:'column-reverse'}}>
                                                        <Text style={{fontFamily:'Baloo2-Medium', color: Colors.grey3}}>{item.trackLength}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                            :
                                            (
                                                <View 
                                                    key={item._id}
                                                    style={{
                                                        justifyContent: 'space-between',
                                                        width:'100%',
                                                        flexDirection: 'row',
                                                        marginVertical:3,
                                                        backgroundColor: Colors.grey1,
                                                        padding:10,
                                                        borderRadius:10,                                                        
                                                    }}
                                                >
                                                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                                                        <View>
                                                            <ImageBackground
                                                                source={{uri:item.trackImage}}
                                                                style={{
                                                                    width:40,
                                                                    height:40,
                                                                    resizeMode:'stretch',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    opacity:index === SongIndexReducer && item._id === currentAudio._id? 0.7 : 1
                                                                }}
                                                                imageStyle={{borderRadius:20}}
                                                            
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
                                                        </View>
                                                        <Text style={{fontFamily:'Baloo2-Medium', color: '#fff', marginLeft:10}}>{item.trackName}</Text>
                                                    </View>
                                                    <View style={{width:'12%', flexDirection:'column-reverse'}}>
                                                        <Text style={{fontFamily:'Baloo2-Medium', color: Colors.grey3}}>{item.trackLength}</Text>
                                                    </View>
                                                </View>
                                            )
                                        
                                    )}
                                    <TouchableOpacity onPress={() => props.navigation.navigate("AllSingels", {songsList: allArtistSongs, screenName:"Singels", optionToDelete: true, deletFrom:'singels'})} style={{top:10 ,paddingHorizontal:10, widht:'20%', alignItems: 'center'}}>
                                        <Text style={{fontFamily:'Baloo2-Medium', color:Colors.grey3, fontSize:12}}>See all singles</Text>
                                        <Feather
                                            name="more-horizontal"
                                            color={Colors.grey3}
                                            size={20}
                                            style={{bottom:5}}
                                        />
                                        
                                    </TouchableOpacity>
                         </ScrollView>
                    </View>
                }
            </ScrollView>
        </ImageBackground>
    )
}


export const screenOptions = ({ navigation }) => {
    return {        
        gestureEnabled: false,
        header: () => {
            return <View style={{
                    height:Platform.OS === "ios" ? 75 : 60,
                    flexDirection:'row',
                    alignItems:"flex-end",
                    backgroundColor: Colors.grey1
                }}>
                    <View style={{
                        width:`10%`,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection:'row',
                    }}>
                        
                        <AntDesign 
                            name="arrowleft"
                            size={22}
                            color="#ffffff"
                            onPress={() => navigation.popToTop()}
                            style={{left:5, bottom:2}}
                        />
                        
                    </View>

                    <TouchableOpacity style={{
                        width:`${90/3}%`,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection:'row',
                    }} onPress={() => navigation.navigate("Setting")}>
                        <Ionicons
                            name="ios-settings"
                            size={22}
                            color={"#fff"}
                        />
                        <Text style={{
                            marginLeft:5,
                            fontFamily:'Baloo2-Bold',
                            color:"#fff",
                            fontSize:16
                        }}>
                            Setting
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        width:`${90/3}%`,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection:'row',
                    }} onPress={() => navigation.navigate("Feed")}>
                            <MaterialCommunityIcons
                            name="newspaper-variant-multiple"
                            size={22}
                            color={"#fff"}
                        />
                        <Text style={{
                            marginLeft:5,
                            fontFamily:'Baloo2-Bold',
                            color:"#fff",
                            fontSize:16
                        }}>
                            Feed
                        </Text>
                    </TouchableOpacity>

                    <View style={{
                        width:`${90/3}%`,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection:'row',
                    }}>
                        <FontAwesome
                            name="music"
                            size={22}
                            color={Colors.red3}
                        />
                        <Text style={{
                            marginLeft:5,
                            fontFamily:'Baloo2-Bold',
                            color:Colors.red3,
                            fontSize:16
                        }}>
                            Music
                        </Text>
                    </View>
            </View>
        }
    }
}


export default ArtistMusicScreen;