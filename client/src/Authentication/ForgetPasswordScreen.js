import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Modal ,KeyboardAvoidingView} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ModalStyle from './style/ModalStyle';
import Colors from '../Utitilities/AppColors';
import Style from './style/ForgetPasswordStyle';
import {checkEmail} from './checkFileds'
import baseIpRequest from '../ServerDev';




const ForgetPassword = props => {
    const [email, setEmail] = useState('');
    const [isVisible1, setIsVisble1] = useState(false);
    const [isVisible2, setIsVisble2] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [systemMessage, setSystemMessage] = useState('');

    const forgetPassword = async() => {
        const check = email.includes('@') && email.includes('.com') && email.indexOf('@') < email.indexOf('.com');
        setIsVisble1(false);
        setIsClicked(true);
        
        if(check) {            
            const response = await fetch( baseIpRequest.ServerAddress + '/accounts/forgetPassword', {
                method:'POST',
                headers:{
                    'Content-type': 'application/json',                    
                },
                body: JSON.stringify({email:email.toLocaleLowerCase()})
            }) 
            const data = await response.json(); 
            if(data.status) {
                props.navigation.navigate('Verification', {user:data});
            } else {
                setSystemMessage(data.message)
                setIsVisble2(true);
            }
        }
    }

    const reset = () => {
        if(!isClicked){
            setIsVisble1(true);
        } else {
            forgetPassword();
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
                    <View>                            
                        <Modal
                            animationType="fade"
                            visible={isVisible1} 
                            transparent={true}                                        
                        >
                            <View style={ModalStyle.errorMessageView}>
                                <View style={ModalStyle.errorMessageContentView}>
                                    <Text style={ModalStyle.errorMessegText}>
                                        Are you sure you want to reset your password?
                                    </Text>
                                    <View style={ModalStyle.line}></View>
                                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                                        <TouchableOpacity onPress={forgetPassword} 
                                        style={{marginTop:10, width:'50%', alignItems: 'center'}}>
                                            <Text style={{fontFamily:'Baloo2-Medium'}}>OK</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity style={{alignItems: 'center', marginTop:10, width:"50%"}}
                                         onPress={() => setIsVisble1(false)}>
                                            <Text style={{fontFamily:'Baloo2-Medium'}}>Cencel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>                
                            </View>
                        </Modal>
                    </View>
             </View>
             

             <View>                            
                <Modal
                animationType="fade"
                visible={isVisible2} 
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
                            <TouchableOpacity onPress={() => setIsVisble2(false)}>
                                <Text style={{fontFamily:'Baloo2-Medium'}}>OK</Text>
                            </TouchableOpacity>
                        </View>                
                    </View>
                </Modal>
            </View>



            <KeyboardAvoidingView behavior='height' style={{flex:1, width:'100%', height:'100%'}}>
                <View style={Style.mainContainer}>
                    <View style={Style.subtitleView}>
                        <Text style={Style.subtitleText}>Input your email address</Text>
                        <Text style={Style.subtitleText}>that associated with you'r account</Text>
                    </View>
                    <View style={Style.textInputView}>
                        <View style={{width:'15%', alignItems: 'center', justifyContent: 'center'}}>
                            <Fontisto
                                name='email'
                                color={Colors.grey3}
                                size={25}
                            />
                        </View>
                        <TextInput
                            style={Style.textInput}
                            placeholder="Email"
                            value={email}
                            onChangeText={text => setEmail(text)}
                        />
                    </View>
                    {isClicked && checkEmail(email)}
                    {
                        email == ''?
                        (
                            <View style={{opacity:0.7}}>
                                <View style={Style.button}>
                                    <Text style={Style.btnText}>Send</Text>
                                </View>
                            </View>
                        )
                        :
                        (
                            <TouchableOpacity onPress={reset} style={Style.button}>
                                <Text style={Style.btnText}>Send</Text>
                            </TouchableOpacity>
                        )
                    }
                    
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    )
}


export const screenOptions = navData => {
    return {
        headerTitle:'Forget Password',
        headerShown: true,
        gestureEnabled:false,          
    }
}

export default  ForgetPassword;