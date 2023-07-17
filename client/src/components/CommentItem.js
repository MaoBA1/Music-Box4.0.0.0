import React, { useState, useEffect, useCallback } from 'react';
import { 
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Modal, Platform,
    ActivityIndicator, Button,
    KeyboardAvoidingView, Image 
} from 'react-native';
import Colors from '../Utitilities/AppColors';
import baseIpRequest from '../ServerDev';
import Style from './Style/CommentItemStyle';



const CommentItem = props => {
    const comment = props.comment;
    let userName = comment?.accountFirstName;
    userName = userName && userName[0]?.toUpperCase() + userName?.substring(1,userName?.length);
    let userImage = comment?.accountImage;
    const commentDate = new Date(comment.commentCreatAdt).toDateString();
    
   

    return (
        <View style={Style.container}>
            <View style={Style.userImageContainer}>
                <Image
                    source={{uri: userImage}}
                    style={{width:30, height:30, borderRadius:50}}
                />
            </View>

            <View style={Style.commentDetailsContainer}>
                <Text style={Style.commentUserNameStyle}>{userName}</Text> 
                <Text style={Style.comentContentStyle}>{comment.comment}</Text> 
            </View>
            <View style={Style.commentDateContainer}>
                <Text style={Style.commentDateStyle}>{commentDate}</Text> 
            </View>            
        </View>
    )
}


export default CommentItem;