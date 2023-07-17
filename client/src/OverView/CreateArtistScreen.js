import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Modal, ActivityIndicator

} from 'react-native';
import {} from '../ApiCalls';
import Style from './Style/CreateArtistStyle';
import Colors from '../Utitilities/AppColors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { getUserData, getArtistData } from '../ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createArtistAction } from '../../store/actions/artistActions';
import ModalStyle from '../Authentication/style/ModalStyle';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import GeneralHeader from '../components/GeneralHedher';
import AdditionalGanersItem from './components/AdditionalGanersItem';
import CheckBoxItem from './components/CheckBoxItem';

const CreatArtistScreen = props => {
    const dispatch = useDispatch();
    const [artistName, setArtistName] = useState('');
    const [description, setDescription] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [profileSeconderyImage, setProfileSeconderyImage] = useState('');
    const [mainImage, setMainImage] = useState(null);
    const [secondImage, setSecondImage] = useState(null);
    const [mainGener, setMainGaner] = useState(null);
    const [additionalGeners, setAdditionalGeners] = useState([]);
    const [userSkills, setUserSkills] = useState([]);
    const [userSkillsError, setUserSkillsError] = useState(false);
    const generSelector = useSelector(state => state.GenerReducer);
    const genresList = generSelector?.GenerReducer?.AllGeners;
    const [isVisible, setIsVisble] = useState(false);
    const [systemMessage, setSystemMessage] = useState('');
    const [accountUpdated, setAccountUpdated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    

    const addGenerToAdditional = gener => {
        let list = additionalGeners;
        list.push(gener);
        setAdditionalGeners(list);
    }

    const removeGenerToAdditional = gener => {
        let list = additionalGeners;
        list.splice(list.indexOf(gener),list.indexOf(gener)+1);        
        setAdditionalGeners(list);
    }

    const addSkillToList = skill => {
        let list = userSkills; 
        list.push(skill);
        setUserSkills(list);
    }

    const removeSkillFromList = skill => {
        let list = userSkills; 
        list.splice(list.indexOf(skill),list.indexOf(skill)+1);        
        setUserSkills(list);
    }


    let selectImageFromGallery = async (type) => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("We need Your permmission to open your media library");
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if(!pickerResult.cancelled){
            if( type === "main") {
                setProfileImage(pickerResult.uri);
            } else {
                setProfileSeconderyImage(pickerResult.uri);
            }
        } 
    };

    let takeImageWithcamra = async (type) => {
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("We need Your permmission to open your media library");
            return;
        }
        let pickerResult = await ImagePicker.launchCameraAsync();
        console.log(pickerResult);
        if(!pickerResult.cancelled){
            if( type === "main") {
                setProfileImage(pickerResult.uri);
            } else {
                setProfileSeconderyImage(pickerResult.uri);
            }
        } 
    };

    const skills = {
        group1:  [
            {_id: 1, skill: "Singer"},
            {_id: 2, skill: "Drum Player"},
            {_id: 3, skill: "Guitar Player"},
        ],
        group2:  [
            {_id: 4, skill: "Pianist"}
        ]
    }

  

    const HandleFileUpload = async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(storage, "AritstProfileImages/" + 
        `${image.split("/")[image.split("/").length - 1]}`);
        const uploadFile = await uploadBytes(imageRef, blob);
        return getDownloadURL(uploadFile.ref);
    }


    const createArtistProfile = async() => {
        if(userSkills.length == 0) {
            setUserSkillsError(true);
            return;
        }
        
        let details = {
            artistName: artistName,
            description: description,            
            mainGener: mainGener,
            additionalGener: additionalGeners,
            skills:userSkills
        }
        if(profileImage.length != ''){
            setIsLoading(true);
            setIsVisble(true);
            await HandleFileUpload(profileImage)
            .then(imageUri => {
                details.profileImage = imageUri;
            })
        }
        if(profileSeconderyImage != '') {
            setIsLoading(true);
            setIsVisble(true);
            await HandleFileUpload(profileSeconderyImage)
            .then(imageUri => {
                details.profileSeconderyImage = imageUri;
            })
        }
        
        

        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
        if(userToken) {
            let action = createArtistAction(userToken, details);
            try{
                await dispatch(action).
                then(data => {
                    setIsLoading(false);
                    setIsVisble(false);
                    console.log(data);
                    if(data.status === false) {
                        setSystemMessage(data.message);
                        setIsVisble(true)
                    } else {
                        getArtistData(dispatch, userToken);
                        getUserData(dispatch, userToken);
                        setAccountUpdated(true); 
                    }
                })
            }catch(error) {
                console.log(error.message);
            }
            
        }


    }


    return(
        <ImageBackground 
                source={ require('../../assets/AppAssets/Logo.png') }
                resizeMode="cover" 
                style={Style.backgroundContainer}
                imageStyle={{opacity: 0.3}}
        >

            <View>                            
                <Modal
                animationType="fade"
                visible={isVisible} 
                transparent={true}                                
                >
                    <View style={ModalStyle.errorMessageView}>
                        {
                            isLoading ?
                            (
                                <View style={ModalStyle.errorMessageContentView}>
                                    <View>
                                        <ActivityIndicator  color="#000"/>
                                        <Text style={ModalStyle.errorMessegText}>
                                            Uploading your new profile pictures ....
                                        </Text>
                                    </View>
                                </View>
                            )
                            :
                            (
                                <View style={ModalStyle.errorMessageContentView}>
                                    <MaterialIcons
                                        name="error"
                                        color="#000"
                                        size={20}
                                    />
                                    <Text style={ModalStyle.errorMessegText}>{systemMessage}</Text>
                                    <View style={ModalStyle.line}></View>
                                    <TouchableOpacity onPress={() => setIsVisble(false)}>
                                        <Text style={{fontFamily:'Baloo2-Medium'}}>OK</Text>
                                    </TouchableOpacity>
                                </View> 
                            )
                        }               
                    </View>
                </Modal>
            </View>

            {
               !accountUpdated?
                (
                    <View style={{flex:1, width:'100%', height:'100%'}}>
                        <GeneralHeader title={'Create Artist Profile'} 
                            goBack={() => props.navigation.goBack(null)}
                        />
                        <ScrollView>
                            <View style={Style.queryTitleContainer}>
                                <Text style={{fontFamily:'Baloo2-SemiBold', color: Colors.red3}}>
                                    What is your nick ?
                                </Text>
                            </View>

                            <TextInput
                                value={artistName}
                                onChangeText={text => setArtistName(text)}
                                style={Style.queryTextInputStyle}
                                placeholder="(*Must)"
                                returnKeyType='done'
                                clearButtonMode='always'
                                autoCorrect={false}
                                
                            />

                            <View style={Style.queryTitleContainer}>
                                <Text style={{fontFamily:'Baloo2-SemiBold', color: Colors.red3}}>
                                    Description
                                </Text>
                            </View>

                            <TextInput
                                value={description}
                                onChangeText={text => setDescription(text)}
                                style={Style.descriptionTextInputStyle}
                                placeholder="(*Optional)"
                                clearButtonMode='always'
                                autoCorrect={false}
                                multiline
                            />

                            <View style={Style.queryTitleContainer}>
                                <Text style={{fontFamily:'Baloo2-SemiBold', color: Colors.red3}}>
                                    Pic Profile Image
                                </Text>
                            </View>

                            <View 
                                style={
                                    [
                                        Style.queryContainer,
                                        {
                                            height:100,
                                            alignItems: 'center',
                                            paddingHorizontal:20
                                        }
                                    ]
                                }
                            >
                                <View>
                                    <TouchableOpacity 
                                        onPress={() => takeImageWithcamra('main')}
                                        style={Style.pictureButton}
                                    >
                                            <FontAwesome
                                                name='camera'
                                                size={20}
                                            />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => selectImageFromGallery('main')}
                                        style={[Style.pictureButton,{marginTop:10}]}>
                                            <FontAwesome5
                                                name='images'
                                                size={20}
                                            />
                                    </TouchableOpacity>
                                </View>
                                <View style={{marginLeft:90, backgroundColor:'#fff', borderRadius:20}}>
                                    <Image
                                        source={ 
                                            profileImage.length > 0 ?
                                            {uri: profileImage}
                                            : require('../../assets/AppAssets/Logo.png')
                                         }
                                        style={{width:120, height:80, borderRadius:20, resizeMode:'stretch'}}
                                    />
                                </View>
                            </View>

                            <View style={[Style.queryTitleContainer, {width:250}]}>
                                <Text style={{fontFamily:'Baloo2-SemiBold', color: Colors.red3}}>
                                    Pic Profile secondery Image
                                </Text>
                            </View>

                            <View 
                                style={
                                    [
                                        Style.queryContainer, 
                                        {
                                            height:100,
                                            alignItems: 'center',
                                            paddingHorizontal:20
                                        }
                                    ]
                                }
                            >
                                <View>
                                    <TouchableOpacity 
                                        onPress={() => takeImageWithcamra('second')}
                                        style={Style.pictureButton}
                                    >
                                            <FontAwesome
                                                name='camera'
                                                size={20}
                                            />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => selectImageFromGallery('second')}
                                        style={
                                            [
                                                Style.pictureButton,
                                                {marginTop:10}
                                            ]
                                        }
                                    >
                                            <FontAwesome5
                                                name='images'
                                                size={20}
                                            />
                                    </TouchableOpacity>
                                </View>
                                <View style={{marginLeft:90, backgroundColor:'#fff', borderRadius:20}}>
                                    <Image
                                        source={ 
                                            profileSeconderyImage.length > 0 ?
                                            {
                                                uri: profileSeconderyImage
                                            } 
                                            :
                                            require('../../assets/AppAssets/Logo.png')
                                        }
                                        style={{width:120, height:80, borderRadius:20, resizeMode:'stretch'}}
                                    />
                                </View>
                            </View>


                            <View style={Style.queryTitleContainer}>
                                <Text style={{fontFamily:'Baloo2-SemiBold', color: Colors.red3}}>Your main ganer</Text>
                            </View>

                            <View style={Style.queryContainer}>
                                <FlatList
                                    horizontal
                                    data={genresList}
                                    keyExtractor={item => item._id}
                                    renderItem={gener => 
                                        <TouchableOpacity onPress={() => setMainGaner(gener.item)}>
                                            <ImageBackground
                                                source={{uri:gener.item.generImage}}
                                                style={{width:100, height:70, margin:2, alignItems:'center', justifyContent:'center'}}
                                                opacity={gener.item == mainGener? 0.4 : 1}
                                            >
                                                {gener.item == mainGener && <FontAwesome name="check" size={30} color={'#000'}/>}
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    }
                                />
                            </View>

                            <View style={Style.queryTitleContainer}>
                                <Text style={{fontFamily:'Baloo2-SemiBold', color: Colors.red3}}>Your additional geners</Text>
                            </View>

                            <View style={Style.queryContainer}>
                                <FlatList
                                    horizontal
                                    data={genresList}
                                    keyExtractor={item => item._id}
                                    renderItem={gener => 
                                        <AdditionalGanersItem
                                            gener={gener.item}
                                            add={addGenerToAdditional}
                                            remove={removeGenerToAdditional}
                                        />
                                    }
                                />
                            </View>

                            <View style={Style.queryTitleContainer}>
                                <Text style={{fontFamily:'Baloo2-SemiBold', color: Colors.red3}}>Your Skills</Text>
                            </View>

                            <View style={[Style.queryContainer, {marginBottom:50, flexDirection:'column'}]}>
                                <FlatList
                                    horizontal
                                    data={skills.group1}
                                    keyExtractor={item => item._id}
                                    renderItem={skill => 
                                        <CheckBoxItem
                                            skill={skill.item.skill}
                                            add={addSkillToList}
                                            remove={removeSkillFromList}
                                        />
                                    }
                                />
                                <FlatList
                                    horizontal
                                    data={skills.group2}
                                    keyExtractor={item => item._id}
                                    renderItem={skill => 
                                        <CheckBoxItem
                                            skill={skill.item.skill}
                                            add={addSkillToList}
                                            remove={removeSkillFromList}
                                        />
                                    }
                                />
                            </View>
                            {
                                userSkillsError 
                                &&
                                <Text 
                                    style={{
                                        left:20,
                                        bottom:30,
                                        fontFamily:'Baloo2-Bold',
                                        color:Colors.red3,
                                        fontSize:14
                                    }}
                                >
                                    choose at least one skill
                                </Text>
                            }

                            <View style={{width:'100%', alignItems: 'center', marginBottom:50}}>
                                {
                                    artistName.length > 2 && mainGener != null ?
                                    (
                                        <TouchableOpacity 
                                            onPress={createArtistProfile}
                                            style={{
                                                padding:10,
                                                backgroundColor:Colors.red3,
                                                borderRadius:50,
                                                borderWidth:2,
                                                borderColor:'#fff'
                                            }}>
                                            <Text 
                                                style={{
                                                    fontFamily:'Baloo2-Bold',
                                                    color: '#fff'
                                                }}>
                                                    Create Artist Profile
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                    :
                                    (
                                        <View 
                                            style={{
                                                opacity:0.7,
                                                padding:10,
                                                backgroundColor:Colors.red3,
                                                borderRadius:50,
                                                borderWidth:2,
                                                borderColor:'#fff'
                                            }}
                                        >
                                            <Text 
                                                style={{
                                                    fontFamily:'Baloo2-Bold',
                                                    color: '#fff'
                                                }}
                                            >
                                                Create Artist Profile
                                            </Text>
                                        </View>
                                    )
                                }
                                    
                            </View>

                        </ScrollView>
                    </View>
                )
                :
                (
                    <View 
                        style={{
                            flex:1 ,
                            width:'100%',
                            height:'100%',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <AntDesign
                            name="like1"
                            size={50}
                            color={Colors.red3}                                    
                        />
                        <View style={Style.verificationMessageView}>
                            <Text style={Style.explainText}>Congratulations {artistName}!</Text>
                            <Text style={Style.explainText}>your artist profile</Text>
                            <Text style={Style.explainText}> was created seccsesfuly.</Text>
                            <Text style={Style.explainText}>you're now an artist on</Text>                                            
                            <Text style={Style.explainText}>Music Box!</Text>                                            
                        </View>

                        
                        
                        <TouchableOpacity 
                            onPress={() => props.navigation.navigate("ArtistProfilePage")} 
                            style={Style.buttonView}>
                            <Text style={Style.explainText}>Continue to your new profile</Text>                                    
                        </TouchableOpacity>
                    </View>
                )
            }
        </ImageBackground>
    )
}


export const screenOptions = navData => {
    return {        
        gestureEnabled: false,
        headerShown: false,
    }
}

export default CreatArtistScreen;