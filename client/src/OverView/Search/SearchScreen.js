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
    FlatList, ScrollView,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Colors from '../../Utitilities/AppColors';
import { Audio } from 'expo-av';
import { play, pause, resume, playNext } from '../../../audioController';
import { 
    playInTheFirstTimeAction,
    pauseSongAction,
    resumeSongAction,
    playNextSongAction,
    preperNextSongAction,
    setPostAuthorProfileAction,
    handleSeeBarAction
} from '../../../store/actions/appActions';


export const Artist = ({item}) => {
    const {name, type, subscribes, profileImage} = item;
    

    return(
        <View style={{width: '100%', padding:10, borderBottomWidth:1, backgroundColor: Colors.grey1, flexDirection:'row', borderColor:Colors.grey3}}>
            <View style={{width: '20%'}}>
                <Image
                    source={{uri: profileImage}}
                    style={{width:65, height:65, borderRadius:3, resizeMode:'stretch'}}
                />
            </View>
            <View style={{width: '50%', justifyContent: 'center'}}>
                <Text style={{fontFamily:'Baloo2-Bold', fontSize:18, color:'#fff'}}>
                    {name}
                </Text>
                <Text style={{fontFamily:'Baloo2-Bold', fontSize:14, color:Colors.grey3}}>
                    {type}
                </Text>
            </View>
            <View style={{width: '30%', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontFamily:'Baloo2-Bold', fontSize:12, color:Colors.grey3}}>
                    {subscribes?.length} Subscribers
                </Text>
            </View>
        </View>
    )
}

export const Song = ({item}) => {
    const {_id, name, type, artistName, trackImage, likes} = item;
    const dispatch = useDispatch();
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

    return(
        <TouchableOpacity 
            onPress={() => handleAudioPress(item, 0, [item])}
            style={{
                width: '100%',
                padding:10,
                borderBottomWidth:1,
                backgroundColor: Colors.grey1,
                flexDirection:'row',
                borderColor:Colors.grey3
            }}>
            <View style={{width: '20%'}}>
            <ImageBackground
                style={{width: 65, height: 65, alignItems: 'center', justifyContent: 'center'}}
                imageStyle={{resizeMode:'stretch', borderRadius:3}}
                source={{uri: trackImage}}
            >

            {
                    _id === currentAudio._id &&
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
            <View style={{width: '50%', justifyContent: 'center', alignItems: 'flex-start'}}>
                <Text numberOfLines={1} style={{fontFamily:'Baloo2-Bold', fontSize:18, color:'#fff'}}>
                    {name}
                </Text>
                <Text style={{fontFamily:'Baloo2-Bold', fontSize:14, color:Colors.grey3}}>
                    {type}
                </Text>
                <Text style={{fontFamily:'Baloo2-Medium', fontSize:14, color:Colors.grey5}}>
                    {artistName}
                </Text>
            </View>
            <View style={{width: '30%', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontFamily:'Baloo2-Bold', fontSize:12, color:Colors.grey3}}>
                    {likes.length} Likes
                </Text>
            </View>
        </TouchableOpacity>
    )
}



export const Album = ({item}) => {
    const {name, type, albumCover, tracks} = item;
    return(
        <View style={{width: '100%', padding:10, borderBottomWidth:1, backgroundColor: Colors.grey1, flexDirection:'row', borderColor:Colors.grey3}}>
            <View style={{width: '20%'}}>
                <Image
                    source={{uri: albumCover}}
                    style={{width:65, height:65, borderRadius:3, resizeMode:'stretch'}}
                />
            </View>
            <View style={{width: '50%', justifyContent: 'center', alignItems: 'flex-start'}}>
                <Text style={{fontFamily:'Baloo2-Bold', fontSize:18, color:'#fff'}}>
                    {name}
                </Text>
                <Text style={{fontFamily:'Baloo2-Bold', fontSize:14, color:Colors.grey3}}>
                    {type}
                </Text>                
            </View>
            <View style={{width: '30%', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontFamily:'Baloo2-Bold', fontSize:12, color:Colors.grey3}}>
                    {tracks.length} Tracks
                </Text>
            </View>
        </View>
    )
}


const SearchScreen = props => {
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const SearchSelector = useSelector(state => state.UserReducer.AllSearchResults);



    const SerchByKeyWord = (text) => {
        setSearch(text);
        let results = SearchSelector.filter(x => x?.name?.includes(search) === true || 
        x?.name?.toLowerCase().includes(search.toLowerCase()));
        setSearchResult(results);
    }

    const dispatch = useDispatch();
    const openToArtistScreen = (artist) => {
        try {
            dispatch(setPostAuthorProfileAction(artist))
            props.navigation.navigate("ArtistFeed");
        }catch(error) {
            console.log(error.message);
        }        
    }
    
    return(
        <ImageBackground 
                source={ require('../../../assets/AppAssets/Logo.png') }
                resizeMode="cover" 
                style={{
                    flex:1,
                    backgroundColor: Colors.grey1
                }}
                imageStyle={{opacity: 0.3}}
        >
            <View style={{
                width: '100%',
                height: Platform.OS === 'ios'? 110 : 90,
                backgroundColor: Colors.grey4,
                flexDirection:'row', 
                justifyContent: 'center',
                alignItems:'flex-end'
            }}>
                <TextInput
                    style={{
                        width:'90%',
                        backgroundColor:Colors.grey3 ,
                        paddingHorizontal:10,
                        borderRadius:5,
                        bottom:15,
                        paddingVertical:Platform.OS === 'ios'? 5 : 0,
                        fontFamily: 'Baloo2-Bold',
                        color: Colors.red3
                    }}
                    placeholder="What content would you like to listen to?"
                    placeholderTextColor={Colors.grey7}
                    value={search}
                    onChangeText={text => SerchByKeyWord(text)}
                    cursorColor={Colors.red3}
                    clearButtonMode="always"
                    returnKeyType='done'
                />
            </View>
            {
                search.length > 0 ?
                (
                    <ScrollView style={{flex:1, width:'100%'}}>
                        {searchResult?.map((item, index) => 
                            <View key={index}>
                                {item.type === 'artist' && 
                                    <TouchableOpacity onPress={() => openToArtistScreen(item)}>
                                        <Artist item={item}/>
                                    </TouchableOpacity>
                                }
                                {item.type === 'song' && <Song item={item}/>}
                                {item.type === 'album' && 
                                    <TouchableOpacity 
                                        onPress={() => props.navigation.navigate("PlaylistScreen",
                                        {songsList: item.tracks, screenName: item.name})}
                                    >
                                        <Album item={item}/>
                                    </TouchableOpacity>
                                }
                            </View>
                        )}
                    </ScrollView>
                )
                :
                (
                    <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{
                            fontFamily:'Baloo2-Bold',
                            fontSize:30,
                            color:'#fff'
                        }}>
                            This is the place to search...
                        </Text>
                        <FontAwesome
                            name="search"
                            size={150}
                            color={Colors.red3}
                        />
                    </View>
                )
            }
            
            
        </ImageBackground>
    )
}



export const screenOptions = navData => {
    return {
        headerShown: false,
        tabBarLabel:'Search',
        tabBarLabelStyle: {
            fontFamily: 'Baloo2-Medium',
            fontSize:25
        },
        tabBarIcon:({focused,color,size}) => {
            const iconColor = focused? Colors.red3 : '#ffffff'
            const iconSzie = focused? 24 : 22
            return(
            <Fontisto name={'search'} color={iconColor} size={iconSzie} />
            )

        } 
    }
}

export default SearchScreen;