import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import Style from '../Authentication/style/ResetPasswordStyle';
import Colors from '../Utitilities/AppColors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import baseIpRequest from '../ServerDev';
import { checkPassword, checkPasswordBackUp } from './checkFileds';







const ResetPasswordScreen = props => {
    const user = props.route.params.user.user;
    const firstName = user.firstName;
    const formattedUserFirstName = firstName[0].toUpperCase() + firstName.substring(1,firstName.length);
    const [isPasswordReset, setIsPasswordReset] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordBackUp, setPasswordBackUp] = useState('');
    const [isClicked, setIsClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const formatted_user = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        formatted_password: user.password,
        mobile: user.mobile,
        dob: user.dob,
        passcode: user.passcode,        
    }

    const resetPassword = async () => {
        setIsClicked(true);
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/updatePassword', {
                method:'POST',
                headers:{
                    'Content-type': 'application/json',                    
                },
                body: JSON.stringify({email:formatted_user.email, password})
        }) 
        const data = await response.json();
        if(data.status){
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                setIsPasswordReset(true);
            },3000)
        }
    }

    return(
        <ImageBackground 
            source={ require('../../assets/AppAssets/Logo.png') }
            resizeMode="cover" 
            style={Style.backgroundContainer}
            imageStyle={{opacity: 0.3}}
        >

            {
                isPasswordReset?
                (
                    <View style={Style.mainContainer}>
                        <AntDesign
                            name="like1"
                            size={50}
                            color={Colors.red3}                                    
                        />
                        <View style={{width:300, alignItems: "center", marginBottom:30}}>                                            
                            <Text style={Style.explainText}>Your password has been successfully changed</Text>
                        </View>
                        <TouchableOpacity onPress={() => props.navigation.navigate("Login")} style={Style.buttonView}>
                            <Text style={Style.explainText}>Back To Login</Text>
                        </TouchableOpacity>  
                    </View>
                )
                : 
                (
                    <View style={Style.mainContainer}>
                            <View style={{alignItems:'center', marginBottom:30}}>
                                <Text style={Style.subTitleText}>Create a new password</Text>
                                <Text style={Style.explainText}>- Password must be atlist 8 charcters</Text>
                                <Text style={Style.explainText}>
                                    - A strong password is a combination{'\n'}  of letters, numbers and punctuation
                                </Text>
                            </View>
                            <KeyboardAvoidingView>
                                <View style={{width:'100%', alignItems:'center', margin:10}}>
                                    <View style={Style.ResetPasswordTextInputView}>
                                        <Feather
                                            name='lock'
                                            color={Colors.grey3}
                                            size={25}
                                        />
                                        <TextInput
                                            value={password}
                                            onChangeText={text => setPassword(text)}
                                            style={Style.textInputView}                    
                                            placeholder="Password"
                                            placeholderTextColor={Colors.red3}
                                            secureTextEntry={true}
                                            editable={!isLoading}
                                        />
                                    </View>
                                </View>
                                {isClicked && checkPassword(password)}
                                <View style={{width:'100%', alignItems:'center', margin:10, marginBottom:20}}>
                                    <View style={Style.ResetPasswordTextInputView}>
                                        <Feather
                                            name='lock'
                                            color={Colors.grey3}
                                            size={25}
                                        />
                                        <TextInput
                                            value={passwordBackUp}
                                            onChangeText={text => setPasswordBackUp(text)}
                                            style={Style.textInputView}                    
                                            placeholder="Confirm Password"
                                            placeholderTextColor={Colors.red3}
                                            secureTextEntry={true}
                                            editable={!isLoading}
                                        />
                                    </View>
                                </View>
                                {isClicked && checkPasswordBackUp(password, passwordBackUp)}
                            </KeyboardAvoidingView>
                            {isLoading && (<ActivityIndicator size={"large"} color={Colors.red3} style={{margin:15}}/>)}
                            {
                                passwordBackUp.length > 0 && password.length > 0?
                                (<TouchableOpacity onPress={resetPassword} style={Style.buttonResetView}>
                                    <Text style={Style.explainText}>Reset</Text>
                                </TouchableOpacity>) :
                                (
                                    <View style={{opacity:0.7}}>
                                        <View style={Style.buttonResetView}>
                                            <Text style={Style.explainText}>Reset</Text>
                                        </View>
                                    </View>
                                )
                            }
                            

                    </View>
                )
            }

        </ImageBackground>
    )
}




export const screenOptions = navData => {
    return {
        headerTitle:'Reset Password',
        headerShown: false,
        gestureEnabled:false,        
    }
}

export default ResetPasswordScreen;