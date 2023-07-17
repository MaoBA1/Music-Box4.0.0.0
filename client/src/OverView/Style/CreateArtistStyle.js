import Colors from '../../Utitilities/AppColors';
import { StyleSheet, Platform } from 'react-native';


export default StyleSheet.create({
    backgroundContainer:{
        flex:1,        
        backgroundColor:Colors.grey1,
        
    },
    queryTitleContainer:{
        marginTop:40, marginLeft:20, backgroundColor: Colors.grey1,
        borderWidth:2, borderColor: '#fff', padding:10,
        alignItems: 'center', justifyContent: 'center', borderRadius:50, width:180
    },
    queryTextInputStyle:{
        width:'85%', backgroundColor:'#fff', left:20, top:15, height:40,
        borderRadius:50, borderWidth:2, borderColor: Colors.grey3,
        paddingHorizontal:15, fontFamily:'Baloo2-SemiBold', color: Colors.red3
    },
    descriptionTextInputStyle:{
        width:'85%', backgroundColor:'#fff', left:20, top:15, height:100,
        borderRadius:30, borderWidth:2, borderColor: Colors.grey3,
        paddingHorizontal:15, fontFamily:'Baloo2-SemiBold', color: Colors.red3
    },
    queryContainer:{
        backgroundColor: Colors.grey4, width:'100%',
        paddingVertical:10, top:10, flexDirection:'row'
    },
    pictureButton:{
        backgroundColor:Colors.red3, padding:5, width:50, alignItems: 'center',
        borderRadius:50, borderWidth:2, borderColor: Colors.grey2
    },
    verificationMessageView:{
        margin: 50,
        alignItems: "center",
    },
    explainText:{ 
        fontFamily: 'Baloo2-SemiBold',
        fontSize: 20,
        color: Colors.grey2, 
               
    },
    buttonView:{
        borderWidth:2,
        borderColor:'#ffff', padding:10, borderRadius:50, backgroundColor: Colors.red3,
        paddingHorizontal:40
    },
    errorMessegText:{
        marginLeft:5,
        fontFamily:'Baloo2-Medium',
    },
});