window.onload = () => {
    console.log("hi")
    request();
}

async function request() {
    const payload = localStorage.getItem("payload")
    const payload_parse = JSON.parse(payload) 
    console.log(payload_parse.profile_img)
    const request_user_id = payload_parse.user_id

    const response = await fetch(`http://127.0.0.1:8000/users/profile/${request_user_id}/`, {
        method: 'GET',
        headers: {
            "Authorization" : "Bearer " + localStorage.getItem("access")
        },
    });
    const data = await response.json();
    console.log(data)

    document.getElementById("my_profile_img").src = `http://127.0.0.1:8000${data.profile_img}/`;
    // payload_parse.profile_img 로 하면, 로그인 당시의 이미지로 되고 중간에 수정된 이미지가 반영이 안 됨.
    document.getElementById("nav_profile_img").src = `http://127.0.0.1:8000${data.profile_img}/`;

    document.getElementById("my_email").innerText = data.email;
    document.getElementById("update_username").value = data.username;
    document.getElementById("update_birthday").value = data.birthday;

}

async function OpenModal() {
    const modalCloseButton = document.getElementById('modalCloseButton');
    const modal = document.getElementById('modalContainer');

    modal.classList.remove('hidden');

    modalCloseButton.addEventListener('click', () => {
        modal.classList.add('hidden');

        // 닫기 누르면 모달 창 초기화
        document.getElementById("update_present_pw").value = "";
        document.getElementById("update_password_").value = "";
        document.getElementById("update_password_check").value = "";
        document.getElementById("pw_update_errors").innerText = "";
    });
}

async function handleUpdatePassword() {
    const payload = localStorage.getItem("payload")
    const payload_parse = JSON.parse(payload)
    const request_user_id = payload_parse.user_id

    const response = await fetch(`http://127.0.0.1:8000/users/profile/${request_user_id}/`, {
      method: "PUT",
      headers: {
        "Authorization" : "Bearer " + localStorage.getItem("access"),
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        "present_pw" : document.getElementById("update_present_pw").value,
        "password" : document.getElementById("update_password_").value,
        "password_check" : document.getElementById("update_password_check").value
    }),
    });

    if (response.status == 200) {
        document.getElementById("pw_update_errors").innerText = "비밀번호 수정됨.";
    } 
    else if (response.status == 403) {
        const errorData = await response.json();
        document.getElementById("pw_update_errors").innerText = errorData.message;
    }
    else {
        const errorData = await response.json();
        document.getElementById("pw_update_errors").innerText = errorData.password[0];
        console.log(errorData)
    }

}

async function handleUpdateProfile() {
    const payload = localStorage.getItem("payload")
    const payload_parse = JSON.parse(payload)
    const request_user_id = payload_parse.user_id

    const formData = new FormData();

    formData.append("username", document.getElementById("update_username").value);
    formData.append("birthday", document.getElementById("update_birthday").value);
    if (document.getElementById("update_profile_img").files[0]) {
        formData.append("profile_img", document.getElementById("update_profile_img").files[0]);
    }

    const response = await fetch(`http://127.0.0.1:8000/users/profile/${request_user_id}/`, {
      method: "PUT",
      headers: {
        "Authorization" : "Bearer " + localStorage.getItem("access")
      },
      body: formData,
    });

    console.log(response)
    if (response.status == 200) {
        location.reload()
    }
    else if (response.status == 403) {
        const errorData = await response.json();
        document.getElementById("profile_update_errors").innerText = errorData.message;
    } else {
        document.getElementById("profile_update_errors").innerText = "회원정보 수정 실패.";
    }
}