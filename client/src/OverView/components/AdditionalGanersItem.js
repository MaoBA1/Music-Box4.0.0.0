import React, { useState } from "react";
import { View, ImageBackground, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';




const AdditionalGanersItem = props => {
    const [isClicked, setIsClicked] = useState(false);
    const hendelClick = () => {
        if(isClicked) {
            setIsClicked(false);
            props.remove(props.gener);
        } else {
            setIsClicked(true);
            props.add(props.gener);
        }
    }

    return(
        <TouchableOpacity onPress={hendelClick}>
            <ImageBackground
                source={{uri:props.gener.generImage}}
                style={{width:100, height:70, margin:2, alignItems:'center', justifyContent:'center'}}
                opacity={isClicked ? 0.4 : 1}
            >
                {isClicked && <FontAwesome name="check" size={30} color={'#000'}/>}
            </ImageBackground>
        </TouchableOpacity>
    )
}


export default AdditionalGanersItem;