import React, { useState, useEffect } from 'react';
import { 
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Modal, Platform,
    ActivityIndicator,
    KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import Style from './style/LoginStyle';
import ModalStyle from './style/ModalStyle';
import Colors from '../Utitilities/AppColors';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { loginAction } from '../../store/actions/userActions';
import { getAllAppGeners, getPosts, getArtists, getUserData } from '../ApiCalls';


const LoginScreen = props => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisble] = useState(false);
    const [systemMessage, setSystemMessage] = useState('');
    

    const login = async() => {
        if(email == '' || password == '') {
            setSystemMessage('You must provide email and password!');
            setIsVisble(true);
            return;
        }
        
        let action = loginAction({email:email.toLocaleLowerCase(),password});
        await dispatch(action)
        .then(result => {
            if(result) {
                console.log(result);
                setUserToken(result.token, result.isItFirstUse)
            }
        })
        .catch(error => {
            setIsVisble(true);
            setSystemMessage(error.message);
        })
    }

    const setUserToken = async(token, isItFirstUse) => {
        try{
            const jsonToken = JSON.stringify(token);
            const jsonIsItFirstUse = JSON.stringify(isItFirstUse);
            await AsyncStorage.setItem('Token', jsonToken)
            await AsyncStorage.setItem('IsItFirstUse', jsonIsItFirstUse) 
            GetUserToken();
        } catch(error) {
            console.log(error);
        }
    }
    
    const GetUserToken = async() => {
        const jsonToken = await AsyncStorage.getItem('Token');        
        const jsonIsItFirstUse = await AsyncStorage.getItem('IsItFirstUse');  
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
        const isItFirstUse = jsonIsItFirstUse !=null ? JSON.parse(jsonIsItFirstUse) : null;
        if(userToken != null) {
            setIsLoading(true);
            getPosts(dispatch, userToken);
            getArtists(dispatch, userToken);
            getUserData(dispatch, userToken);
            console.log(isItFirstUse);
            setTimeout(() => {
                setIsLoading(false);
                if(isItFirstUse == false) {
                    props.navigation.navigate('OverView');              
                } else {
                    props.navigation.navigate('firstUseStack');
                }
                
            },3000)
        } 
    }

    
    useEffect(() => {
        getAllAppGeners(dispatch);
        GetUserToken();
    },[dispatch])
    
    
    
    

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
           
               <View style={Style.mainContainer}>
                   {
                    isLoading?
                    (
                        <ActivityIndicator size="large" color={Colors.red1}/>
                    )
                    :
                    (
                        <View style={Style.mainContainer}>
                            <View style={{margin:10}}>
                                <Text style={Style.title}>Welcome</Text>
                            </View>

                            <KeyboardAvoidingView
                                behavior={Platform.OS == 'ios' && 'height'}
                                
                            >
                                <View style={Style.textInputContainer}>
                                    <View style={Style.inputIconContainer}>
                                    <Fontisto
                                            name='email'
                                            color={Colors.grey3}
                                            size={25}
                                        />
                                    </View>
                                    <TextInput
                                        value={email}
                                        onChangeText={text => setEmail(text)}
                                        style={Style.textInput}
                                        placeholder="Email"                          
                                        />
                                </View> 

                                <View style={Style.textInputContainer}>
                                    <View style={Style.inputIconContainer}>
                                        <Feather
                                            name='lock'
                                            color={Colors.grey3}
                                            size={25}
                                        />
                                    </View>
                                    <TextInput
                                        value={password}
                                        onChangeText={text => setPassword(text)}
                                        style={Style.textInput}
                                        placeholder="Password"                          
                                        secureTextEntry={true}
                                        />
                                </View>
                            </KeyboardAvoidingView>
                            <TouchableOpacity onPress={()=> props.navigation.navigate('ForgetPassword')}>
                                <Text style={Style.forgetPasswoedTxt}>Forget Password</Text>
                            </TouchableOpacity>  
                            <View style={{margin:20}}>
                            <TouchableOpacity onPress={login} style={Style.loginBtn}>
                                <Text style={Style.loginBtnText}>Login</Text>
                            </TouchableOpacity>
                            </View>
                            <View style={{alignItems:'center'}}>
                            <Text style={Style.isAuthQuestTxt}>Not Registerd Yet?</Text>
                            <TouchableOpacity onPress={()=> props.navigation.navigate('SignUp')}>
                                <Text style={Style.signupBtnTxt}>Sign Up</Text>
                            </TouchableOpacity>
                            </View> 
                        </View>
                    )
                   }            
               </View>            
           
            </ImageBackground>
        
    )
    
}


export const screenOptions = navData => {
    return {
        headerShown: false,        
    }
}

export default LoginScreen;

