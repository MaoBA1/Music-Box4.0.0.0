import React, { useState, useEffect, useCallback } from 'react';
import { 
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Modal, Platform, Image,
    ActivityIndicator,
    KeyboardAvoidingView 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../Utitilities/AppColors';
import Style from './Style/ProfileStyle';
import { FlatList } from 'react-native-gesture-handler';
import AddGenersScreen from './AddGenersScreen';
import baseIpRequest from '../ServerDev';
import { getUserData } from '../ApiCalls';
import { setPostAuthorProfileAction } from '../../store/actions/appActions';

const ProfileScreen = props => {
    const dispatch = useDispatch();
    const userDataSelector = useSelector(state => state.UserReducer);
    const generSelector = useSelector(state => state.GenerReducer);
    const userFavoriteGenersIDs = userDataSelector?.UserReducer?.account?.favoritesGeners;
    const userPlaylists = userDataSelector?.UserReducer?.account?.playlists;
    const userSubscribes = userDataSelector?.UserSubs?.Subscribes;
    const userFirstName = userDataSelector?.UserReducer?.account?.firstName;
    const userFormattedFirstName = userFirstName && userFirstName[0]?.toUpperCase() + 
    userFirstName?.substring(1,userFirstName?.length);
    const userLastName = userDataSelector?.UserReducer?.account?.lastName;
    const userAvatar = userDataSelector?.UserReducer?.account?.Avatar;
    const isSuperUser = userDataSelector?.UserReducer?.account?.isSuperUser;
    const [isVisible, setIsVisble] = useState(false);
    const [token, setToken] = useState(null);
    
    const userFormattedLastNameOparition = () => {
        const substringLastName = userLastName?.split(' ')
        let splittedLastName = [];
        substringLastName?.forEach((item, index) => {
            if(item) {
                splittedLastName.push(
                    item[0]?.toUpperCase() + item?.substring(1,item?.length))
            }
            
        })
        return splittedLastName.join(' ');
    }
    
    const userFormattedLastName = userFormattedLastNameOparition();
    
    const sortedGeners = () => {
        let sortedGen = [];
        generSelector?.GenerReducer?.AllGeners?.forEach(gen => {
            userFavoriteGenersIDs?.forEach(genId => {
                if(gen._id == genId) {
                    sortedGen.push(gen);
                }
            })
        })
        return sortedGen;
    };

    const userFavoritesGeners = sortedGeners();
    
    const getToken = async() => {
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
        if(userToken) {
            setToken(userToken);
        }
    }

    useEffect(() => {
        getToken();
    },[])
    
    
    const removeGenerFromFavorites = async (generId) => {
        try{
            const request = await fetch(baseIpRequest.ServerAddress + 
                '/accounts/removeGenerFromFavorites/' +
                generId, {
                method:'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }            
            })
            const response = await request.json();
            if(response.status){
                getUserData(dispatch, token);
            }
        } catch(error) {
            console.log(error);
        }
        
    }
    
    const openToArtistScreen = (artist) => {
        try {
            dispatch(setPostAuthorProfileAction(artist))
            props.navigation.navigate("ArtistFeed");
        }catch(error) {
            console.log(error.message);
        }        
    }
    

    return(
        <ImageBackground 
                source={ require('../../assets/AppAssets/Logo.png') }
                resizeMode="cover" 
                style={Style.backgroundContainer}
                imageStyle={{opacity: 0.3}}
        >

            <Modal
                visible={isVisible}
                animationType='slide' 
            >
                {token && <AddGenersScreen func={() => setIsVisble(false)} token={token}/> }
            </Modal>
            <View style={Style.mainContainer}>
                <View style={Style.UpperContainer}>
                    <View style={Style.upperButtonPart}>
                            <TouchableOpacity 
                                onPress={() => props.navigation.navigate('EditRegularUserPage')} 
                                style={Style.upperIconContainer}>
                                <FontAwesome5
                                    name='user-edit'
                                    color='#fff'
                                    size={20}
                                />
                            </TouchableOpacity>
                            {
                                isSuperUser?
                                (
                                    <TouchableOpacity 
                                        onPress={() => props.navigation.navigate("ArtistProfilePage")}
                                        style={Style.superUserImageContainer}>
                                        <Image
                                            source={{uri:userDataSelector?.UserReducer?.superAccount?.profileImage}}
                                            style={{width:40, height:40, borderRadius:50}}
                                        />
                                    </TouchableOpacity>
                                )
                                :
                                (
                                    <TouchableOpacity 
                                        onPress={() => props.navigation.navigate('CreateArtistPage')}
                                        style={Style.upperIconContainer}>
                                        <MaterialIcons
                                            name='upgrade'
                                            color='#fff'
                                            size={20}
                                        />
                                    </TouchableOpacity>
                                )
                            }
                            
                    </View>
                    <View style={Style.userDetailsPart}>
                        <View style={Style.userImageContainer}>
                            <Image
                                source={{uri:userAvatar}}
                                style={{width:90, height:90, borderRadius:50}}
                            />
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <Text style={{color: Colors.red3, fontFamily:'Baloo2-Bold', fontSize:20}}>{userFormattedFirstName}</Text>
                            <Text style={{color: Colors.red3, fontFamily:'Baloo2-Bold', fontSize:20}}>{userFormattedLastName}</Text>
                        </View>
                    </View>
                </View>
                <View style={{width:'100%', marginVertical:10}}>
                    <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between', paddingHorizontal:10}}>
                            <Text style={{color:'#fff', fontFamily: 'Baloo2-Bold', fontSize:16}}>My Faforites Ganers</Text>
                            <TouchableOpacity onPress={() => setIsVisble(true)}>
                                <AntDesign
                                    name='pluscircle'
                                    color={Colors.grey3}
                                    size={30}
                                />
                            </TouchableOpacity>
                    </View>
                    <View 
                        style={{
                            width:'100%',
                            flexDirection:'row',
                            backgroundColor:Colors.grey4,
                            padding: 10,
                            alignItems: 'center',
                            marginVertical:5
                        }}
                    >
                        <FlatList
                            horizontal
                            data={userFavoritesGeners}
                            keyExtractor={item => item._id}
                            renderItem={
                                ({item, index}) => 
                                <View>
                                    {
                                        userFavoritesGeners.length > 1 &&
                                        <TouchableOpacity 
                                            onPress={() => removeGenerFromFavorites(item._id)}
                                            style={{
                                                backgroundColor:Colors.grey5,
                                                borderRadius:50,
                                                width:20,
                                                height:20,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'absolute',
                                                zIndex:1
                                            }}
                                        >
                                            <Ionicons
                                                name='close'
                                                size={15}
                                                color={'#fff'}
                                            />
                                        </TouchableOpacity>
                                    }
                                    
                                    <Image
                                        source={{uri:item.generImage}}
                                        style={{width:100, height:70, margin:2}}
                                    />
                                </View>
                            }
                        />

                    </View>
                </View>

                <View style={{width:'100%', marginVertical:10}}>
                    <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between', paddingHorizontal:10}}>
                            <Text style={{color:'#fff', fontFamily: 'Baloo2-Bold', fontSize:16}}>My Faforite Artists</Text>
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate("SearchScreen", {typeOfSearch:'artist'})}
                            >
                                <AntDesign
                                    name='pluscircle'
                                    color={Colors.grey3}
                                    size={30}
                                />
                            </TouchableOpacity>
                    </View>
                    {
                        userSubscribes?.length > 0?
                        (
                            <View 
                                style={{
                                    width:'100%',
                                    flexDirection:'row',
                                    backgroundColor:Colors.grey4,
                                    padding:10,
                                    alignItems: 'center',
                                    marginVertical:5
                                }}>
                                <FlatList
                                    horizontal
                                    data={userSubscribes}
                                    keyExtractor={item => item._id}
                                    renderItem={
                                        ({item, index}) => 
                                        <TouchableOpacity 
                                            style={{alignItems: 'center'}}
                                            onPress={() => openToArtistScreen(item)}
                                        >
                                            <Image
                                                source={{uri:item.profileImage}}
                                                style={{
                                                    width:80,
                                                    height:50,
                                                    margin:5,
                                                    borderRadius:10,
                                                    resizeMode:'stretch'
                                                }}
                                            />
                                            <Text numberOfLines={1} 
                                                style={{
                                                    fontFamily:'Baloo2-Bold',
                                                    color:'#fff',
                                                    top:5
                                                }}>
                                                {item.artistName}
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                />

                            </View>
                        )
                        :
                        (
                            <View 
                                style={{
                                    width:'100%',
                                    flexDirection:'row',
                                    backgroundColor:Colors.grey4,
                                    padding:10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginVertical:5
                                }}>
                                <Text 
                                    style={{
                                        fontFamily:'Baloo2-Bold',
                                        fontSize:18,
                                        color:Colors.red3
                                    }}
                                >
                                    No subscribes yet
                                </Text>
                            </View>
                        )
                    }
                </View>

                <View style={{width:'100%', marginVertical:10}}>
                    <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between', paddingHorizontal:10}}>
                            <Text style={{color:'#fff', fontFamily: 'Baloo2-Bold', fontSize:16}}>My Playlists</Text>
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate("SearchScreen", {typeOfSearch:'song'})}
                            >
                                <AntDesign
                                    name='pluscircle'
                                    color={Colors.grey3}
                                    size={30}
                                />
                            </TouchableOpacity>
                    </View>
                    {
                        userPlaylists?.length > 0?
                        (
                            <View style={{
                                    width:'100%',
                                    flexDirection:'row',
                                    backgroundColor:Colors.grey4,
                                    padding:10,
                                    alignItems: 'center',
                                    marginVertical:5
                                }}
                            >
                                <FlatList
                                    horizontal
                                    data={userPlaylists}
                                    keyExtractor={item => item._id}
                                    renderItem={
                                        ({item, index}) => 
                                        <TouchableOpacity 
                                            onPress={() => props.navigation.navigate("AllSingels", 
                                            {songsList: item.songs, screenName: item.playlistName})}
                                            style={{alignItems: 'center'}}
                                        >
                                            <Image
                                                source={{uri:item.playlistImage}}
                                                style={{width:80, height:50, margin:5, borderRadius:10, resizeMode:'stretch'}}
                                            />
                                            <Text 
                                                numberOfLines={1}
                                                style={{
                                                    fontFamily:'Baloo2-Bold',
                                                    color:'#fff',
                                                    top:5
                                                }}
                                            >
                                                {item.playlistName}
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                />

                            </View>
                        )
                        :
                        (
                            <View 
                                style={{
                                    width:'100%',
                                    backgroundColor:Colors.grey4,
                                    padding:10,
                                    alignItems: 'center',
                                    marginVertical:5
                                }}
                            >
                                <Text 
                                    style={{
                                        fontFamily:'Baloo2-Bold',
                                        fontSize:18,
                                        color:Colors.red3
                                    }}
                                >
                                    Don't have playlists yet?
                                </Text>
                                <Text 
                                    style={{
                                        fontFamily:'Baloo2-Medium',
                                        fontSize:18,
                                        color:'#fff'
                                    }}
                                >
                                    What are you waiting for
                                </Text>
                                <Text 
                                    style={{
                                        fontFamily:'Baloo2-Medium',
                                        fontSize:18,
                                        color:'#fff'
                                }}>
                                    Click on the plus button
                                </Text>
                            </View>
                        )
                    }
                </View>

            </View>
        </ImageBackground>
    )
}



export const screenOptions = navData => {
    return {
        headerShown: false,
        tabBarLabel:'Profile',
        tabBarLabelStyle: {
            fontFamily: 'Baloo2-Medium',
            fontSize:25
        },
        tabBarIcon:({focused,color,size}) => {
            const iconColor = focused? Colors.red3 : '#ffffff'
            const iconSzie = focused? 24 : 22
            return(
            <Ionicons name={'person'} color={iconColor} size={iconSzie} />
            )

        },
        gestureEnabled:false, 
    }
}


export default ProfileScreen;