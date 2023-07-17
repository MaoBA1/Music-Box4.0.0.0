import { View, Text, Modal, TouchableOpacity } from 'react-native';
import Colors from '../../../../Utitilities/AppColors';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const OptionsModal = ({
    currentAudio,
    backGroundCurrentAudio,
    close,
    index,
    list,
    play,
    setAddToPlaylistVisible
}) => {

    const playThisSong = () => {
        play(currentAudio, index, list);
        close(false);
    }

    const openAddToPlayListScreen = () => {
        setAddToPlaylistVisible(true);
        close(false);
    }
    return (
        <Modal
            visible
            transparent={true}
            animationType='slide'
            
        >
           <View style={{flex: 1, width: '100%', height:'100%', flexDirection:'column-reverse'}}>
                <View
                    style={{
                        width: '100%',
                        flex: 0.3,
                        backgroundColor:Colors.grey4,
                        borderTopRightRadius:50,
                        borderTopLeftRadius:50
                    }}
                >
                    
                        <FontAwesome
                            name="close"
                            size={25}
                            onPress={() => close(false)}
                            style={{
                                padding:5,
                                alignSelf:'flex-end',
                                right:15,
                                top:10
                            }}
                        />
                        <View style={{
                            width: '100%',
                            alignItems:'center',

                        }}>
                            <Text style={{
                                fontFamily:'Baloo2-Bold',
                                color:'#fff',
                                fontSize:16
                            }}>
                                {currentAudio.trackName}
                            </Text>
                        </View>
                        {
                            backGroundCurrentAudio._id === currentAudio._id ? 
                            (
                                <View
                                    style={{
                                        width: '100%',
                                        paddingHorizontal:30, 
                                        marginTop:20,
                                        marginBottom:10,
                                        paddingVertical:10,
                                        backgroundColor:Colors.grey1,
                                        opacity:0.7
                                    }}
                                >
                                    <Text style={{
                                        fontFamily:'Baloo2-Bold',
                                        fontSize:18,
                                        color: Colors.red3
                                    }}>
                                        Play
                                    </Text>
                                </View>
                            )
                            :
                            (
                                <TouchableOpacity
                                    style={{
                                        width: '100%',
                                        paddingHorizontal:30, 
                                        marginTop:20,
                                        marginBottom:10,
                                        paddingVertical:10,
                                        backgroundColor:Colors.grey1
                                    }}
                                    onPress={playThisSong}
                                >
                                    <Text style={{
                                        fontFamily:'Baloo2-Bold',
                                        fontSize:18,
                                        color: Colors.red3
                                    }}>
                                        Play
                                    </Text>
                                </TouchableOpacity>
                            )
                        }
                        <TouchableOpacity
                            style={{
                                width: '100%',
                                paddingHorizontal:30, 
                                paddingVertical:10,
                                backgroundColor:Colors.grey1
                            }}
                            onPress={openAddToPlayListScreen}
                        >
                            <Text style={{
                                fontFamily:'Baloo2-Bold',
                                fontSize:18,
                                color: Colors.red3
                            }}>
                                Add To Playlist
                            </Text>
                        </TouchableOpacity>
                    
                </View>
           </View>
        </Modal>
    );
};


export default OptionsModal;
