import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
    Image,
    ActivityIndicator
} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../../../Utitilities/AppColors';


const AudioListItemRow = ({
    item,
    index,
    list,
    handleAudioPress,
    SongIndex,
    currentAudio,
    isPlaying,
    isLoading,
    setOptionIsVisible,
    setOptionModalTrack,
    setIndexForOptionsModal,
    setListForOptionsModal
}) => {
    const openOptionsModal = () => {
        setOptionIsVisible(true);
        setOptionModalTrack(item);
        setListForOptionsModal(list);
        setIndexForOptionsModal(index);
    }
    return(
        <>
            <TouchableOpacity key={index}
                    style={{
                        width: '100%',
                        borderBottomColor: Colors.grey6,
                        padding:10
                    }}
                    onPress={() => handleAudioPress(item, index, list)}
                >
                    <View style={{
                        flexDirection:'row', 
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <View style={{
                            flexDirection:'row', 
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                fontFamily:'Baloo2-Bold',
                                color: '#fff'
                            }}>{index + 1}</Text>

                            <View style={{marginLeft:10, alignItems: 'center'}}>
                                <ImageBackground
                                    source={{uri:item.trackImage}}
                                    style={{
                                        width: 45,
                                        height:45,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity:index === SongIndex && item._id === currentAudio._id? 0.7 : 1
                                    }}
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

                            <View style={{
                                marginLeft:15,
                            }}>
                                    <Text style={{
                                        fontFamily:'Baloo2-Bold',
                                        color: '#fff'
                                    }}>
                                        {item.trackName}
                                    </Text>
                                    <View style={{flexDirection:'row', alignItems: 'center', height:20, marginTop:5}}>
                                        <Text style={{
                                            fontFamily:'Baloo2-Bold',
                                            color: '#fff' 
                                        }}>
                                            {item.likes.length}
                                        </Text>
                                        <AntDesign
                                            name="like1"
                                            style={{marginLeft:5}}
                                            color={'#fff'}
                                        />
                                    </View>
                            </View>
                        </View>
                        <View>
                            <SimpleLineIcons
                                name="options"
                                color={Colors.grey3}
                                size={20}
                                onPress={openOptionsModal}
                                style={{padding:10}}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
        </>
    )
}

export default AudioListItemRow;