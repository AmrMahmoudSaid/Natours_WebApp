import '@babel/polyfill'
import  axios from 'axios';
import {showAlert} from "./alert";
export const updateData = async (data , type) =>{
    //type Pass or Data[name , email]
    try{
        const url = type==='password' ?'/api/v1/users/changePassword' : '/api/v1/users/updateMe';
        const res =await axios({
            method: 'PATCH' ,
            url,
            data
        });

        if (res.data.status==='success'){
            showAlert('success','successfully update');
        }
        console.log(res);
    }catch (err) {
        showAlert('error',err.response.data.message);
    }
}