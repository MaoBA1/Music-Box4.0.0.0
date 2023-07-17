import Colors from '../../Utitilities/AppColors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    backgroundContainer:{
        flex:1,        
        backgroundColor:Colors.grey1
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
    QueryTitle:{
        fontFamily: 'Baloo2-SemiBold',
        color: Colors.red3
    },
    QueryTitleContainer:{
        width:'35%', alignItems:'center', justifyContent: 'center', backgroundColor: Colors.grey1,
        borderTopLeftRadius:50, borderBottomLeftRadius:50, borderWidth:1, borderColor: Colors.grey3
    },
    queryInput:{
        width:'65%', 
        backgroundColor: '#fff',
        borderTopRightRadius:50, borderBottomRightRadius:50, borderWidth:1, borderLeftWidth:2, borderColor: Colors.grey3, 
        fontFamily:'Baloo2-Medium', fontSize:16, paddingHorizontal:10, color: Colors.grey1
    },
    calnderBtn:{
        width:55, alignItems:'center', padding:8, borderRadius:50, borderWidth:2, borderColor: Colors.grey3,
        backgroundColor: Colors.red3
    },
    queryPhoneContainer:{
        width:'90%',        
        borderRadius:50,
        borderWidth:2, flexDirection:'row',
        borderColor: Colors.grey3, height:45,
        margin:10
    },
    queryPhoneInput:{
        width:'52%', 
        backgroundColor: '#fff',
        borderTopRightRadius:50, borderBottomRightRadius:50, borderWidth:2, borderLeftWidth:2, borderColor: Colors.grey3, 
        fontFamily:'Baloo2-Medium', fontSize:16, paddingHorizontal:10, color: Colors.grey1
    },
    
})