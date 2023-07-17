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
        width:'100%', marginTop:10,
        backgroundColor:Colors.grey1, borderBottomWidth:1, borderTopWidth:1,
        borderColor:Colors.grey3
    },
    authorDetailsContainer:{
        width:'100%', padding:10
    },
    authorNameAndImageContainer:{
        width:'100%', flexDirection:'row', alignItems: 'center'
    },
    authorImageContainer:{
        borderRadius:50, borderWidth:2, borderColor:Colors.red3, width:55, height:55, alignItems:'center', justifyContent: 'center'
    },
    authorImageStyle:{
        width:50, height:50, borderRadius:50, resizeMode:'cover'
    },
    authorNameContainer:{
        marginLeft:10
    },
    authorNameStyle:{
        fontFamily:'Baloo2-SemiBold', color: '#fff'
    },
    dateContainer:{
        marginTop:8
    },
    dateStyle:{
        fontFamily:'Baloo2-Medium', color: Colors.grey5, fontSize:12
    },
    postMediaStyle:{
        width:'100%', alignItems: 'center', justifyContent: 'center'
    },
    countOfCommentAndLikeContainer:{
        width:'60%', flexDirection:'row', marginVertical:15, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal:15
    },
    countContainer:{
        flexDirection:'row', justifyContent: 'center'
    },
    count:{
        fontFamily:'Baloo2-Medium', color: Colors.grey3
    },
    buttonsContainer:{
        flexDirection:'row', width:'100%', alignItems: 'center', justifyContent: 'center', borderTopWidth:1, borderColor:Colors.grey3
    },
    buttonIconsContainer:{
        margin:10, width:100, alignItems:'center'
    },
    buttonTitle:{
        fontFamily:'Baloo2-Medium', color:Colors.grey7, fontSize:12
    },
    postContentStyle:{
        fontFamily: 'Baloo2-Medium',
        fontSize: 18,
        color: '#fff',   
    },
    postContentContainer:{
        width:'80%',margin:20, paddingHorizontal:5
    }
})