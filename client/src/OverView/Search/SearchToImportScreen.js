import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ImageBackground, ActivityIndicator} from 'react-native';
import Colors from '../../Utitilities/AppColors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TextInput } from 'react-native';
import { getArtists, getAllAppSongs } from '../../ApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { play, pause, resume, playNext } from '../../../audioController';
import { 
    playInTheFirstTimeAction,
    pauseSongAction,
    resumeSongAction,
    playNextSongAction,
    preperNextSongAction,
    handleSeeBarAction,
    setPostAuthorProfileAction
} from '../../../store/actions/appActions';



import OptionsModal from '../DashBoards/DashboardUserProfiles/components/OptionsModal';
import AddSongToPlayList from '../DashBoards/DashboardUserProfiles/components/AddSongToPlayList';


const SearchToImportScreen = (props) => {
    const dispatch = useDispatch();
    const typeOfSearch = props?.route?.params?.typeOfSearch;
    const artistSelector = useSelector(state => state?.ArtistsReducer);
    const songSelector = useSelector(state => state?.SongReducer?.AllSongs);
    const artists = artistSelector?.ArtistsReducer?.artists;
    const [search, setSearch] = useState('');
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
    const [addToPlayListVisible, setAddToPlaylistVisible] = useState(false);
    const [optionModalTrack, setOptionModalTrack] = useState(null);
    const [searchResult, setSearchResult] = useState([]);
    
    const getAllPageData = async() => {
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
        if(userToken) {
            getArtists(dispatch, userToken);
            getAllAppSongs(dispatch, userToken);
        }
    }

    useEffect(() => {
        getAllPageData();

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

    const openOptionsModal = (item) => {
        setOptionIsVisible(true);
        setOptionModalTrack(item);
    }

    const SerchByKeyWord = (text) => {
        setSearch(text);
        let results = typeOfSearch === 'song' ?
            songSelector?.filter(x => x?.trackName?.includes(search) === true || x?.trackName?.toLowerCase().includes(search.toLowerCase()))
            :
            artists.filter(x => x?.artistName?.includes(search) === true || x?.artistName?.toLowerCase().includes(search.toLowerCase()))
        setSearchResult(results);
    }

    const openToArtistScreen = (artist) => {
        try {
            dispatch(setPostAuthorProfileAction(artist))
            props.navigation.navigate("ArtistFeed");
        }catch(error) {
            console.log(error.message);
        }        
    }
  
    return (
        <View style={{
            flex: 1,
            backgroundColor:Colors.grey1
        }}>
            {
                optionIsVisible && 
                <OptionsModal
                    currentAudio={optionModalTrack}
                    close={setOptionIsVisible}
                    backGroundCurrentAudio={currentAudio}
                    play={handleAudioPress}
                    setAddToPlaylistVisible={setAddToPlaylistVisible}
                />
            }
            {
                addToPlayListVisible &&
                <AddSongToPlayList
                    song={optionModalTrack}
                    close={setAddToPlaylistVisible}
                />
            }
            <View
                style={{width: '100%', backgroundColor:Colors.grey4, height: 105}}
            >
                <View style={{backgroundColor:Colors.grey3, borderRadius:50, left:10, width:25, height:25, alignItems: 'center', justifyContent: 'center', top:40}}>
                    <Ionicons
                        name='close'
                        size={20}
                        color={'#fff'}
                        onPress={() => props.navigation.goBack(null)}
                        style={{height:20, width:20}}
                    />
                </View>
                <TextInput
                    style={{
                        width: '85%',
                        backgroundColor:Colors.grey3,
                        borderRadius:10, alignSelf:'center',
                        top:45,
                        left:5,
                        height:25,
                        paddingHorizontal:10,
                        fontFamily: 'Baloo2-Bold',
                        color:Colors.red3
                    }}
                    placeholder={typeOfSearch === 'song' ? "Here you can search for songs..." : "Here you can search for artists..."}
                    placeholderTextColor={Colors.grey6}
                    value={search}
                    onChangeText={text => SerchByKeyWord(text)}
                />
            </View>
            {
                typeOfSearch === 'song' && search === '' && songSelector &&
                <FlatList
                    data={songSelector}
                    keyExtractor={item => item._id}
                    renderItem={({item, index}) => 
                        <TouchableOpacity onPress={() => handleAudioPress(item, 0, [item])} style={{width: '100%', padding:10, borderBottomWidth:1, backgroundColor: Colors.grey1, flexDirection:'row', borderColor:Colors.grey3}}>
                        <View style={{width: '20%'}}>
                        <ImageBackground
                            style={{width: 65, height: 65, alignItems: 'center', justifyContent: 'center'}}
                            imageStyle={{resizeMode:'stretch', borderRadius:3}}
                            source={{uri: item.trackImage}}
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
                        <View style={{width: '55%', justifyContent: 'center', alignItems: 'flex-start'}}>
                            <Text numberOfLines={1} style={{fontFamily:'Baloo2-Bold', fontSize:18, color:'#fff'}}>
                                {item.trackName}
                            </Text>
                            <Text style={{fontFamily:'Baloo2-Medium', fontSize:14, color:Colors.grey5}}>
                                {item.artistName}
                            </Text>
                        </View>
                        <View style={{width: '25%', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontFamily:'Baloo2-Bold', fontSize:12, color:Colors.grey3}}>
                                {item.likes.length} Likes
                            </Text>
                            <SimpleLineIcons
                                name="options"
                                color={Colors.grey3}
                                size={20}
                                style={{alignItems: 'center', justifyContent: 'center', padding:10}}
                                onPress={() => openOptionsModal(item)}
                            />
                        </View>
                    </TouchableOpacity>
                    }
                />
            }
            {
                typeOfSearch === 'song' && search !== '' && songSelector &&
                <FlatList
                    data={searchResult}
                    keyExtractor={item => item._id}
                    renderItem={({item, index}) => 
                        <TouchableOpacity onPress={() => handleAudioPress(item, 0, [item])} style={{width: '100%', padding:10, borderBottomWidth:1, backgroundColor: Colors.grey1, flexDirection:'row', borderColor:Colors.grey3}}>
                        <View style={{width: '20%'}}>
                        <ImageBackground
                            style={{width: 65, height: 65, alignItems: 'center', justifyContent: 'center'}}
                            imageStyle={{resizeMode:'stretch', borderRadius:3}}
                            source={{uri: item.trackImage}}
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
                        <View style={{width: '55%', justifyContent: 'center', alignItems: 'flex-start'}}>
                            <Text numberOfLines={1} style={{fontFamily:'Baloo2-Bold', fontSize:18, color:'#fff'}}>
                                {item.trackName}
                            </Text>
                            <Text style={{fontFamily:'Baloo2-Medium', fontSize:14, color:Colors.grey5}}>
                                {item.artistName}
                            </Text>
                        </View>
                        <View style={{width: '25%', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontFamily:'Baloo2-Bold', fontSize:12, color:Colors.grey3}}>
                                {item.likes.length} Likes
                            </Text>
                            <SimpleLineIcons
                                name="options"
                                color={Colors.grey3}
                                size={20}
                                style={{alignItems: 'center', justifyContent: 'center', padding:10}}
                                onPress={() => openOptionsModal(item)}
                            />
                        </View>
                    </TouchableOpacity>
                    }
                />
            }
            {
                typeOfSearch === 'song' && !songSelector &&
                <View style={{
                    flex: 1,
                }}>
                    <ActivityIndicator color={Colors.red3} size={"large"}/>
                </View>
            }

            {
                typeOfSearch === 'artist' && search === '' && artists &&
                <FlatList
                    data={artists}
                    keyExtractor={item => item._id}
                    renderItem={({item, index}) =>
                        <TouchableOpacity onPress={() => openToArtistScreen(item)}style={{width: '100%', padding:10, borderBottomWidth:1, backgroundColor: Colors.grey1, flexDirection:'row', borderColor:Colors.grey3}}>
                            <View style={{width: '20%'}}>
                                <Image
                                    source={{uri: item.profileImage}}
                                    style={{width:65, height:65, borderRadius:3, resizeMode:'stretch'}}
                                />
                            </View>
                            <View style={{width: '50%', justifyContent: 'center'}}>
                                <Text style={{fontFamily:'Baloo2-Bold', fontSize:18, color:'#fff'}}>
                                    {item.artistName}
                                </Text>
                            </View>
                            <View style={{width: '30%', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{fontFamily:'Baloo2-Bold', fontSize:12, color:Colors.grey3}}>
                                    {item.subscribes?.length} Subscribers
                                </Text>
                            </View>
                        </TouchableOpacity>
                    }
                />
            }
            {
                typeOfSearch === 'artist' && search !== '' && artists &&
                <FlatList
                    data={searchResult}
                    keyExtractor={item => item._id}
                    renderItem={({item, index}) =>
                        <TouchableOpacity onPress={() => openToArtistScreen(item)}style={{width: '100%', padding:10, borderBottomWidth:1, backgroundColor: Colors.grey1, flexDirection:'row', borderColor:Colors.grey3}}>
                            <View style={{width: '20%'}}>
                                <Image
                                    source={{uri: item.profileImage}}
                                    style={{width:65, height:65, borderRadius:3, resizeMode:'stretch'}}
                                />
                            </View>
                            <View style={{width: '50%', justifyContent: 'center'}}>
                                <Text style={{fontFamily:'Baloo2-Bold', fontSize:18, color:'#fff'}}>
                                    {item.artistName}
                                </Text>
                            </View>
                            <View style={{width: '30%', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{fontFamily:'Baloo2-Bold', fontSize:12, color:Colors.grey3}}>
                                    {item.subscribes?.length} Subscribers
                                </Text>
                            </View>
                        </TouchableOpacity>
                    }
                />
            }
            {
                typeOfSearch === 'artist' && !artists &&
                <View style={{
                    flex: 1,
                }}>
                    <ActivityIndicator color={Colors.red3} size={"large"}/>
                </View>
            }
        </View>
    );
};




export default SearchToImportScreen;
