window.onload = () => {
    request();
}

async function request() {
    const request_user_id = JSON.parse(localStorage.getItem("payload")).user_id

    const response = await fetch(`http://127.0.0.1:8000/users/profile/${request_user_id}/`, {
        method: 'GET',
        headers: {
            "Authorization" : "Bearer " + localStorage.getItem("access")
        },
    });
    const data = await response.json();

    document.getElementById("nav_profile_img").src = `http://127.0.0.1:8000${data.profile_img}/`;
    document.getElementById("author_profile_img").src = `http://127.0.0.1:8000${data.profile_img}/`;
    document.getElementById("wish_create_author").innerText = JSON.parse(localStorage.getItem("payload")).username
}


async function handleWishCreate() {
    const formData = new FormData();
    
    formData.append("title", document.getElementById("wish_create_title").value);
    formData.append("wish_name", document.getElementById("wish_create_wish_name").value);
    formData.append("content", document.getElementById("wish_create_content").value);
    formData.append("tags", document.getElementById("wish_create_tags").value);

    if (document.getElementById("wish_create_images").files) {
        for (var i = 0; i < document.getElementById("wish_create_images").files.length; i++) {
            formData.append("image", document.getElementById("wish_create_images").files[i]);
        }
    }
    
    const response = await fetch("http://127.0.0.1:8000/wishes/", {
      method: "POST",
      headers: {
        "Authorization" : "Bearer " + localStorage.getItem("access")
      },
      body: formData,
    });

    console.log(response)

    if (response.status == 201) {
        alert("게시글 작성 완료!")
        window.location.href = "/wish/main.html";
    } else if (response.status == 400) {
        console.log("title, content, wish_name, tags은 필수 입력값입니다.")
        if (document.getElementById("wish_create_title").value == "") {
            document.getElementById("wish_create_title").classList.remove("border-secondary-subtle");
            document.getElementById("wish_create_title").classList.add("border-danger", "shadow-sm");
        } else {
            document.getElementById("wish_create_title").classList.add("border-secondary-subtle");
            document.getElementById("wish_create_title").classList.remove("border-danger", "shadow-sm");
        }
        if (document.getElementById("wish_create_wish_name").value == "") {
            document.getElementById("wish_create_wish_name").classList.remove("border-secondary-subtle");
            document.getElementById("wish_create_wish_name").classList.add("border-danger", "shadow-sm");
        } else {
            document.getElementById("wish_create_wish_name").classList.add("border-secondary-subtle");
            document.getElementById("wish_create_wish_name").classList.remove("border-danger", "shadow-sm");
        }
        if (document.getElementById("wish_create_content").value == "") {
            document.getElementById("wish_create_content").classList.remove("border-secondary-subtle");
            document.getElementById("wish_create_content").classList.add("border-danger", "shadow-sm");
        } else {
            document.getElementById("wish_create_content").classList.add("border-secondary-subtle");
            document.getElementById("wish_create_content").classList.remove("border-danger", "shadow-sm");
        }
        if (document.getElementById("wish_create_tags").value == "") {
            document.getElementById("wish_create_tags").classList.remove("border-secondary-subtle");
            document.getElementById("wish_create_tags").classList.add("border-danger", "shadow-sm");
        } else {
            document.getElementById("wish_create_tags").classList.add("border-secondary-subtle");
            document.getElementById("wish_create_tags").classList.remove("border-danger", "shadow-sm");
        }
    } else {
        console.log("Unauthorized. 로그인 해주세요.")

    }
}

function readURL(input) {
    if (input.files && input.files.length > 0) {
        var previewContainer = document.getElementById('imagePreviewContainer');
        
        // 미리보기 컨테이너 초기화
        previewContainer.innerHTML = '';

        for (let i = 0; i < input.files.length; i++) { // var 말고 let 써야 함.
            console.log(i)
            var reader = new FileReader();
            reader.onload = function (e) {
                var img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('d-block', 'w-100');

                console.log(i)

                var carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel-item');
                carouselItem.appendChild(img);

                if (i == 0) {
                    carouselItem.classList.add('active');
                }

                previewContainer.appendChild(carouselItem);
            };
            reader.readAsDataURL(input.files[i]);

            
        }
    }
}