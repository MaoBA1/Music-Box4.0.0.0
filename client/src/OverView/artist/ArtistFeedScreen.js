import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Modal,
    Linking
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Style from './style/ArtistFeedStyle';
import Colors from '../../Utitilities/AppColors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getArtistPostsById } from '../../ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';



import UploadPostModal from './Modals/UploadPostModal';
import ArtistPost from './components/ArtistPost';


const ArtistFeedScreen = props => {
    const [uploadPostModalVisible, setUploadPostModalVisible] = useState(false);
    const dispatch = useDispatch();
    const postSelector = useSelector(state => state.Post);
    const artistPosts = postSelector.ArtistPostsReducer;
    const artistSelector = useSelector(state => state.ArtistsReducer);
    const artistId = artistSelector?.ArtistDataReducer?._id;
    const artistName = artistSelector?.ArtistDataReducer?.artistName;
    const profileImage = artistSelector?.ArtistDataReducer?.profileImage;
    
    async function getArtistPostsAsync(){
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
        if(userToken) {
            getArtistPostsById(dispatch, userToken, artistId);
        }
    }

    
    
    useEffect(() => {
        getArtistPostsAsync();
        
    },[])

   

    return(
        <View style={Style.backgroundContainer}>
            
            {uploadPostModalVisible && <UploadPostModal close={setUploadPostModalVisible}/>}
            <ScrollView
             onResponderEnd={getArtistPostsAsync}
            >
                <Ionicons
                    name="ios-add-circle"
                    color={Colors.red3}
                    style={{ alignSelf:"flex-end", marginTop:15, right:10 }}
                    size={30}
                    onPress={() => Linking.openURL(`https://musicbox-uploadmediacenter.netlify.app`)}
                />
            {
                !artistPosts || artistPosts?.length == 0 ?
                (
                    <View style={{width:'100%', height:'90%', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontFamily:'Baloo2-Bold', color: '#fff', fontSize:20}}>You have no posts yet</Text>
                    </View>
                )
                :
                (
                    artistPosts.sort((a, b) => (new Date(b.creatAdt) - new Date(a.creatAdt))).map((item, index) => 
                        <ArtistPost key={item._id} post={item} artist={artistSelector?.ArtistDataReducer} 
                            openComments={() => props.navigation.navigate("CommentScreen", {post:item, postAuthor:artistName, postAuthorImage:profileImage})} 
                        />
                    )
                )
            }
            </ScrollView>
            
        </View>
    )
}


export const screenOptions = ({ navigation }) => {
    return {        
        gestureEnabled: false,
        header: () => {
            return <View style={{
                    height:Platform.OS === "ios" ? 75 : 60,
                    flexDirection:'row',
                    alignItems:"flex-end",
                    backgroundColor: Colors.grey1
                }}>
                    <View style={{
                        width:`10%`,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection:'row',
                    }}>
                        
                        <AntDesign 
                            name="arrowleft"
                            size={22}
                            color="#ffffff"
                            onPress={() => navigation.popToTop()}
                            style={{left:5, bottom:2}}
                        />
                        
                    </View>

                    <TouchableOpacity style={{
                        width:`${90/3}%`,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection:'row',
                    }} onPress={() => navigation.navigate("Setting")}>
                        <Ionicons
                            name="ios-settings"
                            size={22}
                            color={"#fff"}
                        />
                        <Text style={{
                            marginLeft:5,
                            fontFamily:'Baloo2-Bold',
                            color:"#fff",
                            fontSize:16
                        }}>
                            Setting
                        </Text>
                    </TouchableOpacity>

                    <View style={{
                        width:`${90/3}%`,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection:'row',
                    }}>
                            <MaterialCommunityIcons
                            name="newspaper-variant-multiple"
                            size={22}
                            color={Colors.red3}
                        />
                        <Text style={{
                            marginLeft:5,
                            fontFamily:'Baloo2-Bold',
                            color:Colors.red3,
                            fontSize:16
                        }}>
                            Feed
                        </Text>
                    </View>


                    <TouchableOpacity style={{
                        width:`${90/3}%`,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection:'row',
                    }} onPress={() => navigation.navigate("Music")}>
                        <FontAwesome
                            name="music"
                            size={22}
                            color={"#fff"}
                        />
                        <Text style={{
                            marginLeft:5,
                            fontFamily:'Baloo2-Bold',
                            color:"#fff",
                            fontSize:16
                        }}>
                            Music
                        </Text>
                    </TouchableOpacity>
            </View>
        }
    }
}


export default ArtistFeedScreen;