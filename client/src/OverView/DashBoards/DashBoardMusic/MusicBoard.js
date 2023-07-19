import React, { useState, useEffect } from 'react';
import { 
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    ActivityIndicator,
    Image,
    ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../../Utitilities/AppColors';
import { Audio } from 'expo-av';
import { play, pause, resume, playNext } from '../../../../audioController';
import { 
    playInTheFirstTimeAction,
    pauseSongAction,
    resumeSongAction,
    playNextSongAction,
    preperNextSongAction,
    setPostAuthorProfileAction,
    handleSeeBarAction
} from '../../../../store/actions/appActions';
import { Avatar } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getArtistsByUserFavoriteGeners, getSongsByUserFavoriteGeners } from '../../../ApiCalls';


const MusicBoardScreen = props => {
    const dispatch = useDispatch();
    const userDataSelector = useSelector(state => state.UserReducer);
    const songsSelector = useSelector(state => state.SongReducer);
    const artistSelector = useSelector(state => state.ArtistsReducer);
    const appBackGroundSelector = useSelector(state => state.AppReducer);
    const userPlaylists = userDataSelector?.UserPlaylists?.Playlists;
    const songsByUserFavoriteGeners = songsSelector?.SongsByUserFavoriteGeners?.List; 
    const artistsByUserFavoriteGeners = artistSelector?.ArtistsByUserFavoritGeners;
    const [topList, setTopList] = useState([]);
    const {
        SongIndexReducer,
        SongOnBackGroundReducer,
        currentAudio,
        isPlaying,
        playbackObj,
        soundObj,
        isLoading,
        MusicOnForGroundReducer
    } = appBackGroundSelector;
    
    

    useEffect(() => {
        function makeTopList(){
            let playlist = userPlaylists?.sort(() => (() => 0.5 - Math.random()));
            let songsByGeners = songsByUserFavoriteGeners?.map(x => x = x.songs);
            songsByGeners = [].concat.apply([],songsByGeners).sort(() => 0.5 - Math.random());
            let list = [];
            for(let i = 0; list.length < 3 && i < playlist?.length; i ++) {
                list.push({
                    type:'playlist',
                    _id: playlist[i]?._id,
                    playlistName: playlist[i]?.playlistName,
                    playlistImage: playlist[i]?.playlistImage,
                    tracks: playlist[i]?.songs,
                })
            }
            for(let i = 0; list.length < 6 && i < songsByGeners?.length; i++) {
                if(songsByGeners[i] !== undefined) {
                    list.push({
                        type: 'song',
                        _id:songsByGeners[i]?._id,
                        artistName:songsByGeners[i]?.artistName,
                        trackImage: songsByGeners[i]?.trackImage,
                        trackLength: songsByGeners[i]?.trackLength,
                        trackName: songsByGeners[i]?.trackName,
                        trackUri: songsByGeners[i]?.trackUri 

                    })
                }
            }
            list = list.sort((a, b) => 0.5 - Math.random()).slice(0,6);
            setTopList(list);
        }
        if((userPlaylists?.length > 0 || songsByUserFavoriteGeners?.length > 0) && topList.length === 0 ){
            makeTopList();
        }

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
        userPlaylists,
        songsByUserFavoriteGeners,
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


    const openToArtistScreen = (artist) => {
        try {
            dispatch(setPostAuthorProfileAction(artist))
            props.navigation.navigate("ArtistFeed");
        }catch(error) {
            console.log(error.message);
        }        
    }

   const getCountOfSongsOrArtist = (userLists, type) => {
        switch(type){
            case 'songs':
                userLists = userLists.map(x => x = x.songs);
                userLists = [].concat.apply([],userLists);
                return userLists.length;
            case 'artists':
                userLists = userLists.map(x => x = x.artists);
                userLists = [].concat.apply([],userLists);
                return userLists.length;
            default: return 0;
        }
    }
    
    const refresh = async() => {
        const jsonToken = await AsyncStorage.getItem('Token');          
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
        if(userToken) {
            getArtistsByUserFavoriteGeners(dispatch, userToken);
            getSongsByUserFavoriteGeners(dispatch, userToken);
        }
    }
    return(
        <View 
            style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:Colors.grey4}}
        >
            <ScrollView style={{flex:1, width: '100%',}} onResponderEnd={refresh}>
                <View 
                style={{flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginVertical: 20 }}>
                    <View style={{width:'47%'}}>
                        {
                            topList?.length > 0
                            && topList?.slice(0, topList.length/2)
                            .map((item, index) => 
                                <View key={index}>
                                    {
                                        item.type === 'playlist' &&
                                        <TouchableOpacity 
                                            onPress={() => props.navigation.navigate("PlaylistScreen", 
                                            {songsList: item.tracks, screenName: item.playlistName})} 
                                            key={index} 
                                            style={{
                                                borderRadius:5,
                                                margin:2,
                                                backgroundColor:Colors.grey3,
                                                flexDirection:'row',
                                                alignItems: 'center',
                                                widht:'45%'
                                            }}
                                        >
                                            <View style={{width:'29%'}}>
                                                <Image
                                                    source={{uri: item?.playlistImage}}
                                                    style={{width: 50, height: 50, borderTopLeftRadius:5, borderBottomLeftRadius:5}}
                                                />
                                            </View>
                                            <View style={{width:'60%', alignItems:'flex-start', marginLeft:5}}>
                                                <Text style={{fontFamily:'Baloo2-Medium', color:'#fff', fontSize:15}} numberOfLines={1}>
                                                    {item.playlistName}
                                                </Text>
                                                <Text style={{fontFamily:'Baloo2-Medium', color:Colors.grey2, fontSize:12}}>{item?.tracks?.length} tracks</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                    {
                                        item.type === 'song' &&
                                        <TouchableOpacity 
                                            onPress={() => handleAudioPress(item, index, [item])} 
                                            key={index} 
                                            style={{
                                                borderRadius:5,
                                                margin:2,
                                                backgroundColor:Colors.grey3,
                                                flexDirection:'row',
                                                alignItems: 'center',
                                                widht:'45%'
                                            }}>
                                            <View style={{width:'29%'}}>
                                            <ImageBackground
                                                style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}}
                                                imageStyle={{borderTopLeftRadius:5, borderBottomLeftRadius:5, resizeMode:"cover"}}
                                                source={{uri: item?.trackImage}}
                                            >

                                            {
                                                    item._id === currentAudio?._id &&
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
                                            <View style={{width:'60%', alignItems: 'flex-start', marginLeft:5}}>
                                                <Text style={{fontFamily:'Baloo2-Medium', color:'#fff', fontSize:15}} numberOfLines={1}>
                                                    {item.trackName}
                                                </Text>
                                                <Text style={{fontFamily:'Baloo2-Medium', color:Colors.grey2, fontSize:12}}>{item?.artistName}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                </View>
                            )
                        }
                    </View>
                    <View style={{width:'47%'}}>
                        {
                            topList?.length > 0
                            && topList?.slice(topList?.length/2, topList?.length)
                            .map((item, index) => 
                                <View key={index}>
                                    {
                                        item.type === 'playlist' &&
                                        <TouchableOpacity 
                                            onPress={() => props.navigation.navigate("PlaylistScreen", 
                                            {songsList: item.tracks, screenName: item.playlistName})}
                                            key={index} 
                                            style={{
                                                borderRadius:5,
                                                margin:2,
                                                backgroundColor:Colors.grey3,
                                                flexDirection:'row',
                                                alignItems: 'center',
                                                widht:'45%'
                                            }}
                                        >
                                            <View style={{width:'29%'}}>
                                                <Image
                                                    source={{uri: item?.playlistImage}}
                                                    style={{width: 50, height: 50, borderTopLeftRadius:5, borderBottomLeftRadius:5}}
                                                />
                                            </View>
                                            <View style={{width:'60%', alignItems: 'flex-start', marginLeft:5}}>
                                                <Text style={{fontFamily:'Baloo2-Medium', color:'#fff', fontSize:15}} numberOfLines={1}>
                                                    {item.playlistName}
                                                </Text>
                                                <Text style={{fontFamily:'Baloo2-Medium', color:Colors.grey2, fontSize:12}}>
                                                    {item?.tracks?.length} 
                                                    tracks
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                    {
                                        item.type === 'song' &&
                                        <TouchableOpacity onPress={() => handleAudioPress(item, index, [item])} 
                                            key={index} 
                                            style={{
                                                borderRadius:5,
                                                margin:2,
                                                backgroundColor:Colors.grey3,
                                                flexDirection:'row',
                                                alignItems: 'center',
                                                widht:'45%'
                                            }}>
                                            <View style={{width:'29%'}}>
                                            <ImageBackground
                                                style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}}
                                                imageStyle={{borderTopLeftRadius:5, borderBottomLeftRadius:5, resizeMode:"cover"}}
                                                source={{uri: item?.trackImage}}
                                            >

                                            {
                                                    item._id === currentAudio?._id &&
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
                                            <View style={{width:'60%', alignItems: 'flex-start', marginLeft:5}}>
                                                <Text 
                                                    style={{
                                                        fontFamily:'Baloo2-Medium',
                                                        color:'#fff',
                                                        fontSize:15
                                                    }}
                                                    numberOfLines={1}
                                                >
                                                    {item.trackName}
                                                </Text>
                                                <Text 
                                                    style={{fontFamily:'Baloo2-Medium', color:Colors.grey2, fontSize:12}} 
                                                    numberOfLines={1}
                                                >
                                                    {item?.artistName}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                </View>
                            )
                        }
                    </View>
                    
                </View>
                <View style={{ marginTop: 25 }}/>
                {
                    songsByUserFavoriteGeners && 
                    getCountOfSongsOrArtist(songsByUserFavoriteGeners, 'songs') > 0 && (
                    <>
                        <View style={{ left:10 }}>
                            <Text 
                                style={{
                                    fontFamily:'Baloo2-Bold',
                                    color:'#fff',
                                    fontSize:20
                                }}>
                                Songs from your favorite genres
                            </Text>
                        </View>
                        <View>
                            <ScrollView>
                                {
                                    songsByUserFavoriteGeners?.
                                    map((item, index) =>
                                        item?.songs?.length > 0 &&
                                        <View key={index}>
                                            <Text 
                                                style={{
                                                    fontFamily:'Baloo2-Bold',
                                                    color:Colors.red3,
                                                    left:10,
                                                    marginTop:10,
                                                    fontSize:18
                                                }}>
                                                {item?.gener?.generName}
                                            </Text>
                                            <ScrollView horizontal>
                                                {
                                                    item?.songs?.
                                                    sort((a, b) => (new Date(b.creatAdt) - new Date(a.creatAdt)))
                                                    .map((item, index, list) =>
                                                        
                                                        <TouchableOpacity 
                                                            onPress={() => handleAudioPress(item, index, list)} 
                                                            key={index} style={{
                                                            margin: 10,
                                                            width:140,
                                                            alignItems: 'center'
                                                        }}>
                                                            <ImageBackground
                                                                style={{
                                                                    width:140,
                                                                    height:140, 
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}
                                                                imageStyle={{resizeMode:"cover", borderRadius:10}}
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
                                                            <Text 
                                                                numberOfLines={1}
                                                                style={{
                                                                    marginTop:5,
                                                                    fontFamily:'Baloo2-Bold',
                                                                    color:'#fff'
                                                                }}
                                                            >
                                                                {item?.trackName}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )
                                                }
                                            </ScrollView>
                                        </View>
                                    )
                                }
                            </ScrollView>
                        </View>
                    </>)
                }
                <View style={{ marginTop: 25 }}/>
                {
                    artistsByUserFavoriteGeners 
                    &&
                    getCountOfSongsOrArtist(artistsByUserFavoriteGeners, 'artists') > 0 &&
                    <>
                        <View style={{ left:10, marginTop:20 }}>
                        <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', fontSize:20}}>
                                Artists from your favorite genres
                            </Text>
                        </View>
                        <View>
                            <ScrollView>
                                {
                                    artistsByUserFavoriteGeners?.map((item, index) =>
                                        item?.artists?.length > 0 &&
                                        <View key={index}>
                                            <Text 
                                                style={{
                                                    fontFamily:'Baloo2-Bold',
                                                    color:Colors.red3,
                                                    left:10,
                                                    marginTop:10,
                                                    fontSize:18
                                                }}
                                            >
                                                {item?.gener?.generName}
                                            </Text>
                                            <ScrollView 
                                                horizontal 
                                                style={{
                                                    backgroundColor: Colors.grey4,
                                                    paddingTop:10
                                                }}
                                            >
                                                {
                                                    item?.artists?.map((item, index) =>
                                                        <TouchableOpacity onPress={() => openToArtistScreen(item)} key={index} style={{
                                                            margin: 10,
                                                            width:140,
                                                            alignItems: 'center'
                                                        }}>
                                                            <Image
                                                                source={{uri: item?.profileImage}}
                                                                style={{width:140, height:140, resizeMode:'stretch', borderRadius:10}}
                                                            />
                                                            <Text 
                                                                numberOfLines={1}
                                                                style={{
                                                                    marginTop:5,
                                                                    fontFamily:'Baloo2-Bold',
                                                                    color:'#fff'
                                                                }}
                                                            >
                                                                {item?.artistName}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )
                                                }
                                            </ScrollView>
                                        </View>
                                    )
                                }
                            </ScrollView>
                        </View>
                    </>
                }
            </ScrollView>
            
        </View>
    )
}




export const screenOptions = ({navigation}) => {
    
    const moveToFeed = () => {
        navigation.navigate('Feed');
    }

    const moveToUserChats = () => {
        navigation.navigate("UserChatScreen");
    }

    return {        
        title:'Music Board',
        headerStyle:{backgroundColor:Colors.grey1, height:110, borderBottomWidth:2},
        headerTitleStyle:{
            color:"#FFFFFF",
            fontFamily:"Baloo2-ExtraBold",
            fontSize:25
        },
        header: () => {
            return <View style={{
                backgroundColor:Colors.grey1,
                height:Platform.OS === 'ios' ? 100 : 80,
                borderBottomWidth:2,
                borderBottomColor:Colors.grey3,
                flexDirection:'row',
            }}>
                <View style={{
                    alignItems: "center",
                    width: '35%',
                    paddingLeft:10,
                    paddingTop: Platform.OS === 'ios' ? 30 : 10,
                    flexDirection: 'row',
                }}>
                    <Avatar
                        rounded
                        source={ require('../../../../assets/Logo.png') }
                        size={35}
                    />
                    <Text style={{
                        fontFamily: 'Baloo2-ExtraBold',
                        fontSize:20,
                        color: Colors.red3,
                        top:2.5
                    }}>Music Box</Text>
                </View>
                <View style={{
                    width:"30%",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    paddingBottom:5
                }}>
                    <Text style={{
                        fontFamily: 'Baloo2-Bold',
                        color: "#fff",
                        fontSize:16
                    }}>Music Board</Text>
                </View>
                <View style={{
                    width:"35%",
                    flexDirection: 'row',
                    alignItems: "center",
                    justifyContent:"flex-end",
                    paddingRight:10,
                    paddingTop: Platform.OS === 'ios' ? 30 : 10,
                }}>
                    <Ionicons 
                        name="chatbox-ellipses"
                        size={24}
                        color={Colors.grey3}
                        onPress={moveToUserChats}
                        style={{margin:5}}
                    />
                    <MaterialCommunityIcons
                        name="newspaper-variant-multiple"
                        size={24}
                        style={{margin:5}}
                        color={Colors.red3}
                        onPress={moveToFeed}
                    />
                </View>
            </View>
        }
    }
}


export default MusicBoardScreen;
    