export const hidAlert =() =>{
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
}

export const showAlert = (type , msg) =>{
    hidAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin' , markup);
    window.setTimeout(hidAlert,2000);
}