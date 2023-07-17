import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import MusicGeneralHeader from '../../../OverView/artist/components/MusicGeneralHeder';
import Colors from '../../../Utitilities/AppColors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector} from 'react-redux';
import { Audio } from 'expo-av';
import { play, pause, resume, playNext } from '../../../../audioController';
import { 
    playInTheFirstTimeAction,
    pauseSongAction,
    resumeSongAction,
    playNextSongAction,
    preperNextSongAction,
    handleSeeBarAction
} from '../../../../store/actions/appActions';

import AddSongToPlayList from './components/AddSongToPlayList';
import OptionsModal from './components/OptionsModal';

export const AudioListItemRow = ({
    item,
    index,
    list,
    setOptionIsVisible,
    setOptionModalTrack,
    setListForOptionsModal,
    setIndexForOptionsModal
}) => {
    const {
        trackName,
        trackImage,
        trackUri,
        artistName,
        likes
    } = item

    
    

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
    


    const openOptionsModal = () => {
        setOptionIsVisible(true);
        setOptionModalTrack(item);
        setListForOptionsModal(list);
        setIndexForOptionsModal(index);
    }

    return(
        <>
        <View
            style={{
                width: '100%',
                padding:10,
                flexDirection:'row',
                borderBottomWidth:0.5,
                borderColor: Colors.grey3,
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
            
        >
            <View style={{width: '20%'}}>
                <ImageBackground
                    style={{
                        width: 70,
                        height:70,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    source={{uri:trackImage}}
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

            <View style={{width:'45%', alignItems: 'flex-start'}}>
                <Text style={{
                    fontFamily:'Baloo2-Bold',
                    color:'#fff',
                    fontSize:15
                }}>
                    {trackName}
                </Text>
                <Text style={{
                    fontFamily:'Baloo2-Bold',
                    color:Colors.grey3,
                    fontSize:13
                }}>
                    {artistName}
                </Text>
                <View style={{flexDirection:'row', alignItems: 'center'}}>
                    <Text style={{
                        fontFamily:'Baloo2-Bold',
                        color:Colors.grey3,
                        fontSize:13
                    }}>
                        {likes?.length} 
                    </Text>
                    <AntDesign name="like1" color={Colors.grey3} style={{bottom:1.5, left:1}}/>
                </View>
            </View>

            <View style={{width: '30%', justifyContent: 'center', alignItems: 'flex-end'}}>
                <SimpleLineIcons
                    name="options"
                    color={Colors.grey3}
                    size={20}
                    style={{alignItems: 'center', justifyContent: 'center', padding:10}}
                    onPress={openOptionsModal}
                />
            </View>
        </View>
        </>
    )
}


const PlayListScreen = (props) => {
    
    const {
        screenName,
        songsList,
    } = props.route.params

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

    
    const { PostAuthorProfile } = appBackGroundSelector;
    const { 
        _id,
        artistName,
    } = PostAuthorProfile;
    const artistId = _id;
    
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
        <View style={{
            flex: 1,
            backgroundColor: Colors.grey1
        }}>
            <MusicGeneralHeader goBack={() => props.navigation.goBack(null)} title={screenName}/>
            <FlatList
                data={songsList}
                keyExtractor={item => item._id}
                renderItem={({item, index}) => 
                    !isLoading?
                    (
                        <TouchableOpacity onPress={() => handleAudioPress(item, index, songsList)}>
                            <AudioListItemRow
                                item={item}
                                index={index}
                                play={play}
                                list={songsList}
                                setOptionModalTrack={setOptionModalTrack}
                                setIndexForOptionsModal={setIndexForOptionsModal}
                                setListForOptionsModal={setListForOptionsModal}
                                setOptionIsVisible={setOptionIsVisible}
                            />
                        </TouchableOpacity>
                    )
                    :
                    (
                        <View style={{opacity:0.7}}>
                            <AudioListItemRow
                                item={item}
                                index={index}
                                play={play}
                                list={songsList}
                                setOptionModalTrack={setOptionModalTrack}
                                setIndexForOptionsModal={setIndexForOptionsModal}
                                setListForOptionsModal={setListForOptionsModal}
                                setOptionIsVisible={setOptionIsVisible}
                            />
                        </View>
                    )
                    
                }
            />
        </View>
        </>
    );
};


export default PlayListScreen;
