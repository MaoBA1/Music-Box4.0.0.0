import React, { useState, useEffect, useLayoutEffect } from 'react';
import { 
    View,
    Text,
    FlatList, 
    ImageBackground,
    TouchableOpacity
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Style from '../../Style/DashBoardStyle';
import Post from '../../../components/Post';
import { 
    getAllSearchResults,
    getArtistsByUserFavoriteGeners,
    getSongsByUserFavoriteGeners,
    getAllUserPlaylist,
    getAllUserSubScribes,
    getArtistDataAsync,
    cleanArtistProfilePageBeforeNextUse 
} from '../../../ApiCalls';
import AddSongFromPostToPlaylist from '../../../components/AddSongFromPostToPlaylist';
import Colors from '../../../Utitilities/AppColors';
import { Avatar } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getPosts } from '../../../ApiCalls';

const DashBoardScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userDataSelector = useSelector(state => state.UserReducer);
    const userAvatar = userDataSelector?.UserReducer?.account?.Avatar;
    const isSuperUser = userDataSelector?.UserReducer?.account?.isSuperUser;
    const postSelector = useSelector(state => state.Post);
    const post = postSelector?.PostReducer;
    const [songForPlaylist, setSongForPlaylist] = useState(null);
    const [addToPlaylistVisible, setAddToPlaylistVisible] = useState(false);
    const [token, setToken] = useState(null);
    
    
    const CloseAndOpenCommentScreen = (params) => {
        navigation.navigate("CommentScreen", {params: params});
    }
    const refresh = () => {
        getPosts(dispatch, token);
    }
    useEffect(() => {
        async function getToken(){
            const jsonToken = await AsyncStorage.getItem('Token');        
            const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
            if(userToken) {
                setToken(userToken);
            }
        }
        if(!token) {
            getToken();
        }
        else {
            getAllSearchResults(dispatch, token);
            getArtistsByUserFavoriteGeners(dispatch, token);
            getSongsByUserFavoriteGeners(dispatch, token);
            getAllUserPlaylist(dispatch, token);
            getAllUserSubScribes(dispatch, token);
            getArtistDataAsync(dispatch, token, isSuperUser);
            cleanArtistProfilePageBeforeNextUse(dispatch); 
        }
    }, [token])
    
    return(
        <View style={Style.backgroundContainer}>
            {addToPlaylistVisible && <AddSongFromPostToPlaylist close={setAddToPlaylistVisible} track={songForPlaylist}/>}

            <View style={Style.mainContainer}>                
                
                {
                    post && post.length > 0 ?
                    (
                        <FlatList
                            onResponderEnd={refresh}
                            style={{width: '100%'}}
                            data={post.sort((a, b) => (new Date(b.creatAdt) - new Date(a.creatAdt)))}
                            keyExtractor={item => item._id}
                            renderItem={
                                currentPost => 
                                <Post 
                                    post={currentPost.item}
                                    openCommentScreen={CloseAndOpenCommentScreen} 
                                    openAddToPlaylist={() => setAddToPlaylistVisible(true)}
                                    setSongForPlaylist={setSongForPlaylist}
                                    moveToPostAuthorProfile={() => navigation.navigate("ArtistFeed")}
                                />
                            }
                            
                        />
                    )
                    :
                    (
                        <ImageBackground 
                                source={ require('../../../../assets/Logo.png') }
                                resizeMode="cover" 
                                style={{flex:1, width:'100%', height:'100%', alignItems: 'center', justifyContent:'center'}}
                                imageStyle={{opacity: 0.3}}
                        >
                            <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', fontSize:20}}>
                                There is no content to show right now
                            </Text>
                        </ImageBackground>
                    ) 
                    
                }
                
            </View>
        </View>
    )
}




export const screenOptions = ({navigation}) => {
    const userDataSelector = useSelector(state => state.UserReducer);
    const userAvatar = userDataSelector?.UserReducer?.account?.Avatar;

    const logout = async () =>{
        try {
            navigation.navigate('auth');
        } catch (error) {
            console.log(error);
        }
    }
    const moveToMusicBoard = () => {
        navigation.navigate('Music Board');
    }

    const moveToUserChats = () => {
        navigation.navigate("UserChatScreen");
    }
    return {        
        gestureEnabled:false,
        title:'Feed',
        headerStyle:{backgroundColor:Colors.grey1, height:Platform.OS === 'ios' ? 110 : 90, borderBottomWidth:2, borderBottomColor:Colors.grey3},
        headerTitleStyle:{
            color:"#FFFFFF",
            fontFamily:"Baloo2-ExtraBold",
            fontSize:25
        },
        header: () => {
            return <View style={{
                backgroundColor:Colors.grey1,
                height:Platform.OS === 'ios' ? 100 : 80,
                borderBottomWidth:2,
                borderBottomColor:Colors.grey3,
                flexDirection:'row',
            }}>
                <View style={{
                    alignItems: "center",
                    width: '40%',
                    paddingLeft:10,
                    paddingTop: Platform.OS === 'ios' ? 30 : 10,
                    flexDirection: 'row',
                }}>
                    <Avatar
                        rounded
                        source={ require('../../../../assets/Logo.png') }
                        size={35}
                    />
                    <Text style={{
                        fontFamily: 'Baloo2-ExtraBold',
                        fontSize:20,
                        color: Colors.red3,
                        top:2.5
                    }}>Music Box</Text>
                </View>
                <View style={{
                    width:"20%",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    paddingBottom:5
                }}>
                    <Text style={{
                        fontFamily: 'Baloo2-Bold',
                        color: "#fff",
                        fontSize:16
                    }}>Feed</Text>
                </View>
                <View style={{
                    width:"40%",
                    flexDirection: 'row',
                    alignItems: "center",
                    justifyContent:"flex-end",
                    paddingRight:10,
                    paddingTop: Platform.OS === 'ios' ? 30 : 10,
                }}>
                    <Ionicons 
                        name="chatbox-ellipses"
                        size={24}
                        color={Colors.grey3}
                        onPress={moveToUserChats}
                        style={{margin:5}}
                    />
                    <FontAwesome
                        name="music"
                        size={24}
                        style={{margin:5}}
                        color={Colors.red3}
                        onPress={moveToMusicBoard}
                    />
                </View>
            </View>
        }
    }
}


export default DashBoardScreen;
    