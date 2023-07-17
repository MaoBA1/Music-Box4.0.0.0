import Colors from '../../Utitilities/AppColors';
import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    container:{
        width:'95%', borderRadius:10, backgroundColor:Colors.grey4, padding:10, marginTop:8, marginLeft:5, flexDirection:'row'
    },
    userImageContainer:{
        width:'10%', justifyContent: 'center', marginHorizontal:10
    },
    commentDetailsContainer:{
        width:'60%', justifyContent: 'center'
    },
    commentUserNameStyle:{
        fontFamily:'Baloo2-Bold', color:Colors.red3
    },
    comentContentStyle:{
        fontFamily:'Baloo2-Medium', color:'#fff'
    },
    commentDateContainer:{
        width:'30%', justifyContent:'flex-end', marginLeft:10
    },
    commentDateStyle:{
        fontFamily:'Baloo2-Regular', color:Colors.grey7, fontSize:12
    }

});