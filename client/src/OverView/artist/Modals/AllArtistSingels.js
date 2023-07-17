//import liraries
import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import Colors from '../../../Utitilities/AppColors';
import { useDispatch, useSelector } from 'react-redux';
import MusicGeneralHeader from '../components/MusicGeneralHeder';
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
import AudioListItemRow from '../components/AudioListItemRow';

const {width} = Dimensions.get('window');



const AllArtistSingels = props => {
    const dispatch = useDispatch();
    const ScreenTitle = props.route.params.screenName;
    const artistSongsSelector = useSelector(state => state.SongReducer);
    const allArtistSongs = props.route.params.songsList;
    const appBackGroundSelector = useSelector(state => state.AppReducer);
    const [musicScreenVisible, setMusicScreenVisible] = useState(false);
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
                        list: allArtistSongs
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
    

    const handleAudioPress = async (audio, index) => {  
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
                    list: allArtistSongs,
                    musicOnBackGround: true,
                    isLoading: false,
                    MusicOnForGroundReducer: true
                }))
            } catch {
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
                    MusicOnForGroundReducer: true,
                    list: allArtistSongs
                }))
            } catch {
                console.log(error.message);
            }
             
        }
    }


    

    return (
        <View
            style={{flex:1}}
        >
            <MusicGeneralHeader goBack={() => props.navigation.goBack(null)} title={ScreenTitle}/>
            <View
                style={{
                    flex: 1,
                    backgroundColor: Colors.grey1,                    
                }}
            >

                
                {
                    allArtistSongs.map((item, index) => 
                    <View key={index}>
                        {
                            isLoading?
                            (
                                <View
                                    style={{
                                        width: width,
                                        backgroundColor:Colors.grey4,
                                        padding:10,
                                        borderBottomWidth:0.8,
                                        flexDirection:'row',
                                        opacity: item._id === currentAudio._id ? 1 : 0.6
                                    }}
                                >
                                    <AudioListItemRow
                                        isPlaying={isPlaying}
                                        isLoading={isLoading}
                                        item={item}
                                        currentAudio={currentAudio}
                                        index={index}
                                        SongIndex={SongIndexReducer}
                                    />
                                </View>
                            )
                            :
                            (
                                <TouchableOpacity
                                    style={{
                                        width: width,
                                        backgroundColor:Colors.grey4,
                                        padding:10,
                                        borderBottomWidth:0.8,
                                        flexDirection:'row',
                                    }}
            
                                    onPress={() => handleAudioPress(item, index)}
                                >
                                    <AudioListItemRow
                                        isPlaying={isPlaying}
                                        isLoading={isLoading}
                                        item={item}
                                        currentAudio={currentAudio}
                                        index={index}
                                        SongIndex={SongIndexReducer}
                                    />
                                </TouchableOpacity>
                            )
                        }
                        
                    </View>
                    )
                }
                
            </View>
        </View>
    );
};





export default AllArtistSingels;







