import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    Image,
    TouchableOpacity, Platform,
    ActivityIndicator, Keyboard,
    TextInput, KeyboardAvoidingView
} from 'react-native';
import Colors from '../../../Utitilities/AppColors';
import Style from './Style/ChangeImageModalStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { changeArtistDescriptionAction } from '../../../../store/actions/artistActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getArtistData, getPosts, getArtistPostsById, giveCommentToPost } from '../../../ApiCalls';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';

import CommentItem from '../../../components/CommentItem';


const ArtistPostCommentModal = props => {
    const dispatch = useDispatch();
    const flatListRef = React.useRef();
    const postAuthor = props?.params?.postAuthor;
    const post = props.params.post;
    const formatted_artistName = postAuthor[0]?.toUpperCase() + postAuthor?.substring(1,postAuthor?.length); 
    const postContent = props.params.post.postContent;
    let commentsSelector = useSelector(state => state.Post?.postCommentReducer);
    const [commentText, setCommentText] = useState('');
    

    const sendComment = async() => {
        Keyboard.dismiss();
        try{
            const jsonToken = await AsyncStorage.getItem('Token');
            const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
            if(userToken) {
                console.log('test');
                giveCommentToPost(dispatch, userToken, post._id, commentText);
                setCommentText('');
                getPosts(dispatch, userToken);
                getArtistPostsById(dispatch, userToken, props.params.artistId);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <Modal
            visible={true}
            transparent={true}
            animationType='slide'
        >
            <View style={{flex: 1, width: '100%', height:'100%', backgroundColor:Colors.grey3}}>
                <View style={{width:'100%', backgroundColor:Colors.grey1, alignItems: 'center', height:Platform.OS == 'ios'? 80 : 50, flexDirection: 'row', paddingTop: Platform.OS == 'ios'? 40 : 0}}>
                    <View style={{width:'20%', paddingLeft:15}}>
                        <TouchableOpacity onPress={() => props.close(false)}>
                            <FontAwesome
                                name='close'
                                size={25}
                                color={'#fff'}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{width:'60%', alignItems: 'center'}}>
                        <Text style={{
                            fontFamily: 'Baloo2-ExtraBold', fontSize:25,
                            color: Colors.grey2,
                            textShadowColor: Colors.red3,
                            textShadowOffset: {width: 0, height:2},
                            textShadowRadius:10
                        }}
                        >
                            Comments</Text>
                    </View>
                </View>
                <View style={{width:'100%', backgroundColor:Colors.grey1, flexDirection:'row', padding:10, borderBottomWidth:1, borderTopWidth:1, borderColor:Colors.grey3}}>
                    <View style={{borderRadius:50, borderWidth:2, borderColor:Colors.red3, width:55, height:55}}>
                        <Image
                            source={{uri:props?.params?.postAuthorImage}}
                            style={{width:50, height:50, borderRadius:50}}
                        />
                    </View>   
                    <View style={{justifyContent: 'center', left:10}}>
                         <Text style={{fontFamily:'Baloo2-Bold', color:'#fff', fontSize:16}}>{formatted_artistName}</Text>
                         <Text style={{fontFamily:'Baloo2-Medium', color:'#fff', fontSize:16}}>{postContent}</Text>
                    </View> 
                </View>
                <KeyboardAvoidingView keyboardVerticalOffset={Platform.OS == 'ios' ? 60 : 40} behavior='height' style={{width:'100%', flex:1}}>
                    <KeyboardAwareFlatList
                        ref={flatListRef}
                        data={commentsSelector?.sort((a, b) => (new Date(b.commentCreatAdt) - new Date(a.commentCreatAdt)))}
                        keyExtractor={item => item._id}
                        renderItem={commentItem => <CommentItem comment={commentItem.item}/>}
                    />
                </KeyboardAvoidingView>
                <View style={{
                        width:'100%', backgroundColor:Colors.grey1, height:70, flexDirection:'row',
                        borderTopWidth:1, borderTopColor: Colors.grey7, alignItems: 'center',
                        justifyContent:'space-between', paddingHorizontal:15
                    }}
                >
                    <TextInput
                        style={{
                            width:'78%', height:30, backgroundColor:'#fff', 
                            borderRadius:50, paddingHorizontal:15, fontFamily:'Baloo2-Medium'
                        }}
                        placeholder="Comment..."
                        value={commentText}
                        onChangeText={text => setCommentText(text)}
                        keyboardAppearance='dark'
                        multiline 
                        // autoCorrect={false}
                        // autoComplete={false}                       
                    />

                    {
                        commentText.length > 0?
                        (
                            <TouchableOpacity onPress={sendComment} style={{
                                    width:'20%', height:30, backgroundColor:Colors.red3,
                                    borderRadius:50, alignItems: 'center', justifyContent: 'center', borderWidth:2, borderColor:'#fff'
                                }}
                            >
                                <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Send</Text>
                            </TouchableOpacity>
                        )
                        :
                        (
                            <View style={{
                                    width:'20%', height:30, backgroundColor:Colors.red3, opacity:0.5,
                                    borderRadius:50, alignItems: 'center', justifyContent: 'center', borderWidth:2, borderColor:'#fff'
                                }}
                            >
                                <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Send</Text>
                            </View>
                        )
                    }
                </View>
            </View>
        </Modal>
    )
}

export default ArtistPostCommentModal;