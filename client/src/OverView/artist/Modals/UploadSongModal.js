import React, { useState, useEffect } from 'react';
import {
    View,
    Text, TouchableOpacity, Image, ActivityIndicator,
    Modal, TextInput, Platform
} from 'react-native';
import Colors from '../../../Utitilities/AppColors';
import { Video } from 'expo-av';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSongsByUserFavoriteGeners, getAllSearchResults, getArtistLatestRealeases, getAllArtistSongs, setIsUploadComplete, setIsWaitingForUpload } from '../../../ApiCalls';
import { uploadNewSongAction } from '../../../../store/actions/songActions';
import { storage } from '../../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';




const UploadPostModal = props => {
    const dispatch = useDispatch();
    const [songImage, setSongImage] = useState('');
    const [trackLength, setTrackLength] = useState('');
    const [song, setSong] = useState('');
    const [songName, setSongName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const artistSelector = useSelector(state => state.ArtistsReducer);
    const artistMainGener = artistSelector?.ArtistDataReducer?.mainGener;
    const artistId = artistSelector?.ArtistDataReducer?._id;

    let detailsToUpload = {
        trackName: songName,
        trackLength: trackLength,
        trackImage: null,
        trackUri: null,
        gener: artistMainGener
    }
    
    const HandleVideoUpload = async (video) => {
        const response = await fetch(video);
        const blob = await response.blob();
        const imageRef = ref(storage, "songVideos/" + songName);
        const downloadURL =
         await uploadBytes(imageRef, blob).then(snapshot => {
            return getDownloadURL(snapshot.ref);
         })
        return downloadURL;
    }

    const HandleImageUpload = async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRefFile = ref(storage, "songImages/" + songName);
        const uploadFile = await uploadBytes(imageRefFile, blob);
        return getDownloadURL(uploadFile.ref);
    }

    let selectVideoFromGallery = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("We need Your permmission to open your media library");
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [4, 3]
        });
        if(!pickerResult.cancelled){
            console.log(pickerResult);
            var milliseconds = parseInt((pickerResult.duration % 1000) / 100),
            seconds = Math.floor((pickerResult.duration / 1000) % 60),
            minutes = Math.floor((pickerResult.duration / (1000 * 60)) % 60),
            hours = Math.floor((pickerResult.duration / (1000 * 60 * 60)) % 24);

            hours = (hours == 0) ? null : hours;
            if(hours != null) {
                hours = (hours < 10) ? "0" + hours : hours;
            }            
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;
            if(hours != null) {
                setTrackLength(hours + ":" + minutes + ":" + seconds );
            } else {
                setTrackLength(minutes + ":" + seconds );
            }
            setSong(pickerResult.uri);
        }
    };


    let takeVideoWithcamra = async () => {
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("We need Your permmission to open your media library");
            return;
        }
        let pickerResult = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [16, 9]
        });
        console.log(pickerResult);
        if(!pickerResult.cancelled){
            console.log(pickerResult);
            var milliseconds = parseInt((pickerResult.duration % 1000) / 100),
            seconds = Math.floor((pickerResult.duration / 1000) % 60),
            minutes = Math.floor((pickerResult.duration / (1000 * 60)) % 60),
            hours = Math.floor((pickerResult.duration / (1000 * 60 * 60)) % 24);

            hours = (hours == 0) ? null : hours;
            if(hours != null) {
                hours = (hours < 10) ? "0" + hours : hours;
            }            
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;
            if(hours != null) {
                setTrackLength(hours + ":" + minutes + ":" + seconds );
            } else {
                setTrackLength(minutes + ":" + seconds );
            }
            setSong(pickerResult.uri);
        }
    };

    let selectImageFromGallery = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("We need Your permmission to open your media library");
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        });
        if(!pickerResult.cancelled){
            setSongImage(pickerResult.uri);
        } 
    };


    let takeImageWithcamra = async () => {
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("We need Your permmission to open your media library");
            return;
        }
        let pickerResult = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9]
        });
        console.log(pickerResult);
        if(!pickerResult.cancelled){
            setSongImage(pickerResult.uri);
        } 
    };
    

    const uploadSong = async() => {
        setIsLoading(true);
        const jsonToken = await AsyncStorage.getItem('Token');        
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
        if(userToken) {
            setIsWaitingForUpload(dispatch, true, 'song');
            if(songImage != '') {
                HandleImageUpload(songImage)
                .then(image => {
                    detailsToUpload.trackImage = image;  
                    HandleVideoUpload(song)
                    .then(async video => {
                        detailsToUpload.trackUri = video;  
                        let action = uploadNewSongAction(userToken, detailsToUpload);
                        try{
                            await dispatch(action)
                            .then(() => {
                                getAllArtistSongs(dispatch, userToken, artistId);
                                getArtistLatestRealeases(dispatch, userToken, artistId);
                                getSongsByUserFavoriteGeners(dispatch, userToken);
                                getAllSearchResults(dispatch, userToken);
                                setIsLoading(false);
                            })
                        } catch(error){
                            console.log(error.message);
                        }
                    })
                })
            }else{
                HandleVideoUpload(song)
                .then(async video => {
                    detailsToUpload.trackUri = video;
                    let action = uploadNewSongAction(userToken, detailsToUpload);
                    try{
                        await dispatch(action)
                        .then(() => {
                            getAllArtistSongs(dispatch, userToken, artistId);
                            getArtistLatestRealeases(dispatch, userToken, artistId);
                            getSongsByUserFavoriteGeners(dispatch, userToken);
                            getAllSearchResults(dispatch, userToken);
                            setIsUploadComplete(dispatch, true, true, 'song');
                            setIsLoading(false);
                        })
                    } catch(error){
                        console.log(error.message);
                    }
                })
            }
            
            props.close(false);
        }
    }

    

    return(
        <Modal
            visible={true}
            transparent={true}
            animationType='slide'
        >
            <View style={{flex: 1, width: '100%', height:'100%', backgroundColor:Colors.grey3, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{
                        width: '95%', height: Platform.OS == 'ios'? '80%' : '90%', backgroundColor:Colors.grey1,borderRadius:20,
                        shadowColor:'#000', shadowOffset:{width:0, height:3},
                        shadowOpacity:0.5, shadowRadius :5, paddingVertical:10
                    }}
                >
                    <View style={{width:'100%', alignItems: 'center', justifyContent: 'center', marginTop:30}}>
                        <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', fontSize:20}}>Upload New Song</Text>
                    </View>
                    <View style={{width:'100%', paddingHorizontal:20, marginTop:20}}>
                        <Text style={{fontFamily:'Baloo2-Bold', color:'#fff'}}>What is your song name?</Text>
                        <TextInput
                            style={{
                                width:'95%', height: 30, fontFamily:'Baloo2-Medium', color:Colors.red3,
                                paddingHorizontal:10, backgroundColor:'#fff', borderWidth:2,
                                marginTop:10, borderRadius:50, borderColor:Colors.grey5
                            }}
                            value={songName}
                            onChangeText={text => setSongName(text)}
                            returnKeyType='done'
                        />
                    </View>
                    <View style={{width:'100%', paddingHorizontal:20, marginTop:20}}>
                        <Text style={{fontFamily:'Baloo2-Bold', color:'#fff'}}>Would you like to add single picture?</Text>
                    </View>
                    <View style={{width:'100%', alignItems: 'center', justifyContent: 'center', marginTop:10}}>
                        <View style={{borderWidth:2, borderColor:'#fff', width:'85%', backgroundColor:Colors.grey4, padding:10, borderRadius:20, flexDirection:'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <View>
                                <TouchableOpacity onPress={takeImageWithcamra} style={{width:40, height:40, alignItems: 'center', justifyContent: 'center', backgroundColor:Colors.red3, padding:10, borderRadius:50, borderWidth:2, borderColor:'#fff',margin:5}}>
                                    <FontAwesome
                                        name='camera'
                                        size={15}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={selectImageFromGallery} style={{width:40, height:40, alignItems: 'center', justifyContent: 'center', backgroundColor:Colors.red3, padding:10, borderRadius:50, borderWidth:2, borderColor:'#fff',margin:5}}>
                                    <FontAwesome5
                                        name='images'
                                        size={15}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{width:'70%', alignItems: 'center', justifyContent: 'center', padding:10}}>
                                <Image
                                    source={songImage == ''? require('../../../../assets/noimage.jpg') : {uri:songImage}}
                                    style={{width:150, height:120, borderRadius:20}}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{width:'100%', paddingHorizontal:20, marginTop:20}}>
                        <Text style={{fontFamily:'Baloo2-Bold', color:'#fff'}}>Pic / Take video song</Text>
                    </View>
                    <View style={{width:'100%', alignItems: 'center', justifyContent: 'center', marginTop:10}}>
                        <View style={{borderWidth:2, borderColor:'#fff', width:'85%', backgroundColor:Colors.grey4, padding:10, borderRadius:20, alignItems: 'center', justifyContent: 'space-between'}}>
                            <View style={{flexDirection:'row', width:'100%', alignItems: 'center', justifyContent: 'space-between'}}>
                                <View>
                                    <TouchableOpacity onPress={takeVideoWithcamra} style={{width:40, height:40, alignItems: 'center', justifyContent: 'center', backgroundColor:Colors.red3, padding:10, borderRadius:50, borderWidth:2, borderColor:'#fff',margin:5}}>
                                        <FontAwesome
                                            name='camera'
                                            size={15}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={selectVideoFromGallery} style={{width:40, height:40, alignItems: 'center', justifyContent: 'center', backgroundColor:Colors.red3, padding:10, borderRadius:50, borderWidth:2, borderColor:'#fff',margin:5}}>
                                        <FontAwesome5
                                            name='images'
                                            size={15}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={{width:'70%', alignItems: 'center', justifyContent: 'center', padding:10}}>
                                    {
                                        song == ''?
                                        (
                                            <Image
                                                source={require('../../../../assets/noimage.jpg')}
                                                style={{width:150, height:120, borderRadius:20}}
                                            />
                                        )
                                        :
                                        (
                                            <Video
                                                source={{uri:song}}
                                                style={{width:150, height:120, borderRadius:20}}
                                                resizeMode="cover"
                                            />
                                        )
                                    }
                                </View>
                            </View>
                            {
                                trackLength != '' &&
                                <View style={{width:'100%', flexDirection:'row-reverse', paddingHorizontal:30}}>
                                    <View style={{width:150, borderWidth:2, padding:5, paddingHorizontal:10, justifyContent: 'center', borderRadius:50, borderColor: 'white', backgroundColor: Colors.grey7}}>
                                        <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Track Length: {trackLength}</Text>
                                    </View>
                                </View>
                            }
                        </View>
                    </View>
                    <View style={{width:'100%', flexDirection:'row', alignItems: 'center', justifyContent: 'center', marginTop:10}}>
                        <TouchableOpacity onPress={() => props.close(false)} 
                            style={{
                                backgroundColor:Colors.red3, margin:5,
                                padding:5, paddingHorizontal:15,
                                borderRadius:50, borderWidth:2, borderColor: 'white',
                            }}
                        >
                            <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Cancel</Text>
                        </TouchableOpacity>
                        {
                            song != '' && songName != ''?
                            (
                                <View>
                                    {
                                        !isLoading?
                                        (
                                            <TouchableOpacity onPress={uploadSong} 
                                                style={{
                                                    backgroundColor:Colors.red3, margin:5,
                                                    padding:5, paddingHorizontal:15,
                                                    borderRadius:50, borderWidth:2, borderColor: 'white',
                                                }}
                                            >
                                                <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Upload Song</Text>
                                            </TouchableOpacity>
                                        )
                                        :
                                        (
                                            <View 
                                                style={{
                                                    backgroundColor:Colors.red3, margin:5,
                                                    padding:5, paddingHorizontal:15,
                                                    borderRadius:50, borderWidth:2, borderColor: 'white',
                                                }}
                                            >
                                                <ActivityIndicator color={'#000'}/>
                                            </View>
                                        )
                                    }
                                    
                                </View>
                            )
                            :
                            (
                                <View 
                                    style={{
                                        backgroundColor:Colors.red3, margin:5,
                                        padding:5, paddingHorizontal:15, opacity:0.5,
                                        borderRadius:50, borderWidth:2, borderColor: 'white',
                                    }}
                                >
                                    <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Upload Song</Text>
                                </View>
                            )
                        }
                    </View>
                    
                </View>
            </View>
        </Modal>
    )
}

export default UploadPostModal;





