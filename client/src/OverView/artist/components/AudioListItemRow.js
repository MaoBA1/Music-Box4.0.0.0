//import liraries
import {
    View,
    Text,
    ImageBackground,
    ActivityIndicator
} from 'react-native';
import Colors from '../../../Utitilities/AppColors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// create a component
const AudioListItemRow = ({
    isPlaying,
    item,
    currentAudio,
    isLoading,
    index,
    SongIndex
}) => {
    const {
        artistName,
        creatAdt,
        likes,
        trackImage,
        trackLength,
        trackName,
        trackUri
    } = item;
    return (
        <>
            <View style={{
                width: '20%'
            }}>
                <ImageBackground
                    source={{uri:trackImage}}
                    style={[{width:50, height:50, alignItems: 'center', justifyContent: 'center'}, {opacity:index === SongIndex && item._id === currentAudio._id? 0.8 : 1}]}
                    imageStyle={{borderRadius:50}}
                >
                    {
                        item._id === currentAudio._id &&
                        <>
                            {
                                isPlaying?
                                (
                                    <FontAwesome5
                                        name="pause"
                                        size={20}
                                        color={Colors.red3}
                                    />
                                )
                                :
                                (
                                    <>
                                        {
                                            isLoading?
                                            (
                                                <ActivityIndicator color={Colors.red3}/>
                                            )
                                            :
                                            (
                                                <FontAwesome5
                                                    name="play"
                                                    size={20}
                                                    color={Colors.red3}
                                                />
                                            )
                                        }
                                        
                                    </>
                                )
                            }
                            
                        </>
                    }
                </ImageBackground>
            </View>
            <View
                style={{
                    justifyContent: 'center',
                    width: '60%',
                    alignItems: 'flex-start'
                }}
            >
                <Text
                    style={{fontFamily:'Baloo2-Medium', color:Colors.grey6, fontSize:16}}
                >
                    {trackName}
                </Text>
                <Text
                    style={{fontFamily:'Baloo2-Regular', color:Colors.grey3, fontSize:14}}
                >
                    {artistName}
                </Text>
            </View>
            <View
                style={{width:'20%', justifyContent: 'space-between', alignItems: 'center'}}
            >
                <Text style={{fontFamily:'Baloo2-Medium', color: Colors.grey3}}>{trackLength}</Text>
                {
                    likes &&
                    <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center'}}>
                        <AntDesign
                            name="like1"
                            color={Colors.grey3}
                            size={15}
                        />
                        <Text style={{fontFamily:'Baloo2-Medium', color: Colors.grey3, left:5, top:2}}>{likes.length} Likes</Text>
                    </View>
                }   
                <Text style={{fontFamily:'Baloo2-Medium', color: Colors.grey3, fontSize:10, top:5}}>{new Date(creatAdt).toDateString()}</Text>
            </View>

        </>
    );
};




export default AudioListItemRow;
