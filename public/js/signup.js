//to make new features work in older browsers
import '@babel/polyfill'
import  axios from 'axios';
import {showAlert} from "./alert";

export const signup = async (name,email,password,passwordConfirm) =>{
    try{
        const res =await axios({
            method: 'POST' ,
            url: '/api/v1/users/signup',
            data : {
                name,
                email,
                password,
                passwordConfirm
            }
        });

        if (res.data.status==='success'){
            showAlert('success','sign up in successfully');
            window.setTimeout(()=>{
                location.assign('/me');
            },500)
        }
        console.log(res);
    }catch (err) {
        showAlert('error',err.response.data.message);
    }
}
