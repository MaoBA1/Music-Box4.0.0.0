import React, { useState } from 'react';
import { CheckBox } from 'react-native-elements';
import Colors from '../../Utitilities/AppColors';



const CheckBoxItem = props => {
    const [isChecked, setIsChecked] = useState(false);
    const hendelPress = () => {
        if(!isChecked) {
            props.add(props.skill);
            setIsChecked(true);
        } else {
            props.remove(props.skill);
            setIsChecked(false);
        }
    }

    return(
        <CheckBox
            title={props.skill}
            checked={isChecked}
            onPress={hendelPress}
            containerStyle={{ borderRadius:10, backgroundColor: Colors.grey4}}
            size={10}
            checkedColor={Colors.red3}
            textStyle={{color: Colors.red3, fontSize:10}}
        />
    )
}

export default CheckBoxItem;