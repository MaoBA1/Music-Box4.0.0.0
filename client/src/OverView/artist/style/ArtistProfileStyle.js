import {StyleSheet} from 'react-native';
import Colors from '../../../Utitilities/AppColors';

export default StyleSheet.create({
    backgroundContainer:{
        flex:1,        
        backgroundColor:Colors.grey1
    },
    subImageView: {
        width:'100%', height:200,
        borderBottomWidth:2, borderColor:Colors.grey3,
    },
    subImage:{
        width:'100%', height:'100%', resizeMode:'stretch'
    },
    profileImageView:{
        bottom:45, left:15, borderWidth:2, width:103, borderColor:Colors.grey3,
        height:103, borderRadius:50, alignItems: 'center', justifyContent: 'center'
    },
    profileImage:{
        width:100, height:100,
        resizeMode:'cover', borderRadius:50
    }
})