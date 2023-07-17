import React, { useState, useEffect, useCallback } from 'react';
import { 
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Modal, Platform, Image,
    ActivityIndicator,Avatar,
    KeyboardAvoidingView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import baseIpRequest from '../ServerDev';
import Colors from '../Utitilities/AppColors';
import Style from './Style/EditRegularUserStyle';
import { FlatList } from 'react-native-gesture-handler';
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import { checkDob, checkPhoneNumber } from '../Authentication/checkFileds';
import ModalStyle from '../Authentication/style/ModalStyle';
import { getUserDataAction } from '../../store/actions/userActions';
import { updateRegularProfile } from '../ApiCalls';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const EditRegularUserScreen = props => {
    const dispatch = useDispatch();
    const userDataSelector = useSelector(state => state.UserReducer);
    const userAvatar = userDataSelector?.UserReducer?.account?.Avatar;
    const userEmail = userDataSelector?.UserReducer?.account?.email;
    const userPhoneNumber = userDataSelector?.UserReducer?.account?.mobile;
    const [show, setShow] = useState(false);
    const[birthDate, setBirthDate] = useState(new Date(userDataSelector?.UserReducer?.account?.dob));
    const [firstName, setFirstName] = useState(userDataSelector?.UserReducer?.account?.firstName);
    const [lastName, setLastName] =  useState(userDataSelector?.UserReducer?.account?.lastName);
    const [isClicked, setIsClicked] = useState(false);
    const [phoneNmber, setPhoneNumber] = useState(userPhoneNumber?.substring(3,userPhoneNumber?.length));
    const [digits3, setDigits3] = useState(userPhoneNumber?.substring(0,3));
    const [image, setImage] = useState(userAvatar);
    const [isVisible, setIsVisble] = useState(false);
    const [systemMessage, setSystemMessage] = useState('');
    const [updateStatus, setUpdateStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

   

    function onDateSelected(event, value) {
        const currentDate = value || birthDate;
        setBirthDate(currentDate);
        setShow(false);
    };
    
    const phone3DigitsList = [
        {label: '050',value: '050'},
        {label: '051',value: '051'},
        {label: '052',value: '052'},
        {label: '053',value: '053'},
        {label: '054',value: '054'},
        {label: '058',value: '058'},
    ]

    const isFiledFull = () => {
        if(firstName.length < 2 || 
            lastName.length < 2 ||
             digits3 == '' ||
              phoneNmber == '' ||
               birthDate.getFullYear() >
             2018) {                                
                return false;
            } else {
                return true;
            }
    }
    

    const HandleFileUpload = async () => {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(storage, "RegularUserProfileImages/" +
         `${image.split("/")[image.split("/").length - 1]}`);
        const uploadFile = await uploadBytes(imageRef, blob);
        return getDownloadURL(uploadFile.ref);
    }

    let selectImageFromGallery = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("We need Your permmission to open your media library");
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        !pickerResult.cancelled && setImage(pickerResult.uri);
    };

    const updateAccount = async () => {
        setIsClicked(true);
        const dobCheck = birthDate.getFullYear() < 2018;
        const mobileCheck = digits3.length == 3 && phoneNmber.length == 7;
        console.log(dobCheck, mobileCheck);
        if(!dobCheck || !mobileCheck) {
            return;
        }
        const detailsToUpdate = {
            firstName: firstName,
            lastName: lastName,
            Avatar: userAvatar,
            dob: birthDate,
            mobile: digits3 + phoneNmber
        }
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
        if(userToken) {
            if(image != userAvatar) {
                setIsLoading(true);
                setIsVisble(true);
                await HandleFileUpload()
                .then(result => {
                    detailsToUpdate.Avatar = result;
                    updateRegularProfile(dispatch,userToken, detailsToUpdate)
                    .then(result => {
                        setIsLoading(false);
                        setUpdateStatus(true);
                        setSystemMessage('Your account was updated successfully');
                        setIsVisble(true);
                    })
                    .catch(error => {
                        setSystemMessage(error.message);
                        setIsVisble(true);
                    })
                }).catch(error => {
                    console.log(error);
                })
            }
            else {
                updateRegularProfile(dispatch,userToken, detailsToUpdate)
                    .then(result => {
                        setUpdateStatus(true);
                        setSystemMessage('Your account was updated successfully');
                        setIsVisble(true);
                    })
                    .catch(error => {
                        setSystemMessage(error.message);
                        setIsVisble(true);
                    })
            }
        }
        
        
        
        
        
    }
    

    const returnBackAfterUpdate = () => {
        if(!updateStatus) {
            setIsVisble(false);
            return;
        }
        setIsVisble(false);
        props.navigation.goBack(null);
    }
    
    return (
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
                        <View style={ModalStyle.errorMessageContentView}>
                            {
                                isLoading?
                                (
                                    <View>
                                        <ActivityIndicator  color="#000"/>
                                        <Text style={ModalStyle.errorMessegText}>
                                            Uploading your new profile picture ....
                                        </Text>
                                    </View>
                                )
                                :
                                (
                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                        <MaterialIcons
                                            name="error"
                                            color="#000"
                                            size={20}
                                        />
                                        <Text style={ModalStyle.errorMessegText}>{systemMessage}</Text>
                                        <View style={ModalStyle.line}></View>
                                        <TouchableOpacity onPress={returnBackAfterUpdate}>
                                            <Text style={{fontFamily:'Baloo2-Medium'}}>OK</Text>
                                        </TouchableOpacity> 
                                    </View>
                                )
                            }
                        </View>         
                    </View>
                </Modal>
            </View>
                <TouchableOpacity 
                    onPress={() => props.navigation.goBack(null)}
                    style={{
                        position: 'absolute',
                        top:45,
                        left:20
                    }}>
                    <FontAwesome5
                        name='arrow-left'
                        size={20}
                        color={'#fff'}
                    />
                </TouchableOpacity>
            <View 
                style={{
                    width:'100%',
                    top:80,
                    flexDirection:'row',
                    padding:10,
                    backgroundColor:Colors.grey4,
                    justifyContent:'space-between'
                }}>
                <View style={{height:70, width:'20%'}}>
                    <Image
                        source={{uri:image}}
                        style={{width:70, height:70, borderRadius:50}}
                    />
                    <TouchableOpacity 
                        onPress={selectImageFromGallery}
                        style={{
                            width:25,
                            height:25,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor:Colors.grey7,
                            borderRadius:50,
                            left:55,
                            bottom:70
                        }}
                    >
                        <MaterialIcons
                            name='edit'
                            size={15}
                            color={'#fff'}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{width:'80%', padding:10, justifyContent:'center'}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{fontFamily:'Baloo2-Bold', color:Colors.red3, fontSize:15}}>Email: </Text>
                        <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>{userEmail}</Text>
                    </View>
                </View>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS == 'android' && 'padding'} style={{width:'100%', height:'80%', top:80}}>
                <View style={Style.rowContainer}>
                    <View style={Style.queryContainer}>
                        <View style={Style.QueryTitleContainer}>
                            <Text style={Style.QueryTitle}>
                                First Name
                            </Text>                            
                        </View>
                        <TextInput
                            style={Style.queryInput}
                            value={firstName}
                            onChangeText={text => setFirstName(text)}
                            returnKeyType='done'
                        />
                    </View>
                        
                    <View style={Style.queryContainer}>
                        <View style={Style.QueryTitleContainer}>
                            <Text style={Style.QueryTitle}>
                                Last Name
                            </Text>                            
                        </View>
                        <TextInput
                            style={Style.queryInput}
                            value={lastName}
                            onChangeText={text => setLastName(text)}
                            returnKeyType='done'
                        />
                    </View>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={Style.queryContainer}>
                            <View style={Style.QueryTitleContainer}>
                                <Text style={Style.QueryTitle}>
                                    Birth Date
                                </Text>                            
                            </View>
                            <TextInput
                                style={Style.queryInput}
                                editable={false}
                                value={birthDate.toLocaleDateString()}
                            />
                        </View>

                        <TouchableOpacity style={Style.calnderBtn} onPress={() => setShow(true)}>
                            <FontAwesome
                                name="calendar"
                                size={20}
                                color='#fff'
                            />
                        </TouchableOpacity>
                    </View>
                    {
                            show && (
                                <View style={
                                    Platform.OS == 'ios'? 
                                    {
                                        width: '100%', 
                                        flexDirection:'row-reverse'
                                    }
                                    :
                                    {}
                                }>
                                <View 
                                    style={
                                        Platform.OS == 'ios'?
                                        {
                                            width:110,
                                            height:35,
                                            borderRadius:50,
                                            justifyContent:'center',
                                            alignItems:'center',
                                            backgroundColor:Colors.grey3
                                        }
                                        :
                                        {}
                                    }
                                >
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={birthDate}
                                    mode={'date'}
                                    is24Hour={true}
                                    display='default'
                                    onChange={onDateSelected} 
                                    style={{width:100, height:80}}
                                                      
                                />
                                </View>
                                </View>
                            )
                    }

                        <View style={{marginLeft:30}}>
                            { isClicked && checkDob(birthDate)}
                        </View>

                    <View style={Style.queryPhoneContainer}>
                        <View style={Style.QueryTitleContainer}>
                            <Text style={Style.QueryTitle}>
                                Phone Number
                            </Text>                            
                        </View>
                        
                        <RNPickerSelect
                            placeholder={{ label: userPhoneNumber.substring(0,3), value: '' }}
                            style={{
                                inputIOS:{color:Colors.red1, fontFamily:'Baloo2-Bold', fontSize:15},
                                inputIOSContainer:{backgroundColor: Colors.grey3, width:50, alignItems: 'center',
                                height:'100%', justifyContent: 'center'},
                                inputAndroid:{color:Colors.red1, fontFamily:'Baloo2-Bold', fontSize:15},
                                inputAndroidContainer:{backgroundColor: Colors.grey3, width:52, alignItems: 'center',
                                height:'100%', justifyContent: 'center'},  
                                                                    
                            }}  
                            useNativeAndroidPickerStyle={false}                              
                            allowFontScaling={false} 
                            onValueChange={(value) => setDigits3(value)}
                            items={phone3DigitsList}
                        />
                        
                        <TextInput
                            style={Style.queryPhoneInput}
                            value={phoneNmber}
                            onChangeText={text => setPhoneNumber(text)}
                            keyboardType='numeric'
                            returnKeyType='done'
                        />                            
                    </View>
                    <View style={{marginLeft:30}}>
                        {isClicked && checkPhoneNumber(digits3, phoneNmber)}   
                    </View>


                    <View style={{
                        width:'100%',
                        height:130,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        top:50
                    }}>
                        {
                            isFiledFull() ?
                            (
                                <TouchableOpacity 
                                    onPress={updateAccount}
                                    style={{
                                        padding:10,
                                        borderWidth:2,
                                        borderRadius:50,
                                        borderColor:'#fff',
                                        backgroundColor:Colors.red3
                                    }}
                                >
                                    <Text style={{fontFamily:'Baloo2-Bold', color:'#fff'}}>
                                        Update your Account
                                    </Text>
                                </TouchableOpacity>
                            )
                            :
                            (
                                <View 
                                    style={{
                                        padding:10,
                                        borderWidth:2,
                                        borderRadius:50,
                                        borderColor:'#fff',
                                        backgroundColor:Colors.red3,
                                        opacity:0.7
                                    }}>
                                    <Text style={{fontFamily:'Baloo2-Bold', color:'#fff'}}>
                                        Update your Account
                                    </Text>
                                </View>
                            )
                        }                        
                    </View>
            </KeyboardAvoidingView>

            

        </ImageBackground>
    )
}



export const screenOptions = navData => {
    return {
        headerShown: false,
        tabBarLabel:'Edit Regular User',
        gestureEnabled: false,
    }
}


export default EditRegularUserScreen;