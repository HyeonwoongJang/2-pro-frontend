window.onload = () => {
    console.log('로그인 페이지 연결 완료')
}

async function handleLogin() {

    const email = document.getElementById('id_email').value
    const password = document.getElementById('id_password').value

    const response = await fetch('http://127.0.0.1:8000/users/login/', {

        headers : {
            'Content-type': 'application/json',
        },
        method : 'POST',
        body : JSON.stringify({
            "email" : email,
            "password" : password
        })
    })
    //console.log(response)

    if (response.status == 200) {

        const response_json = await response.json()

        localStorage.setItem("access", response_json.access)
        localStorage.setItem("refresh", response_json.refresh)
        

        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g,'/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        localStorage.setItem("payload",jsonPayload);

        alert('로그인 성공')

        window.location.href = "http://127.0.0.1:5500/wish/main.html"
    } else {
        alert('로그인 실패. 다시 시도하세요.')
    }
}