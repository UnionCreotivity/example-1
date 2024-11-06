
//所有英文標題
splitText(".en-title")
splitText(".first-page .titleBox p")
function gradientSquareAnimation() {
    const square = document.querySelectorAll(".gradient-square .box")
    square.forEach((item, i) => {
        this[`box${i}`] = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: "top 90%",
            }
        })
        this[`box${i}`].to(item, {
            backgroundSize: "100% 100%",
            delay: i == 0 ? 0.5 : 0,
            duration: 2,
            opacity: 0.4
        })
    })
}
function imgScale() {
    const target = document.querySelectorAll(".imgBox .gray");
    target.forEach((item, i) => {
        const img = item.parentNode.children[0]
        this[`box${i}`] = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: "top center",
                scrub: 1,
                end: `+=${window.innerHeight / 1.5}`,
                toggleActions: "play none none reverse"
            }
        })
        this[`box${i}`].fromTo(img, {
            scale: 1.4
        }, {
            scale: 1,
        })
    })
}
imgScale()


function toggleMenu() {
    const btn = document.querySelector("header .close");
    const menu = document.querySelector("header ul")
    btn.addEventListener("click", () => {
        btn.classList.toggle("active")
        menu.classList.toggle("active-ul")
    })
}
toggleMenu()

//first-page-animation except newsInner 、 index 、 progress

function firstPageAnimation() {
    let gg = gsap.timeline()
    gg.from(".first-page .titleBox h2 .blind:nth-child(1)", {
        opacity: 0,
        y: -45,
        duration: 1.2,
    }).from(".first-page .titleBox h2 .blind:not(:first-child)", {
        opacity: 0,
        x: 35,
        duration: 1.2,
        stagger: 0.07
    }, ">-0.6").from(".first-page .titleBox p .blind", {
        opacity: 0,
        x: -35,
        duration: 1.2,
        stagger: 0.07
    }, ">-1").from(".first-page .imgBox:nth-child(1)", {
        y: 50,
        opacity: 0,
        duration: 1.2
    }, "<").from(".first-page .imgBox:nth-child(2)", {
        y: -50,
        opacity: 0,
        duration: 1.2,
        onStart: () => {
            let gg3 = gsap.timeline({
                paused: true
            })
            gg3.fromTo(".first-page .imgBox .gray", {

                clipPath: "polygon(0 0 , 100% 0 , 100% 0 , 0 0 )",
            }, {
                clipPath: "polygon(0 0 , 100% 0 , 100% 100% , 0 100% )",
                duration: 0.8,
                ease: "none"
            })
            gg3.progress(1)
            setTimeout(() => {
                gg3.reverse()
            }, 900)

        }
    }, "<").from(".first-page .imgBox img", {
        scale: 1.15,
        duration: 1.2,
    }, ">-0.3")

    let gg2 = gsap.timeline({
        scrollTrigger: {
            trigger: ".first-page",
            start: "top top",
            scrub: 2,
            end: `+=${window.innerHeight * 1.5}`
        }
    })

    gg2.to(".first-page .gradient-square .box", {
        y: -window.innerHeight,
    }).to(".first-page .gradient-square > :nth-child(even)", {
        y: -window.innerHeight,
    }, "<+0.03")

}

//loading effect
let loadingPageAnimation;
let flag = false;
function loadingAnimation() {
    loadingPageAnimation = gsap.timeline({
        repeat: -1
    });
    loadingPageAnimation.fromTo("#loading-page .loading-progress", {
        transform: "scaleY(0)",
    }, {
        transform: "scaleY(1)",
        duration: 2,
    }).fromTo("#loading-page .loading-progress", {
        opacity: 1
    }, {
        opacity: 0,
        duration: 1.2,
        onStart: () => {
            if (flag) {
                loadingPageAnimation.kill()
            }
        }
    }, ">-0.08")
}
loadingAnimation()

function loadingOut() {
    const loadingPage = document.querySelector("#loading-page");
    flag = true
    return new Promise((resolve) => {
        // setTimeout(() => {
            
        // }, 2000)
        loadingPage.style.opacity = 0;
            gradientSquareAnimation();
            firstPageAnimation();

            resolve()
    })
}

// =============================== 檢查input ====================================
function check_input(id, txt) {
    if ($(id).attr('type') == 'radio' || $(id).attr('type') == 'checkbox') {

        if ($(id + ':checked').val() == undefined) {
            $(id).css('borderColor', 'red');
            return txt;
        } else {
            $(id).css('borderColor', 'rgba(0,0,0,0.1)');
            return "";
        }
    } else {
        if ($(id).val() == '') {
            $(id).css('borderColor', 'red');
            return txt;
        } else {
            $(id).css('borderColor', 'rgba(0,0,0,0.1)');
            return "";
        }
    }
}


//----- 送出資料 -------
/**
 * 
 */
function sub_data ({
    form_DOM='#put_form', 
    ajax_url='ajax.php', 
    img_arr=[], 
    imgs_arr=[], 
    img_area_arr=[], 
    ck_arr=[], 
    ajax_type='insert', 
    other_arr=[], 
    headers={},
    location_url=`admin.php?MT_id=${$('#mt_id').val()}`, 
    test=false }) {

	let form_data = new FormData();
	$.each($(`${form_DOM} [type="text"], 
				${form_DOM} [type="hidden"], 
				${form_DOM} [type="file"], 
				${form_DOM} [type="checkbox"]:checked, 
				${form_DOM} [type="radio"]:checked, 
				${form_DOM} select,
				${form_DOM} [type="number"],
                ${form_DOM} [type="password"],
				${form_DOM} textarea`), function (indexInArray, valueOfElement) { 
		//console.log($(this).attr('name'), $(this).val());
		form_data.append($(this).attr('name'), $(this).val());
	});

	if(img_arr.length>0){
		img_arr.forEach(img => {
			let img_data = document.getElementById(img);
			form_data.append(img, img_data.files[0]);
		});
	}
	
	//-- 多圖 --
	if(imgs_arr.length>0){
		imgs_arr.forEach(imgs => {
		let imgs_data = document.getElementById(imgs);
			for (const file of imgs_data.files) {
				form_data.append(`${imgs}[]`, file);
			}
		});
	}

    //-- 區塊單圖 --
    if(img_area_arr.length>0){
        img_area_arr.forEach(img_area => {
            let img_area_data = document.getElementsByName(img_area);
            for (const file of img_area_data) {
                if(file.files[0]!=undefined){
                   form_data.append(`${img_area}`, file.files[0]);
                   console.log(file.files[0]);
                }	
            }
        });
    }
	
    //-- Ck edit --
    if(ck_arr.length>0){
        let ck_index=0;
        ck_arr.forEach(ck => {
            form_data.set(ck, ck_box[ck_index].getData());
            ck_index++;
        });
    }
    
	
    //-- 其他 --
    if(other_arr.length>0){
        other_arr.forEach(item => {
            form_data.append(item.name, item.data);
        });
    }
    
    form_data.append('type', ajax_type);

	let ajax_js= $.ajax({
		type: "POST",
		url: ajax_url,
        headers: headers,
		data: form_data,
		contentType: false,
		cache: false,
		processData:false,
		dataType: "json",
		beforeSend: function(){
			$('.ajax_loading').addClass('show_in');
		},
		complete: function(){
			$('.ajax_loading').removeClass('show_in');
		},
		success: function (data) {

            if(test){
                console.log(data);
            }
            else{
                if(data.success){
                     alert(data.msg);
                     if(location_url!=false){
                        location.replace(location_url);
                    }
                    
                }
                else{
                     alert(data.msg);
                
                }
            }
		}
	});

    return ajax_js;
}