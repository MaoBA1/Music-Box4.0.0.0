import React, { useState, useRef, useEffect } from 'react';
import {
    Text,
    View,
    Modal,
    Image,
    ImageBackground,
    FlatList, TouchableOpacity,
    Dimensions, Animated, ActivityIndicator
} from 'react-native';
import Colors from './src/Utitilities/AppColors';
import { useDispatch, useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PlayerButton from './src/components/PlayerButton';
import Slider from '@react-native-community/slider';
import { 
    playInTheFirstTimeAction,
    pauseSongAction,
    resumeSongAction,
    playNextSongAction,
    preperNextSongAction,
    handleSeeBarAction,
    setMusicOnForGroundAction
} from './store/actions/appActions';
import { getAllUserFavoriteSongsAction, likeUserSongAction, unlikeUserSongAction } from './store/actions/userActions';
import { play, pause, resume, playNext } from './audioController';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAllUserPlaylist} from './src/ApiCalls';

const { width, height } = Dimensions.get('window');


const MusicScreenModal = props => {
    const dispatch = useDispatch();    
    const appSelector = useSelector(state => state.AppReducer);
    const userSelector = useSelector(state => state.UserReducer);
    const userFavoriteSongs = userSelector?.UserFavoritesSongs?.Playlist;
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
    } = appSelector;
    const songDetails = currentAudio;
    const artistName = songDetails?.artistName;
    const songLength = songDetails?.trackLength;
    const songName = songDetails?.trackName;
    const songUri = songDetails?.trackUri;
    const songImage = songDetails?.trackImage;
    const [currentPosition, setCurrentPosition] = useState(0);
    let [isUserLikeThisSong, setIsUserLikeThisSong] = useState(false);
    const [token, setToken] = useState(null);

    async function getToken(){
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
        if(userToken) {
            setToken(userToken);
        }
    }

   async function getUserFavoritesSongs() {
        let action = getAllUserFavoriteSongsAction(token);
        try{
            await dispatch(action);
        }catch(error){
            console.log(error.message);
        }
    }

    const amILikeThisSong = () => {
        if(userFavoriteSongs && userFavoriteSongs?.songs?.length > 0) {
            const likedSong = userFavoriteSongs?.songs?.find(x => x._id.toString() === currentAudio?._id?.toString())
            setIsUserLikeThisSong(likedSong != null);
        }
    }

    const like = async() => {
        let action = likeUserSongAction(token, currentAudio?._id);
        try{
            await dispatch(action)
            .then(() => {
                getUserFavoritesSongs();
                getAllUserPlaylist(dispatch, token);
                setIsUserLikeThisSong(true);
            })
            
        }catch(error) {
            console.log(error.message);
        }
    }

    const unlike = async() => {
        let action = unlikeUserSongAction(token, currentAudio?._id);
        try{
            await dispatch(action)
            .then(() => {
                getUserFavoritesSongs();
                getAllUserPlaylist(dispatch, token);
                setIsUserLikeThisSong(false);
            })
            
        }catch(error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        if(!token) {
            getToken();
        }
        getUserFavoritesSongs();
        if(userFavoriteSongs) {
            amILikeThisSong();
        }
        
    },[userFavoriteSongs, token])

    
    
     
     const calculateSeeBar = () => {
        if(playbackPosition != null && playbackDuration != null) {
            return playbackPosition / playbackDuration;
        }
        return 0;
    }
    
    const closeMusicScreen = () => {
        try{
            dispatch(setMusicOnForGroundAction(false));
        }catch(error) {
            console.log(error.message);
        }
    }


    const handlePlayPause = async() => {
        if(isLoading) return;
       if(soundObj.isPlaying) {            
            try {
                const status = await pause(playbackObj)
                return dispatch(pauseSongAction({
                    status: status,
                    isPlaying: false                
                }))
            }catch(error) {
            console.log(error.message);
            }  
        }

        if(!soundObj.isPlaying) {
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
    }


    const handleNext = async() => {
        if(isLoading) {
            return;
        }
        
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

    const handlePrev = async() => {
        if(isLoading) {
            return;
        }
        try{
            const nextAudioIndex = SongIndexReducer > 0 ? SongIndexReducer - 1 : SongOnBackGroundReducer?.length - 1;
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

    const calculatePlaybackPostition = (position) => {
        var milliseconds = parseInt((position % 1000) / 100),
            seconds = Math.floor((position / 1000) % 60),
            minutes = Math.floor((position / (1000 * 60)) % 60),
            hours = Math.floor((position / (1000 * 60 * 60)) % 24);

            hours = (hours == 0) ? null : hours;
            if(hours != null) {
                hours = (hours < 10) ? "0" + hours : hours;
            }            
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;
            if(hours != null) {
                return hours + ":" + minutes + ":" + seconds;
            }
            return minutes + ":" + seconds;
    }
    

    return(
        <Modal
            visible={true}
            transparent={true}
            animationType='slide'
        >
            <View style={{flex:1, width: '100%', height: '100%', backgroundColor:Colors.grey4}}>
                <View style={{top:10, width:'100%', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity style={{
                            shadowColor: '#171717',
                            shadowOffset: {width: 0, height: 10},
                            shadowOpacity: 0.5,
                            shadowRadius: 3,
                            width:'10%',
                            alignItems: 'center', top:35
                        }} 
                        onPress={closeMusicScreen}
                    >
                        <FontAwesome
                            name='close'
                            size={25}
                            color={'#fff'}
                        />
                    </TouchableOpacity>

                    {
                        isUserLikeThisSong?
                        (
                            <AntDesign
                                style={{
                                    shadowColor: '#171717',
                                    shadowOffset: {width: 0, height: 10},
                                    shadowOpacity: 0.5,
                                    shadowRadius: 3,
                                    width:'10%',
                                    alignItems: 'center', top:35
                                }} 
                                name="heart"
                                color={Colors.red3}
                                size={30}
                                onPress={unlike}
                            />
                        )
                        :
                        (
                            <AntDesign
                                style={{
                                    shadowColor: '#171717',
                                    shadowOffset: {width: 0, height: 10},
                                    shadowOpacity: 0.5,
                                    shadowRadius: 3,
                                    width:'10%',
                                    alignItems: 'center', top:35
                                }} 
                                name="hearto"
                                color={Colors.red3}
                                size={30}
                                onPress={!isLoading && like}
                            />
                        )
                    }
                    
                </View>
                <View style={{width: '100%', marginTop:90}}>
                    <View 
                        style={{
                            width:width,
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            shadowColor:'#000', shadowOffset:{width:0, height:3}, shadowOpacity:0.5, shadowRadius :5
                        }}
                    >
                        <ImageBackground
                            source={{uri:songImage}}
                            style={{width:250, height: 300, alignItems: 'center', justifyContent: 'center'}}
                            imageStyle={{opacity: isPlaying? 1 : 0.5, borderRadius:20, resizeMode:"stretch"}}
                        >
                            {isLoading && <ActivityIndicator size="large" color={Colors.red3}/>}
                        </ImageBackground>
                    </View>
                </View>
                <View style={{width:'100%', alignItems: 'center', marginTop:50}}>
                    <Text style={{fontFamily:'Baloo2-Bold', color: '#fff', fontSize:18}}>{songName}</Text>
                    <Text style={{fontFamily:'Baloo2-Medium', fontSize:15, color:Colors.grey3}}>{artistName}</Text>
                </View>

                <View style={{width: width, marginTop:30, alignItems: 'center'}}>
                    <Slider
                        style={{width: width - 30, height: 50}}
                        minimumValue={0}
                        maximumValue={1}
                        value={calculateSeeBar()}
                        minimumTrackTintColor={Colors.red3}
                        maximumTrackTintColor={Colors.red3}
                        thumbTintColor={Colors.red3}
                        onValueChange={
                            value => {
                                setCurrentPosition(calculatePlaybackPostition(value * playbackDuration));
                            }
                        }
                        onSlidingStart={
                            async () => {
                                if(!isPlaying) return;

                                try{
                                    const status = await pause(playbackObj);
                                    return dispatch(pauseSongAction({
                                        status: status,
                                        isPlaying: false                
                                    }))
                                }catch(error) {
                                    console.log(error.message);
                                }
                            }
                        }
                        onSlidingComplete={
                            async value => {
                                if(soundObj === null) return;

                                try{
                                    const status = await playbackObj.setPositionAsync(Math.floor(value * playbackDuration));
                                    setCurrentPosition(0);
                                    await resume(playbackObj);            
                                        return dispatch(resumeSongAction({
                                            status: status,
                                            isPlaying: true  
                                    }));
                                }catch(error) {
                                    console.log(error.message);
                                }
                                
                            }
                        }
                        
                    />
                    <View style={{width: width-40, flexDirection:'row', justifyContent:'space-between', bottom:10}}>
                        <Text style={{
                            fontFamily:'Baloo2-Medium',
                            color:'#fff'
                        }}>
                            {currentPosition ? currentPosition : calculatePlaybackPostition(playbackPosition)}
                        </Text>
                        <Text style={{
                            fontFamily:'Baloo2-Medium',
                            color:'#fff'
                        }}>
                            {songLength}
                        </Text>
                    </View>
                    <View style={{
                            width,
                            flexDirection:'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 20
                        }}
                    >
                        <PlayerButton 
                            iconType={'PREV'}
                            onPress={handlePrev}
                            size={50}
                        />
                        <PlayerButton 
                            onPress={handlePlayPause}
                            style={{marginHorizontal:25}}
                            iconType={isPlaying ? 'PLAY' : 'PAUSE'}
                            size={50}
                        />
                        <PlayerButton 
                            iconType={'NEXT'} 
                            onPress={handleNext}
                            size={50}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default MusicScreenModal;



