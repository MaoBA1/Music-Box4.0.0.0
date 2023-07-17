import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useDispatch, useSelector} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../../Utitilities/AppColors';
import { 
    getArtistLatestRealeasesForDashBoardProfil,
    getArtistTop5ForDashBoardProfil,
    getAllArtistSongsForDashBoardProfil,
    getArtistPlayListsForDashBoardProfile,
    getAllArtistAlbumsForDashBoardProfile
} from '../../../ApiCalls';
import { 
    playInTheFirstTimeAction,
    pauseSongAction,
    resumeSongAction,
    playNextSongAction,
    preperNextSongAction,
    handleSeeBarAction
} from '../../../../store/actions/appActions';
import { Audio } from 'expo-av';
import { play, pause, resume, playNext } from '../../../../audioController';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


import AudioListItemRow from './components/AudioListItemRow';
import OptionsModal from './components/OptionsModal';
import AddSongToPlayList from './components/AddSongToPlayList';

const MusicScreen = props => {
    const dispatch = useDispatch();
    const appSelector = useSelector(state => state.AppReducer);
    const artistSelector = useSelector(state => state.ArtistsReducer);
    const artistAlbumSelector = useSelector(state => state.AlbumReducers);
    const artistSongsSelector = useSelector(state => state.SongReducer);
    const allArtistAlbums = artistAlbumSelector?.ArtistAlbumDashBordReducer?.ArtistAlbums;
    const artistTop5 = artistSongsSelector?.ArtistTop5SongsDashBoardProfileReducer;
    const artistLatestRealeases = artistSongsSelector?.ArtistLatestReleasesDashBoardProfileReducer;
    const allArtistSongs = artistSongsSelector?.ArtistSongsDashBoardProfileReducer;
    const allArtistPlaylist = artistSelector?.ArtistPlaylistsDashBoardReducer;
    const { PostAuthorProfile } = appSelector;
    const { 
        _id,
        profileImage,
        profileSeconderyImage,
        artistName,
        description,
        mainGener,
        additionalGener,
        skills
    } = PostAuthorProfile;
    const artistId = _id;
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
    const [optionIsVisible, setOptionIsVisible] = useState(false);
    const [optionModalTrack, setOptionModalTrack] = useState(null);
    const [listForOptionsModal, setListForOptionsModal] = useState(null);
    const [indexForOptionsModal, setIndexForOptionsModal] = useState(null);
    const [addToPlayListVisible, setAddToPlaylistVisible] = useState(false);
    
    
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

        const getArtistSongs = async () => {
            const jsonToken = await AsyncStorage.getItem('Token');        
            const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
            if(userToken) {            
                getAllArtistSongsForDashBoardProfil(dispatch, userToken, artistId);
                getArtistTop5ForDashBoardProfil(dispatch, userToken, artistId);
                getArtistLatestRealeasesForDashBoardProfil(dispatch, userToken, artistId);
                getArtistPlayListsForDashBoardProfile(dispatch, userToken, artistId);
                getAllArtistAlbumsForDashBoardProfile(dispatch, userToken, artistId);
            }
        }
        getArtistSongs();
    },[
        SongIndexReducer,
        SongOnBackGroundReducer,                
        playbackObj,        
        MusicOnForGroundReducer
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

    const backToHomePage = () => {
        props.navigation.goBack(null);
    }

    return (
        <>
        {
            optionIsVisible && 
            <OptionsModal
                currentAudio={optionModalTrack}
                close={setOptionIsVisible}
                backGroundCurrentAudio={currentAudio}
                play={handleAudioPress}
                list={listForOptionsModal}
                index={indexForOptionsModal}    
                setAddToPlaylistVisible={setAddToPlaylistVisible}
            />
        }
        {
            addToPlayListVisible &&
            <AddSongToPlayList
                artist={{artistName:artistName, artistId:artistId}}
                song={optionModalTrack}
                close={setAddToPlaylistVisible}
            />
        }
        
            {
                (!artistTop5 || artistTop5?.length === 0) && 
                (!artistLatestRealeases || artistLatestRealeases?.length === 0)
                && (!allArtistPlaylist || allArtistPlaylist?.length === 0) &&
                (!allArtistAlbums || allArtistAlbums?.length === 0)
                && (!allArtistSongs || allArtistSongs?.length === 0) ?
                ( 
                    <ImageBackground
                        source={require('../../../../assets/AppAssets/Logo.png')}
                        style={{flex: 1, backgroundColor:Colors.grey1, alignItems: 'center', justifyContent: 'center'}}
                        imageStyle={{opacity: 0.3}}
                    >
                        <Text
                            style={{
                                fontFamily: 'Baloo2-Bold', 
                                color: '#fff',
                                fontSize:20,
                            }}
                        >
                            Apparently this is a new profile,
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'Baloo2-Bold', 
                                color: '#fff',
                                fontSize:20,
                            }}
                        >
                            currently there is no content to display yet
                        </Text>
                    </ImageBackground>
                )
                :
                (
                    <ScrollView
                        style={{
                            flex:1,
                            backgroundColor: Colors.grey1
                        }}
                    >
                        {artistTop5 && artistTop5.length > 0 && 
                            <>
                                    <View style={{
                                        marginTop:20, 
                                        marginLeft:10
                                    }}>
                                        <Text style={{
                                            fontFamily:'Baloo2-Bold',
                                            color: '#fff',
                                            fontSize:16
                                        }}>
                                            Top 5
                                        </Text>
                                    </View>

                                    <View style={{
                                        borderColor: Colors.grey6,
                                        borderTopWidth:0.5,
                                        borderBottomWidth:0.5,
                                    }}>
                                        {
                                            artistTop5.map((item, index) => 
                                                <AudioListItemRow
                                                    key={item._id}
                                                    index={index}
                                                    item={item}
                                                    list={artistTop5}
                                                    handleAudioPress={handleAudioPress}
                                                    SongIndex={SongIndexReducer}
                                                    currentAudio={currentAudio}
                                                    isPlaying={isPlaying}
                                                    isLoading={isLoading}
                                                    setOptionIsVisible={setOptionIsVisible}
                                                    setOptionModalTrack={setOptionModalTrack}
                                                    setListForOptionsModal={setListForOptionsModal}
                                                    setIndexForOptionsModal={setIndexForOptionsModal}
                                                />
                                            )
                                        }

                                    </View>

                                    
                            </>
                        }


                        
                        {
                            artistLatestRealeases && artistLatestRealeases.length > 0 &&
                                <>
                                        <View style={{
                                            marginTop:20, 
                                            marginLeft:10
                                        }}>
                                            <Text style={{
                                                fontFamily:'Baloo2-Bold',
                                                color: '#fff',
                                                fontSize:16
                                            }}>
                                                Latest Realeases
                                            </Text>
                                        </View>

                                        <View style={{
                                            borderColor: Colors.grey6,
                                            borderTopWidth:0.5,
                                            borderBottomWidth:0.5,
                                        }}>
                                            {
                                                artistLatestRealeases.slice(0,5).map((item, index) => 
                                                    <AudioListItemRow
                                                        key={item._id}
                                                        index={index}
                                                        item={item}
                                                        list={artistLatestRealeases}
                                                        handleAudioPress={handleAudioPress}
                                                        SongIndex={SongIndexReducer}
                                                        currentAudio={currentAudio}
                                                        isPlaying={isPlaying}
                                                        isLoading={isLoading}
                                                        setOptionIsVisible={setOptionIsVisible}
                                                        setOptionModalTrack={setOptionModalTrack}
                                                        setListForOptionsModal={setListForOptionsModal}
                                                        setIndexForOptionsModal={setIndexForOptionsModal}
                                                    />
                                                )
                                            }

                                        </View>

                                        
                                </>
                            
                        }


                        {
                            allArtistPlaylist && allArtistPlaylist.length > 0 &&
                                <>
                                        <View style={{
                                            marginTop:20, 
                                            marginLeft:10
                                        }}>
                                            <Text style={{
                                                fontFamily:'Baloo2-Bold',
                                                color: '#fff',
                                                fontSize:16
                                            }}>
                                                Playlists
                                            </Text>
                                        </View>

                                        <ScrollView horizontal style={{
                                            borderColor: Colors.grey6,
                                            borderTopWidth:0.5,
                                            borderBottomWidth:0.5,
                                            backgroundColor: Colors.grey4,
                                        }}>
                                            {
                                                allArtistPlaylist.map((item, index) => 
                                                    <TouchableOpacity key={index} style={{
                                                        margin:10,
                                                        alignItems: 'center',
                                                        top:5,
                                                        height:'100%',
                                                        width:90
                                                    }} 
                                                    onPress={() => props.navigation.navigate("PlaylistScreen", 
                                                    {songsList: item.tracks, screenName: item.playlistName})}>
                                                        <Image
                                                            style={{width:85, height:85, resizeMode:'stretch'}}
                                                            source={{uri:item.playlistImage}}
                                                        />
                                                        <Text numberOfLines={1} style={{
                                                            fontFamily:'Baloo2-Medium',
                                                            color:'#fff', 
                                                        }}>
                                                            {item.playlistName}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )
                                            }

                                        </ScrollView>

                                        
                                </>
                            
                        }

                        {
                            allArtistAlbums && allArtistAlbums.length > 0 &&
                                <>
                                        <View style={{
                                            marginTop:20, 
                                            marginLeft:10
                                        }}>
                                            <Text style={{
                                                fontFamily:'Baloo2-Bold',
                                                color: '#fff',
                                                fontSize:16
                                            }}>
                                                Albums
                                            </Text>
                                        </View>

                                        <ScrollView horizontal style={{
                                            borderColor: Colors.grey6,
                                            borderTopWidth:0.5,
                                            borderBottomWidth:0.5,
                                            backgroundColor: Colors.grey4,
                                        }}>
                                            {
                                                allArtistAlbums.map((item, index) => 
                                                    <TouchableOpacity key={index} style={{
                                                        margin:10,
                                                        alignItems: 'center',
                                                        top:5,
                                                        height:'100%',
                                                        width:90
                                                    }} onPress={() => props.navigation.navigate("PlaylistScreen", 
                                                    {songsList: item.tracks, screenName: item.albumName})}>
                                                        <Image
                                                            style={{width:85, height:85, resizeMode:'stretch'}}
                                                            source={{uri:item.albumCover}}
                                                        />
                                                        <Text numberOfLines={1} style={{
                                                            fontFamily:'Baloo2-Medium',
                                                            color:'#fff', 
                                                        }}>
                                                            {item.albumName}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )
                                            }

                                        </ScrollView>

                                        
                                </>
                            
                        }

                        
                        {
                            allArtistSongs && allArtistSongs.length > 0 &&
                                <>
                                        <View style={{
                                            marginTop:20, 
                                            marginLeft:10
                                        }}>
                                            <Text style={{
                                                fontFamily:'Baloo2-Bold',
                                                color: '#fff',
                                                fontSize:16
                                            }}>
                                                Singles
                                            </Text>
                                        </View>

                                        <View style={{
                                            borderColor: Colors.grey6,
                                            borderTopWidth:0.5,
                                            borderBottomWidth:0.5,
                                        }}>
                                            {
                                                allArtistSongs.slice(0,5).map((item, index) => 
                                                    <AudioListItemRow
                                                        key={item._id}
                                                        index={index}
                                                        item={item}
                                                        list={artistLatestRealeases}
                                                        handleAudioPress={handleAudioPress}
                                                        SongIndex={SongIndexReducer}
                                                        currentAudio={currentAudio}
                                                        isPlaying={isPlaying}
                                                        isLoading={isLoading}
                                                        setOptionIsVisible={setOptionIsVisible}
                                                        setOptionModalTrack={setOptionModalTrack}
                                                        setListForOptionsModal={setListForOptionsModal}
                                                        setIndexForOptionsModal={setIndexForOptionsModal}
                                                    />
                                                )
                                            }
                                                <View style={{width: '100%', alignItems: 'center', margin:10}}>
                                                    <TouchableOpacity style={{alignItems: 'center'}} 
                                                    onPress={() => props.navigation.navigate("PlaylistScreen", 
                                                    {songsList: allArtistSongs, screenName:"Singels"})}>
                                                        <Text style={{
                                                            color:Colors.grey3,
                                                            fontFamily: 'Baloo2-Medium'
                                                        }}>See All Singles</Text>
                                                        <Feather
                                                            name="more-horizontal"
                                                            color={Colors.grey3}
                                                            size={20}
                                                            style={{bottom:5}}
                                                        />
                                                    </TouchableOpacity>
                                                </View> 
                                        </View>

                                       
                                </>
                            
                        }
                   </ScrollView> 
                )
            }
        

        </>
    );
    
};

export const screenOptions = ({navigation}) => {
    const moveToFeedScreen = () => {
        navigation.navigate("ArtistFeed")
    }
    return {        
        gestureEnabled:false,
        headerStyle:{backgroundColor:Colors.grey1, height:Platform.OS === 'ios' ? 110 : 90, borderBottomWidth:2, borderBottomColor:Colors.grey3},
        headerTitleStyle:{
            color:"#FFFFFF",
            fontFamily:"Baloo2-ExtraBold",
            fontSize:25
        },
        presentation:"transparentModal",
        header: () => {
            return <View style={{
                backgroundColor:Colors.grey1,
                height:Platform.OS === 'ios' ? 90 : 70,
                borderBottomWidth:2,
                borderBottomColor:Colors.grey3,
                flexDirection:'row',
            }}>
                <TouchableOpacity style={{
                    width:"10%",
                    justifyContent: "flex-end",
                    paddingBottom:10,
                    paddingLeft: 10
                }} onPress={navigation.goBack}>
                    <Entypo 
                        name={'home'}
                        color={"#fff"}
                        size={24}
                    />
                </TouchableOpacity>
                
                <TouchableOpacity style={{
                    flexDirection:'row',
                    width:"45%",
                    justifyContent: 'center',
                    alignItems: "flex-end",
                    paddingBottom:5,
                }} onPress={moveToFeedScreen}>
                    <MaterialCommunityIcons
                        name="newspaper-variant-multiple"
                        size={25}
                        color={"#ffff"}
                    />
                    <Text style={{fontFamily: 'Baloo2-Bold', color: "#ffff", marginLeft:5, fontSize:18}}>Feed</Text>
                </TouchableOpacity>

                <View style={{
                    flexDirection:'row',
                    width:"30%",
                    justifyContent: 'center',
                    alignItems: "flex-end",
                    paddingBottom:5,
                }}>
                    <FontAwesome
                        name="music"
                        size={25}
                        color={Colors.red3}
                    />
                    <Text style={{fontFamily: 'Baloo2-Bold', color:Colors.red3, marginLeft:5, fontSize:18}}>Music</Text>
                </View>
                
            </View>
        }
    }
}


export default MusicScreen;
