import React, { useEffect } from "react";
import {
    View, 
    TouchableOpacity,
    Text,
    ImageBackground,
    Platform,
    ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setMusicOnBackGroundAction } from './store/actions/appActions'
import {RootStack as AppNavigator} from './src/navigation';
import {NavigationContainer} from '@react-navigation/native';
import Colors from './src/Utitilities/AppColors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MusicScreenModal from "./MusicScreenModal";
import PlayerButton from './src/components/PlayerButton';
import { pause, resume, playNext } from './audioController';
import { 
    pauseSongAction,
    resumeSongAction,
    playNextSongAction,
    preperNextSongAction,
    setMusicOnForGroundAction,
} from './store/actions/appActions';
import { setIsUploadComplete } from './src/ApiCalls';
import { Image, Dimensions } from "react-native";

export const { height } = Dimensions.get('window');


// Bottom Song Bar controller
// It should appear when a user plays a song in the background
export const SongBar = props => {
    const dispatch = useDispatch();
    const appSelector = useSelector(state => state.AppReducer);
    const {
        playbackPosition,
        playbackDuration,
        SongOnBackGroundReducer,
        SongIndexReducer,
        soundObj,
        isLoading,
        playbackObj,
        MusicOnForGroundReducer,
        isPlaying,
        currentAudio,
        isWaitingForUpload,
        isUploadComplete
    } = appSelector;
    const songDetails = currentAudio;
    const artistName = songDetails?.artistName;
    const songLength = songDetails?.trackLength;
    const songName = songDetails?.trackName;
    const songUri = songDetails?.trackUri;
    const songImage = songDetails?.trackImage;
    

    const closeSongBar = () => {
        let action = setMusicOnBackGroundAction(false);
        try{
            dispatch(action);
        }catch(error) {
            console.log(error.message);
        }
    }

    const calculateSeeBar = () => {
        if(playbackPosition != null && playbackDuration != null) {
            return playbackPosition / playbackDuration * 100;
        }
        return 0;
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


    const openMusicScreen = () => {
        try{
            dispatch(setMusicOnForGroundAction(true));
        }catch(error){
            console.log(error.message);
        }
    }

    const locate = () => {
        switch(Platform.OS) {
            case 'ios':
                if(isUploadComplete || isWaitingForUpload) {
                    return height - height + 100;
                } else {
                    return height - height + 86
                }
            
            case 'android':
                if(isUploadComplete || isWaitingForUpload) {
                    return height - height + 100;
                } else {
                    return height - height + 54;
                }
            default: return;
        }
    }

    return(
        <>
            <TouchableOpacity onPress={openMusicScreen} style={{width:'100%', alignItems: 'center', position:'absolute', zIndex:1, bottom:locate()}}>
                <View style={{
                    width:'100%',
                    backgroundColor:'#fff',
                    borderTopLeftRadius:15,
                    borderTopRightRadius:15,
                    backgroundColor: Colors.grey4,
                    flexDirection:'row',
                    paddingVertical:10,
                }}>
                        <View style={{width:'15%', alignItems: 'center'}}>
                            <ImageBackground
                                source={{uri: songImage}}
                                style={{width:40, height:40, alignItems: 'center', justifyContent: 'center'}}
                                imageStyle={{opacity:1, borderRadius:50}}
                            >
                                
                            </ImageBackground>
                        </View>
                        <View style={{width:'30%'}}>
                            <Text numberOfLines={1} style={{fontFamily:'Baloo2-Bold', color:Colors.red3, width:'80%'}}>{songName}</Text>
                            <Text numberOfLines={1} style={{fontFamily:'Baloo2-Medium', color:Colors.grey3, width:'80%'}}>{artistName}</Text>
                        </View>
                        <View style={{
                            width:'30%',
                            flexDirection:'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height:'100%',
                        }}
                    >
                        <PlayerButton 
                            iconType={'PREV'}
                            onPress={handlePrev}
                            size={25}
                            style={{
                                width:40,
                                height:40,
                                margin:2,
                            }}
                        />
                        <PlayerButton 
                            onPress={handlePlayPause}
                            iconType={isPlaying ? 'PLAY' : 'PAUSE'}
                            size={25}
                            style={{
                                width:40,
                                height:40,
                                margin:2,
                            }}
                        />
                        <PlayerButton 
                            iconType={'NEXT'} 
                            onPress={handleNext}
                            size={25}
                            style={{
                                width:40,
                                height:40,
                                margin:2,
                            }}
                        />
                        
                    </View>
                        <View style={{
                            width:'25%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <TouchableOpacity style={{
                                    shadowColor: '#171717',
                                    shadowOffset: {width: 0, height: 10},
                                    shadowOpacity: 0.5,
                                    shadowRadius: 3,
                                    width:'50%',
                                    alignItems: 'center',
                                    left:20
                                }} 
                                onPress={closeSongBar}
                            >
                                <FontAwesome
                                    name='close'
                                    size={17}
                                    color={'#fff'}
                                />
                            </TouchableOpacity>
                           <Text style={{
                                fontFamily:'Baloo2-Medium',
                                color:Colors.grey3,
                                fontSize:12
                            }}>
                                {`${calculatePlaybackPostition(playbackPosition)} / ${songLength}`}
                            </Text>
                        </View>
                </View>
                <View style={{width:'100%', height:5, backgroundColor:Colors.grey3}}>
                    <View style={{
                        width: `${calculateSeeBar()}%`,
                        height:5,
                        backgroundColor:'#fff'
                    }}>

                    </View>
                </View>
            </TouchableOpacity>
            
      </>
    )
}

// Side Song Bottom bar
export const SideSongBar = props => {
    const dispatch = useDispatch();
    const appSelector = useSelector(state => state.AppReducer);
    const { currentAudio } = appSelector;
    const songDetails = currentAudio;
    const songImage = songDetails?.trackImage;

    const openSongBar = () => {
        let action = setMusicOnBackGroundAction(true);
        try{
            dispatch(action);
        }catch(error) {
            console.log(error.message);
        }
    }

    return (
        <TouchableOpacity 
            style={{
                width:60,
                height:60,
                backgroundColor:Colors.grey4, 
                bottom:95,
                alignSelf:'flex-end',
                right:10,
                position:'absolute',
                borderRadius:50,
                borderWidth:2,
                borderColor:Colors.grey3,
                alignItems: 'center',
                justifyContent: 'center'
            }} onPress={openSongBar}
        >
            <Image
                source={{uri: songImage}}
                style={{width:50, height:50, borderRadius:50}}
            />
        </TouchableOpacity>
    )
}

// This component used as indicator to upload some media
export const UploadBarStatus = ({}) => {
    const dispatch = useDispatch();
    const appSelector = useSelector(state => state.AppReducer);
    const { isWaitingForUpload, uploadType, isUploadComplete } = appSelector;

    const closeUploadBar = setTimeout(() =>{
        setIsUploadComplete(dispatch, null, null, null);
    },2000);

    useEffect(() => {
        if(isUploadComplete){
            closeUploadBar;
        }
    },[isUploadComplete])

    return(
        <View style={{
            width:'100%',
            borderWidth:2,
            padding:10,
            backgroundColor:Colors.red3
        }}>
            <View style={{flexDirection:'row', paddingHorizontal:10, marginBottom:2}}>
                <ActivityIndicator color='#fff'/>
                <View style={{left:20}}>
                    <Text>
                        {isWaitingForUpload && !isUploadComplete && `Your ${uploadType} is uploading....`}
                        {isUploadComplete && 'Upload Completed'}
                    </Text>
                </View>
            </View>
        </View>
    )
}

const AppBackGround = props => {
    const appSelector = useSelector(state => state.AppReducer);
    const backgrounMusicBarVisible = appSelector.MusicOnBackGroundReducer;
    const {
        MusicOnForGroundReducer,
        soundObj,
        isWaitingForUpload,
        isUploadComplete
    } = appSelector;
    
    
    return(
        <NavigationContainer>
            <AppNavigator/>
            {backgrounMusicBarVisible && <SongBar/>}
            {MusicOnForGroundReducer && <MusicScreenModal/>}
            {!backgrounMusicBarVisible && soundObj && <SideSongBar/>}
            {(isWaitingForUpload === true || isUploadComplete === true) && <UploadBarStatus/>}
        </NavigationContainer>
    )
}


export default AppBackGround;
