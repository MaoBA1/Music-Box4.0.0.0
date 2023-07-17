import Colors from '../../Utitilities/AppColors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    backgroundContainer:{
        flex:1,        
        backgroundColor:Colors.grey1
    },
    keyboardContainer:{
        
    },
    mainContainer:{
        flex:1,
        width:'100%',
        height:'100%'
    },
    UpperContainer:{
        width:'100%',
        paddingTop:40,
    },
    upperButtonPart:{
        width:'100%',
        justifyContent:'space-between',
        paddingHorizontal:10, flexDirection:'row', alignItems: 'center'
    },
    userDetailsPart:{
        width:'100%',
        alignItems: 'center', justifyContent: 'center',
    },
    userImageContainer:{
        borderWidth:2, borderColor:Colors.grey3, 
        borderRadius:50, padding:1, marginBottom:10
    },
    superUserImageContainer:{
        borderWidth:2, borderColor:Colors.red3, 
        borderRadius:50, padding:1, marginBottom:10, top:5
    },
    upperIconContainer:{
        backgroundColor:Colors.grey3, height:40, width:40,
        borderRadius:50, alignItems: 'center', justifyContent: 'center',
    },
    
    
})