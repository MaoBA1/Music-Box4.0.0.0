import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image, ImageBackground,
    Modal
} from 'react-native';
import Colors from '../../../Utitilities/AppColors';
import { Video } from 'expo-av';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts, giveLikeToPost, unLikeToPost, getPostComment, getArtistPostsById } from '../../../ApiCalls';
import {deleteArtistPostAction} from '../../../../store/actions/postActions';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ArtistPost = props => {
    const dispatch = useDispatch();
    const post = props?.post;
    const formatted_artistName = post?.postAuthorName[0]?.toUpperCase() + post?.postAuthorName?.substring(1,post?.postAuthorName?.length); 
    const getUserDataSelector = useSelector(state => state.UserReducer);
    let likeStatus = false;
    const artistSelector = useSelector(state => state.ArtistsReducer);
    const artistId = artistSelector?.ArtistDataReducer?._id;
    const [deletPostVisible, setDeletePostVisible] = useState(false);


    const amILikeThisPost = async () => {
        let likes = post?.likes;
        let myId = getUserDataSelector?.UserReducer?.account?._id;        
        let flag = false;
        likes.forEach(like => {
            if(like.toString() == myId?.toString()) {
                flag = true;
                likeStatus = true;                
                return;
            }
        })
        if(!flag) {
            likeStatus = false;
        }
    }

    const like = async() => {
        try {
            const jsonToken = await AsyncStorage.getItem('Token');
            const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
            if(userToken){            
                await giveLikeToPost(dispatch, userToken, post?._id)
                .then(result => {
                    getPosts(dispatch, userToken);
                    getArtistPostsById(dispatch, userToken, artistId);
                    amILikeThisPost();
                })
                .catch(error => {console.log(error.message);})
            }
        } catch (error) {
            console.log(error.message);
        }
        
    }

    const unlike = async() => {
        try {
            const jsonToken = await AsyncStorage.getItem('Token');
            const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
            if(userToken){
                await unLikeToPost(dispatch, userToken, post?._id)
                .then(result => {
                    getPosts(dispatch, userToken);
                    getArtistPostsById(dispatch, userToken, artistId);
                    amILikeThisPost();
                })
            }
        } catch (error) {
            console.log(error.message);
        }
        
    }

    amILikeThisPost();

    const openCommentScreen = async() => {
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
        if(userToken){
            await getPostComment(dispatch, userToken, post._id)
            .then(result => {
                props.openComments(true);
            })
        }
    }

    const deleteArtistPost = async() => {
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null; 
        if(userToken){
            let action = deleteArtistPostAction(userToken, post._id);
            try {
                await dispatch(action);
                getPosts(dispatch, userToken);
                getArtistPostsById(dispatch, userToken, artistId);
            }catch (error) {
                console.log(error.message);
            }
        }
        
    }
    
    const checkLanguage = sentence => {
        return sentence[0] >= 'א' && sentence[0] <= 'ת';
    }

    return(
        <ImageBackground 
            source={require('../../../../assets/AppAssets/Logo.png')}
            resizeMode="cover"
            style={{marginTop:5, width:'100%', borderTopWidth:1, borderColor: Colors.grey3}}
            imageStyle={{opacity:0.5}}
        >
            <Modal
                visible={deletPostVisible}
                transparent={true}
                animationType='fade'
            >
                <View style={{flex:1, padding:10, alignItems: 'center', justifyContent:'center'}}>
                    <View style={{
                        width:'80%',
                        alignItems: 'center',
                        borderRadius:10,
                        backgroundColor: Colors.red3
                    }}>
                        <View style={{padding:20}}>
                            <Text style={{fontFamily:'Baloo2-Bold', fontSize:14, color: '#fff'}}>Are you sure you want delete this post?</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity onPress={() => setDeletePostVisible(false)} style={{width:'50%', borderRightWidth:0.5, borderTopWidth:1, alignItems: 'center', justifyContent:'center', padding:5}}>
                                <Text style={{fontFamily:'Baloo2-Bold', fontSize:14, color: '#fff'}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={deleteArtistPost} style={{width:'50%', borderLeftWidth:0.5, borderTopWidth:1, alignItems: 'center', justifyContent:'center', padding:5}}>
                                <Text style={{fontFamily:'Baloo2-Bold', fontSize:14, color: '#fff'}}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={{width:'100%', flexDirection:'row', padding:15, justifyContent:'space-between'}}>
                <View style={{flexDirection:'row',}}>
                    <View style={{borderRadius:50, borderWidth:2, borderColor:Colors.red3, width:55, height:55}}>
                        <Image
                            source={{uri:props?.artist?.profileImage}}
                            style={{width:50, height:50, borderRadius:50}}
                        />
                    </View>
                    <View style={{justifyContent: 'center', left:10}}>
                        <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', fontSize:16}}>{formatted_artistName}</Text>
                        <Text style={{fontFamily:'Baloo2-Regular', color: Colors.grey3, fontSize:12}}>{new Date(props.post.creatAdt).toDateString()}</Text>
                    </View>
                </View>
                <TouchableOpacity style={{
                    width:70,
                    height:25, 
                    backgroundColor:Colors.red3,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius:10
                }} onPress={() => setDeletePostVisible(true)}>
                    <Text style={{fontFamily:'Baloo2-Bold', color: '#fff', fontSize:12}}>Delete</Text>
                </TouchableOpacity>
            </View>
            <View style={{paddingHorizontal:15}}>
                <Text style={{
                    fontFamily:'Baloo2-Medium', color:'#fff',
                    fontSize:16, 
                }}>
                    {props.post.postContent}
                </Text>
            </View>
            <View style={{width:'100%', marginTop:10}}>                
                <View>
                    {
                        props?.post?.postMedia?.format == 'video'?
                        (
                            <Video
                                source={{uri:props?.post?.postMedia?.uri}}
                                style={{width:'100%', height:250}}
                                posterSource={{uri:props?.post?.postMedia?.uri}}
                                posterStyle={{alignSelf:'stretch'}}
                                resizeMode="cover"
                                useNativeControls
                            />
                        )
                        :
                        (
                            <Image
                                source={{uri:props?.post?.postMedia?.uri}}
                                style={{width:'100%', height:250}}
                            />
                        )
                    }
                </View>
            </View>
            <View style={{width:'100%', flexDirection:'row', paddingVertical:10, paddingHorizontal:10}}>
                <View style={{flexDirection:'row'}}>
                    <FontAwesome
                        name='comment'
                        size={20}
                        color={Colors.grey3}
                    />
                    <Text style={{left:5 , fontFamily:'Baloo2-Medium', color:Colors.grey3}}>{props?.post?.comments?.length} comments</Text>
                </View>
                <View style={{flexDirection:'row', left:25}}>
                    <AntDesign
                        name='like1'
                        size={20}
                        color={Colors.grey3}
                    />
                    <Text style={{left:5 , fontFamily:'Baloo2-Medium', color:Colors.grey3}}>{props?.post?.likes?.length} Likes</Text>
                </View>
            </View>
            <View style={{flexDirection:'row', width:'100%', borderBottomWidth:1, borderTopWidth:1, padding:10, borderColor:Colors.grey3}}>
                <TouchableOpacity onPress={openCommentScreen} style={{width:'50%', alignItems: 'center', justifyContent: 'center'}}>
                    <FontAwesome
                        name='comment'
                        size={25}
                        color={Colors.grey7}
                    />
                    <Text style={{fontFamily:'Baloo2-Medium', color:Colors.grey7, fontSize:12}}>Add Comment</Text>
                </TouchableOpacity>
                {
                    !likeStatus?
                    (
                        <TouchableOpacity onPress={like} style={{width:'50%', alignItems: 'center', justifyContent: 'center'}}>
                            <AntDesign
                                name='like1'
                                size={25}
                                color={Colors.grey7}
                            />
                            <Text style={{fontFamily:'Baloo2-Medium', color:Colors.grey7, fontSize:12}}>Like</Text>
                        </TouchableOpacity>
                    )
                    :
                    (
                        <TouchableOpacity onPress={unlike} style={{width:'50%', alignItems: 'center', justifyContent: 'center'}}>
                            <AntDesign
                                name='dislike1'
                                size={25}
                                color={Colors.red3}
                            />
                            <Text style={{fontFamily:'Baloo2-Medium', color:Colors.grey7, fontSize:12}}>UnLike</Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        </ImageBackground>
    )
}

export default ArtistPost;