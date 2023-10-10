window.onload = () => {
    console.log('메인 페이지 연결 완료')

    if (localStorage.getItem("access")) {

        const payload = localStorage.getItem("payload")
        //console.log(payload)
    
        const payload_parse = JSON.parse(payload)                               // 문자열 형식의 JSON 데이터(payload)를 분해해서 Javascript 객체로 조립(변환)
        //console.log(payload_parse)

        const user_username = document.getElementById("user_username")
        //console.log(payload_parse.username)
        user_username.innerText = payload_parse.username

        const user_profile_img = document.getElementById("user_profile_img")
        //console.log(payload_parse.profile_img)
        if (payload_parse.profile_img) {
            user_profile_img.src = "http://127.0.0.1:8000" + payload_parse.profile_img
        } else {
            user_profile_img.src = "/media/wish/wish_img/4/%EC%A1%B1%EB%B0%9C%EC%97%94_%EC%86%8C%EB%A7%A5.jpg"
        }

        // 로그인 한 유저의 프로필 이미지(image 태그)의 class 값을 설정 -> css 파일에 style 정의
        user_profile_img.classList.add("profile_img")

        // 로그인한 유저에게는 로그아웃 버튼과 프로필사진이 보이고, 회원가입 버튼과 로그인 버튼이 안보이게 설정
        document.getElementById("user_info").style.display = ""
        document.getElementById("btn_logout").style.display = ""
        document.getElementById("btn_sign_up_page").style.display = "none"
        document.getElementById("btn_login_page").style.display = "none"
    }

    loadMainpage()

    async function loadMainpage() {

        const response = await fetch('http://127.0.0.1:8000/wishes/', {
            method : 'GET'
        })
        const response_json = await response.json()                             // response.json() 메서드 : Response 객체(HTTP 응답 상태 코드, 헤더, 본문 등의 정보가 포함)를 JSON 형식으로 조립(변환/파싱)해서 JavaScript 객체로 반환
        //console.log(response)
        //console.log(response_json)

        const wish_list = document.getElementById('id_wish_list')

        response_json.forEach(wish => {
            //console.log(wish)
            //console.log(wish.images)
            //console.log(wish.images[0])

            // HTML 요소를 생성
            const wish_div = document.createElement('div')
            const wish_author_a = document.createElement('a')
            const wish_url_a = document.createElement('a')
            const wish_title_p = document.createElement('p')
            const wish_thumbnail_img = document.createElement('img')
            const wish_info_p = document.createElement('p')
            const wish_like_span = document.createElement('span')
            const wish_bookmark_span = document.createElement('span')

            // 해당 a 태그의 내용을 wish의 작성자로 설정
            wish_author_a.innerText = wish.author

            // 위시 작성자(a 태그)의 href 속성 값을 설정 (해당 유저 피드 페이지 url 주소)
            wish_author_a.href = "http://127.0.0.1:5500/user/feed.html?author=" + wish.author

            // 해당 위시의 href 속성 값을 설정 (해당 위시의 상세 페이지 url 주소)
            wish_url_a.href = "http://127.0.0.1:5500/wish/detail.html?wish_id=" + wish.id

            // 해당 p 태그의 내용을 위시의 제목으로 설정
            wish_title_p.innerText = wish.title

            //////// 위시 이미지가 있으면 첫 번째 이미지를 썸네일로 지정 ////////
            //////// 위시 이미지가 없을 경우 디폴트 이미지 url을 정의 ////////
            if (wish.images.length > 0) {
                thumbnail = wish.images[0].image
                //console.log(thumbnail)
            } else {
                default_image_url = "/media/wish/wish_img/4/%EC%A1%B1%EB%B0%9C%EC%97%94_%EC%86%8C%EB%A7%A5.jpg"
                thumbnail = default_image_url
            }

            // 위시 썸네일(image 태그)의 src 속성 값을 설정 (해당 위시에 등록한 첫 번째 이미지 주소)
            wish_thumbnail_img.src = "http://127.0.0.1:8000" + thumbnail

            //위시의 좋아요 수와 북마크 수를 표시
            wish_like_span.innerText = wish.likes_count + " likes "
            wish_bookmark_span.innerText = wish.bookmarks_count + " bookmarks"

            // 위시의 HTML 구조 생성 (자식 요소로 추가)
            wish_url_a.appendChild(wish_title_p)
            wish_url_a.appendChild(wish_thumbnail_img)

            wish_info_p.appendChild(wish_like_span)
            wish_info_p.appendChild(wish_bookmark_span)

            wish_div.appendChild(wish_author_a)
            wish_div.appendChild(wish_url_a)
            wish_div.appendChild(wish_info_p)

            wish_list.appendChild(wish_div)
            
            // style이 필요한 태그에 class 값을 설정 -> css 파일에 style 정의
            wish_div.classList.add('wish')
            wish_thumbnail_img.classList.add('wish_thumbnail')

            // <div id="id_wish_list">
            //     <div class='wish'>
            //         <a> 위시 작성자</a>
            //         <a>
            //             <p>위시 제목</p>
            //             <image class='wish_thumbnail'>위시 썸네일</image>
            //         </a>
            //     </div>
            //     <div>
            //         <a> 위시 작성자</a>
            //         <a>
            //             <p>위시 제목</p>
            //             <image>위시 썸네일</image>
            //         </a>
            //         <div>
            //             <p>
            //                <span> 라이크 수 </span>
            //                <span> 북마크 수 </span>
            //             <p>
            //         <div>
            //     </div>
            // </div>
            
        })
    }
}

function handleLogout() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('payload')

    
    document.getElementById("user_info").style.display = 'none'
    document.getElementById("btn_logout").style.display = "none"
    document.getElementById("btn_sign_up_page").style.display = ""
    document.getElementById("btn_login_page").style.display = ""
}







