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
    subtitleText:{
       fontFamily:'Baloo2-Bold', fontSize:20, color: '#fff'
    },
    subtitleView:{
        width:'90%', alignItems: 'center', padding:10, margin:20
    },
    textInput:{
        width:'85%', padding:5, paddingVertical:10, borderTopRightRadius:50,
        borderBottomRightRadius:50, fontFamily:'Baloo2-Medium', fontSize:18
    },
    textInputView:{
        width:'80%', borderWidth:2, borderRadius:50, paddingLeft:10, backgroundColor:Colors.grey2, flexDirection:'row',
        marginBottom:10,
    },
    button:{
        width:100, borderWidth:2, borderRadius:50,
        padding:10, alignItems: 'center', backgroundColor:Colors.red3,
        borderColor: '#fff', marginBottom:100, marginTop:20
    },
    btnText:{
        fontFamily:'Baloo2-Bold', 
        color:'#fff', fontSize: 18
    }
})