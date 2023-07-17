import { ResizeMode } from 'expo-av';
import {StyleSheet} from 'react-native';
import Colors from '../../Utitilities/AppColors';

export default StyleSheet.create({
    backgroundContainer:{
        flex:1,        
        backgroundColor:Colors.grey1
    },
    mainContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center', width:'100%',
        height:'100%',padding:10
    },
    title:{
        fontFamily: 'Baloo2-ExtraBold',
        fontSize: 55,
        color: Colors.grey2,
        textShadowColor: Colors.red3,
        textShadowOffset: {width: 3, height:2},
        textShadowRadius:10
    },
    keyboardContainer:{
        flex:1,
        width:'100%', height:'100%',        
    },
    rowContainer:{
        width:'100%',         
        paddingHorizontal:8, paddingVertical:20
    },
    queryContainer:{
        width:'80%',        
        borderRadius:50,
        borderWidth:2, flexDirection:'row',
        borderColor: Colors.grey3, height:45,
        margin:10
    },
    queryPhoneContainer:{
        width:'90%',        
        borderRadius:50,
        borderWidth:2, flexDirection:'row',
        borderColor: Colors.grey3, height:45,
        margin:10
    },
    QueryTitle:{
        fontFamily: 'Baloo2-SemiBold',
        color: Colors.red3
    },
    queryInput:{
        width:'65%', 
        backgroundColor: '#fff',
        borderTopRightRadius:50, borderBottomRightRadius:50, borderWidth:1, borderLeftWidth:2, borderColor: Colors.grey3, 
        fontFamily:'Baloo2-Medium', fontSize:16, paddingHorizontal:10, color: Colors.grey1
    },
    queryPhoneInput:{
        width:'50%', 
        backgroundColor: '#fff',
        borderTopRightRadius:50, borderBottomRightRadius:50, borderWidth:2, borderLeftWidth:2, borderColor: Colors.grey3, 
        fontFamily:'Baloo2-Medium', fontSize:16, paddingHorizontal:10, color: Colors.grey1
    },
    QueryTitleContainer:{
        width:'35%', alignItems:'center', justifyContent: 'center', backgroundColor: Colors.grey1,
        borderTopLeftRadius:50, borderBottomLeftRadius:50, borderWidth:1, borderColor: Colors.grey3
    },
    calnderBtn:{
        width:55, alignItems:'center', padding:8, borderRadius:50, borderWidth:2, borderColor: Colors.grey3,
        backgroundColor: Colors.red3
    },
    signUpBtn:{
        borderWidth:2,
        borderColor:'#ffff', padding:10, borderRadius:50, backgroundColor: Colors.red3,
        paddingHorizontal:40
    },
    signUpBtnText:{
        fontFamily:'Baloo2-Bold',
        fontSize:20, color:'#fff'
    },
})