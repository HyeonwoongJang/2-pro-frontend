window.onload = () => {
    console.log("window loaded")

    const payload = localStorage.getItem("payload")
    const payload_parse = JSON.parse(payload)
    const request_username = payload_parse.username
    console.log(payload_parse)

    document.getElementById("wish_create_author").innerText = request_username
}

async function handleWishCreate() {
    const formData = new FormData();
    
    formData.append("title", document.getElementById("wish_create_title").value);
    formData.append("wish_name", document.getElementById("wish_create_wish_name").value);
    formData.append("content", document.getElementById("wish_create_content").value);

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
        console.log("title, content, wish_name은 필수 입력값입니다.")
        if (document.getElementById("wish_create_title").value == "") {
            document.getElementById("wish_create_title").style.borderBlockColor = "red";
            document.getElementById("wish_create_title").ariaPlaceholder = "title을 입력해주세요."
        } 
        if (document.getElementById("wish_create_wish_name").value == "") {
            document.getElementById("wish_create_wish_name").style.borderBlockColor = "red";
        } 
        if (document.getElementById("wish_create_content").value == "") {
            document.getElementById("wish_create_content").style.borderBlockColor = "red";
        }
    } else {
        console.log("Unauthorized. 로그인 해주세요.")

    }
}

async function handleWishImageUpload() {
    console.log("hi")

    if (document.getElementById("wish_create_images").files) {
        for (var i = 0; i < document.getElementById("wish_create_images").files.length; i++) {
            document.getElementById("wish_create_images_preview").innerHTML = "<h1> hi </h1>" 
        }

    }
}