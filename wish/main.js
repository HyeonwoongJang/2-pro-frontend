window.onload = () => {
    console.log('메인 페이지 연결 완료')

    if (localStorage.getItem("access")) {

        const payload = localStorage.getItem("payload")
        //console.log(payload)
    
        const payload_parse = JSON.parse(payload)                               // 문자열 형식의 JSON 데이터(payload)를 분해해서 Javascript 객체로 조립(변환)
        //console.log(payload_parse)

        const user_feed_page = document.getElementById("user_feed_page")
        user_feed_page.href = "/user/feed.html?author=" + payload_parse.username

        const user_username = document.getElementById("user_username")
        //console.log(payload_parse.username)
        user_username.innerText = payload_parse.username

        const user_profile_img = document.getElementById("user_profile_img")
        //console.log(payload_parse.profile_img)
        if (payload_parse.profile_img) {
            user_profile_img.src = "http://127.0.0.1:8000" + payload_parse.profile_img
        } 

        const wish_create_page = document.getElementById("wish_create_page")
        wish_create_page.href = "/wish/create.html"

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
            rander_wish(wish)
        })
    }
}

function handleLogout() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('payload')

    
    document.getElementById("user_info").style.display = 'none'
    document.getElementById("btn_logout").style.display = 'none'
    document.getElementById("btn_sign_up_page").style.display = ""
    document.getElementById("btn_login_page").style.display = ""
}

async function sort() {
    const sort_option = document.getElementById('sort_option').value;

    // loadMainpage 함수와 같은 방식으로 Fetch 데이터 로드 
    const response = await fetch('http://127.0.0.1:8000/wishes/', {
        method: 'GET'
    })
    const response_json = await response.json()

    // 정렬 옵션에 따라 배열을 정렬
    if (sort_option == 'latest') {
        // 날짜 비교 함수를 사용하여 최신순으로 정렬 (sort 메서드)
        // 반환 값이 양수인 경우: b가 a보다 뒤에 위치하도록 정렬
        // 반환 값이 음수인 경우: a가 b보다 뒤에 위치하도록 정렬
        // 반환 값이 0인 경우: 순서 변화 없음
        response_json.sort((a, b) => {return new Date(b.created_at) - new Date(a.created_at)})      // 'Date' :  JavaScript의 내장 객체 / 객체의 created_at 속성을 'Date'객체로 변환
    } else if (sort_option == 'most_likes') {
        // 좋아요 수를 기준으로 내림차순으로 정렬
        response_json.sort((a, b) => {return b.likes_count - a.likes_count})
    } else if (sort_option == 'most_bookmarks') {
        // 북마크 수를 기준으로 내림차순으로 정렬
        response_json.sort((a, b) => {return b.bookmarks_count - a.bookmarks_count})
    }

    // 재정렬을 위해 위시 목록을 초기화
    const wish_list = document.getElementById('id_wish_list')
    wish_list.innerHTML = ''

    // 재정렬된 위시 목록을 다시 렌더링
    response_json.forEach(wish => {
        rander_wish(wish)
    });
}

async function search() {
    const category_option = document.getElementById('category_option').value;
    const search_box = document.getElementById('search_box').value;

    const response = await fetch('http://127.0.0.1:8000/wishes/', {
        method: 'GET'
    })
    const response_json = await response.json()

    // 재정렬을 위해 위시 목록을 초기화
    const wish_list = document.getElementById('id_wish_list')
    wish_list.innerHTML = ''

    if (category_option == 'title') {
        response_json.forEach(wish => {
            if (wish.title.includes(search_box)) {
                rander_wish(wish)
            }
        })
    } else if (category_option == 'content') {
        response_json.forEach(wish => {
            if (wish.content.includes(search_box)) {
                rander_wish(wish)
            }
        })
    } else if (category_option == 'author') {
        response_json.forEach(wish => {
            if (wish.author.includes(search_box)) {
                rander_wish(wish)
            } 
        })
    } else {
        response_json.forEach(wish => {
            rander_wish(wish)
        })
    }
}

function rander_wish(wish) {
    //console.log(wish)
    //console.log(wish.images)
    //console.log(wish.images[0])

    const wish_list = document.getElementById('id_wish_list')

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
    wish_author_a.href = "/user/feed.html?author=" + wish.author

    // 해당 위시의 href 속성 값을 설정 (해당 위시의 상세 페이지 url 주소)
    wish_url_a.href = "/wish/detail.html?wish_id=" + wish.id

    // 해당 p 태그의 내용을 위시의 제목으로 설정
    wish_title_p.innerText = wish.title

    //////// 위시 이미지가 있으면 첫 번째 이미지를 썸네일로 지정 ////////
    //////// 위시 이미지가 없을 경우 디폴트 이미지 url을 정의 ////////
    if (wish.images.length > 0) {
        thumbnail = wish.images[0].image
        //console.log(thumbnail)
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
    }
