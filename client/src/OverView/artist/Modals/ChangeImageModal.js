import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    Image,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import Colors from '../../../Utitilities/AppColors';
import Style from './Style/ChangeImageModalStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { changeArtistImageAction } from '../../../../store/actions/artistActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getArtistData } from '../../../ApiCalls';
import { storage } from '../../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ChangeImageModal = props => {
    const dispatch = useDispatch();
    const [updatedImage, setUpdatedImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    let selectImageFromGallery = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("We need Your permmission to open your media library");
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if(!pickerResult.cancelled){
            setUpdatedImage(pickerResult.uri);
        } 
    };

    
      const HandleFileUpload = async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(storage, "AritstProfileImages/" + `${image.split("/")[image.split("/").length - 1]}`);
        const uploadFile = await uploadBytes(imageRef, blob);
        return getDownloadURL(uploadFile.ref);
      }

    // const HandleFileUpload = async image => {
    //     let sourceuri = image;
    //     let newFile = {
    //         uri: sourceuri,
    //         type: `test/${sourceuri.split(".")[1]}`,
    //         name: `test.${sourceuri.split(".")[1]}`
    //     }
    //     const data = new FormData();
    //     data.append('file', newFile);
    //     data.append('upload_preset', 'AritstProfileImages');
    //     data.append('cloud_name', 'musicbox');
    //     const res = await fetch('https://api.cloudinary.com/v1_1/musicbox/image/upload', {
    //         method: 'post',
    //         body: data
    //     });
    //     const result = await res.json();  
    //     return result.secure_url;
    // }

    let takeImageWithcamra = async () => {
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("We need Your permmission to open your media library");
            return;
        }
        let pickerResult = await ImagePicker.launchCameraAsync();
        console.log(pickerResult);
        if(!pickerResult.cancelled){
            setUpdatedImage(pickerResult.uri);
        } 
    };

    const changeImage = async () => {
        setIsLoading(true);
        HandleFileUpload(updatedImage)
        .then(async result => {
            const jsonToken = await AsyncStorage.getItem('Token');
            const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
            if(userToken) {
                let action = changeArtistImageAction(userToken, {image:result, type:props.details.type});
                try{
                    await dispatch(action)
                    .then(result => {
                        getArtistData(dispatch, userToken);
                        props.details.func(false);
                    })
                } catch(error) {
                    console.log(error.message);
                }
            }
        })
    }
    console.log(props);
    return(
        
        <Modal
            visible={true}
            transparent={true}
            animationType='slide'
        >
            <View style={{flex: 1, width: '100%', height:'100%', backgroundColor:Colors.grey3, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{width: '80%', backgroundColor:Colors.grey1, alignItems: 'center', justifyContent: 'center', padding:20, shadowColor:'#000', shadowOffset:{width:0, height:3}, shadowOpacity:0.5, shadowRadius :5, borderRadius:30}}>
                    <Text style={{fontFamily:'Baloo2-Bold', fontSize:18, color:'#fff'}}>{props.details.title}</Text>
                    <View style={{shadowColor:'#000', shadowOffset:{width:0, height:3}, shadowOpacity:0.5, shadowRadius :5, marginTop:10}}>
                        <Image
                            style={{width: 140, height: 180, borderRadius:20}}
                            source={{uri:updatedImage == ''? props.details.image: updatedImage}}
                        />
                    </View>
                    <View style={{width:'100%', justifyContent: 'center', marginTop:20, alignItems: 'center'}}>
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity onPress={takeImageWithcamra} style={{width:100, alignItems: 'center', justifyContent: 'center', backgroundColor:Colors.red3, padding:10, borderRadius:50, borderWidth:2, borderColor:'#fff',margin:5}}>
                                <FontAwesome
                                    name='camera'
                                    size={20}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={selectImageFromGallery} style={{width:100, alignItems: 'center', justifyContent: 'center', backgroundColor:Colors.red3, padding:10, borderRadius:50, borderWidth:2, borderColor:'#fff',margin:5}}>
                                <FontAwesome5
                                    name='images'
                                    size={20}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            {
                                updatedImage == ''?
                                (
                                    <View style={{opacity:0.7, width:100, alignItems: 'center', justifyContent: 'center', backgroundColor:Colors.red3, padding:10, borderRadius:50, borderWidth:2, borderColor:'#fff',margin:5}}>
                                        <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Update</Text>
                                    </View>
                                )
                                :
                                (
                                    <View>
                                        {
                                            isLoading?
                                            (
                                                <View style={{width:100, alignItems: 'center', justifyContent: 'center', backgroundColor:Colors.red3, padding:10, borderRadius:50, borderWidth:2, borderColor:'#fff',margin:5}}>
                                                    <ActivityIndicator color='#000'/>
                                                </View>
                                            )
                                            :
                                            (
                                                <TouchableOpacity onPress={changeImage} style={{width:100, alignItems: 'center', justifyContent: 'center', backgroundColor:Colors.red3, padding:10, borderRadius:50, borderWidth:2, borderColor:'#fff',margin:5}}>
                                                    <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Update</Text>
                                                </TouchableOpacity>
                                            )
                                        }
                                    </View>
                                )
                            }
                            
                            <TouchableOpacity onPress={() => props.details.func(false)} style={{width:100, alignItems: 'center', justifyContent: 'center', backgroundColor:Colors.red3, padding:10, borderRadius:50, borderWidth:2, borderColor:'#fff',margin:5}}>
                                <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            
        </Modal>
        
        
    )
}

export default ChangeImageModal;