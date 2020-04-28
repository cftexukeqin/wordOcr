$(function () {

    $(".input input").focus(function () {

        $(this).parent(".input").each(function () {
            $("label", this).css({
                "line-height": "18px",
                "font-size": "18px",
                "font-weight": "100",
                "top": "0px"
            })
            $(".spin", this).css({
                "width": "100%"
            })
        });
    }).blur(function () {
        $(".spin").css({
            "width": "0px"
        })
        if ($(this).val() == "") {
            $(this).parent(".input").each(function () {
                $("label", this).css({
                    "line-height": "60px",
                    "font-size": "24px",
                    "font-weight": "300",
                    "top": "10px"
                })
            });

        }
    });

    $(".button").click(function (e) {
        var pX = e.pageX,
            pY = e.pageY,
            oX = parseInt($(this).offset().left),
            oY = parseInt($(this).offset().top);

        $(this).append('<span class="click-efect x-' + oX + ' y-' + oY + '" style="margin-left:' + (pX - oX) + 'px;margin-top:' + (pY - oY) + 'px;"></span>')
        $('.x-' + oX + '.y-' + oY + '').animate({
            "width": "500px",
            "height": "500px",
            "top": "-250px",
            "left": "-250px",

        }, 600);
        $("button", this).addClass('active');
    })

    $(".alt-2").click(function () {
        if (!$(this).hasClass('material-button')) {
            $(".shape").css({
                "width": "100%",
                "height": "100%",
                "transform": "rotate(0deg)"
            })

            setTimeout(function () {
                $(".overbox").css({
                    "overflow": "initial"
                })
            }, 600)

            $(this).animate({
                "width": "140px",
                "height": "140px"
            }, 500, function () {
                $(".box").removeClass("back");

                $(this).removeClass('active')
            });

            $(".overbox .title").fadeOut(300);
            $(".overbox .input").fadeOut(300);
            $(".overbox .button").fadeOut(300);

            $(".alt-2").addClass('material-buton');
        }

    })

    $(".material-button").click(function () {

        if ($(this).hasClass('material-button')) {
            setTimeout(function () {
                $(".overbox").css({
                    "overflow": "hidden"
                })
                $(".box").addClass("back");
            }, 200)
            $(this).addClass('active').animate({
                "width": "700px",
                "height": "700px"
            });

            setTimeout(function () {
                $(".shape").css({
                    "width": "50%",
                    "height": "50%",
                    "transform": "rotate(45deg)"
                })

                $(".overbox .title").fadeIn(300);
                $(".overbox .input").fadeIn(300);
                $(".overbox .button").fadeIn(300);
            }, 700)

            $(this).removeClass('material-button');

        }

        if ($(".alt-2").hasClass('material-buton')) {
            $(".alt-2").removeClass('material-buton');
            $(".alt-2").addClass('material-button');
        }

    });
    var news = new News();
    news.run();
});

function News() {
    var self = this;
}



News.prototype.ListenUploadFile = function () {
    var uploadBtn = $('#fileupload');
    var imgTag = $('#showImg');
    var videoSourceTag = $("#video-source");
    var videoDiv = $("#video-box");
    var videoTag = $("#my-video_html5_api");

    // 精度条
    var progessGroup = $('#progess-group');
    var progessbar = $('.progress-bar');

    uploadBtn.change(function () {
        var file = uploadBtn[0].files[0];
        var formdata = new FormData();
        formdata.append('file', file);
        xfzajax.post({
            'url': '/upload/',
            'data': formdata,
            'processData': false,
            'contentType': false,
            'success': function (result) {
                if (result['code'] === 200) {
                    // console.log(result['data']['url']);
                    url = result['data']['url'];
                    var sear = new RegExp('mp4');
                    // window.messageBox.show(result['message']);
                    if (sear.test(url)) {
                        $("#video-box").load();
                        videoTag.attr('src', url);
                        videoSourceTag.attr('src', url);
                        videoDiv.show();
                        imgTag.hide();
                    } else {
                        imgTag.show();
                        imgTag.attr('src', result['data']['url']);
                        videoDiv.hide();
                    }
                }
            },
            'xhr': function () {
                var xhr = new XMLHttpRequest();
                progessbar.css({'width': 0});
                progessGroup.show();
                //使用XMLHttpRequest.upload监听上传过程，注册progress事件，打印回调函数中的event事件
                xhr.upload.addEventListener('progress', function (e) {
                    // console.log(e);
                    //loaded代表上传了多少
                    //total代表总数为多少
                    var progess = parseInt((e.loaded / e.total) * 100);
                    var progressRate = progess + '%';
                    // console.log(progess);

                    //通过设置进度条的宽度达到效果
                    $('.progress > div').css('width', progressRate);
                    progessbar.text(progressRate);
                    if (e.loaded === e.total) {
                        setInterval(function () {
                            progessGroup.hide();
                        }, 500)
                    }
                });

                return xhr;
            }
        })
    })
};

// 图片识别
News.prototype.ListenImgrecongnise = function () {
    var recongiseBtn = $('#submit-Btn');
    var imgTag = $('#showImg');
    var txtTag = $("#txturl");
    recongiseBtn.click(function (event) {
        event.preventDefault();
        // console.log("123dad");
        imgUrl = imgTag[0].src;
        var sear = new RegExp('default');
        if (sear.test(imgUrl)) {
            xfzalert.alertErrorToast("请上传图片");
            return;
        }
        xfzalert.alertInfoWithTitle("正在识别,请稍后...");
        xfzajax.post({
            url: '/imgocr/',
            data: {
                'imgurl': imgUrl
            },
            success: function (result) {
                // xfzalert.alertInfoToast(result)

                if (result['code'] === 200) {
                    console.log(result['data'])
                    ue.setContent(result['data']['context'])
                    txtTag.attr('href',result['data']['t_filename'])
                    xfzalert.close()
                }

            }
        });
        // xfzalert.alertInfoToast(imgUrl);
    })
};


News.prototype.ShowModel = function () {
    var showBtn = $('#show-btn');
    showBtn.click(function (event) {
        event.preventDefault();
        $('#myModal').modal('show')
    })
};


News.prototype.UeditorEvent = function(){
    var ue = UE.getEditor('container',{
            'initialFrameHeight': 400,
            // 'serverUrl': '/ueditor/upload/'
        });
    window.ue = ue
};


News.prototype.SaveFileEvent = function(){
    var saveBtn = $("#save-Btn");
    var txtTag = $("#txturl");
    saveBtn.click(function (event) {
        event.preventDefault();
        var context = ue.getContent();
        filename = txtTag.attr('href')
        if (!context){
            xfzalert.alertInfoToast("无保存的内容！");
            return;
        }
        window.location.href = 'http://127.0.0.1:8000/f/'+filename

    })

}
News.prototype.run = function () {
    var self = this;
    // self.listenUploadFileEvent();
    self.ShowModel();
    self.ListenUploadFile();
    self.ListenImgrecongnise();
    self.UeditorEvent();
    self.SaveFileEvent();
    // 链接设备
    // 视频识别

};


