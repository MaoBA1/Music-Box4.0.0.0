import React, { useState, useEffect, useCallback } from 'react';
import { 
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Modal, Platform,
} from 'react-native';
import Style from './style/SignUpStyle';
import ModalStyle from './style/ModalStyle';
import Colors from '../Utitilities/AppColors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from 'react-native-picker-select';
import * as Check from './checkFileds';
import baseIpRequest from '../ServerDev';


const SignUpScreen = props => {
    const [show, setShow] = useState(false);
    const defaultDate = new Date(Date.now());
    defaultDate.setFullYear(defaultDate.getFullYear() - 10)
    const[birthDate, setBirthDate] = useState(defaultDate);
    const [phoneNmber, setPhoneNumber] = useState('');
    const [digits3, setDigits3] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordBackUp, setPasswordBackUp] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] =  useState('');
    const [isClicked, setIsClicked] = useState(false);
    const [isVisible, setIsVisble] = useState(false);
    const [systemMessage, setSystemMessage] = useState('');
    

    const signUpDetails = {
        email: email,
        password: password,
        firstName: firstName.length > 0 ? firstName[0].toUpperCase() + firstName.substring(1,firstName.length) : firstName, 
        lastName: lastName.length > 0 ? lastName[0].toUpperCase() + lastName.substring(1,lastName.length) : lastName,
        dob: birthDate.toLocaleDateString(),
        mobile: digits3 + phoneNmber,
    }
    

    function onDateSelected(event, value) {
        const currentDate = value || birthDate;
        setBirthDate(currentDate);
        // setShow(false);
    };

    const isFiledFull = () => {
        if(email == '' || password == '' || firstName.length < 2 || lastName.length < 2
            || passwordBackUp == '' || digits3 == '' || phoneNmber == '' || birthDate.getFullYear() > 2018) {                                
                return false;
            } else {
                return true;
            }
    }

    const signUp = async() => {
        setIsClicked(true);
        const emailCheck = email.includes('@') && email.includes('.com') && email.indexOf('@') < email.indexOf('.com');
        const dobCheck = birthDate.getFullYear() < 2018;
        const mobileCheck = digits3.length == 3 && phoneNmber.length == 7;
        const passCheck = password.length >= 8;
        const passBackUpCheck = password == passwordBackUp;
        
        if(emailCheck && dobCheck && mobileCheck && passCheck && passBackUpCheck) {            
            const response = await fetch(baseIpRequest.ServerAddress + '/accounts/creatAccount', {
                method:'POST',
                headers:{
                    'Content-type': 'application/json',                    
                },
                body: JSON.stringify(signUpDetails)
            })   
            const data = await response.json();
            console.log(data);
            if(!data.status) {
                setSystemMessage(data.message)
                setIsVisble(true);
            } else {
                props.navigation.navigate('Verification', {user:data});
            }
            
        }
    }

    const phone3DigitsList = [
        {label: '050',value: '050'},
        {label: '051',value: '051'},
        {label: '052',value: '052'},
        {label: '053',value: '053'},
        {label: '054',value: '054'},
        {label: '058',value: '058'},
    ]
    
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
                    </View>
                </Modal>
            </View>

            <KeyboardAwareScrollView 
                style={Style.keyboardContainer}
                resetScrollToCoords={{ x: 0, y: 0 }}
                extraHeight={125}
                scrollEnabled={true}
            >
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
                        />
                    </View>

                    <View style={Style.queryContainer}>
                        <View style={Style.QueryTitleContainer}>
                            <Text style={Style.QueryTitle}>
                                Email
                            </Text>                            
                        </View>
                        <TextInput
                            style={Style.queryInput}
                            value={email}
                            onChangeText={text => setEmail(text)}
                        />
                    </View>
                        <View style={{marginLeft:30}}>
                            { isClicked && Check.checkEmail(email)}
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

                        <TouchableOpacity style={Style.calnderBtn} onPress={!show? () => setShow(true) : () => setShow(false)}>
                            {!show?(<FontAwesome5
                                name="calendar"
                                size={20}
                                color='#fff'
                            />) : (<FontAwesome
                                name="close"
                                size={20}
                                color='#fff'
                            />)}
                        </TouchableOpacity>
                    </View>
                    {
                            show && (
                                <View style={Platform.OS == 'ios'? {width: '100%', flexDirection:'row-reverse'} : {}}>
                                <View style={
                                    Platform.OS == 'ios'?
                                    {width:110, height:35, borderRadius:50, justifyContent:'center',alignItems:'center', backgroundColor:Colors.grey3}:
                                {}}>
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
                            { isClicked && Check.checkDob(birthDate)}
                        </View>
                        
                        <View style={Style.queryPhoneContainer}>
                            <View style={Style.QueryTitleContainer}>
                                <Text style={Style.QueryTitle}>
                                    Phone Number
                                </Text>                            
                            </View>
                            
                            <RNPickerSelect
                                placeholder={{ label: '- - -', value: '' }}
                                style={{
                                    inputIOS:{color:Colors.red1, fontFamily:'Baloo2-Bold', fontSize:15},
                                    inputIOSContainer:{backgroundColor: Colors.grey3, width:50, alignItems: 'center',
                                    height:'100%', justifyContent: 'center'},
                                    inputAndroid:{color:Colors.red1, fontFamily:'Baloo2-Bold', fontSize:15},
                                    inputAndroidContainer:{backgroundColor: Colors.grey3, width:50, alignItems: 'center',
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
                            />                            
                        </View>
                            <View style={{marginLeft:30}}>
                                 {isClicked && Check.checkPhoneNumber(digits3, phoneNmber)}   
                            </View>
                        <View style={Style.queryContainer}>
                                <View style={Style.QueryTitleContainer}>
                                    <Text style={Style.QueryTitle}>
                                        Password
                                    </Text>                            
                                </View>
                                <TextInput
                                    style={Style.queryInput}
                                    value={password}
                                    onChangeText={text => setPassword(text)}
                                    secureTextEntry={true}
                                />
                        </View>
                            <View style={{marginLeft:30}}>
                                { isClicked && Check.checkPassword(password)}
                            </View>
                        <View style={Style.queryContainer}>
                                <View style={Style.QueryTitleContainer}>
                                    <Text style={Style.QueryTitle}>
                                        Confirm Pass
                                    </Text>                            
                                </View>
                                <TextInput
                                    style={Style.queryInput}
                                    value={passwordBackUp}
                                    onChangeText={text => setPasswordBackUp(text)}
                                    secureTextEntry={true}
                                />
                        </View>
                            <View style={{marginLeft:30}}>
                                { isClicked && Check.checkPasswordBackUp(password, passwordBackUp)}
                            </View>
                </View>

                <View style={{alignItems: 'center', justifyContent: 'center', height:100}}>
                    <View>
                        {
                            isFiledFull() == true?
                            (
                                <TouchableOpacity onPress={signUp} style={Style.signUpBtn}>
                                    <Text style={Style.signUpBtnText}>Sign me up!</Text>
                                </TouchableOpacity>
                            )
                            :
                            (
                                <View style={{opacity:0.5}}>
                                    <View style={Style.signUpBtn}>
                                        <Text style={Style.signUpBtnText}>Sign me up!</Text>
                                    </View>
                                </View>
                            )
                        }
                        
                    </View>
                </View>
                
            </KeyboardAwareScrollView>            
        </ImageBackground>
        
    )
}


export const screenOptions = () => {
    return {
        headerTitle:'Register',
        headerShown: true,
        gestureEnabled:false,        
    }
}

export default SignUpScreen;