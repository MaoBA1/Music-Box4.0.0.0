import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, Modal, ImageBackground, TouchableOpacity, Platform } from 'react-native';
import Colors from '../../../Utitilities/AppColors';
import { useDispatch, useSelector} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import { subscribeToArtistPageAction, getAllUserSubScribesAction, unsubscribeToArtistPageAction } from '../../../../store/actions/userActions';
import { 
    getArtistPostsForDashboardProfileById,
    cleanArtistPostsForDashboardProfil,
    cleanSongReducers ,
    cleanPlaylistReducer,
    cleanAlbumReducer,
    getArtistPostsById
} from '../../../ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Post from '../../../components/Post';
import AddSongFromPostToPlaylist from '../../../components/AddSongFromPostToPlaylist';
import { ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getArtistSubsAction } from '../../../../store/actions/artistActions';
import { db } from '../../../../firebase';
import { collection, addDoc, onSnapshot, getDocs, query, where, } from "firebase/firestore";


export const GenersModal = ({close}) => {
    const appSelector = useSelector(state => state.AppReducer);
    const mainGener = appSelector?.PostAuthorProfile?.mainGener;
    const additionalGener = appSelector?.PostAuthorProfile?.additionalGener;
    return(
        <View style={{
            borderWidth:2,
            borderColor: Colors.grey3,
            borderRadius:20,
            padding:10,
            backgroundColor: Colors.grey4,
            margin:10, 
            alignItems: 'center',
        }}>
            <View style={{width: '100%', alignItems: 'center', bottom: 8}}>
                <MaterialIcons
                    name="arrow-drop-up"
                    color={Colors.grey3}
                    size={30}
                    onPress={close}
                />
            </View>
            <Text style={{
                fontFamily: 'Baloo2-Bold',
                color: Colors.red3,
                fontSize:15
            }}>
                Main Gener
            </Text>
            <View style={{width: '100%', alignItems: 'center'}}>
                <Image
                    source={{uri: mainGener.generImage}}
                    style={{width:100, height:60, margin:10}}
                />
            </View>
            <Text style={{
                fontFamily: 'Baloo2-Bold',
                color: Colors.red3,
                fontSize:15,
                marginTop:10
            }}>
                Additional Geners
            </Text>
            <View style={{width: '100%', margin:10}}>
                <ScrollView horizontal scrollToOverflowEnabled>
                    {additionalGener.map((item, index) => 
                        <Image
                            key={index}
                            source={{uri: item.generImage}}
                            style={{width:100, height:60, marginTop:5, marginHorizontal:7}}
                        />
                    )}
                </ScrollView>
            </View>
        </View>
    )
}

export const SkillsModal = ({close}) => {
    const appSelector = useSelector(state => state.AppReducer);
    const skills = appSelector?.PostAuthorProfile?.skills;
    
    return(
        <View style={{
            borderWidth:2,
            borderColor: Colors.grey3,
            borderRadius:20,
            padding:10,
            backgroundColor: Colors.grey4,
            margin:10, 
            alignItems: 'center',
        }}>
            <View style={{width: '100%', alignItems: 'center', bottom: 8}}>
                <MaterialIcons
                    name="arrow-drop-up"
                    color={Colors.grey3}
                    size={30}
                    onPress={close}
                />
            </View>
            <Text style={{
                fontFamily: 'Baloo2-Bold',
                color: Colors.red3,
                fontSize:15,
                marginTop:10
            }}>
                Skills
            </Text>
            <View style={{width: '100%', justifyContent: 'center', flexDirection:'row', margin:10}}>
                {skills?.map((item, index) => 
                    <Text key={index} style={{fontFamily: 'Baloo2-Bold', color:'#fff'}}>
                        {item}{skills.length - 1 === index? '' : ','}
                    </Text>
                )}
            </View>
        </View>
    )
}

const FeedScreen = props => {
    const dispatch = useDispatch();
    const appSelector = useSelector(state => state.AppReducer);
    const userSelector = useSelector(state => state.UserReducer);
    const artistSelector = useSelector(state => state.ArtistsReducer)
    const artistSubs = artistSelector.ArtistSubs;
    const userSubsCribes = userSelector?.UserSubs?.Subscribes;
    const _id = appSelector?.PostAuthorProfile?._id;
    const profileImage = appSelector?.PostAuthorProfile?.profileImage;
    const profileSeconderyImage = appSelector?.PostAuthorProfile?.profileSeconderyImage;
    const artistName = appSelector?.PostAuthorProfile?.artistName || appSelector?.PostAuthorProfile?.name;
    const description = appSelector?.PostAuthorProfile?.description;
    const postSelector = useSelector(state => state.Post);
    const artistPosts = postSelector.ArtistPostsReducer;
    const [commentParams, setCommentParams] = useState(null);
    const [songForPlaylist, setSongForPlaylist] = useState(null);
    const [addToPlaylistVisible, setAddToPlaylistVisible] = useState(false);
    const [isVisible, setIsVisble] = useState(false);
    const [modalStatus, setModalStatus] = useState('');
    const [genersVisible, setGenersVisible] = useState(false);
    const [skillsVisible, setSkillsVisible] = useState(false);
    let [isUserSubscribe, setIsUserSubscribe] = useState(false);
    const userArtistName = artistSelector?.ArtistDataReducer?.artistName;
    const userFirstName = userSelector?.UserReducer?.account?.firstName;
    const userFormattedFirstName = userFirstName && userFirstName[0]?.toUpperCase() + 
    userFirstName?.substring(1,userFirstName?.length);
    const isSuperUser = userSelector?.UserReducer?.account?.isSuperUser;
    const userId = isSuperUser? artistSelector?.ArtistDataReducer?._id : 
    userSelector?.UserReducer?.account._id;
    const reciverName = isSuperUser ? userArtistName : userFormattedFirstName;
    const reciverPhoto = isSuperUser ? artistSelector?.ArtistDataReducer?.profileImage :
     userSelector?.UserReducer?.account?.Avatar;
    const thisProfile = appSelector?.PostAuthorProfile;
   
    const createNewChat = async() => {
        const q1 = query(collection(db, "single-chats"), where("chatName", "==", reciverName + " " + artistName));
        const q2 = query(collection(db, "single-chats"), where("chatName", "==", artistName + " " + reciverName));
        const querySnapshot1 = await getDocs(q1);
        const querySnapshot2 = await getDocs(q2);
        
        if(querySnapshot1.empty && querySnapshot2.empty) {
            await addDoc(collection(db, "single-chats"), {
                chatName: reciverName + " " + artistName,
                contacts:[
                    {
                        id: userId,
                        name: reciverName,
                        photo: reciverPhoto
                    },
                    {
                        id: thisProfile._id,
                        name: artistName,
                        photo: thisProfile.profileImage
                    }
                ]
            }).then((result) => { props.navigation.navigate("SingleChatScreen", { contact: thisProfile, chatId: result.id })});

        } else if(!querySnapshot1.empty || !querySnapshot2.empty) {
            const unsub = onSnapshot(collection(db, "single-chats"), (snapShot) => {
                snapShot.forEach(doc => {
                    if(doc.data().chatName === reciverName + " " + artistName || 
                        doc.data().chatName === artistName + " " + reciverName
                    ) {
                        props.navigation.navigate("SingleChatScreen", { contact: thisProfile, chatId: doc.id })
                    }
                })
            })
        }
        
    }

    function isUserSub(){
        userSubsCribes?.forEach(sub => {
            if(sub._id.toString() === _id.toString()) {
                return setIsUserSubscribe(true);
            }
        })
    }
    async function getAllUserSubScribes() {
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;     
        if(userToken) {
            let action1 = getAllUserSubScribesAction(userToken);
            let action2 = getArtistSubsAction(userToken, _id);
            try{
                await dispatch(action1);
                await dispatch(action2);
            }catch (error) {
                console.log(error.message);
            }
        }
    }

    useEffect(() => {
        async function getArtistPostsAsync(){
            const jsonToken = await AsyncStorage.getItem('Token');
            const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
            if(userToken) {
                getArtistPostsForDashboardProfileById(dispatch, userToken, _id);
                getArtistPostsById(dispatch, userToken, _id);
            }
        }
        getArtistPostsAsync();
        isUserSub();
        getAllUserSubScribes();
    },[])

    const CloseAndOpenCommentScreen = (params) => {
        props.navigation.navigate("CommentScreen", {params: params});
    }

    const openModals = (type) => {
        switch(type) {
            case 'gener':
                setSkillsVisible(false);
                setGenersVisible(true);
                return;
            case 'skill':
                setGenersVisible(false);
                setSkillsVisible(true);
                return;
            default: return;
        }
    }

    const subscribe = async() => {
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
        if(userToken) {
            let action = subscribeToArtistPageAction(userToken, _id);
            try{
                await dispatch(action);
                await getAllUserSubScribes();
                isUserSub();
                setIsUserSubscribe(true);
            }catch(error){
                console.log(error.message);
            }
        }
    }

    const unsubscribe = async() => {
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
        if(userToken) {
            let action = unsubscribeToArtistPageAction(userToken, _id);
            try{
                await dispatch(action);
                await getAllUserSubScribes();
                isUserSub();
                setIsUserSubscribe(false);
            }catch(error){
                console.log(error.message);
            }
        }
    }
  

    if(appSelector?.PostAuthorProfile !== null) {
        return (
                <>
                    <ScrollView style={{
                        flex: 1,
                        backgroundColor:Colors.grey1
                    }}>
                        {addToPlaylistVisible && 
                            <AddSongFromPostToPlaylist 
                                close={setAddToPlaylistVisible}
                                track={songForPlaylist}
                        />}
                        <View style={{
                            position: 'absolute',
                            zIndex:1,
                            display: 'flex',
                            width:'100%',
                            justifyContent:"space-between",
                            alignItems: 'center',
                            flexDirection:'row',
                        }}>
                            {userId !== _id && <AntDesign
                                name="message1"
                                size={25}
                                color={Colors.red3}
                                style={{margin:7}}
                                onPress={createNewChat}
                            />}
                            { userId !== _id && <View style={{padding:7}}>
                                {
                                    isUserSubscribe?
                                    (
                                        <TouchableOpacity style={{
                                            paddingHorizontal:10,
                                            backgroundColor: '#fff',
                                            borderWidth:2,
                                            borderRadius:50,
                                            borderColor: Colors.red3
                                        }} onPress={unsubscribe}>
                                            <Text style={{color:Colors.red3, fontFamily:'Baloo2-Bold'}}>
                                                Unsubscribe
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                    :
                                    (
                                        <TouchableOpacity style={{
                                            paddingHorizontal:10,
                                            backgroundColor: Colors.red3,
                                            borderWidth:2,
                                            borderRadius:50,
                                            borderColor: '#fff'
                                        }} onPress={subscribe}>
                                            <Text style={{color:'#fff', fontFamily:'Baloo2-Bold'}}>
                                                Subscribe
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                }
                                
                            </View>}
                        </View>
                        
                        <ImageBackground
                            source={{uri:profileSeconderyImage}}
                            style={{
                                width: '100%',
                                height:180,
                                borderBottomWidth:2,
                                borderColor:Colors.grey6,
                                flexDirection:'column-reverse',
                            }}
                            imageStyle={{resizeMode:'stretch'}}
                        >
                            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                                <View
                                    style={{
                                        width:'100%',
                                        padding:10,
                                        justifyContent:'space-between',
                                    }}
                                >
                                    <Text style={{
                                        fontFamily: 'Baloo2-ExtraBold',
                                        color: Colors.red3,
                                        fontSize:20,
                                    }}>
                                        {artistName}
                                    </Text>

                                    <Text style={{
                                        fontFamily: 'Baloo2-ExtraBold',
                                        color: Colors.grey2,
                                        fontSize:14,
                                    }}>
                                        {artistSubs?.length} Subscribers
                                    </Text>
                                </View>
                                <View style={{
                                    borderRadius:50,
                                    borderWidth:2,
                                    width:75,
                                    height:75,
                                    marginLeft:10,
                                    borderColor: Colors.grey6,
                                    right:8,
                                    position: 'absolute',
                                    zIndex:1,
                                    top:30
                                }}>
                                    <Image
                                        source={{uri:profileImage}}
                                        style={{width:70, height:70, borderRadius:50}}
                                    />
                                </View>
                            </View>
                        </ImageBackground>
                        <View style={{width:'78%', backgroundColor:Colors.grey4, padding:10, alignItems: 'flex-start'}}>
                                <Text style={{fontFamily: 'Baloo2-Bold', color:'#fff'}}>{description}</Text>
                        </View>
                        <View style={{
                            flexDirection:'row',
                            justifyContent:'space-between',
                            height:50,
                        }}>
                            
                            <View 
                                style={{
                                    flexDirection:'row',
                                    width:'78%',
                                    backgroundColor:Colors.grey4,
                                    top:0.5,
                                    borderBottomRightRadius:50,
                                    borderTopWidth:0.5
                                }}>
                                <TouchableOpacity
                                     style={{width:'50%', alignItems: 'center', borderRightWidth:0.5, justifyContent: 'center'}}
                                     onPress={() => openModals('gener')}
                                >
                                    <Text style={{
                                        fontFamily: 'Baloo2-Bold',
                                        color: genersVisible? Colors.red3 : '#fff',
                                        fontSize:12
                                    }}>
                                        Artists Geners
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={{width:'50%', alignItems: 'center', justifyContent: 'center'}}
                                    onPress={() => openModals('skill')}
                                >
                                    <Text style={{
                                        fontFamily: 'Baloo2-Bold',
                                        color: skillsVisible? Colors.red3 : '#fff',
                                        fontSize:12
                                    }}>
                                        Artists Skills
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {genersVisible && <GenersModal close={() => setGenersVisible(false)}/>}
                        {skillsVisible && <SkillsModal close={() => setSkillsVisible(false)}/>}
                        {
                                artistPosts && 
                                (
                                    <View style={{bottom: 8}}>
                                        {
                                            artistPosts?.
                                            sort((a, b) => (new Date(b.creatAdt) - new Date(a.creatAdt))).
                                            map((item, index) => (
                                                <View key={index}>
                                                    <Post
                                                        post={item}
                                                        openCommentScreen={CloseAndOpenCommentScreen} 
                                                        openAddToPlaylist={() => setAddToPlaylistVisible(true)}
                                                        setSongForPlaylist={setSongForPlaylist}
                                                    />
                                                </View>
                                            ))
                                        }
                                    </View>
                                )
                            }
                        
                    </ScrollView>
                    {
                        !artistPosts || artistPosts?.length === 0 && 
                        (
                            <ImageBackground 
                                    source={ require('../../../../assets/Logo.png') }
                                    resizeMode="cover" 
                                    style={{
                                        flex:(genersVisible || skillsVisible) ? 0.2 : 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: Colors.grey1,
                                    }}
                                    imageStyle={{opacity: 0.3}}
                            >
                                <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', fontSize:20}}>
                                    There is no content to show right now
                                </Text>
                            </ImageBackground>
                        ) 
                    }
                </>
                
            );
        } else {
            return(
                <ImageBackground 
                        source={ require('../../../../assets/Logo.png') }
                        resizeMode="cover" 
                        style={{flex:(genersVisible || skillsVisible) ? 0.2 : 1, alignItems: 'center', justifyContent: 'center'}}
                        imageStyle={{opacity: 0.3}}
                >
                    <ActivityIndicator color={Colors.red3} size={"large"}/>
                </ImageBackground>
            )
        }
    }
    
export const screenOptions = ({navigation}) => {
    const moveToMusicScreen = () => {
        navigation.navigate("ArtistMusicBoard")
    }
    return {        
        gestureEnabled:false,
        headerStyle:{backgroundColor:Colors.grey1, height:Platform.OS === 'ios' ? 110 : 90, borderBottomWidth:2, borderBottomColor:Colors.grey3},
        headerTitleStyle:{
            color:"#FFFFFF",
            fontFamily:"Baloo2-ExtraBold",
            fontSize:25
        },
        presentation:"transparentModal",
        header: () => {
            return <View style={{
                backgroundColor:Colors.grey1,
                height:Platform.OS === 'ios' ? 90 : 70,
                borderBottomWidth:2,
                borderBottomColor:Colors.grey3,
                flexDirection:'row',
            }}>
                <TouchableOpacity style={{
                    width:"10%",
                    justifyContent: "flex-end",
                    paddingBottom:10,
                    paddingLeft: 10
                }} onPress={navigation.goBack}>
                    <Entypo 
                        name={'home'}
                        color={"#fff"}
                        size={24}
                    />
                </TouchableOpacity>
                
                <View style={{
                    flexDirection:'row',
                    width:"45%",
                    justifyContent: 'center',
                    alignItems: "flex-end",
                    paddingBottom:5,
                }}>
                    <MaterialCommunityIcons
                        name="newspaper-variant-multiple"
                        size={25}
                        color={Colors.red3}
                    />
                    <Text style={{fontFamily: 'Baloo2-Bold', color: Colors.red3, marginLeft:5, fontSize:18}}>Feed</Text>
                </View>

                <TouchableOpacity style={{
                    flexDirection:'row',
                    width:"30%",
                    justifyContent: 'center',
                    alignItems: "flex-end",
                    paddingBottom:5,
                }} onPress={moveToMusicScreen}>
                    <FontAwesome
                        name="music"
                        size={25}
                        color={"#fff"}
                    />
                    <Text style={{fontFamily: 'Baloo2-Bold', color:'#fff', marginLeft:5, fontSize:18}}>Music</Text>
                </TouchableOpacity>
                
            </View>
        }
    }
}


export default FeedScreen;