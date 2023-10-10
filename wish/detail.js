const frontend_base_url = "http://127.0.0.1:5500"
const backend_base_url = "http://127.0.0.1:8000"

//async function getComment(wishId)를 따로 만들어서 따로 불러오는 것도 방법
async function getWish(wishId) {
    const response = await fetch(`${(backend_base_url)}/wishes/${wishId}/`)

    if (response.status == 200) {
        response_json = await response.json()
        return response_json
    } else {
        alert(response.status)
    }
}

async function loadWish(wishId) {
    const response = await getWish(wishId); // 오류(Uncaught (in promise) ReferenceError: getWish is not defined)로 인해 getWish 위에 정의

    console.log(response)
    console.log(response.images)
    const wishTitle = document.getElementById("wish-title")
    const wishName = document.getElementById("wish-name")
    const wishImage = document.getElementById("wish-image")
    const wishContent = document.getElementById("wish-content")

    wishTitle.innerText = response.title
    wishName.innerText = response.wish_name
    wishContent.innerText = response.content
    // console.log(wishImage)
    
    // const newImage = document.createElement("img")


    if (response.images && response.images.length > 0) {
        let imagesHtml = '';
        for (let i = 0; i < response.images.length; i++) {
            imagesHtml += `<img src="${backend_base_url}${response.images[i].image}" alt="Wish Image">`;    // alt -> img 태그에서 img가 안 나왔을 때 img를 대체하는 문자열/정보
        }
        wishImage.innerHTML = imagesHtml;
    }
}



// comment list 불러오기
async function loadComments(wishId) {
    const response = await getWish(wishId);
    const comments = response.comments;
    // console.log(comments)

    const commentAuthor = document.getElementById("comment-author")
    const commentContent = document.getElementById("comment-content")
    const commentCreatedAt = document.getElementById("comment-created")

    console.log(comments.length)
    if (comments && comments.length > 0) {
        for (let i = 0; i < comments.length; i++) {
            commentAuthor.innerText = comments[i].author;
            commentContent.innerText = comments[i].content;
            commentCreatedAt.innerText = comments[i].created_at;
        }            
    }
}







// URLSearchParams를 이용한 wishId 가져와 loadWish, loadComments 함수 사용해서 화면 띄우기
window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search);  // 화면이 로드되면 window.location.search를 이용해 로드된 화면의 url을 가져와서 urlParams라는 object로 만들어준다.
    const wishId = urlParams.get('wish_id');                        // wish_id를 가져오기
    console.log(wishId)
    await loadWish(wishId);
    await loadComments(wishId);

}   

// update 페이지 가게 하기 위한 url 설정
function wishDetailModify(){
    window.location.href = `$(frontend_base_url)/wish/update.html`  
}


