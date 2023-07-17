import React, { useState } from 'react';
import {
    View,
    Text, TouchableOpacity,
    FlatList, Modal
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import Colors from '../../../Utitilities/AppColors';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getArtistData } from '../../../ApiCalls';
import { addSkillToArtistSkillsAction, removeSkillFromArtistSkillsAction } from '../../../../store/actions/artistActions';

const skills = [
    {_id: 1, skill: "Singer"},
    {_id: 2, skill: "Drum Player"},
    {_id: 3, skill: "Guitar Player"},
    {_id: 4, skill: "Pianist"}

]
    

const EdditSkillsModal = props => {
    const dispatch = useDispatch();
    const artistSelector = useSelector(state => state.ArtistsReducer);
    const artistSkills = artistSelector?.ArtistDataReducer?.skills;
    const [noteVisible, setNoteVisible] = useState(false);

    const isInTheSkillList = skill => {
        let flag = false;
        artistSkills?.forEach(skil => {
            if(skil === skill) {
                flag = true;
                
            }
        })
        return flag;
    }

    const addSkillToArtistSkills = async (skill) => {
        setNoteVisible(false);
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
        if(userToken) {
            let action = addSkillToArtistSkillsAction(userToken, {skill:skill});
            try{
                await dispatch(action);
                getArtistData(dispatch, userToken);
            } catch(error) {
                console.log(error.message);
            }
        }
    }

    const removeSkillFromArtistSkills = async (skill) => {
        if(artistSkills.length == 1) {
            setNoteVisible(true);
            return;
        }
        setNoteVisible(false);
        const jsonToken = await AsyncStorage.getItem('Token');
        const userToken = jsonToken != null ? JSON.parse(jsonToken) : null;
        if(userToken) {
            let action = removeSkillFromArtistSkillsAction(userToken, {skill:skill});
            try{
                await dispatch(action);
                getArtistData(dispatch, userToken);
            } catch(error) {
                console.log(error.message);
            }
        }
    }


    return(
        <Modal
            visible={true}
            transparent={true}
            animationType='slide'
        >
            <View style={{flex: 1, width: '100%', height:'100%', backgroundColor:Colors.grey3, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{padding:20, alignItems: 'center', width:'90%', height:'60%', backgroundColor:Colors.grey1, borderRadius:20, shadowColor:'#000', shadowOffset:{width:0, height:3}, shadowOpacity:0.5, shadowRadius :5}}>
                    <View style={{marginBottom:10}}>
                        {noteVisible && <Text style={{fontFamily:'Baloo2-Medium', color:Colors.red3}}>You must have at least one skill</Text>}
                    </View>
                    <FlatList
                        data={skills}
                        keyExtractor={item => item._id}
                        renderItem={skill => 
                            <CheckBox
                                title={skill.item.skill}
                                checked={isInTheSkillList(skill.item.skill)}
                                onPress={isInTheSkillList(skill.item.skill)? () => removeSkillFromArtistSkills(skill.item.skill) : () => addSkillToArtistSkills(skill.item.skill)}
                                containerStyle={{ borderRadius:10, backgroundColor: Colors.grey4, width:300}}
                                size={10}
                                checkedColor={Colors.red3}
                                textStyle={{color: Colors.red3, fontSize:10}}
                            />
                        }
                    />
                    <TouchableOpacity onPress={() => props.func(false)} style={{bottom:60, width:100, padding:5, alignItems: 'center', justifyContent: 'center', backgroundColor:Colors.red3, borderRadius:50, borderWidth:2, borderColor:'#fff'}}>
                        <Text style={{fontFamily:'Baloo2-Medium', color:'#fff'}}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default EdditSkillsModal;