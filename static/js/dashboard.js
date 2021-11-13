window.onload = function () {
    var userName = document.getElementById('user-name');
    var userEmail = document.getElementById('user-email');
    var userProfilePhoto = document.getElementById('user-profile-photo');

    userName.innerHTML = sessionStorage.getItem('name');
    userEmail.innerHTML = sessionStorage.getItem('email');
    userProfilePhoto.src = sessionStorage.getItem('profile_photo');
};
