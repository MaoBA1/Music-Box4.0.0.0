import React, { useLayoutEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Platform, TextInput, Keyboard, TouchableWithoutFeedback, FlatList } from 'react-native';
import Colors from '../../../Utitilities/AppColors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import { Avatar } from 'react-native-elements';
import { db } from '../../../../firebase';
import { collection, addDoc, onSnapshot, getDocs, query, where, } from "firebase/firestore";



const CreateNewSingleChatScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const userDataSelector = useSelector(state => state.UserReducer);
    const userSubscribes = userDataSelector?.UserSubs?.Subscribes;
    const isSuperUser = userDataSelector?.UserReducer?.account?.isSuperUser;
    const artistSelector = useSelector(state => state.ArtistsReducer);
    const artistName = artistSelector?.ArtistDataReducer?.artistName;
    const userFirstName = userDataSelector?.UserReducer?.account?.firstName;
    const userFormattedFirstName = userFirstName && userFirstName[0]?.toUpperCase() + 
    userFirstName?.substring(1,userFirstName?.length);
    const reciverName = isSuperUser ? artistName : userFormattedFirstName;
    const reciverId = isSuperUser? artistSelector?.ArtistDataReducer?._id :
     userDataSelector?.UserReducer?.account._id;
    const reciverPhoto = isSuperUser ? artistSelector?.ArtistDataReducer?.profileImage :
     userDataSelector?.UserReducer?.account?.Avatar;
    
    const createNewChat = async(contact) => {
        const q1 = query(collection(db, "single-chats"), 
        where("chatName", "==", reciverName + " " + contact.artistName));
        const q2 = query(collection(db, "single-chats"), 
        where("chatName", "==", contact.artistName + " " + reciverName));
        const querySnapshot1 = await getDocs(q1);
        const querySnapshot2 = await getDocs(q2);
        
        if(querySnapshot1.empty && querySnapshot2.empty) {
            await addDoc(collection(db, "single-chats"), {
                chatName: reciverName + " " + contact.artistName,
                contacts:[
                    {
                        id: reciverId,
                        name: reciverName,
                        photo: reciverPhoto
                    },
                    {
                        id: contact._id,
                        name: contact.artistName,
                        photo: contact.profileImage
                    }
                ]
            }).then((result) => { navigation.navigate("SingleChatScreen", 
            { contact: contact, chatId: result.id })});

        } else if(!querySnapshot1.empty || !querySnapshot2.empty) {
            const unsub = onSnapshot(collection(db, "single-chats"), (snapShot) => {
                snapShot.forEach(doc => {
                    if(doc.data().chatName === reciverName + " " + contact.artistName || 
                        doc.data().chatName === contact.artistName + " " + reciverName
                    ) {
                        navigation.navigate("SingleChatScreen", { contact: contact, chatId: doc.id })
                    }
                })
            })
        }
        
    }

    return (
        <View style={{
            flex:1,
            backgroundColor:Colors.grey1
        }}>
                <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    height:Platform.OS === "ios"? 90 : 70,
                    backgroundColor:Colors.grey1,
                    alignItems: "flex-end",
                    paddingBottom:10,
                    borderBottomWidth:2,
                    borderColor: Colors.grey3,
                }}>
                    <TouchableOpacity onPress={navigation.goBack} style={{ marginLeft:10 }}>
                        <AntDesign name="arrowleft" size={24} color="#ffffff"/>
                    </TouchableOpacity>
                    <TextInput
                        style={{
                            backgroundColor:Colors.grey7,
                            flex:0.95,
                            marginLeft:10,
                            borderRadius: 5,
                            paddingHorizontal: 10,
                            paddingVertical: Platform.OS === 'ios'? 5 : 0,
                            fontFamily:'Baloo2-Medium'
                        }}
                        placeholder={"Who would you like to talk to?"}
                        value={search}
                        onChangeText={text => setSearch(text)}
                        disabled={!userSubscribes || userSubscribes?.length === 0}
                    />
                </View>
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                >
                    <View style={{
                        flex: 1,
                    }}>
                        {
                            !userSubscribes || userSubscribes?.length === 0 ?
                            (
                                
                                <View style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent:"center",
                                    paddingBottom:50
                                }}>
                                    <Text style={{
                                        fontFamily: 'Baloo2-Bold',
                                        fontSize:20,
                                        color: Colors.red3
                                    }}>
                                        There is no one to chat with right now
                                    </Text>
                                    <Text style={{
                                        fontFamily: 'Baloo2-Bold',
                                        fontSize:18,
                                        color: "#ffffff"
                                    }}>
                                        Because of one of the following reasons :
                                    </Text>
                                    <View style={{ marginTop: 20 }}/>
                                    <Text style={{
                                        fontFamily: 'Baloo2-Bold',
                                        color: "#ffffff",
                                        fontWeight: "500",
                                        fontSize:15
                                    }}>
                                        - Internet communication problem
                                    </Text>
                                    <Text style={{
                                        fontFamily: 'Baloo2-Bold',
                                        color: "#ffffff",
                                        fontWeight: "500",
                                        fontSize:15
                                    }}>
                                        - You haven't subscribed to any artist yet
                                    </Text>
                                </View>
                            )
                            :
                            (
                                <FlatList
                                    data={userSubscribes}
                                    keyExtractor={item => item._id}
                                    renderItem={({item, index}) => 
                                    <TouchableOpacity
                                        onPress={() => createNewChat(item)}
                                        style={{
                                            backgroundColor:Colors.grey4,
                                            width:"100%",
                                            padding:10,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            borderBottomWidth:0.5,
                                            borderColor: Colors.grey3,
                                        }}
                                    >
                                        <Avatar
                                            rounded
                                            source={{
                                                uri: item?.profileImage
                                            }}
                                            size={35}
                                        />
                                        <Text style={{
                                            fontFamily: 'Baloo2-Medium',
                                            left:10,
                                            fontSize:16,
                                            color:"#ffffff"
                                        }}>
                                            {item.artistName}
                                        </Text>
                                    </TouchableOpacity>
                                }
                                />
                            )
                        }
                    </View>
                </TouchableWithoutFeedback>
        </View>
    );
};

export const screenOptions = ({ navigation }) => {
    return {
        headerShown: false,
    }
}


export default CreateNewSingleChatScreen;
