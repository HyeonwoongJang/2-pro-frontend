let currentPage = 1;
let sortedPage = 1;
let searchedPage = 1;
let followingfeedPage = 1;

window.onload = () => {
    console.log('메인 페이지 연결 완료')

    if (localStorage.getItem("access")) {
        document.getElementById("nav_wish_create_page").style.display = ""
        document.getElementById("nav_logout").style.display = ""
        document.getElementById("nav_my_page").style.display = ""
        document.getElementById("nav_user_username").style.display = ""
        document.getElementById("nav_profile_img").style.display = ""
        document.getElementById("wish_feed").style.display = ""
        document.getElementById("following_feed").style.display = ""

        
        
        
        document.getElementById("nav_sign_up_page").style.display = "none"
        document.getElementById("nav_login_page").style.display = "none"

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

        // payload_parse.profile_img 로 하면, 로그인 당시의 이미지로 되고 중간에 수정된 이미지가 반영이 안 됨.
        document.getElementById("nav_profile_img").src = `http://127.0.0.1:8000${data.profile_img}/`;
        document.getElementById('nav_user_username').innerText = data.username
        document.getElementById('nav_my_page').href = `/user/mypage.html?author=${data.username}`
    }

    loadMainPage(currentPage)
}

function btn_next_page() {
    currentPage++;
    loadMainPage(currentPage);
}

function btn_previous_page() {
    if (currentPage > 1) {
        currentPage--;
        loadMainPage(currentPage);
    }
}


async function loadMainPage(page) {


    const response = await fetch(`http://127.0.0.1:8000/wishes/?page=${page}`, {
        method: 'GET'
    })
    const response_json = await response.json()
    //console.log(response)
    //console.log(response_json)

    document.getElementById("following_feed_option").style.display = "none"
    document.getElementById("wish_feed_option").style.display = ""

    // 리스트
    const wish_list = document.getElementById('id_wish_list')
    wish_list.innerHTML = ""


    const wishes = response_json.results;
    console.log(wishes)
    wishes.forEach(wish => {
        rander_wish(wish)
    })

    // 페이지네이션
    document.getElementById('pagination').style.display = ""
    document.getElementById('sorted_pagination').style.display = "none"
    document.getElementById('searched_pagination').style.display = "none"

    const next_page = document.getElementById('next_page')
    const previous_page = document.getElementById('pre_page')

    //console.log(response_json.next)
    if (response_json.next && response_json.previous) {

        next_page.style.display= ""
        previous_page.style.display= ""
        next_page.onclick = function () {
            loadMainPage(page + 1);
        } 
        previous_page.onclick = function () {
            loadMainPage(page - 1);
        }
    } else if (response_json.next && !response_json.previous) {
            next_page.style.display= ""
            previous_page.style.display= "none"
            next_page.onclick = function () {
                loadMainPage(page + 1);
            }
    } else if (!response_json.next && response_json.previous) {
            next_page.style.display= "none"
            previous_page.style.display= ""
            previous_page.onclick = function () {
                loadMainPage(page - 1);
            }
    } else {
        next_page.style.display= "none"
        previous_page.style.display= "none"
    }

    const sort = document.getElementById('sort')

    sort.onclick = function () {
        sortMain(page)
    }

    const search = document.getElementById('search')

    search.onclick = function () {
        searchMain(page)
    }
}

function sorted_btn_next_page() {
    sortedPage++;
    sortMain(sortedPage);
}

function sorted_btn_previous_page() {
    if (sortedPage > 1) {
        sortedPage--;
        sortMain(sortedPage);
    }
}


function handleLogout() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('payload')

    document.getElementById("nav_wish_create_page").style.display = 'none'
    document.getElementById("nav_logout").style.display = 'none'
    document.getElementById("nav_my_page").style.display = 'none'
    document.getElementById("nav_user_username").style.display = 'none'
    document.getElementById("nav_profile_img").style.display = 'none'

    document.getElementById("nav_sign_up_page").style.display = ""
    document.getElementById("nav_login_page").style.display = ""

}


async function sortMain(page) {

    const sort_option = document.getElementById('sort_option').value;

    // loadMainpage 함수와 같은 방식으로 Fetch 데이터 로드 
    const response = await fetch(`http://127.0.0.1:8000/wishes/?page=${page}`, {
        method: 'GET'
    })
    const response_json = await response.json()
    const sorted_wishes = response_json.results

    console.log(response_json)
    // 정렬 옵션에 따라 배열을 정렬
    if (sort_option == 'latest') {
        // 날짜 비교 함수를 사용하여 최신순으로 정렬 (sort 메서드)
        // 반환 값이 양수인 경우: b가 a보다 뒤에 위치하도록 정렬
        // 반환 값이 음수인 경우: a가 b보다 뒤에 위치하도록 정렬
        // 반환 값이 0인 경우: 순서 변화 없음
        sorted_wishes.sort((a, b) => {return new Date(b.created_at) - new Date(a.created_at)})      // 'Date' :  JavaScript의 내장 객체 / 객체의 created_at 속성을 'Date'객체로 변환
    } else if (sort_option == 'most_likes') {
        // 좋아요 수를 기준으로 내림차순으로 정렬
        sorted_wishes.sort((a, b) => {return b.likes_count - a.likes_count})
    } else if (sort_option == 'most_bookmarks') {
        // 북마크 수를 기준으로 내림차순으로 정렬
        sorted_wishes.sort((a, b) => {return b.bookmarks_count - a.bookmarks_count})
    }

    // 재정렬을 위해 위시 목록을 초기화
    const wish_list = document.getElementById('id_wish_list')
    wish_list.innerHTML = ''

    // 재정렬된 위시 목록을 다시 렌더링
    sorted_wishes.forEach(wish => {
        rander_wish(wish)
    })

        // 페이지네이션
        document.getElementById('pagination').style.display = "none"
        document.getElementById('sorted_pagination').style.display = ""
        document.getElementById('searched_pagination').style.display = "none"

        const sorted_next_page = document.getElementById('sorted_next_page')
        const sorted_previous_page = document.getElementById('sorted_pre_page')

    if (response_json.next && response_json.previous) {

        sorted_next_page.style.display= ""
        sorted_previous_page.style.display= ""
        sorted_next_page.onclick = function () {
            sortMain(page + 1);
        } 
        sorted_previous_page.onclick = function () {
            sortMain(page - 1);
        }
    } else if (response_json.next && !response_json.previous) {
        sorted_next_page.style.display= ""
        sorted_previous_page.style.display= "none"
        sorted_next_page.onclick = function () {
            sortMain(page + 1);
        }
    } else if (!response_json.next && response_json.previous) {
        sorted_next_page.style.display= "none"
        sorted_previous_page.style.display= ""
        sorted_previous_page.onclick = function () {
            sortMain(page - 1);
        }
    } else {
        sorted_next_page.style.display= "none"
        sorted_previous_page.style.display= "none"
    }
}

function searched_btn_next_page() {
    searchedPage++;
    searchMain(searchedPage);
}

function searched_btn_previous_page() {
    if (searchedPage > 1) {
        searchedPage--;
        searchMain(searchedPage);
    }
}

async function searchMain(page) {
    const category_option = document.getElementById('category_option').value;
    const search_box = document.getElementById('search_box').value;

    const response = await fetch(`http://127.0.0.1:8000/wishes/?page=${page}`, {
        method: 'GET'
    })
    const response_json = await response.json()
    const searched_wishes = response_json.results
    console.log(searched_wishes)
    // 재정렬을 위해 위시 목록을 초기화
    const wish_list = document.getElementById('id_wish_list')
    wish_list.innerHTML = ''

    if (category_option == 'title') {
        searched_wishes.forEach(wish => {
            if (wish.title.includes(search_box)) {
                rander_wish(wish)
            }
        })
    } else if (category_option == 'content') {
        searched_wishes.forEach(wish => {
            if (wish.content.includes(search_box)) {
                rander_wish(wish)
            }
        })
    } else if (category_option == 'author') {
        searched_wishes.forEach(wish => {
            if (wish.author.includes(search_box)) {
                rander_wish(wish)
            } 
        })
    } else if (category_option == 'tag') {
        searched_wishes.forEach(wish => {
            if (wish.tags.includes(search_box)) {
                rander_wish(wish)
            } 
        })
    } else {
        searched_wishes.forEach(wish => {
            rander_wish(wish)
        })
    }

       // 페이지네이션
       document.getElementById('pagination').style.display = "none"
       document.getElementById('sorted_pagination').style.display = "none"
       document.getElementById('searched_pagination').style.display = ""
       
       const searched_next_page = document.getElementById('searched_next_page')
       const searched_previous_page = document.getElementById('searched_pre_page')

   if (response_json.next && response_json.previous) {

        searched_next_page.style.display= ""
        searched_previous_page.style.display= ""
        searched_next_page.onclick = function () {
            searchMain(page + 1);
       } 
       searched_previous_page.onclick = function () {
            searchMain(page - 1);
       }
   } else if (response_json.next && !response_json.previous) {
        searched_next_page.style.display= ""
        searched_previous_page.style.display= "none"
        searched_next_page.onclick = function () {
            searchMain(page + 1);
           }
   } else if (!response_json.next && response_json.previous) {
        searched_next_page.style.display= "none"
        searched_previous_page.style.display= ""
        searched_previous_page.onclick = function () {
            searchMain(page - 1);
           }
   } else {
        searched_next_page.style.display= "none"
        searched_previous_page.style.display= "none"
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
    wish_author_a.href = "/user/mypage.html?author=" + wish.author

    // 해당 위시의 href 속성 값을 설정 (해당 위시의 상세 페이지 url 주소)
    wish_url_a.href = "/wish/detail.html?wish_id=" + wish.id

    // 해당 p 태그의 내용을 위시의 제목으로 설정
    wish_title_p.innerText = wish.title

    //////// 위시 첫 번째 이미지를 썸네일로 지정 ////////
    if (wish.images.length > 0) {
        wish_thumbnail_img.src = "http://127.0.0.1:8000" + wish.images[0].image
    } else {
        wish_thumbnail_img.src = "http://127.0.0.1:8000/media/images/DefaultThumbnail.png"
    }
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

async function following_feed() {

    const payload = localStorage.getItem("payload")
    const payload_parse = JSON.parse(payload) 

    const response = await fetch(`http://127.0.0.1:8000/users/${payload_parse.username}/feed/`, {
        method : 'GET'
    })

    const response_json = await response.json()
    console.log(response_json)
    const following_wishes = response_json.following_wishes
    console.log(following_wishes)

    const wish_list = document.getElementById('id_wish_list')
    wish_list.innerHTML = ''

    following_wishes.forEach(wish => {
        rander_wish(wish)
    })

    document.getElementById("following_feed_option").style.display = ""
    document.getElementById("wish_feed_option").style.display = "none"
}

async function following_sort() {
    const sort_option = document.getElementById('f-sort_option').value;

    const payload = localStorage.getItem("payload")
    const payload_parse = JSON.parse(payload) 

    const response = await fetch(`http://127.0.0.1:8000/users/${payload_parse.username}/feed/`, {
        method : 'GET'
    })

    const response_json = await response.json()
    console.log(response_json)
    const following_wishes = response_json.following_wishes
    console.log(following_wishes)


    if (sort_option == 'f-latest') {
        following_wishes.sort((a, b) => {return new Date(b.created_at) - new Date(a.created_at)})
    } else if (sort_option == 'f-most_likes') {
        following_wishes.sort((a, b) => {return b.likes_count - a.likes_count})
    } else if (sort_option == 'f-most_bookmarks') {
        following_wishes.sort((a, b) => {return b.bookmarks_count - a.bookmarks_count})
    }

    const wish_list = document.getElementById('id_wish_list')
    wish_list.innerHTML = ''

    following_wishes.forEach(wish => {
        rander_wish(wish)
    });
}

async function following_search() {

    const category_option = document.getElementById('f-category_option').value;
    const search_box = document.getElementById('f-search_box').value;

    const payload = localStorage.getItem("payload")
    const payload_parse = JSON.parse(payload) 

    const response = await fetch(`http://127.0.0.1:8000/users/${payload_parse.username}/feed/`, {
        method : 'GET'
    })

    const response_json = await response.json()
    //console.log(response_json)

    const following_wishes = response_json.following_wishes
    console.log(following_wishes)

    const wish_list = document.getElementById('id_wish_list')
    wish_list.innerHTML = ''

    if (category_option == 'f-title') {
        following_wishes.forEach(wish => {
            if (wish.title.includes(search_box)) {
                rander_wish(wish)
            }
        })
    } else if (category_option == 'f-content') {
        following_wishes.forEach(wish => {
            if (wish.content.includes(search_box)) {
                rander_wish(wish)
            }
        })
    } else if (category_option == 'f-author') {
        following_wishes.forEach(wish => {
            if (wish.author.includes(search_box)) {
                rander_wish(wish)
            } 
        })
    } else if (category_option == 'tag') {
        following_wishes.forEach(wish => {
            if (wish.tags.includes(search_box)) {
                rander_wish(wish)
            } 
        })
    } else {
        following_wishes.forEach(wish => {
            rander_wish(wish)
        })
    }
}