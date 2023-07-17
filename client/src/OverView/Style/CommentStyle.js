import Colors from '../../Utitilities/AppColors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    backgroundContainer:{
        flex:1,        
        backgroundColor:Colors.grey1,
    },
    keyboardContainer:{
        
    },
    mainContainer:{
        flex:1,
        width:'100%',
        height:'100%'
    },
    authorImageContainer:{
        borderRadius:50, borderWidth:2, borderColor:Colors.red3, width:55, height:55, alignItems:'center', justifyContent: 'center'
    },
    authorImageStyle:{
        width:50, height:50, borderRadius:50, resizeMode:'cover'
    },
    authorNameAndPostContentContainer:{
        marginLeft:10,
    },
    authorNameStyle:{
        fontFamily:'Baloo2-Bold', color: Colors.red3
    },
    postContentStyle:{
        fontFamily:'Baloo2-SemiBold', color: '#fff'
    },
    authorPartContainer:{
        width:'100%', borderTopWidth:0.5, borderBottomWidth:0.5, padding:10, flexDirection:'row', alignItems: 'center', backgroundColor: Colors.grey1,
        borderColor:Colors.grey7
    },
    textInputContainer:{
        width:'100%', backgroundColor:Colors.grey1, height:70, flexDirection:'row', borderTopWidth:1, borderTopColor: Colors.grey7,
        alignItems: 'center', justifyContent:'space-between', paddingHorizontal:15
    },
    textInputStyle:{
        width:'78%', height:30, backgroundColor:'#fff', 
        borderRadius:50, paddingHorizontal:15, fontFamily:'Baloo2-Medium'
    },
    sendButtonStyle:{
        width:'20%', height:30, backgroundColor:Colors.red3,
        borderRadius:50, alignItems: 'center', justifyContent: 'center', borderWidth:2, borderColor:'#fff'
    },
    sendButtonDeom:{
        width:'20%', height:30, backgroundColor:Colors.red3, borderRadius:50, alignItems: 'center',
        justifyContent: 'center', borderWidth:2, borderColor:'#fff', opacity:0.5
    }
    
})