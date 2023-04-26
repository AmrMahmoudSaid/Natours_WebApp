import {login , logout} from "./login";
import {displayMap} from "./mapbox";
import {updateData} from "./updateSettings"
import {signup} from "./signup";
import {bookTour} from "./stripe";

const mapBox =document.getElementById('map');
const bookBtn = document.getElementById('book-tour');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateSettingsForm = document.querySelector('.form-user-data');
const updatePassword = document.querySelector('.form-user-password');
const signupForm = document.querySelector('.form--signup');
if(mapBox){
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if (signupForm){
    signupForm.addEventListener('submit' , e =>{
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email =document.getElementById('email').value;
        const password =document.getElementById('password').value;
        const passwordConfirm =document.getElementById('passwordConfirm').value;
        console.log(name,email,password);
        signup(name,email,password,passwordConfirm);
    })
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
        const form = new FormData();
        form.append('name' , document.getElementById('name').value);
        form.append('email' , document.getElementById('email').value);
        form.append('photo' , document.getElementById('photo').files[0]);
        updateData(form , 'Data');
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
if (bookBtn){
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset;
        console.log('amr');
        bookTour(tourId);
    });
}

