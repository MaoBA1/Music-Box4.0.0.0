import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image, ImageBackground
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../../Utitilities/AppColors';



const SongItem = props => {
    const [isClicked, setIsClicked] = useState(false);
    const hendelClick = () => {
        if(isClicked) {
            setIsClicked(false);
            props.remove(props.song);
            
        } else {
            setIsClicked(true);
            props.add(props.song);
        }
    }

    return(
        <TouchableOpacity 
            onPress={hendelClick} 
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                marginHorizontal:8
            }}
        >
            <ImageBackground
                source={{uri:props.song.trackImage}}
                style={{width:60, height:60, margin:5, alignItems:'center', justifyContent:'center'}}
                opacity={isClicked ? 0.4 : 1}
                imageStyle={{borderRadius:20}}
            >
                {isClicked && <FontAwesome name="check" size={30} color={Colors.red3}/>}
            </ImageBackground>
            <Text numberOfLines={1} style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>{props.song.trackName}</Text>
        </TouchableOpacity>
    )
}

export default SongItem;