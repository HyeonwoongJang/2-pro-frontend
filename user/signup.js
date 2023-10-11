window.onload = () => {
    console.log("회원가입 페이지 연결 완료")
}

async function handleSignup() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;
    const profile_img = document.getElementById("profile_img");
    const birthday = document.getElementById("birthday").value;
  
    console.log(username, email, password, password2);
  
    //각 유효성 검사 에러메세지 변수값
    const usernameError = document.getElementById("username-error");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const password2Error = document.getElementById("password2-error");
  
    //innertext를 먼저 초기화를 시켜놓고 각 에러 변수의 메세지를 추가하고 지정함
    usernameError.innerText = "";
    emailError.innerText = "";
    passwordError.innerText = "";
    password2Error.innerText = "";
  
    // 필드 값 자정해주고 필드 비어있을경우 에러 메세지 발생
    const usernameValue = username;
    const emailValue = email;
    const passwordValue = password;
    const password2Value = password2;
  
    if (!usernameValue) {
      usernameError.innerText = "이름을 입력하세요.";
      return;
    }
    if (!emailValue) {
      emailError.innerText = "이메일을 입력하세요.";
      return;
    }
    if (!passwordValue) {
      passwordError.innerText = "비밀번호를 입력하세요.";
      return;
    }
    if (!password2Value) {
      password2Error.innerText = "비밀번호 확인을 입력하세요.";
      return;
    }
  
    // 비밀번호가 일치하지 않을 때
    if (password !== password2) {
      password2Error.innerText = "비밀번호가 일치하지 않습니다.";
      return;
    }
  
    //form data 사용하여 서버로 전송
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("birthday", birthday);
  
    // 프로필 이미지가 선택되었을 때만 FormData에 추가
    //존재하면 프로필 이미지를 FormData에 추가, 아니면 FormData에는 해당 필드를 추가하지 않도록 변경
    if (profile_img.files[0]) {
      formData.append("profile_img", profile_img.files[0]);
    }
  
    const response = await fetch("http://127.0.0.1:8000/users/signup/", {
      method: "POST",
      body: formData,
    });
  
    if (response.status === 201) {
      // 회원가입 성공
      alert("회원가입이 성공적으로 완료되었습니다.");
      window.location.href = "/login/"; // 로그인 페이지 URL로 이동
    } else if (response.status === 400) {
      // 유효성 검사 실패 시 오류 메시지를 받아와 화면에 표시
      const errorData = await response.json();
  
      if (errorData.message) {
        // username 중복 에러 메시지가 있다면 표시
        if (errorData.message.username) {
          usernameError.innerText = errorData.message.username[0];
        }
  
        // password 유효성 에러 메시지가 있다면 표시
        if (errorData.message.password) {
          const passwordErrors = errorData.message.password;
          const passwordErrorMessage = passwordErrors.join("\n"); // 여러 오류 메시지를 개행으로 연결
          passwordError.innerText = passwordErrorMessage;
        }
  
        // email 에러 중복 메시지가 있다면 표시
        if (errorData.message.email) {
          emailError.innerText = errorData.message.email[0];
        }
      }
    }
  }

// async function handleSignup() {

//     const email = document.getElementById('id_email').value
//     const password = document.getElementById('id_password').value
//     const password2 = document.getElementById('id_password2').value
//     const username = document.getElementById('id_username').value
//     const profile_img = document.getElementById('id_profile_img').files[0]
//     const birthday = document.getElementById('id_birthday').value

//     if (password == password2) {
        
//         const formdata = new FormData()

//         //console.log(formdata)

//         formdata.append('email', email)
//         formdata.append('password', password)
//         formdata.append('username', username)
//         if (profile_img) {
//             formdata.append('profile_img', profile_img)
//         }
//         formdata.append('birthday', birthday)

//         //console.log(formdata)

//         const response = await fetch('http://127.0.0.1:8000/users/signup/', {
//         method : 'POST',
//         body : formdata
//         })

//         if (response.status == 201) {
//             alert('가입 완료')
//             window.location.href = "http://127.0.0.1:5500/user/login.html"
//         } else {
//             alert('회원가입에 실패. 다시 시도하세요.')
//         }

//     } else {
//         alert('비밀번호와 비밀번호 확인이 일치하지 않습니다. 다시 시도하세요.');
//     }
    
// }

