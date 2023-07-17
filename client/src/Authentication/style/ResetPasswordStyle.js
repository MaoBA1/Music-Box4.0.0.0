import {StyleSheet} from 'react-native';
import Colors from '../../Utitilities/AppColors';

export default StyleSheet.create({
    backgroundContainer:{
        flex:1,        
        backgroundColor:Colors.grey1
    },
    mainContainer:{
        flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'
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
    buttonResetView:{
         borderWidth:2, borderRadius:50, paddingVertical:5,
         paddingHorizontal:20, borderColor: '#fff', backgroundColor: Colors.red3         
    },
    subTitleText:{ 
        fontFamily: 'Baloo2-Bold',
        fontSize: 25,
        color: Colors.red3,        
    },
    ResetPasswordTextInputView:{
        width: '70%',
        height:50,
        borderRadius:30,
        borderWidth:2,
        flexDirection:'row',
        backgroundColor: Colors.grey2,         
        alignItems: 'center',
        paddingHorizontal:20,        
    },
    textInputView:{
        width: '70%',
        height:50,
        fontFamily:'Baloo2-SemiBold',
        fontSize: 18,
        flexDirection:'row',         
        alignItems: 'center',
        paddingHorizontal:5,
        margin: 10
    },
})