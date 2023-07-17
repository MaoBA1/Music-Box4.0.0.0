import Colors from '../Utitilities/AppColors';
import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    backgroundContainer:{
        flex:1,        
        backgroundColor:Colors.grey1
    },
    mainContainer:{
        flex:1,
        alignItems:'center',
        width:'100%',
        height:'100%',paddingTop:100
    },
    title:{
        fontFamily:'Baloo2-ExtraBold', fontSize:25, color:Colors.red3
    },
    subtitle:{
        fontFamily:'Baloo2-Bold', fontSize:20, color:'#fff'
    },
    textContainer:{
        alignItems: 'center',
        margin:10
    },
    buttonContainer:{
        width:'30%', borderWidth:2, padding:10, marginBottom:80, alignItems:'center',
        justifyContent:'center', borderRadius:50, backgroundColor:Colors.red3, borderColor:'#fff'
    },
    buttonText:{
        fontFamily:'Baloo2-Bold',
        color:'#fff'
    }
});
