import {login , logout} from "./login";
import {displayMap} from "./mapbox";
import {updateData} from "./updateSettings"

const mapBox =document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateSettingsForm = document.querySelector('.form-user-data');
const updatePassword = document.querySelector('.form-user-password');
if(mapBox){
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if (loginForm){
    loginForm.addEventListener('submit',e =>{
        e.preventDefault();
        const email =document.getElementById('email').value;
        const password =document.getElementById('password').value;
        login(email,password)
    });
}

if (logoutBtn){
    logoutBtn.addEventListener('click' , logout);
}

if (updateSettingsForm){
    updateSettingsForm.addEventListener('submit' , e => {
        e.preventDefault();
        const name =document.getElementById('name').value;
        const email =document.getElementById('email').value;
        updateData({name, email} , 'Data');
    })
}
if (updatePassword){
    updatePassword.addEventListener('submit' , async e => {
        e.preventDefault();
        document.querySelector('.btn--savePassword').textContent = 'Updating...';
        const oldpassword =document.getElementById('password-current').value;
        const newPassword =document.getElementById('password').value;
        const newPasswordConfirm =document.getElementById('password-confirm').value;
        await updateData({oldpassword, newPassword,newPasswordConfirm} , 'password');
        document.querySelector('.btn--savePassword').textContent = 'SAVE PASSWORD';
        document.getElementById('password-current').value='';
        document.getElementById('password').value='';
        document.getElementById('password-confirm').value='';
    });
}

