import React, { useEffect, useState, useCallback } from 'react';
import { 
    View,
    TouchableOpacity,
    Keyboard,
    Text,
    Platform
} from 'react-native';
import Colors from '../../../Utitilities/AppColors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db } from '../../../../firebase';
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { useSelector } from 'react-redux';
import { Avatar } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import { ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';


const SingleChatScreen = ({ navigation, route }) => {
    // reciver 
    const userDataSelector = useSelector(state => state.UserReducer);
    const isSuperUser = userDataSelector?.UserReducer?.account?.isSuperUser;
    const artistSelector = useSelector(state => state.ArtistsReducer);
    const artistName = artistSelector?.ArtistDataReducer?.artistName;
    const userFirstName = userDataSelector?.UserReducer?.account?.firstName;
    const userFormattedFirstName = userFirstName && userFirstName[0]?.toUpperCase() + 
    userFirstName?.substring(1,userFirstName?.length);
    const userAvatar = userDataSelector?.UserReducer?.account?.Avatar;
    const artistAvatar = artistSelector?.ArtistDataReducer?.profileImage;
    const reciverName = isSuperUser ? artistName : userFormattedFirstName;
    const reciverId = isSuperUser? artistSelector?.ArtistDataReducer?._id :
    userDataSelector?.UserReducer?.account._id;
    const reciverAvatar = isSuperUser ? artistAvatar : userAvatar;
    
    // contact
    const contactName = route?.params?.contact?.artistName || route?.params?.contact?.name;
    const contactAvatar = route?.params?.contact?.profileImage || route?.params?.contact?.photo;
    const contactId = route?.params?.contact?._id || route?.params?.contact?.id;
    

    // chat configuration
    const chatId = route.params.chatId
    const chatRef = collection(db, "single-chats", chatId, "massages");
    const [input, setInput] = useState("");
    const [ messages, setMessages ] = useState([]);

    useEffect(() => {
        const snap = onSnapshot(chatRef, (snapShot) => {
            setMessages(snapShot.docs.map(doc => ({
                _id: doc.id,
                text: doc.data().message,
                createdAt: doc.data().createdAt,
                user: {
                    _id: doc.data().senderId,
                    name:doc.data().senderName,
                    avatar: doc.data().avatar
                },
            })).sort((a, b) => b.createdAt - a.createdAt))
        })
        
    },[])
    
    const sendMessage = async(m) => {
        Keyboard.dismiss();
        await addDoc( chatRef, {
            message:m.text,
            senderName: reciverName,
            senderId: reciverId,
            createdAt: Date.now(),
            avatar: reciverAvatar
        })
        setInput("");
    }
    
    const onSend = useCallback((messages = []) => {
        sendMessage(messages)
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
      }, [])

    return(
        <View style={{
            flex: 1,
            backgroundColor:Colors.grey1
        }}>
            <GiftedChat
                messages={messages}
                onSend={message => onSend(message)}
                user={{
                    _id: reciverId,
                    name: reciverName,
                    avatar: reciverAvatar,
                }}
                showAvatarForEveryMessage={true}
                render
                renderInputToolbar={
                    () => {
                        return <View style={{
                            flexDirection:"row",
                            backgroundColor: Colors.grey3,
                            top:Platform.OS === "ios" ? 30 : -5,
                            alignItems: "center",
                            height:50
                        }}>
                            <TextInput
                                style={{
                                    backgroundColor:Colors.grey2,
                                    borderRadius:20,
                                    height:30,
                                    width:"85%",
                                    marginLeft:5,
                                    paddingHorizontal:10,
                                    fontFamily:"Baloo2-Bold",
                                }}
                                placeholder="Type a Message...."
                                onSubmitEditing={() => onSend({
                                    _id:0,
                                    avatar: reciverAvatar,
                                    text: input,
                                    senderId: reciverId,
                                    senderName: reciverName,
                                    user:{
                                        _id: reciverId,
                                        name: reciverName,
                                        avatar: reciverAvatar,
                                    }
                                })}
                                value={input}
                                onChangeText={text  => setInput(text)}
                            />
                            <Ionicons 
                                name="ios-send-sharp"
                                color={Colors.red3} 
                                size={28}
                                style={{left:15}}
                                onPress={() => onSend({
                                    _id:0,
                                    avatar: reciverAvatar,
                                    text: input,
                                    senderId: reciverId,
                                    senderName: reciverName,
                                    user:{
                                        _id: reciverId,
                                        name: reciverName,
                                        avatar: reciverAvatar,
                                    }
                                })}
                            />
                        </View>
                    }
                }
                renderBubble={({currentMessage}) => {
                    const userId = currentMessage?.user?._id;
                    const userName = currentMessage?.user?.name;
                    const message = currentMessage?.text;
                    const createdAt = new Date(currentMessage.createdAt).
                    toLocaleTimeString().split(":").slice(0,2).join(":");
                    return createdAt? 
                    (
                        <>
                            {
                                userId === reciverId?
                                (
                                    <View style={{
                                        padding:10,
                                        backgroundColor: Colors.red3,
                                        borderTopLeftRadius:20,
                                        borderTopRightRadius:20,
                                        borderBottomLeftRadius:20
                                    }}>
                                        <Text 
                                            style={{
                                                fontFamily:"Baloo2-Medium",
                                                color:'#fff',
                                                fontSize:15
                                            }}>
                                            {message}
                                        </Text>
                                        <Text 
                                            style={{
                                                fontFamily:"Baloo2-Regular",
                                                color: Colors.grey2,
                                                fontSize:12
                                            }}
                                        >
                                            {createdAt}
                                        </Text>
                                    </View>
                                )
                                :
                                (
                                    <View style={{
                                        padding:10,
                                        backgroundColor: Colors.grey2,
                                        borderTopLeftRadius:20,
                                        borderTopRightRadius:20,
                                        borderBottomRightRadius:20
                                    }}>
                                        <Text 
                                            style={{
                                                fontFamily:"Baloo2-Medium",
                                                color:Colors.grey4,
                                                fontSize:15
                                            }}
                                        >
                                            {message}
                                        </Text>
                                        <Text
                                             style={{
                                                fontFamily:"Baloo2-Regular",
                                                color: Colors.grey3,
                                                fontSize:12
                                            }}>
                                                {createdAt}
                                        </Text>
                                    </View>
                                )
                            }
                        </>
                    )
                    :
                    (
                        <>
                            {
                                userId === reciverId?
                                (
                                    <View style={{
                                        padding:10,
                                        backgroundColor: Colors.red3,
                                        borderTopLeftRadius:20,
                                        borderTopRightRadius:20,
                                        borderBottomLeftRadius:20
                                    }}>
                                        <ActivityIndicator size="small" color={Colors.red3}/>
                                    </View>
                                )
                                :
                                (
                                    <View style={{
                                        padding:10,
                                        backgroundColor: Colors.grey2,
                                        borderTopLeftRadius:20,
                                        borderTopRightRadius:20,
                                        borderBottomRightRadius:20
                                    }}>
                                        <ActivityIndicator size="small" color={Colors.red3}/>
                                    </View>
                                )
                            }
                        </>
                    )

                }}
            />
        </View>
    );
};


export const screenOptions = ({ navigation, route }) => {
    const contactName = route?.params?.contact?.artistName || route?.params?.contact?.name;
    const contactAvatar = route?.params?.contact?.profileImage || route?.params?.contact?.photo;
    return {
        title: contactName,
        headerStyle:{backgroundColor:Colors.grey1, borderBottomWidth:2},
        headerTitleStyle:{
            color:"#FFFFFF",
            fontFamily:"Baloo2-ExtraBold",
            fontSize:25
        },
        headerTitleAlign: "center",
        headerLeft: () => {
            return <TouchableOpacity onPress={() => navigation.popToTop()} style={{ marginLeft:10, marginBottom:5 }}>
                <AntDesign name="arrowleft" size={24} color="#ffffff"/>
            </TouchableOpacity>
        },
        headerRight: () => {
            return <View style={{ marginRight: 10, marginBottom:5 }}>
                    <Avatar
                        rounded
                        source={{
                            uri: contactAvatar
                        }}
                    />
                </View>
        }
    }
}

export default SingleChatScreen;
