const frontend_base_url = "http://127.0.0.1:5500"
const backend_base_url = "http://127.0.0.1:8000"



// 위시 아이디 값 찾는 함수
function wishIdSearch() {
    const url = window.location.href
    const url_split = url.split(["?"])[1]
    const wish_id = url_split.split(["="])[1]

    return wish_id
}

// 상세 위시 불러오기, request_user와 wish_author가 같을 때 수정/삭제 버튼 생성
async function loadWish(){
    const wish_id=wishIdSearch()

    const response = await fetch(`${(backend_base_url)}/wishes/${wish_id}/`)
    const response_json = await response.json()

    const wishAuthor= document.getElementById("wish-author")
    const wishTitle = document.getElementById("wish-title")
    const wishTags = document.getElementById("wish-tags")  
    const wishName = document.getElementById("wish-name")
    const wishImage = document.getElementById("wish-image")
    const wishContent = document.getElementById("wish-content")

    wishAuthor.innerText = response_json.author
    wishAuthor.href = `${frontend_base_url}/user/mypage.html?author=` + response_json.author
    // tag들 불러오기
    if (response_json.tags.length > 0) {
        
        for (let i = 0; i < response_json.tags.length; i++) {

            const wishTag = document.createElement('span')
            wishTag.setAttribute("id",`wishTag${i}`)
            wishTag.setAttribute("class","border border-5 border-dark")
            wishTag.innerText = response_json.tags[i].name
            wishTags.appendChild(wishTag)        
        }
    } else {}
    
    wishTitle.innerText = response_json.title
    wishName.innerText = response_json.wish_name
    wishContent.innerText = response_json.content

    

    // 위시 이미지 불러오기
    if (response_json.images && response_json.images.length > 0) {
        let imagesHtml = '';
        for (let i = 0; i < response_json.images.length; i++) {
            imagesHtml += `<img src="${backend_base_url}${response_json.images[i].image}" alt="Wish Image">`;    // alt -> img 태그에서 img가 안 나왔을 때 img를 대체하는 문자열/정보
        }
        wishImage.innerHTML = imagesHtml;
    } else {
            wishImage.innerHTML = `<img src="${backend_base_url}/media/images/DefaultThumbnail.png" alt="Default Image">`;
        }
    
    var wish_author = wishAuthor.innerText
    if (localStorage.getItem("access")) {
        // 로그인해서 보고 있는 request_user의 username 가져오기
        const payload = localStorage.getItem("payload")
        const payload_parse = JSON.parse(payload)
        request_user = payload_parse.username
        // console.log(request_user)

        // 수정하기, 삭제하기 버튼 만들기 (조건:로그인해서 보고 있는 request_user와 위시 작성자가 같다)
        if (request_user == wish_author) {

            const wish_author_only = document.getElementById('wish_author_only')

            const wish_update_span = document.createElement('span')
            const wish_delete_span = document.createElement('span')
            const wish_update_btn = document.createElement('button')
            
            const wish_delete_btn = document.createElement('button')
            

            wish_update_btn.innerText = "수정하기"
            wish_update_btn.setAttribute("onclick", `location.href="${frontend_base_url}/wish/update.html?wish_id=${wish_id}"`)
            
            wish_delete_btn.innerText = "삭제하기"
            wish_delete_btn.setAttribute("onclick", `handleDelete(${wish_id})`)

            
            wish_update_span.appendChild(wish_update_btn)
            wish_delete_span.appendChild(wish_delete_btn)
            wish_author_only.appendChild(wish_update_span)            
            wish_author_only.appendChild(wish_delete_span)

        } else{}
    }
    
}

// 위시 좋아요
async function submitLike() {
    wish_id=wishIdSearch()

    if (localStorage.getItem("access")) {

        const access_token = localStorage.getItem("access")
        // console.log(wishId)
        // console.log(access_token)
        const response = await fetch(`${backend_base_url}/wishes/${wish_id}/like/`, {
    
            headers : {
                "Authorization": `Bearer ${access_token}`,
                "Content-type": "application/json",
            },
            method : 'POST'
        })
        alert("좋아요를 눌렀습니다.")
        location.reload();
    } else {
        alert("로그인 후 이용 가능합니다.")
    }
}

// 위시 북마크
async function submitBookmark() {
    wish_id=wishIdSearch()

    if (localStorage.getItem("access")) {

        const access_token = localStorage.getItem("access")
        // console.log(wishId)
        // console.log(access_token)
        const response = await fetch(`${backend_base_url}/wishes/${wish_id}/bookmark/`, {
    
            headers : {
                "Authorization": `Bearer ${access_token}`,
                "Content-type": "application/json",
            },
            method : 'POST'
        })
        alert("북마크에 등록했습니다.")
        location.reload();
    } else {
        alert("로그인 후 이용 가능합니다.")
    }
}



// 삭제하기 버튼을 눌렀을 때 실행되는 위시 삭제 함수
async function handleDelete(wish_id) {

    const response = await fetch(`${(backend_base_url)}/wishes/${wish_id}/`)
    const response_json = await response.json()
    var wish_author = response_json.author
    // console.log(wish_author)

    if (localStorage.getItem("access")) {
    // 로그인해서 보고 있는 request_user의 username 가져오기
        const payload = localStorage.getItem("payload")
        const payload_parse = JSON.parse(payload)
        var request_user = payload_parse.username   // Uncaught (in promise) TypeError: Assignment to constant variable.
        console.log(request_user)

         // 로그인해서 보고 있는 request_user와 위시 작성자가 같다면, (미완성)
        if (wish_author == request_user) {   // 이게 동작하지 않고, 서버에서 막힘 -> 조건식은 ==
            console.log(request_user)
            const access_token = localStorage.getItem("access")

            const response = await fetch(`${backend_base_url}/wishes/${wish_id}/`, {
        
                headers : {
                    "Authorization": `Bearer ${access_token}`,
                    "Content-type": "application/json",
                },
                method : 'DELETE',
            })
            console.log(response.status);
            window.location.href = `${frontend_base_url}/wish/main.html`;

        } else {
            console.log(response.status)
            alert(response.status)
        }
    } else {}   
}
// Wish의 상세 정보: 좋아요 북마크 버튼과 수 *작성시간, 수정시간
async function loadWishInfo(){
    wish_id=wishIdSearch()

    const response = await fetch(`${(backend_base_url)}/wishes/${wish_id}/`)
    const wish = await response.json()
    console.log(wish)


    const wish_detail_div = document.getElementById('wish_detail')
    const wish_info_div = document.getElementById('wish_info')
    const wish_like_bookmark =document.getElementById('like_bookmark')

    const wish_created_div =document.getElementById('wish_created')
    const wish_updated_div = document.getElementById('wish_updated')
    const wish_likes_span = document.getElementById('likes')
    const wish_bookmarks_span = document.getElementById('bookmarks')

    wish_created_div.innerText = "작성시간: " + wish.created_at
    wish_updated_div.innerText = "수정시간: " + wish.updated_at

    wish_info_div.appendChild(wish_created_div)
    wish_info_div.appendChild(wish_updated_div)
    wish_likes_span.innerText = wish.likes_count + " likes "
    // wish_likes_span.onclick = wish.likes // 위시를 like한 유저들 리스트 (미완성)
    wish_bookmarks_span.innerText = wish.bookmarks_count + " bookmarks"
    // wish_bookmarks_span.onclick = wish.bookmarks // 위시를 bookmark한 유저들 리스트(미완성)

    wish_like_bookmark.appendChild(wish_likes_span)
    wish_like_bookmark.appendChild(wish_bookmarks_span)
    wish_info_div.appendChild(wish_like_bookmark)
    wish_detail_div.appendChild(wish_info_div)

}



// comment 작성 **오류: 댓글 작성하고 엔터 누르면 (http://127.0.0.1:5500/wish/detail.html?)로 이동**
async function submitComment() {
    wish_id=wishIdSearch()
    console.log(wish_id)

    // const commentForm = document.getElementById("comment-form")
    const newComment = document.getElementById("new-comment").value;
    console.log(newComment);


    if (localStorage.getItem("access")) {

        const access_token = localStorage.getItem("access")
        // console.log(wishId)
        // console.log(access_token)
        const response = await fetch(`${backend_base_url}/wishes/${wish_id}/comment/`, {
    
            headers : {
                "Authorization": `Bearer ${access_token}`,
                "Content-type": "application/json",
            },
            method : 'POST',
            body : JSON.stringify({
                "content": newComment
            })
        })
    alert("댓글을 작성했습니다.")
    loadComments(wish_id)

    } else {
        alert("로그인 후 댓글 작성이 가능합니다.")
    }



}


async function commentDelete(comment_id) {
    wish_id=wishIdSearch()

    const access_token = localStorage.getItem("access")
    const response = await fetch(`${backend_base_url}/wishes/${wish_id}/comment/${comment_id}`, {
        
        headers : {
            "Authorization": `Bearer ${access_token}`
        },
        method : 'DELETE',
    })
    alert("댓글을 삭제했습니다.")
    loadComments(wish_id)
    console.log(response.status)
}


async function loadComments() {
    wish_id=wishIdSearch()

    const response = await fetch(`${(backend_base_url)}/wishes/${wish_id}/comment/`)
    const comments = await response.json()


    const comment_list = document.getElementById("comment_list")
    console.log(comment_list)
    comment_list.innerHTML = "" // 댓글 작성 후 다시 댓글 불러올 때(새로고침) 초기화하고 불러오기

    if (comments && comments.length > 0) {
        for (let i = 0; i < comments.length; i++) {

            const comment_div = document.createElement('div')
            comment_div.name =comments[i].id
            
            // comment id
            const comment_author = document.createElement('span')
            const comment_author_img = document.createElement('img')
            const comment_author_a = document.createElement('a')
            const comment_content_span = document.createElement('span')
            const comment_created_span = document.createElement('span')

            comment_author_a.innerText = comments[i].author
            comment_author_a.href = "/user/mypage.html?author=" + comments[i].author
            comment_content_span.innerText = comments[i].content
            comment_created_span.innerText = comments[i].created_at

            // comment_author_img 를 서버에서 가져오기 위해선, comment serializer에서 프로필 이미지를 가져오도록 만들어야 하나? (wish의 author의 이미지를 가져오는 것도 동일)
            // comment_author_img.src = `${backend_base_url}` + comments.author.profile_img.src

            
            comment_author.appendChild(comment_author_img)
            comment_author.appendChild(comment_author_a)
            comment_div.appendChild(comment_author)
            comment_div.appendChild(comment_content_span)
            comment_div.appendChild(comment_created_span)


            // 요청 user와 comment 작성자가 같을 때, comment 삭제 버튼 생성
            const payload = localStorage.getItem("payload")
            const payload_parse = JSON.parse(payload)
            request_user = payload_parse.username
            if (request_user == comments[i].author) {                
                const comment_delete_btn = document.createElement('button')
                comment_delete_btn.type = 'button'
                comment_delete_btn.innerText = "삭제"
                comment_delete_btn.setAttribute("onclick", `commentDelete(${comments[i].id})`)  // comment의 pk값을 commentDelete함수의 인자에 넣어서 데이터를 보내준다.
                comment_div.appendChild(comment_delete_btn)
            } else {}

            
            comment_list.appendChild(comment_div)
            console.log(comment_div)
        }            
    }
    

    
}

window.onload = () =>{
    loadWish()
    loadWishInfo()
    loadComments()
}