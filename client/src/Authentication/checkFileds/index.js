import {View, Text} from 'react-native';
import Colors from '../../Utitilities/AppColors';

export const checkDob = dob => {
   return dob.getFullYear() >= 2018 && 
   (<Text style={{fontFamily:'Baloo2-Medium', fontSize:15, color: Colors.red1}}>Invalid birth date</Text>)
}

export const checkEmail = email => {
    const check = email.includes('@') && email.includes('.com') && email.indexOf('@') < email.indexOf('.com');
    return !check &&
    (<Text style={{fontFamily:'Baloo2-Medium', fontSize:15, color: Colors.red1}}>Invalid Email</Text>)
}

export const checkPhoneNumber = (digits3,rest) => {
    return !(digits3.length == 3 && rest.length == 7) &&
    (<Text style={{fontFamily:'Baloo2-Medium', fontSize:15, color: Colors.red1}}>Invalid Phone Number</Text>)
}

export const checkPassword = password => {
   return password.length < 8 &&
   (<Text style={{fontFamily:'Baloo2-Medium', fontSize:15, color: Colors.red1}}>Passowrd must includes atleast 8 chars</Text>)
}

export const checkPasswordBackUp = (password, passwordBackUp) => {
   return password != passwordBackUp && 
   (<Text style={{fontFamily:'Baloo2-Medium', fontSize:15, color: Colors.red1}}>Passowrds not match</Text>)
}