import React, { useState } from 'react';
import {
    View,KeyboardAvoidingView,
    Text, TouchableOpacity, Image, ActivityIndicator,
    FlatList, Modal, TextInput, Platform
} from 'react-native';
import Colors from '../../../Utitilities/AppColors';
import { Video } from 'expo-av';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import { uploadNewPostAction } from '../../../../store/actions/postActions';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from '../../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getPosts, getArtistPostsById, getSongsByUserFavoriteGeners, getAllSearchResults, getArtistLatestRealeases, getAllArtistSongs, setIsUploadComplete, setIsWaitingForUpload } from '../../../ApiCalls';



const UploadPostModal = props => {
    const dispatch = useDispatch();
    const [postContent, setPostContent] = useState('');
    const [video, setVideo] = useState('');
    const [image, setImage] = useState('');
    const [mediaState, setMediaState] = useState('pic');
    const [isLoading, setIsLoading] = useState(false);
    const artistSelector = useSelector(state => state.ArtistsReducer);
    const artistId = artistSelector?.ArtistDataReducer?._id;

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
            setImage(pickerResult.uri);
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
            setImage(pickerResult.uri);
        } 
    };

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
            setVideo(pickerResult.uri);
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
            setVideo(pickerResult.uri);
        } 
    };
    
    const HandleVideoUpload = async (video) => {
        const response = await fetch(video);
        const blob = await response.blob();
        const imageRef = ref(storage, "postVideos/" + `${video.split("/")[video.split("/").length - 1]}`);
        const uploadFile = await uploadBytes(imageRef, blob);
        return getDownloadURL(uploadFile.ref);
    }

    const HandleImageUpload = async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(storage, "postImages/" + `${image.split("/")[image.split("/").length - 1]}`);
        const uploadFile = await uploadBytes(imageRef, blob);
        return getDownloadURL(uploadFile.ref);
    }

    const uploadPost = async() => {
        setIsLoading(true);
        const jsonToken = await AsyncStorage.getItem('Token');        
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
        if(userToken) { 
            if(image.length > 0 && mediaState == 'pic') {
                HandleImageUpload(image)
                .then(async result => {
                    let details = {
                        postContent: postContent,
                        uri: result ,
                        format: 'image'
                    }
                    let action = uploadNewPostAction(userToken, details);
                    try {
                        await dispatch(action);
                        getArtistPostsById(dispatch, userToken, artistId);
                        getPosts(dispatch,userToken);
                        setIsLoading(false);
                        props.close(false);
                    } catch(error) {
                        console.log(error.message);
                    }            
                })
            } else if(video.length > 0 && mediaState == 'video') {
                setIsWaitingForUpload(dispatch, true, 'post');
                HandleVideoUpload(video)
                .then(async result => {                
                    let details = {
                        postContent: postContent,
                        uri: result,
                        format: 'video'
                    }
                    let action = uploadNewPostAction(userToken, details);
                    try {
                        await dispatch(action);
                        getArtistPostsById(dispatch, userToken, artistId);
                        getPosts(dispatch,userToken);
                        setIsUploadComplete(dispatch, true, true, 'song');
                        setIsLoading(false);
                    } catch(error) {
                        console.log(error.message);
                    }                
                })
                props.close(false);
            } else {  
                let details = {postContent: postContent}
                let action = uploadNewPostAction(userToken, details);
                try {
                    await dispatch(action);
                    getArtistPostsById(dispatch, userToken, artistId);
                    getPosts(dispatch,userToken);
                    setIsLoading(false);
                    props.close(false);
                } catch(error) {
                    console.log(error.message);
                }
            }
        }
        
    }



    return(
        <Modal
            visible={true}
            transparent={true}
            animationType='slide'
        >
            <View style={{flex: 1, width: '100%', height:'100%', backgroundColor:Colors.grey3, alignItems: 'center', justifyContent: 'center'}}>
                <KeyboardAvoidingView behavior='padding' style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                <View style={{marginTop:30 , padding:20, alignItems: 'center', width:'95%', backgroundColor:Colors.grey1, borderRadius:20, shadowColor:'#000', shadowOffset:{width:0, height:3}, shadowOpacity:0.5, shadowRadius :5}}>
                    <View style={{width: '100%'}}>
                        <Text style={{fontFamily:'Baloo2-Medium', color:'#fff', fontSize:16}}>What would you like to share?</Text> 
                    </View>
                    <TextInput
                        style={{
                            width: '95%', backgroundColor:'#fff',
                            height: 100, marginTop:10, borderRadius:20,
                            paddingHorizontal:10, fontFamily:'Baloo2-Medium',
                            color:Colors.red3
                        }}
                        placeholder="Thats the place to share..."
                        multiline
                        value={postContent}
                        onChangeText={text => setPostContent(text)}
                        autoCorrect={false}
                        autoComplete="off"
                    />
                    <View style={{width: '100%', marginTop:10}}>
                        <Text style={{fontFamily:'Baloo2-Medium', color:'#fff', fontSize:16}}>Would you like to share media in your post?</Text> 
                    </View>
                    <View style={{width: '100%', height:200, borderWidth:2, marginTop:10, flexDirection:'row', padding:10, alignItems: 'center', borderRadius:20, borderColor:'#fff', backgroundColor:Colors.grey4}}>
                        <View style={{width: '20%', height: '100%', justifyContent: 'center'}}>
                            <TouchableOpacity onPress={mediaState == 'pic'? takeImageWithcamra : takeVideoWithcamra} style={{width:40, height:40, alignItems: 'center', justifyContent: 'center', backgroundColor:Colors.red3, padding:10, borderRadius:50, borderWidth:2, borderColor:'#fff',margin:5}}>
                                <FontAwesome
                                    name='camera'
                                    size={15}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={mediaState == 'pic'? selectImageFromGallery : selectVideoFromGallery} style={{width:40, height:40, alignItems: 'center', justifyContent: 'center', backgroundColor:Colors.red3, padding:10, borderRadius:50, borderWidth:2, borderColor:'#fff',margin:5}}>
                                <FontAwesome5
                                    name='images'
                                    size={15}
                                />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={{width:'80%', alignItems: 'center', height:'100%'}}>
                            <View style={{flexDirection:'row', width:'50%'}}>
                                {
                                    mediaState == 'pic' ?
                                    (
                                        <View style={{backgroundColor:Colors.red3, borderWidth:2, borderColor:'#fff', width:'50%', alignItems: 'center'}}>
                                            <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Image</Text>
                                        </View>
                                    )
                                    :
                                    (
                                        <TouchableOpacity onPress={() => setMediaState('pic')} style={{opacity:0.7, backgroundColor:Colors.red3, borderWidth:2, borderColor:'#fff', width:'50%', alignItems: 'center'}}>
                                            <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Image</Text>
                                        </TouchableOpacity>
                                    )
                                }
                                {
                                    mediaState == 'video' ?
                                    (
                                        <View style={{backgroundColor:Colors.red3, borderWidth:2, borderColor:'#fff', width:'50%', alignItems: 'center'}}>
                                            <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Video</Text>
                                        </View>
                                    )
                                    :
                                    (
                                        <TouchableOpacity onPress={() => setMediaState('video')} style={{opacity:0.7, backgroundColor:Colors.red3, borderWidth:2, borderColor:'#fff', width:'50%', alignItems: 'center'}}>
                                            <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Video</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            </View>                                                
                            <View style={{width:'80%', marginTop:10}}>
                                {
                                    mediaState == 'pic' &&
                                    <View>
                                        {
                                            image == ''?
                                            (
                                                <Image
                                                    source={require('../../../../assets/noimage.jpg')}
                                                    style={{width:'100%', height:120, borderRadius:20}}
                                                />
                                            )
                                            :
                                            (
                                                <Image
                                                    source={{uri:image}}
                                                    style={{width:'100%', height:120, resizeMode:'contain', borderRadius:20}}
                                                />
                                            )
                                        }
                                    </View>
                                }
                                {
                                    mediaState == 'video' &&
                                    <View>
                                        {
                                            video == ''?
                                            (
                                                <Image
                                                    source={require('../../../../assets/noimage.jpg')}
                                                    style={{width:'100%', height:120, borderRadius:20}}
                                                />
                                            )
                                            :
                                            (
                                                <Video
                                                    style={{width:'100%', height:120, borderRadius:20, resizeMode:'stretch'}}
                                                    source={{ uri: video }}
                                                    resizeMode="cover"
                                                    useNativeControls 
                                                />
                                            )
                                        }
                                    </View>
                                }
                            </View>
                        </View>
                    </View>

                    <View style={{width:'100%', marginTop:20, flexDirection:'row', justifyContent: 'center'}}>
                        <TouchableOpacity style={{margin:5 ,backgroundColor:Colors.red3, width:60, alignItems: 'center', padding:5, borderRadius:50, borderColor:'#fff', borderWidth:2}} onPress={() => props.close(false)}>
                            <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Close</Text>
                        </TouchableOpacity>
                        {
                            postContent == '' && video == '' && image == ''?
                            (
                                <View style={{opacity:0.7, margin:5 ,backgroundColor:Colors.red3, width:60, alignItems: 'center', padding:5, borderRadius:50, borderColor:'#fff', borderWidth:2}}>
                                    <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Post</Text>
                                </View>
                            )
                            :
                            (
                                <View>
                                    {
                                        isLoading?
                                        (
                                            <View style={{margin:5 ,backgroundColor:Colors.red3, width:60, alignItems: 'center', padding:5, borderRadius:50, borderColor:'#fff', borderWidth:2}}>
                                                <ActivityIndicator color='#000'/>
                                            </View>
                                        )
                                        :
                                        (
                                            <TouchableOpacity style={{margin:5 ,backgroundColor:Colors.red3, width:60, alignItems: 'center', padding:5, borderRadius:50, borderColor:'#fff', borderWidth:2}} onPress={uploadPost}>
                                                <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Post</Text>
                                            </TouchableOpacity>
                                        )
                                    }
                                </View>
                            )
                        }
                        
                    </View>
                    
                </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    )
}


export default UploadPostModal;