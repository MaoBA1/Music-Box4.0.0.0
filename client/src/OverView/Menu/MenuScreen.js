import React, { useState, useEffect, useCallback } from 'react';
import { 
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    Modal, Platform,
    ActivityIndicator,
    Image ,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Colors from '../../Utitilities/AppColors';
import Style from '../Style/MenuStyle';
import { playInTheFirstTimeAction } from '../../../store/actions/appActions';
import { getAllUserFavoriteSongsAction } from '../../../store/actions/userActions'
import { pause } from '../../../audioController';


const MenuScreen = props => {
    const dispatch = useDispatch();
    const userDataSelector = useSelector(state => state.UserReducer);
    const user = userDataSelector?.UserReducer?.account;
    const userFirstName = userDataSelector?.UserReducer?.account?.firstName;
    const userFormattedFirstName = userFirstName && userFirstName[0]?.toUpperCase() + 
    userFirstName?.substring(1,userFirstName?.length);
    const userLastName = userDataSelector?.UserReducer?.account?.lastName;
    const userAvatar = userDataSelector?.UserReducer?.account?.Avatar;
    const isSuperUser = userDataSelector?.UserReducer?.account?.isSuperUser;
    const[isLoading, setIsLoading] = useState(false);
    const [profileOptionsVisible, setProfileOptionVisible] = useState(false);
    const userFavoriteSongsSelector = useSelector(state => state.UserReducer?.UserFavoritesSongs);
    const userFavoriteSongs = userFavoriteSongsSelector?.Playlist;
    const appBackGroundSelector = useSelector(state => state.AppReducer);
    const { playbackObj } = appBackGroundSelector;
    
    const logout = async() => {
        await AsyncStorage.removeItem('Token');
        await AsyncStorage.removeItem('IsItFirstUse');
        await pause(playbackObj).
        then(() => {
            dispatch(playInTheFirstTimeAction({
                playbackObj: null,
                status: null,
                currentAudio: {},
                isPlaying: false,
                index: null,
                list: null,
                musicOnBackGround: false,
                isLoading: false,
                MusicOnForGroundReducer: false
            }))
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                props.navigation.navigate('auth');
            },3000)
        })
        
    }

    const moveToArtistProfile = () => {
        props.navigation.navigate('ArtistProfilePage');
        setProfileOptionVisible(false);
    }

    const moveToAccountProfile = () => {
        props.navigation.jumpTo('Profile');
        setProfileOptionVisible(false);
    }

    const upgradeYourAccount = () => {
        props.navigation.navigate('CreateArtistPage');
        setProfileOptionVisible(false);
    }

    async function getAllUserFavoriteSongs() {
        const jsonToken = await AsyncStorage.getItem('Token');        
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
        if(userToken) {
            let action = getAllUserFavoriteSongsAction(userToken);
            try {
                await dispatch(action);
            }catch(error){
                console.log(error.message);
            }   
        }
    }

    useEffect(() => {
        getAllUserFavoriteSongs();
    },[])
    
    return(
        <ImageBackground 
                source={ require('../../../assets/AppAssets/Logo.png') }
                resizeMode="cover" 
                style={Style.backgroundContainer}
                imageStyle={{opacity: 0.3}}
        >
            <Modal
                visible={profileOptionsVisible}
                transparent={true}
                animationType="fade"
            >
                <TouchableOpacity 
                    style={{flex:3, borderWidth:2, backgroundColor:'#000', opacity:0.2}}
                    onPress={() => setProfileOptionVisible(false)}
                />
                <View style={{
                    flex: 1,
                    flexDirection:'column-reverse'
                }}>
                    <View style={{
                        width: '100%',
                        height: 250,
                        backgroundColor:Colors.grey4,
                        borderTopRightRadius:50,
                        borderTopLeftRadius:50
                    }}>
                        <View style={{
                            width: '100%',
                            alignItems: 'center',
                            padding:20,
                            borderBottomWidth:1,
                            borderColor:Colors.grey3,
                            flexDirection:'row',
                            
                        }}>
                            <FontAwesome
                                name="close"
                                size={20}
                                color={Colors.red3}
                                onPress={() => setProfileOptionVisible(false)}
                            />
                            <Text 
                                style={{
                                    fontFamily:'Baloo2-Bold',
                                    color:'#fff',
                                    fontSize:16,
                                    left:10
                                }}>
                                Your profile screens
                            </Text>
                        </View>
                        <TouchableOpacity style={{
                            width:'95%',
                            flexDirection:'row',
                            alignItems: 'center',
                            marginTop:15,
                            padding:5,
                            backgroundColor:Colors.grey1,
                            alignSelf: 'center',
                            borderRadius:10,
                        }} onPress={moveToAccountProfile}>
                            
                                <Image
                                    source={{uri:userAvatar}}
                                    style={{width:50, height:50, borderRadius:50, resizeMode:'stretch'}}
                                />
                                <Text 
                                    style={{
                                        fontFamily:'Baloo2-Bold',
                                        color:'#fff',
                                        fontSize:13,
                                        left:10
                                    }}
                                >
                                    {userFormattedFirstName} {userLastName}
                                </Text>
                            
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            width:'95%',
                            flexDirection:'row',
                            alignItems: 'center',
                            marginTop:15,
                            padding:5,
                            backgroundColor:Colors.grey1,
                            alignSelf: 'center',
                            borderRadius:10,
                        }}
                            onPress={isSuperUser? moveToArtistProfile : upgradeYourAccount}
                        >
                            
                            {
                                isSuperUser?
                                (
                                    <>
                                    <View 
                                        style={{borderWidth:2, borderRadius:50, borderColor:Colors.red3}}
                                    >
                                        <Image
                                            source={{uri:userDataSelector?.UserReducer?.superAccount?.profileImage}}
                                            style={{width:47, height:47, borderRadius:50, resizeMode:'stretch'}}
                                        />
                                    </View>
                                        <Text 
                                            style={{
                                                fontFamily:'Baloo2-Bold',
                                                color:'#fff',
                                                fontSize:13,
                                                left:10
                                            }}
                                        >
                                            {userDataSelector?.UserReducer?.superAccount?.artistName}
                                        </Text>
                                    </>
                                )
                                :
                                (
                                    <>
                                    <View 
                                        style={{
                                            width:47,
                                            height:47,
                                            borderRadius:50,
                                            backgroundColor:Colors.grey3,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderColor:'#fff',
                                            borderWidth:1
                                        }}
                                    >
                                        <FontAwesome
                                            name='level-up'
                                            color='#fff'
                                            size={20}
                                        />
                                    </View>
                                        <Text style={{
                                            fontFamily:'Baloo2-Bold',
                                            color:Colors.red3,
                                            fontSize:13,
                                            left:10
                                        }}>
                                            Upgrade your account
                                        </Text>
                                    </>
                                )
                            }
                            
                        </TouchableOpacity>
                    </View>

                </View>
                
            </Modal>
            {
                !isLoading &&
                <>
                    <View
                        style={{
                            width: '100%',
                            marginTop:30,
                            padding:10,
                            paddingHorizontal:20,
                            flexDirection:'row',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', fontSize:25}}>
                            Menu
                        </Text>
                        <View style={{alignItems: 'center'}}>
                        <Entypo
                            name="log-out"
                            size={25}
                            color={Colors.red3}
                            onPress={logout}
                        />
                        <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', fontSize:10}}>Log out</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={{
                            width:'90%',
                            padding:10,
                            backgroundColor:Colors.grey4,
                            position: 'absolute',
                            alignSelf:'center',
                            top:100,
                            justifyContent:'space-between',
                            flexDirection: 'row',
                            borderRadius:10
                    }} onPress={() => props.navigation.jumpTo('Profile')}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image
                                source={{uri:userAvatar}}
                                style={{width:50, height:50, borderRadius:50, resizeMode:'stretch'}}
                            />
                            <Text 
                                style={{
                                    fontFamily:'Baloo2-Bold',
                                    color:'#fff',
                                    fontSize:13,
                                    left:10
                                }}>
                                {userFormattedFirstName} {userLastName}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', width:'22%', justifyContent: 'space-between'}}>
                            
                            {
                                isSuperUser?
                                (
                                    <TouchableOpacity 
                                        style={{borderWidth:2, borderRadius:50, borderColor:Colors.red3}}
                                        onPress={() => props.navigation.navigate('ArtistProfilePage')}
                                    >
                                        <Image
                                            source={{uri:userDataSelector?.UserReducer?.superAccount?.profileImage}}
                                            style={{width:30, height:30, borderRadius:50, resizeMode:'stretch'}}
                                        />
                                    </TouchableOpacity>
                                )
                                :
                                (
                                    <TouchableOpacity 
                                        style={{
                                            width:30,
                                            height:30,
                                            borderRadius:50,
                                            backgroundColor:Colors.grey3,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderColor:'#fff',
                                            borderWidth:1
                                    }}
                                        onPress={() => props.navigation.jumpTo('Profile', {screen:'CreateArtistPage'})}>
                                        <FontAwesome
                                            name='level-up'
                                            color='#fff'
                                            size={20}
                                        />
                                    </TouchableOpacity>
                                )
                            }
                            <TouchableOpacity style={{
                                width:30,
                                height:30,
                                borderRadius:50,
                                backgroundColor:Colors.grey3,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth:1,
                                borderColor:'#fff'
                            }} onPress={() => setProfileOptionVisible(true)}>
                                <AntDesign
                                    name='caretdown'
                                    size={15}
                                    color='#fff'
                                />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                    <View style={{
                        flexDirection: 'row',
                        width:'80%',
                        justifyContent: 'space-between',
                        marginTop:120,
                        alignSelf: 'center'
                    }}>
                            <TouchableOpacity
                                style={{
                                    width:150,
                                    height:150,
                                    backgroundColor:Colors.grey4,
                                    borderRadius:10,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={() => props.navigation.jumpTo('Home', {screen: "Feed"})}
                            >
                                <FontAwesome5
                                    name="newspaper"
                                    size={40}
                                    color={Colors.grey6}
                                />
                                <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', top:10 }}>Feed</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width:150,
                                    height:150,
                                    backgroundColor:Colors.grey4,
                                    borderRadius:10,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={() => props.navigation.jumpTo('Home', {screen: "Music Board"})}
                            >
                                <FontAwesome
                                    name="music"
                                    size={40}
                                    color={Colors.grey6}
                                />
                                <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', top:10 }}>Music</Text>
                            </TouchableOpacity>
                    </View>
                    <View 
                        style={{
                            flexDirection: 'row',
                            width:'80%',
                            justifyContent: 'space-between',
                            marginTop:20,
                            alignSelf: 'center'
                        }}
                    >
                            <TouchableOpacity 
                                style={{
                                    width:150,
                                    height:150,
                                    backgroundColor:Colors.grey4,
                                    borderRadius:10,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={() => props.navigation.navigate('EditRegularUserPage')}
                            >
                                <Ionicons
                                    name='settings'
                                    size={40}
                                    color={Colors.grey6}
                                />
                                <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', top:10 }}>Profile Settings</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{
                                    width:150,
                                    height:150,
                                    backgroundColor:Colors.grey4,
                                    borderRadius:10,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={() => props.navigation.navigate('UserChatScreen')}
                            >
                                <Entypo   
                                    name="chat"
                                    size={40}
                                    color={Colors.grey6}
                                />
                                <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', top:10 }}>Messages</Text>
                            </TouchableOpacity>
                    </View>
                    <View 
                        style={{
                            flexDirection: 'row',
                            width:'80%',
                            justifyContent: 'space-between',
                            marginTop:20,
                            alignSelf: 'center'
                        }}
                    >
                            <TouchableOpacity 
                                style={{
                                    width:150,
                                    height:150,
                                    backgroundColor:Colors.grey4,
                                    borderRadius:10,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={() => props.navigation.navigate('Search')}
                            >
                                <Fontisto 
                                    name={'search'}
                                    color={Colors.grey6}
                                    size={40}
                                />
                                <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', top:10 }}>Search</Text>
                            </TouchableOpacity>
                            {
                                userFavoriteSongs?.songs?.length > 0 ?
                                (
                                    <TouchableOpacity 
                                        style={{
                                            width:150,
                                            height:150,
                                            backgroundColor:Colors.grey4,
                                            borderRadius:10,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onPress={() => props.navigation.navigate("PlaylistScreen",
                                        {songsList: userFavoriteSongs?.songs, screenName: 'Your Favorite Songs',
                                         optionToDelete: false, isRegularUserPlaylist: true,
                                         playlistId: userFavoriteSongs?._id
                                        })}
                                    >
                                        <FontAwesome5   
                                            name="music"
                                            size={40}
                                            color={Colors.grey6}
                                        />
                                        <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', top:10 }}>Your Favorite</Text>
                                        <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', top:10 }}>Songs</Text>
                                    </TouchableOpacity>
                                )
                                :
                                (
                                    <View 
                                        style={{
                                            width:150,
                                            height:150,
                                            backgroundColor:Colors.grey4,
                                            borderRadius:10,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity:0.7
                                        }}>
                                        <FontAwesome5   
                                            name="music"
                                            size={40}
                                            color={Colors.grey6}
                                        />
                                        <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', top:10 }}>0 Liked songs</Text>
                                        <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', top:10 }}>for now</Text>
                                    </View>
                                )
                            }
                    </View>
                </>
            }
            {
                isLoading &&
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator color={Colors.red3} size={Platform.OS === 'ios' ? "large" : 80}/>
                </View>
            }
        </ImageBackground>
    )
}



export const screenOptions = navData => {
    const userDataSelector = useSelector(state => state.UserReducer);
    const userAvatar = userDataSelector?.UserReducer?.account?.Avatar;
    
    return {
        headerShown: false,
        tabBarLabel:'Menu',
        tabBarLabelStyle: {
            fontFamily: 'Baloo2-Medium',
            fontSize:20,
        },
        
        tabBarIcon:({focused,color,size}) => {
            const iconColor = focused? Colors.red3 : '#ffff'
            const iconSzie = focused? 24 : 20
            return(
                
                <>
                    <ImageBackground
                        source={{uri: userAvatar} || require('../../../assets/icon.png')}
                        style={{width:30, height:30, bottom:5, zIndex:1, alignItems: 'center'}}
                        imageStyle={{borderRadius:50,  resizeMode:'stretch'}}
                    >
                        <Entypo
                            name='menu'
                            size={22}
                            color={iconColor}
                            style={{top:15, right:20}}
                        />
                    </ImageBackground>
                    
                </>
            )

        } 
    }
}



export default MenuScreen;
