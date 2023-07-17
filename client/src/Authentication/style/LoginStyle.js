import {StyleSheet} from 'react-native';
import Colors from '../../Utitilities/AppColors';

export default StyleSheet.create({
    backgroundContainer:{
        flex:1,        
        backgroundColor:Colors.grey1
    },
    keyboardContainer:{
        
    },
    mainContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center', width:'100%',
        height:'100%'
    },
    title:{
        fontFamily: 'Baloo2-ExtraBold',
        fontSize: 55,
        color: Colors.grey2,
        textShadowColor: Colors.red3,
        textShadowOffset: {width: 3, height:2},
        textShadowRadius:10
    },
    textInput:{
      paddingVertical:10,
      justifyContent:'center', width:'85%',
      borderBottomRightRadius:50,
      borderTopRightRadius:50,
      fontFamily:'Baloo2-Bold',
      fontSize:18,
      paddingRight:10,
      color: Colors.red3
    },
    textInputContainer:{
        width:'80%',
        backgroundColor:Colors.grey2,        
        borderRadius:50, borderWidth:2 , borderColor: Colors.grey3,
        flexDirection:'row',
        alignItems:'center', 
        margin:10       
    },
    inputIconContainer:{
        padding:10,
        width:'15%'
    },
    loginBtn:{
        borderWidth:2,
        borderColor:'#ffff', padding:10, borderRadius:50, backgroundColor: Colors.red3,
        paddingHorizontal:40
    },
    loginBtnText:{
        fontFamily:'Baloo2-Bold',
        fontSize:20, color:'#fff'
    },
    forgetPasswoedTxt:{
        fontFamily:'Baloo2-Bold',
        fontSize:16,
        color:Colors.red3
    },
    signupBtnTxt:{
        fontFamily:'Baloo2-Medium',
        fontSize:20,
        color:Colors.grey2
    },
    isAuthQuestTxt:{
        fontFamily:'Baloo2-Medium',
        color:Colors.red3,
        fontSize:22
    }
    
})