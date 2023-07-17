import React, { useState, useEffect } from 'react';
import { 
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Platform, Keyboard,
    KeyboardAvoidingView, Image,
    TouchableWithoutFeedback,
    SafeAreaView,
    ScrollView,
    Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import Style from './Style/CommentStyle';
import Colors from '../Utitilities/AppColors';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import CommentItem from '../components/CommentItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { giveCommentToPost , getPosts, getArtistPostsById } from '../ApiCalls';
import { Avatar, Input } from 'react-native-elements';
import { FlatList } from 'react-native';


const CommentScreen = ({navigation, route}) => {
    const flatListRef = React.useRef();
    const dispatch = useDispatch();
    const userDataSelector = useSelector(state => state.UserReducer);
    const user = userDataSelector?.UserReducer?.message;
    const post = route?.params?.params?.post || route?.params?.post;
    const postAuthorId = route?.params?.params?.post?.postAuthorId || route?.params?.post?.postAuthorId;
    const postAuthorName = route?.params?.params?.postAuthor || route?.params?.postAuthor;
    const postAuthorImage = route?.params?.params?.postAuthorImage || route?.params?.postAuthorImage;    
    let commentsSelector = useSelector(state => state.Post?.postCommentReducer);
    const [commentText, setCommentText] = useState('');
    const [keyboardStatus, setKeyboardStatus] = useState(undefined);
    
    const getFormattedFulName = (firstName, lastName) => {
        const formatted_fname = `${firstName[0].toUpperCase()}${firstName.slice(1)}`;
        const formatted_lname = `${lastName[0].toUpperCase()}${lastName.slice(1)}`;
        return formatted_fname + " " + formatted_lname;
    }
    
  

    const sendComment = async() => {
        Keyboard.dismiss();
        try{
            const jsonToken = await AsyncStorage.getItem('Token');
            const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
            if(userToken) {
                await giveCommentToPost(dispatch, userToken, post._id, commentText);
                await getPosts(dispatch, userToken);
                await getArtistPostsById(dispatch, userToken, postAuthorId);
                setCommentText('');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <ImageBackground 
                source={ require('../../assets/AppAssets/Logo.png') }
                resizeMode="cover" 
                style={Style.backgroundContainer}
                imageStyle={{opacity: 0.3}}
        >
            
            
                <SafeAreaView style={{flex:1, backgroundColor:Colors.grey1}}>
                <KeyboardAvoidingView
                    behavior="height"
                    keyboardVerticalOffset={ Platform.OS === "ios" ? 100 : 90 }
                    style={{flex:1}}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <>
                        <View style={{
                            height:80,
                            backgroundColor:Colors.grey4,
                            flexDirection:'row',
                            alignItems: 'center',
                            paddingVertical: 15,
                            
                        }}>
                            <View style={{ marginLeft:5, borderWidth:1, borderRadius:50, borderColor:Colors.red3 }}>
                                <Avatar
                                    rounded
                                    source={{uri:postAuthorImage}}
                                />
                            </View>
                            <View style={{ alignItems:"flex-start", marginLeft: 10 }}>
                                <Text style={{ fontFamily:'Baloo2-Medium', color: Colors.red3}}>{postAuthorName}</Text>
                                <Text style={{ fontFamily:'Baloo2-Regular', color:'#fff'}}>{post?.postContent}</Text>
                            </View>
                        </View>
                        
                        <FlatList 
                            data={commentsSelector?.sort((a, b) => (new Date(b.commentCreatAdt) - new Date(a.commentCreatAdt)))}
                            keyExtractor={item => item._id}
                            renderItem={({item, index}) => 
                                <View
                                    style={{
                                        width:"100%",
                                        borderBottomWidth:1,
                                        borderTopWidth:1,
                                        borderColor: Colors.grey3,
                                        backgroundColor:Colors.grey4,
                                        padding:10,
                                        flexDirection:'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <View style={{ 
                                        borderWidth:1.2, 
                                        borderColor:Colors.grey3,
                                        borderRadius:50
                                    }}>
                                        <Avatar
                                            rounded
                                            source={{uri: item.accountImage}}
                                        />
                                    </View>
                                    <View style={{flex:1, flexDirection: 'row', justifyContent: "space-between"}}>
                                        <View style={{ width:"75%" }}>
                                            <Text style={{ marginLeft:10, color:'#ffffff', fontFamily:'Baloo2-Regular' }}>{getFormattedFulName(item.accountFirstName, item.accountLastName)}</Text>
                                            <Text style={{ marginLeft:10, color: Colors.grey6, fontFamily:'Baloo2-Regular' }}>{item.comment}</Text>
                                        </View>
                                        <View style={{
                                            justifyContent: "flex-end",
                                            alignItems: "center"
                                        }}>
                                            <Text style={{ fontFamily:'Baloo2-Regular', color: Colors.grey3}}>
                                                {new Date(item.commentCreatAdt).toLocaleDateString()}
                                            </Text>
                                            <Text style={{ fontFamily:'Baloo2-Regular', color: Colors.grey3}}>
                                                {new Date(item.commentCreatAdt).toLocaleTimeString().split(':').slice(0,2).join(':')}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            }
                        />
                            

                        
                            <View style={{
                                flexDirection:'row',
                                alignItems: 'center',
                                justifyContent: "space-between",
                                width: '100%',
                                backgroundColor:Colors.grey4,
                                paddingHorizontal:10, 
                                bottom:-5
                            }}>
                                <View style={{
                                    width:"90%",
                                    height:40,
                                    alignItems: 'center',
                                    justifyContent: "center",
                                    
                                }}>
                                    <Input
                                        placeholder="Comment..."
                                        style={{
                                            bottom:-10,
                                            flex:1,
                                            marginRight: 15,
                                            paddingHorizontal:10,
                                            color:"grey",
                                            borderRadius:30,
                                            fontFamily:'Baloo2-Bold',
                                            fontSize:14
                                        }}
                                        
                                        autoCorrect={false}
                                        value={commentText}
                                        onChangeText={text => setCommentText(text)}
                                        onSubmitEditing={!commentText.length === 0 && sendComment}
                                    />
                                </View>
                                <TouchableOpacity style={{ marginRight: 10 }} disabled={commentText.length === 0} onPress={sendComment}>
                                    <Ionicons name="send" size={24} color={Colors.red3}/>
                                </TouchableOpacity>
                            </View>
                        </>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    )
}

export const screenOptions = ({ navigation }) => {
    return {
        title:'Comments',
        headerStyle:{backgroundColor:Colors.grey1, borderBottomWidth:2, borderBottomColor:Colors.grey3},
        headerTitleStyle:{
            color:"#FFFFFF",
            fontFamily:"Baloo2-ExtraBold",
            fontSize:25
        },
        headerTitleAlign: 'center',
        headerLeft: () => {
            return <TouchableOpacity onPress={navigation.goBack} style={{ marginLeft:10 }}>
                <AntDesign name="arrowleft" size={24} color="#ffffff"/>
            </TouchableOpacity>
        },
    }
}


export default CommentScreen;
    

