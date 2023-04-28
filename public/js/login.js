//to make new features work in older browsers
import '@babel/polyfill'
import  axios from 'axios';
import {showAlert} from "./alert";

export const login = async (email,password) =>{
    try{
        const res =await axios({
            method: 'POST' ,
            url: '/api/v1/users/login',
            data : {
                email,
                password
            }
        });

        if (res.data.status==='success'){
            showAlert('success','logged in successfully');
            window.setTimeout(()=>{
                location.assign('/');
            },500)
        }
        console.log(res);
    }catch (err) {
        showAlert('error',err.response.data.message);
    }
}

export const logout = async () =>{
    try{
        const res = await axios({
            method : 'GET' ,
            url: 'http://127.0.0.1:3000/api/v1/users/logout',
        });
        if (res.data.status==='success'){
            console.log('amrmama');
            showAlert('success' ,'logged out successfully');
            //true to make reload form the server not cache
            location.reload(true);
        }
    }catch (err){
        showAlert('error' ,'Error logging out , try again');
    }
}

