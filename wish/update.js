const frontend_base_url = "http://127.0.0.1:5500"
const backend_base_url = "http://127.0.0.1:8000"


function wishIdSearch() {
    const url = window.location.href
    const url_split = url.split(["?"])[1]
    const wish_id = url_split.split(["="])[1]

    return wish_id
}

deleted_image_ids = []

function wishImgDel(wish_img, deleted_image_id) {
    console.log(wish_img)   // <div id="wishImage0"> (이미지와 이미지 삭제 버튼) </div>
    console.log(deleted_image_id)
    deleted_image_ids.push(deleted_image_id)
    console.log("리스트:", deleted_image_ids)
    alert(`${wish_img.id}를 삭제합니다.`)
    return wish_img.innerHTML =""   // <div id="wishImage0"></div>

    
}

async function loadWish(){
    const wish_id=wishIdSearch()

    const response = await fetch(`${(backend_base_url)}/wishes/${wish_id}/`)
    const response_json = await response.json()
    console.log(response_json)

    // const wishAuthor = document.getElementById("wish-author")
    const wishTitle = document.getElementById("wish-title-input")
    const wishTags = document.getElementById("wish-tags")

    if (response_json.tags) {
        
        for (let i = 0; i < response_json.tags.length; i++) {

            const wishTag = response_json.tags[i].name
            wishTag.setAttribute("id",`wishTag${i}`)
            wishTag.setAttribute("class","border border-2 border-dark")
            wishTags.value += `${response_json.tags[i].name} `     
        }
    } else {}

    const wishName = document.getElementById("wish-name-input")
    const wishContent = document.getElementById("wish-content-input")
    const wish_images = document.getElementById("wish-images")
    const wishImages = document.createElement("div")
    wishImages.id = "wishImages"
    
    
    // image read와 image delete버튼을 담고 있는 div 만드는 반복문
    if (response_json.images && response_json.images.length > 0) {
        let imageHtml = '';
        console.log(response_json.images)
        for (let i = 0; i < response_json.images.length; i++) {
        const wishImage = document.createElement("div")
        wishImage.id = `wishImage${[i]}`    // image와 image 삭제 버튼을 담고 있는 div의 아이디 부여
        
        // 이미지 요소 하나씩 만들어주고 띄워주기
        const wish_img = document.createElement("image")
        imageHtml = `<img src="${backend_base_url}${response_json.images[i].image}" alt="Wish Image">`;
        wish_img.innerHTML = imageHtml;
        wish_img.id = `image${[i]}`
       
        wishImage.appendChild(wish_img)
        

        // 원본 이미지 삭제 버튼
        const wish_img_del_div =document.createElement('div')
        const wish_img_del = document.createElement("button")
        wish_img_del.innerText = "이미지 삭제"
        wish_img_del.setAttribute("type", "button")        
        wish_img_del.setAttribute("onclick", `wishImgDel(wishImage${[i]}, ${response_json.images[i].id})`)
        
        wish_img_del_div.appendChild(wish_img_del)
        wishImage.appendChild(wish_img_del_div)
        wishImages.appendChild(wishImage)
        
        }
    } else {}
    wish_images.appendChild(wishImages) // wish_images(이미지와 버튼이 들어간 wishImage들을 묶어놓은 wishImages를 )

    // 새로운 사진 추가
    const wishNewImages = document.createElement("div")
    const wish_img_input = document.createElement("input")
    wish_img_input.setAttribute("type", "file")
    wish_img_input.setAttribute("id", "wish-images-input")
    wish_img_input.setAttribute("multiple", "multiple")
    // wish_img_input.setAttribute("accept", ".png, .jpeg")
    wish_img_input.setAttribute("class", "form-control")
    
    wishNewImages.appendChild(wish_img_input)
    wish_images.appendChild(wishNewImages)

    //새로 추가할 이미지 인풋(multiple)
    // if (response_json.images && response_json.images.length > 0) {
    //     let imageHtml = '';
    //     for (let i = 0; i < response_json.images.length; i++) {
    //     }
    // }

    wishTitle.value = response_json.title
    wishName.value = response_json.wish_name
    wishContent.value = response_json.content
    // wishAuthor.innerText =response_json.author_id


    
}

async function handleUpdate() {

    const wish_id=wishIdSearch()

    var response = await fetch(`${(backend_base_url)}/wishes/${wish_id}/`, {
        method: 'GET',
        headers: {
            "Authorization" : "Bearer " + localStorage.getItem("access")
        },
    });
    const data = await response.json();
    console.log(data['images'])
    
    
    // local storage의 payload에서의 user_id 가져와 formData에 넣어준다.
    const payload = localStorage.getItem("payload")
    const payload_parse = JSON.parse(payload)
    const author_id = payload_parse.user_id
    
    // formData에 넣어줄 값들 정의
    const wishAuthor= author_id
    const wishTitle = document.getElementById("wish-title-input").value
    const wishName = document.getElementById("wish-name-input").value
    const wishContent = document.getElementById("wish-content-input").value

    // if (wishImages.length > 0) {
    //     wishImages = document.getElementById("").files
    // }
    
    
    const wishNewImages = document.getElementById("wish-images-input").files
    console.log(wishNewImages)
    




    const formData = new FormData();
    formData.append("author", wishAuthor);
    formData.append("title", wishTitle);
    formData.append("wish_name", wishName);
    formData.append("content", wishContent);
    // formData.append("images", wishImages);
    formData.append("deleted_image_ids", deleted_image_ids)
    if (wishNewImages.length > 0) {
        for (var i = 0; i < wishNewImages.length; i++) {
            formData.append("image", wishNewImages[i]);
            console.log(wishNewImages[i])
        }
    }
    
    // formData.append("image", '/media/wish/wish_img/1/IMG_4155_YlxPtOE.jpeg')



    // fetch api로 put 요청
    const access_token = localStorage.getItem("access")
    var response = await fetch(`${(backend_base_url)}/wishes/${wish_id}/`, {

        headers : {
            "Authorization": `Bearer ${access_token}`,
        },
        method : 'PUT',
        body : formData,
    })
    // alert(response.status)
    console.log(response.status)
    window.location.href = `/wish/detail.html?wish_id=${wish_id}`;
}


window.onload = () =>{
    loadWish()
}