import {StyleSheet} from 'react-native';
import Colors from '../../Utitilities/AppColors';

export default StyleSheet.create({
    backgroundContainer:{
        flex:1,        
        backgroundColor:Colors.grey1
    },
    screenContainer:{
        flex: 1,
        backgroundColor: Colors.grey1,
        alignItems: 'center',
        justifyContent: 'center', paddingTop:100
    },
    title:{    
        fontFamily: 'Baloo2-ExtraBold',
        fontSize: 55,
        color: Colors.grey2,
        textShadowColor: Colors.red3,
        textShadowOffset: {width: 3, height:2},
        textShadowRadius:10
    },
    verificationContentView:{
        margin:30,
        alignItems: "center",
        width:'100%', 
        height: 400
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
    verificationTextInputView:{
        width: '70%',
        height:50,
        borderRadius:30,
        borderWidth:2,
        flexDirection:'row',
        backgroundColor: Colors.grey2,         
        alignItems: 'center',
        paddingHorizontal:20,
        marginLeft: 45
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
    noteText:{
        fontFamily:'Baloo2-Medium',
        color: Colors.red1,          
        marginLeft: 30
    },
    buttonView:{
        borderWidth:2,
        borderColor:'#ffff', padding:10, borderRadius:50, backgroundColor: Colors.red3,
        paddingHorizontal:40
    },
});