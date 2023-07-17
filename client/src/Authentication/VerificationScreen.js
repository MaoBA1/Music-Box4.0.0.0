import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import Style from './style/VerificationStyle';
import Colors from '../Utitilities/AppColors';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import baseIpRequest from '../ServerDev';

const VarificationScreen = props => {
    const [passcode, setPasscode] = useState('');
    const [verifyStatus, setVerifyStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMesage, setErrorMessage] = useState('');
    const user = props.route.params.user.account;
    console.log(props.route.params.user);
    const formatted_user = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        formatted_password: user.password,
        mobile: user.mobile,
        dob: user.dob,
        passcode: user.passcode,
        inputted_passcode: passcode,
    }
    
    const firstName = user.firstName[0].toUpperCase() + user.firstName.substring(1,user.firstName.length);

    const varify = async () => {         
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/verify', {
                method:'POST',
                headers:{
                    'Content-type': 'application/json',                    
                },
                body: JSON.stringify(formatted_user)
        })   
        const data = await response.json();
        
        if(!data.status) {
            setErrorMessage(data.message);            
        } else {
            setIsLoading(true);            
            setTimeout(() => {                
                setIsLoading(false);
            },3000)
            setVerifyStatus(data.status);
        }
        if(data.statusForgetPassword){
            console.log(data);
            setIsLoading(true);            
            setTimeout(() => {                
                setIsLoading(false);
            },3000)
            props.navigation.navigate("ResetPassword", {user:data});
            
        }        
    } 
    
    setTimeout(() => {
        setIsLoading(false);
    },3000)

    
    return(
        <View style={Style.screenContainer}>
             <ImageBackground 
                source={!isLoading ? require('../../assets/AppAssets/Logo.png') : {uri:'empty'} }
                resizeMode="cover" 
                style={Style.backgroundContainer}
                imageStyle={{opacity: 0.3}}
            >
                {
                    
                    isLoading?
                    (
                        <View style={{flex:1, width:'100%', height:'100%', alignItems:'center', justifyContent: 'center'}}>
                            <ActivityIndicator size={"large"} color={Colors.red3}/>
                        </View>
                    )
                    :
                    (
                        <View style={{alignItems: 'center', width: '100%'}}>
                            <Text style={Style.title}>Verification</Text>
                            <View style={Style.verificationContentView}>
                                {
                                    !verifyStatus?
                                    (
                                        <View>
                                            <View style={Style.verificationMessageView}>
                                                <Text style={Style.explainText}>Hello {firstName}!</Text>
                                                <Text style={Style.explainText}>We sent verification code to</Text>
                                                <Text style={Style.explainText}>the phone number linked to {user.email}</Text>
                                            </View>
                                        
                                            <View style={Style.verificationTextInputView}>
                                                <Feather
                                                    name='lock'
                                                    color={Colors.grey3}
                                                    size={25}
                                                />
                                                <TextInput
                                                    value={passcode}
                                                    onChangeText={text => setPasscode(text)}
                                                    style={Style.textInputView}                    
                                                    placeholder="Verification code"
                                                    placeholderTextColor={Colors.red3}
                                                />
                                            </View>

                                            <View style={{marginLeft:40, marginTop:5}}>
                                                <Text style={Style.noteText}>{errorMesage}</Text>
                                            </View>

                                            <TouchableOpacity onPress={varify} style={{marginLeft:150}}>
                                                <Text style={Style.explainText}>Varify</Text> 
                                            </TouchableOpacity>
                                        </View>
                                    )
                                    :
                                    (
                                        <View style={{alignItems: 'center'}}>
                                            <AntDesign
                                                name="like1"
                                                size={50}
                                                color={Colors.red3}                                    
                                            />
                                            <View style={Style.verificationMessageView}>
                                                <Text style={Style.explainText}>Welcome {firstName} You have been</Text>
                                                <Text style={Style.explainText}> rgisterd seccsesfuly to</Text>
                                                <Text style={Style.explainText}>Music Box!</Text>                                            
                                            </View>

                                            
                                            
                                            <TouchableOpacity onPress={() => props.navigation.navigate("Login")} 
                                            style={Style.buttonView}>
                                                <Text style={Style.explainText}>Back to login</Text>                                    
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }
                            </View> 
                        </View>
                    )
                }
                
            </ImageBackground>
        </View>
    )
}


export const screenOptions = navData => {
    return{
        headerTitle:'Varify',
        headerShown: false,
        gestureEnabled:false
        
    }
};

export default VarificationScreen;