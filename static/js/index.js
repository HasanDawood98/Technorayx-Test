window.onload = function () {
    var loginForm = document.getElementById('login-form');
    var loginEmail = document.getElementById('login-email');
    var loginPassword = document.getElementById('login-password');

    loginForm.addEventListener(
        'submit',
        function (e) {
            e.preventDefault();
            axios
                .post('/user/login', {
                    email: loginEmail.value,
                    password: loginPassword.value,
                })
                .then(function (response) {
                    alert('Login Successful');

                    sessionStorage.setItem('name', response.data.user.fullname);
                    sessionStorage.setItem('email', response.data.user.email);
                    sessionStorage.setItem('profile_photo', response.data.user.profilePictureUrl);

                    window.location.href = '/dashboard.html';
                })
                .catch(function (err) {
                    console.log(err);
                    alert(err.response.data.error);
                });
        },
        false,
    );

    var registerForm = document.getElementById('register-form');
    var registerProfilePhoto = document.getElementById('register-profile-photo');
    var registerName = document.getElementById('register-name');
    var registerEmail = document.getElementById('register-email');
    var registerPassword = document.getElementById('register-password');
    var registerConfirmPassword = document.getElementById('register-confirm-password');

    registerForm.addEventListener(
        'submit',
        function (e) {
            e.preventDefault();

            var formData = new FormData();
            formData.append('fullname', registerName.value);
            formData.append('email', registerEmail.value);
            formData.append('password', registerPassword.value);
            formData.append('profilePicture', registerProfilePhoto.files[0]);

            axios
                .post('/user/register', formData)
                .then(function (response) {
                    alert('Register Successful');
                })
                .catch(function (err) {
                    console.log(err);
                    alert(err.response.data.error);
                });
        },
        false,
    );
};
