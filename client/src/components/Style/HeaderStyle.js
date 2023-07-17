import Colors from '../../Utitilities/AppColors';
import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({       
    title:{
        fontFamily: 'Baloo2-ExtraBold', fontSize:25,
        color: Colors.grey2,
        textShadowColor: Colors.red3,
        textShadowOffset: {width: 0, height:2},
        textShadowRadius:10
    },
    blassing:{
        fontFamily: 'Baloo2-ExtraBold',
        color: Colors.grey2,
        textShadowColor: '#171717',
        textShadowOffset: {width: 0, height:3},
        textShadowRadius:3,
    },
    container:{
        width: '100%', height: 80, flexDirection:'row',
        backgroundColor:Colors.grey1
        
    },
    shadowProp: {
        shadowColor: '#171717',
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    titleContainer:{
        width:'40%', height:'100%', alignItems:'center', justifyContent: 'center'
    },
    generalTitleContainer:{
        height:'100%', alignItems:'center', justifyContent: 'center',
        marginLeft:50
    },
    iconContainer:{
        width:'30%', height:'100%', paddingLeft:20, justifyContent: 'center'
    },
    generalIconContainer:{
        width:'10%', height:'100%', paddingLeft:20, justifyContent: 'center'
        
    },
    blessingContainer:{
        width:'30%', height:'100%', alignItems:'center', justifyContent:'flex-end'
    },
    menuHeaderContainer:{
        width: '100%', height: Platform.OS == 'ios' ? 100 : 80, flexDirection:'row',
        backgroundColor:Colors.grey1, paddingTop: Platform.OS == 'ios' ? 50 : 0
        
    },
    generalHeaderContainer:{
        width: '100%', height: Platform.OS == 'ios' ? 100 : 80, flexDirection:'row',
        backgroundColor:Colors.grey1, paddingTop: Platform.OS == 'ios' ? 50 : 0
        
    },
})