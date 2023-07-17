import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Colors from '../../../Utitilities/AppColors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useSelector } from 'react-redux';
import { db } from '../../../../firebase';
import { onSnapshot, collection, Timestamp, getDocs  } from "firebase/firestore"; 
import { Avatar } from 'react-native-elements';



const UserChatsScreen = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const userDataSelector = useSelector(state => state.UserReducer);
    const isSuperUser = userDataSelector?.UserReducer?.account?.isSuperUser;
    const artistSelector = useSelector(state => state.ArtistsReducer);
    const reciverId = isSuperUser? artistSelector?.ArtistDataReducer?._id : 
    userDataSelector?.UserReducer?.account._id;
    const artistName = artistSelector?.ArtistDataReducer?.artistName;
    const userFirstName = userDataSelector?.UserReducer?.account?.firstName;
    const userFormattedFirstName = userFirstName && userFirstName[0]?.toUpperCase() + 
    userFirstName?.substring(1,userFirstName?.length);
    const reciverName = isSuperUser ? artistName : userFormattedFirstName;
    
    
    const getChatMessages = async(chatID) => {
        let messages = [];
        const querySnapshot = await getDocs(collection(db, "single-chats", chatID, "massages"));
        querySnapshot.forEach((doc) => {
            messages.push({
                text: doc.data().message,
                createdAt: 
                new Date(new Timestamp(doc?.data()?.
                timestamp?.seconds, doc?.data()?.timestamp?.nanoseconds).toDate()),
                user: {
                    _id: doc.data().senderId,
                    name:doc.data().senderName,
                    avatar: doc.data().avatar
                },
            }); 

        });
        return messages;
    }
    useEffect(() => {
        const unsub = onSnapshot(collection(db, "single-chats"), (snapShot) => {
            let contacts = [];
            snapShot.docs.forEach(async x => {
                if(x.data().contacts.some(contact => contact.id === reciverId)) {
                    let messages = await getChatMessages(x.id);
                    messages = messages.sort((a, b) => b.createdAt - a.createdAt);
                    let item = {data: x.data().contacts.filter(x => x.id !== reciverId)[0], 
                        id: x.id, messages: messages, lastModified: messages[0]?.createdAt};
                    if(item.messages.length > 0) {
                        contacts.push(item);
                        contacts = contacts.sort((a, b) => b.lastModified - a.lastModified);
                        setChats(contacts);
                    }
                    
                }
            })
        });
    },[])
    
    
    return (
        <View style={{
            flex:1,
            backgroundColor:Colors.grey1
        }}>
            <FlatList
                data={chats}
                keyExtractor={item => item.id}
                renderItem={({ item, index}) =>
                    <TouchableOpacity style={{
                        backgroundColor:Colors.grey4,
                        width:"100%",
                        padding:10,
                        flexDirection: "row",
                        alignItems: "center",
                        borderBottomWidth:0.5,
                        borderColor: Colors.grey3,
                    }} onPress={() => navigation.navigate("SingleChatScreen", 
                    { contact: item.data, chatId: item.id })}>
                        <Avatar
                            rounded
                            source={{
                                uri: item?.data?.photo
                            }}
                            size={35}
                        />
                        <View>
                        <Text style={{
                            fontFamily: 'Baloo2-Medium',
                            left:10,
                            fontSize:16,
                            color:"#ffffff"
                        }}>
                            {item?.data?.name}
                        </Text>
                        <Text style={{
                            fontFamily: 'Baloo2-Regular',
                            left:10,
                            fontSize:14,
                            color:Colors.grey3
                        }}>
                           {item?.messages[0]?.user?.name?.split(" ")[0]} : {item?.messages[0]?.text}
                        </Text>
                        </View>
                    </TouchableOpacity>
                }
            />
        </View>
    );
};

export const screenOptions = ({ navigation }) => {
    const createNewSinglesChat = () => navigation.navigate("CreateNewSingleChatScreen");
    return {
        title:'Messages',
        headerStyle:{backgroundColor:Colors.grey1, borderBottomWidth:2, borderBottomColor:Colors.grey3},
        headerTitleStyle:{
            color:"#FFFFFF",
            fontFamily:"Baloo2-ExtraBold",
            fontSize:25
        },
        headerTitleAlign: 'center',
        headerLeft: () => {
            return <TouchableOpacity onPress={() => navigation.popToTop()} style={{ marginLeft:10 }}>
                <AntDesign name="arrowleft" size={24} color="#ffffff"/>
            </TouchableOpacity>
        },
        headerRight: () => {
            return <TouchableOpacity style={{ marginRight:10 }} onPress={createNewSinglesChat}>
                <Entypo name="new-message" size={24} color={Colors.grey6}/>
            </TouchableOpacity>
        }
    }
}

export default UserChatsScreen;
