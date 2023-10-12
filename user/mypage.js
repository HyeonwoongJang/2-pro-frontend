window.onload = () => {
    
loadMyPage()
    
    async function loadMyPage() {

        const currentURL = window.location.href

        const user_username = currentURL.split('=')[1]
        //console.log(user_username)

        const page_owner = document.getElementById("page_owner_1")
        page_owner.innerText = user_username



        const response = await fetch(`http://127.0.0.1:8000/users/${user_username}/mypage/`, {
            method : 'GET'
        })
        const response_json = await response.json()
        //console.log(response)
        console.log(response_json)

        const profile_img = document.getElementById("profile_img")
        profile_img.src = "http://127.0.0.1:8000" + response_json.profile_img
        profile_img.classList.add("profile_img")

        if (localStorage.getItem("access")) {
            document.getElementById("btn_logout").style.display = ""
            document.getElementById("btn_sign_up_page").style.display = "none"
            document.getElementById("btn_login_page").style.display = "none"
            document.getElementById("btn_wish_list").style.display = ""
            
            document.getElementById("following_count").innerText = response_json.following_count
            document.getElementById("follower_count").innerText = response_json.follower_count
            
            document.getElementById("page_owner_2").innerText = user_username
            document.getElementById("page_owner_3").innerText = user_username
            document.getElementById("page_owner_4").innerText = user_username


            const payload = localStorage.getItem("payload")
            const payload_parse = JSON.parse(payload) 

            if (payload_parse.username == user_username) {
                document.getElementById("btn_myprofile_page").style.display = ""
                document.getElementById("btn_follow").style.display = "none"
            }

        } 

        const wish_list = document.getElementById('wish_list')
        const wishes = response_json.wishes
        
        wishes.forEach(wish => {
            rander_wish(wish)
        })
    }
}

function handleLogout() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('payload')

    
    document.getElementById("btn_logout").style.display = "none"
    document.getElementById("btn_sign_up_page").style.display = ""
    document.getElementById("btn_login_page").style.display = ""
    document.getElementById("btn_wish_list").style.display = "none"
    document.getElementById("btn_myprofile_page").style.display = "none"
}

async function follow() {
    if (localStorage.getItem("access")) {

        const access_token = localStorage.getItem("access")

        const currentURL = window.location.href

        const user_username = currentURL.split('=')[1]

        const response = await fetch(`http://127.0.0.1:8000/users/follow/${user_username}/`, {
            headers: {
                'Authorization' : `Bearer ${access_token}`
            },
            method: 'POST'
        })

        console.log(response.json())

        if (response.status == 200) {
            window.location.href = "/user/mypage.html?author=" + user_username
        }

    } else {
        alert('로그인이 필요합니다.')
    }
}

async function following_count() {
    
    const following_list = document.getElementById("following_list")
    if (following_list.style.display === "none") {
        following_list.style.display = ""

        following_list.innerHTML=""
        following_list.classList.add('following_list')

        const currentURL = window.location.href

        const user_username = currentURL.split('=')[1]

        const response = await fetch(`http://127.0.0.1:8000/users/${user_username}/mypage/`, {
            method : 'GET'
        })
        const response_json = await response.json()

        followings = response_json.following

        followings.forEach(following => {
            const following_div = document.createElement('div')
            const following_a = document.createElement('a')

            following_a.innerText = following.username
            following_a.href="/user/mypage.html?author=" + following.username

            following_div.appendChild(following_a)
            following_list.appendChild(following_div)
        })
    } else {
        following_list.style.display = "none"
    }
}

async function follower_count() {
    
    const follower_list = document.getElementById("follower_list")

    if (follower_list.style.display === "none") {
        follower_list.style.display = ""

        follower_list.innerHTML=""
        follower_list.classList.add('follower_list')

        const currentURL = window.location.href

        const user_username = currentURL.split('=')[1]

        const response = await fetch(`http://127.0.0.1:8000/users/${user_username}/mypage/`, {
            method : 'GET'
        })
        const response_json = await response.json()

        followers = response_json.follower

        followers.forEach(follower => {
            const follower_div = document.createElement('div')
            const follower_a = document.createElement('a')

            follower_a.innerText = follower.username
            follower_a.href="/user/mypage.html?author=" + follower.username

            follower_div.appendChild(follower_a)
            follower_list.appendChild(follower_div)
        })
    } else {
        follower_list.style.display = "none"
    }
}

async function sort() {

    const currentURL = window.location.href

    const user_username = currentURL.split('=')[1]

    const response = await fetch(`http://127.0.0.1:8000/users/${user_username}/mypage/`, {
        method : 'GET'
    })
    const response_json = await response.json()
    //console.log(response_json)
    const wishes = response_json.wishes
    // console.log(wishes)

    const sort_option = document.getElementById('sort_option').value;
    
    if (sort_option == 'latest') {
        wishes.sort((a, b) => {return new Date(b.created_at) - new Date(a.created_at)})
    } else if (sort_option == 'most_likes') {
        wishes.sort((a, b) => {return b.likes_count - a.likes_count})
    } else if (sort_option == 'most_bookmarks') {
        wishes.sort((a, b) => {return b.bookmarks_count - a.bookmarks_count})
    }

    // 재정렬을 위해 위시 목록을 초기화
    const wish_list = document.getElementById('wish_list')
    wish_list.innerHTML = ''
    

    // 재정렬된 위시 목록을 다시 렌더링
    wishes.forEach(wish => {
        rander_wish(wish)
    });
}

async function search() {

    const currentURL = window.location.href

    const user_username = currentURL.split('=')[1]

    const response = await fetch(`http://127.0.0.1:8000/users/${user_username}/mypage/`, {
        method : 'GET'
    })
    const response_json = await response.json()
    //console.log(response_json)
    const wishes = response_json.wishes
    // console.log(wishes)

    const category_option = document.getElementById('category_option').value;
    const search_box = document.getElementById('search_box').value;

    // 재정렬을 위해 위시 목록을 초기화
    const wish_list = document.getElementById('wish_list')
    wish_list.innerHTML = ''

    if (category_option == 'title') {
        wishes.forEach(wish => {
            if (wish.title.includes(search_box)) {
                rander_wish(wish)
            }
        })
    } else if (category_option == 'content') {
        wishes.forEach(wish => {
            if (wish.content.includes(search_box)) {
                rander_wish(wish)
            }
        })
    } else if (category_option == 'author') {
        wishes.forEach(wish => {
            if (wish.author.includes(search_box)) {
                rander_wish(wish)
            } 
        })
    } else {
        wishes.forEach(wish => {
            rander_wish(wish)
        })
    }
}

function rander_wish(wish) {
    

    // HTML 요소를 생성
    const wish_div = document.createElement('div')
    const wish_author_a = document.createElement('a')
    const wish_url_a = document.createElement('a')
    const wish_title_p = document.createElement('p')
    const wish_thumbnail_img = document.createElement('img')
    const wish_info_p = document.createElement('p')
    const wish_like_span = document.createElement('span')
    const wish_bookmark_span = document.createElement('span')

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
                
}

async function my_wish_list() {
    const btn_my_wish_list = document.getElementById('btn_my_wish_list')

    const currentURL = window.location.href

    const user_username = currentURL.split('=')[1]

    window.location.href = "/user/mypage.html?author=" + user_username
}

async function bookmark_wish_list() {

    const currentURL = window.location.href

    const user_username = currentURL.split('=')[1]

    const response = await fetch(`http://127.0.0.1:8000/users/${user_username}/mypage/`, {
        method : 'GET'
    })
    const response_json = await response.json()
    const bookmark_wishes = response_json.bookmark_wishes

    const wish_list = document.getElementById('wish_list')
    wish_list.innerHTML = ''
    
    bookmark_wishes.forEach(wish => {
        rander_wish(wish)
    });

    document.getElementById("b_wish_option").style.display = ""
    document.getElementById("m_wish_option").style.display = "none"
    document.getElementById("l_wish_option").style.display = "none"
}

async function b_sort() {

    const currentURL = window.location.href

    const user_username = currentURL.split('=')[1]

    const response = await fetch(`http://127.0.0.1:8000/users/${user_username}/mypage/`, {
        method : 'GET'
    })
    const response_json = await response.json()
    const bookmark_wishes = response_json.bookmark_wishes

    const b_sort_option = document.getElementById('b_sort_option').value;

    if (b_sort_option == 'latest') {
        bookmark_wishes.sort((a, b) => {return new Date(b.created_at) - new Date(a.created_at)})
    } else if (b_sort_option == 'most_likes') {
        bookmark_wishes.sort((a, b) => {return b.likes_count - a.likes_count})
    } else if (b_sort_option == 'most_bookmarks') {
        bookmark_wishes.sort((a, b) => {return b.bookmarks_count - a.bookmarks_count})
    }

    const wish_list = document.getElementById('wish_list')
    wish_list.innerHTML = ''
    
    bookmark_wishes.forEach(wish => {
        rander_wish(wish)
    });
}

async function b_search() {
    
    const currentURL = window.location.href

    const user_username = currentURL.split('=')[1]

    const response = await fetch(`http://127.0.0.1:8000/users/${user_username}/mypage/`, {
        method : 'GET'
    })
    const response_json = await response.json()
    const bookmark_wishes = response_json.bookmark_wishes

    const b_category_option = document.getElementById('b_category_option').value;
    const b_search_box = document.getElementById('b_search_box').value;

    const wish_list = document.getElementById('wish_list')
    wish_list.innerHTML = ''

    if (b_category_option == 'title') {
        bookmark_wishes.forEach(wish => {
            if (wish.title.includes(b_search_box)) {
                rander_wish(wish)
            }
        })
    } else if (b_category_option == 'content') {
        bookmark_wishes.forEach(wish => {
            if (wish.content.includes(b_search_box)) {
                rander_wish(wish)
            }
        })
    } else if (b_category_option == 'author') {
        bookmark_wishes.forEach(wish => {
            if (wish.author.includes(b_search_box)) {
                rander_wish(wish)
            } 
        })
    } else {
        bookmark_wishes.forEach(wish => {
            rander_wish(wish)
        })
    }
}

async function like_wish_list() {

    document.getElementById("l_wish_option").style.display = ""
    document.getElementById("m_wish_option").style.display = "none"
    document.getElementById("b_wish_option").style.display = "none"

    const currentURL = window.location.href

    const user_username = currentURL.split('=')[1]

    const response = await fetch(`http://127.0.0.1:8000/users/${user_username}/mypage/`, {
        method : 'GET'
    })
    const response_json = await response.json()
    const like_wishes = response_json.like_wishes

    const wish_list = document.getElementById('wish_list')
    wish_list.innerHTML = ''
    
    like_wishes.forEach(wish => {
        rander_wish(wish)
    });


}

async function l_sort() {

    const currentURL = window.location.href

    const user_username = currentURL.split('=')[1]

    const response = await fetch(`http://127.0.0.1:8000/users/${user_username}/mypage/`, {
        method : 'GET'
    })
    const response_json = await response.json()
    const like_wishes = response_json.like_wishes

    const l_sort_option = document.getElementById('l_sort_option').value;

    if (l_sort_option == 'latest') {
        like_wishes.sort((a, b) => {return new Date(b.created_at) - new Date(a.created_at)})
    } else if (l_sort_option == 'most_likes') {
        like_wishes.sort((a, b) => {return b.likes_count - a.likes_count})
    } else if (l_sort_option == 'most_bookmarks') {
        like_wishes.sort((a, b) => {return b.bookmarks_count - a.bookmarks_count})
    }

    const wish_list = document.getElementById('wish_list')
    wish_list.innerHTML = ''
    
    like_wishes.forEach(wish => {
        rander_wish(wish)
    });
}

async function l_search() {
    
    const currentURL = window.location.href

    const user_username = currentURL.split('=')[1]

    const response = await fetch(`http://127.0.0.1:8000/users/${user_username}/mypage/`, {
        method : 'GET'
    })
    const response_json = await response.json()
    const like_wishes = response_json.like_wishes

    const l_category_option = document.getElementById('l_category_option').value;
    const l_search_box = document.getElementById('l_search_box').value;

    const wish_list = document.getElementById('wish_list')
    wish_list.innerHTML = ''

    if (l_category_option == 'title') {
        like_wishes.forEach(wish => {
            if (wish.title.includes(l_search_box)) {
                rander_wish(wish)
            }
        })
    } else if (l_category_option == 'content') {
        like_wishes.forEach(wish => {
            if (wish.content.includes(l_search_box)) {
                rander_wish(wish)
            }
        })
    } else if (l_category_option == 'author') {
        like_wishes.forEach(wish => {
            if (wish.author.includes(l_search_box)) {
                rander_wish(wish)
            } 
        })
    } else {
        like_wishes.forEach(wish => {
            rander_wish(wish)
        })
    }
}
