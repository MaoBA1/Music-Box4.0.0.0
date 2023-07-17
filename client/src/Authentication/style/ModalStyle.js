import {StyleSheet} from 'react-native';
import Colors from '../../Utitilities/AppColors';

export default StyleSheet.create({
    errorMessageView:{
        flex:1,        
        alignItems: "center",
        justifyContent: 'center',        
        padding:115
    }, 
    errorMessageContentView:{
        backgroundColor:Colors.red3,
        padding: 20,
        width:250,     
        alignItems: "center",
        justifyContent: "center",
        borderRadius:15,                       
    },
    errorMessegText:{
        marginLeft:5,
        fontFamily:'Baloo2-Medium',
    },
    line:{
        width:250,
        height:2,
        backgroundColor: '#000'
    },
});