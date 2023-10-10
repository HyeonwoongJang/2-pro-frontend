window.onload = () => {
    console.log("회원가입 페이지 연결 완료")
}



async function handleSignup() {

    const email = document.getElementById('id_email').value
    const password = document.getElementById('id_password').value
    const password2 = document.getElementById('id_password2').value
    const username = document.getElementById('id_username').value
    const profile_img = document.getElementById('id_profile_img').files[0]
    const birthday = document.getElementById('id_birthday').value

    if (password == password2) {
        
        const formdata = new FormData()

        //console.log(formdata)

        formdata.append('email', email)
        formdata.append('password', password)
        formdata.append('username', username)
        if (profile_img) {
            formdata.append('profile_img', profile_img)
        }
        formdata.append('birthday', birthday)

        //console.log(formdata)

        const response = await fetch('http://127.0.0.1:8000/users/signup/', {
        method : 'POST',
        body : formdata
        })

        if (response.status == 201) {
            alert('가입 완료')
            window.location.href = "http://127.0.0.1:5500/user/login.html"
        } else {
            alert('회원가입에 실패. 다시 시도하세요.')
        }

    } else {
        alert('비밀번호와 비밀번호 확인이 일치하지 않습니다. 다시 시도하세요.');
    }
    
}

//-------------------------------------------------------------------------

// http://127.0.0.1:8000/users/signup/ net::ERR_FAILED 201 (Created) 에러가 뜨지만 페이지가 넘어가지 않고 가입은 되서 db에 저장됨.  

// 'http://127.0.0.1:5500/user/signup.html'에서 'http://127.0.0.1:8000/users/signup/'로 리소스 요청을 보내고 있는데,
// 브라우저의 보안 정책인 Same-Origin Policy를 위반하여 오류가 발생함. 응답의 내용에 접근할 수 없음. 그래서 window.location.href가 정의된 조건문이 안 돌아가고 alert('회원가입에 실패했습니다. 다시 시도하세요.')가 실행됨.

// 서버에서 다른 도메인에서의 요청을 허용하도록 응답에 CORS(Cross-Origin Resource Sharing) 헤더를 설정해야됨.

//-------------------------------------------------------------------------

// 1. 서버에서 CORS 헤더 설정 (가입 & 페이지 리디렉션 가능)
//https://pypi.org/project/django-cors-headers/

// 2. fetch 요청에 mode: 'no-cors' 옵션을 추가 (가입만 가능)

// const response = await fetch('http://127.0.0.1:8000/users/signup/', {
//     method: 'POST',
//     body: formdata,
//     mode: 'no-cors'      "no-cors" 모드로 요청을 보내면, 응답의 내용에 접근할 수 없음.
// })

//-------------------------------------------------------------------------

// console.log(document.getElementById('id_profile_img'))          // <input type="file" id="id_profile_img">
// console.log(document.getElementById('id_profile_img').files)    // FileList {0: File, length: 1} // .files는 HTML5에서 파일 입력(input type="file") 요소에서 선택한 파일을 나타내는 프로퍼티 // FileList 객체를 반환하며, FileList는 선택한 파일의 목록을 포함
// console.log(document.getElementById('id_profile_img').files[0]) // File {name: '족발엔 소맥.jpg', lastModified: 1696330701049, lastModifiedDate: Tue Oct 03 2023 19:58:21 GMT+0900 (한국 표준시), webkitRelativePath: '', size: 689147, …}
// console.log(document.getElementById('id_birthday').value)       // 2023-10-12

//-------------------------------------------------------------------------
