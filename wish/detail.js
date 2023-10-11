const frontend_base_url = "http://127.0.0.1:5500"
const backend_base_url = "http://127.0.0.1:8000"



// const url = window.location.href
// // const wish_id_call = window.location.pathname
// // const wish_id = url.get('wish_id'); 
// console.log(url)

// const url_split = url.split(["?"])[1]
// const wish_id = url_split.split(["="])[1]
// console.log(wish_id)

function wishIdSearch() {
    const url = window.location.href
    const url_split = url.split(["?"])[1]
    const wish_id = url_split.split(["="])[1]

    return wish_id
}


async function loadWish(){
    const wish_id=wishIdSearch()

    const response = await fetch(`${(backend_base_url)}/wishes/${wish_id}/`)
    const response_json = await response.json()

    const wishAuthor= document.getElementById("wish-author")
    const wishTitle = document.getElementById("wish-title")
    const wishName = document.getElementById("wish-name")
    const wishImage = document.getElementById("wish-image")
    const wishContent = document.getElementById("wish-content")

    wishAuthor.innerText = response_json.author
    wishAuthor.href = "http://127.0.0.1:5500/user/feed.html?author=" + response_json.author
    wishTitle.innerText = response_json.title
    wishName.innerText = response_json.wish_name
    wishContent.innerText = response_json.content

    if (response_json.images && response_json.images.length > 0) {
        let imagesHtml = '';
        for (let i = 0; i < response_json.images.length; i++) {
            imagesHtml += `<img src="${backend_base_url}${response_json.images[i].image}" alt="Wish Image">`;    // alt -> img 태그에서 img가 안 나왔을 때 img를 대체하는 문자열/정보
        }
        wishImage.innerHTML = imagesHtml;
    } else {
            const default_image_url = "/media/wish/wish_img/default_img.jpg";
            wishImage.innerHTML = `<img src="${backend_base_url}${default_image_url}" alt="Default Image">`;
        }
    
    // console.log(response_json)
    
}

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
    } else {
        alert("로그인 후 이용 가능합니다.")
    }
}

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
        console.log(response.status)
    } else {
        alert("로그인 후 이용 가능합니다.")
    }
}

async function handleUpdate(){
    wish_id=wishIdSearch()

    // 수정하기 버튼 누르면 가는 경로 정하기(미완)
    const wish_update = document.getElementById('wish_update')
    const wish_update_a = document.createElement('a')
    wish_update.innerText = "수정하기"
    wish_update_a.href = `${frontend_base_url}/wish/update.html?wish_id=${wish_id}`
    
    wish_update.appendChild(wish_update_a)
}

async function handleDelete() {
    wish_id=wishIdSearch()

    const response = await fetch(`${(backend_base_url)}/wishes/${wish_id}/`)
    const response_json = await response.json()
    var wish_author = response_json.author
    // console.log(wish_author)

    // 로그인해서 보고 있는 request_user의 username 가져오기
    const payload = localStorage.getItem("payload")
    const payload_parse = JSON.parse(payload)
    var request_user = payload_parse.username   // Uncaught (in promise) TypeError: Assignment to constant variable.
    console.log(request_user)

    // 로그인해서 보고 있는 request_user와 위시 작성자가 같다면, (미완성)
    if (wish_author = request_user) {   // 이게 동작하지 않고, 서버에서 막힘
        console.log(request_user)
        const access_token = localStorage.getItem("access")

        const response = await fetch(`${backend_base_url}/wishes/${wish_id}/`, {
    
            headers : {
                "Authorization": `Bearer ${access_token}`,
                "Content-type": "application/json",
            },
            method : 'DELETE',
        })
        // console.log(response.status)
        // window.location.href = `${frontend_base_url}/wish/main.html`;

    } else {
        console.log(response.status)
        alert(response.status)
    }
}

async function loadWishInfo(){
    wish_id=wishIdSearch()

    const response = await fetch(`${(backend_base_url)}/wishes/${wish_id}/`)
    const wish = await response.json()
    console.log(wish)

    const wish_detail_div = document.getElementById('wish_detail')
    const wish_info_div = document.getElementById('wish_info')
    const wish_likes_span = document.getElementById('likes')
    const wish_bookmarks_span = document.getElementById('bookmarks')

    wish_likes_span.innerText = wish.likes_count + " likes "
    wish_likes_span.onclick = wish.likes // 위시를 like한 유저들 리스트 (미완성)
    wish_bookmarks_span.innerText = wish.bookmarks_count + " bookmarks"
    wish_bookmarks_span.onclick = wish.bookmarks // 위시를 bookmark한 유저들 리스트(미완성)

    wish_info_div.appendChild(wish_likes_span)
    wish_info_div.appendChild(wish_bookmarks_span)
    wish_detail_div.appendChild(wish_info_div)

    

    // // request_user = wish_author에만 수정, 삭제 버튼 보이게 하기

    // const response = await fetch(`${(backend_base_url)}/wishes/${wish_id}/`)
    // const response_json = await response.json()
    // wish_author = response_json.author

    // // 로그인해서 보고 있는 request_user의 username 가져오기
    // const payload = localStorage.getItem("payload")
    // const payload_parse = JSON.parse(payload)
    // request_user = payload_parse.username
    // // console.log(request_user)

    // // 로그인해서 보고 있는 request_user와 위시 작성자가 같다면,
    // if (request_user == wish_author) {
    //     // 수정하기, 삭제하기 버튼 만들기
    //     const wish_detail_div = document.getElementById('wish_detail')
    //     const wish_delete_span = document.createElement('span')
    //     const wish_update_span = document.createElement('span')
    //     const wish_delete_btn = document.createElement('button')
    //     const wish_update_btn = document.createElement('button')

    //     wish_update_btn.innerText = "수정하기"
    //     console.log(wish_update_btn)
    //     // wish_update_btn.onclick = window.location.href=`${frontend_base_url}/wish/update.html?wish_id=${wish_id}`
    //     wish_delete_btn.innerText = "삭제하기"
    //     wish_delete_btn.onclick = handleDelete()

        
    //     wish_update_span.appendChild(wish_update_btn)
    //     wish_detail_div.appendChild(wish_update_span)
    //     wish_delete_span.appendChild(wish_delete_btn)
    //     wish_detail_div.appendChild(wish_delete_span)
    //     console.log(wish_detail_div)
    // }
}








// comment 작성
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
    
    loadComments(wish_id)

    } else {
        alert("로그인 후 댓글 작성이 가능합니다.")
    }



}


async function loadComments() {
    wish_id=wishIdSearch()

    const response = await fetch(`${(backend_base_url)}/wishes/${wish_id}/`)
    const response_json = await response.json()
    const comments = response_json.comments

    // console.log(comments)



    const comment_list = document.getElementById("comment_list")

    comment_list.innerHTML = "" // 댓글 작성 후 다시 댓글 불러올 때(새로고침) 초기화하고 불러오기

    if (comments && comments.length > 0) {
        for (let i = 0; i < comments.length; i++) {

            const comment_div = document.createElement('div')
            const comment_author_img = document.createElement('img')
            const comment_author_a = document.createElement('a')
            const comment_content_span = document.createElement('span')
            const comment_created_span = document.createElement('span')
        
            comment_author_a.innerText = comments[i].author
            comment_author_a.href = "http://127.0.0.1:5500/user/feed.html?author=" + comments[i].author
            comment_content_span.innerText = comments[i].content
            comment_created_span.innerText = comments[i].created_at

            comment_author_img
            
            comment_div.appendChild(comment_author_img)
            comment_div.appendChild(comment_author_a)
            comment_div.appendChild(comment_content_span)
            comment_div.appendChild(comment_created_span)

            comment_list.appendChild(comment_div)
        }            
    }

    
}

window.onload = () =>{
    loadWish()
    loadWishInfo()
    loadComments()
}