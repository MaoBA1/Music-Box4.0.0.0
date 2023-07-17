import Colors from '../../Utitilities/AppColors';
import { StyleSheet, Platform } from 'react-native';


export default StyleSheet.create({
    backgroundContainer:{
        flex:1,        
        backgroundColor:Colors.grey1,
        
    },
    mainContainer:{
        flex:1,
        alignItems:'center',
        width:'100%',
        height:'100%',paddingTop:100
    },
    textContainer:{
        alignItems: 'center',
        margin:10,
        marginBottom:50
    },
    subtitle:{
        fontFamily:'Baloo2-Bold', fontSize:20, color:'#fff'
    },
    closeButtonContainer:{
        left:10, 
        top: Platform.OS == 'ios' ? 60 : 20,
        position:'absolute',
    },
    note:{
        top:20, fontFamily:'Baloo2-Bold', color:Colors.red3,
        fontSize:16
    }
})