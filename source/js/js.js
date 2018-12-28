// --------------------------------------------------------------------------------
// hash location + smooth scrolling
// 모든 anchor에 이벤트 바인딩하자. internal link로 판명될 경우 smooth scrolling 처리
// 최초 로딩,URL에서 hash가 변경될 경우 smooth scrolling 하지 않기로
// --------------------------------------------------------------------------------
(function ($) {
    var _isSetClassName = true;

    function smoothScrollTo(hash, e) {
        if (hash === '') { return false; } 

        if ($(hash).length > 0) {

            if(typeof e !== 'undefined') {
                if ('scrollRestoration' in history) {
                    history.scrollRestoration = 'manual';
                }

                e.preventDefault();
                var insertQuery;

                if (e.type === 'click') {

                    insertQuery = $(e.target).attr('href');
                    history.pushState(null, null, insertQuery);
                }
            }

            _isSetClassName = false;

            $('html,body').stop().animate({
                scrollTop: $(hash).offset().top
            }, 450, function() {
                _isSetClassName = true;
                $('#header').removeClass('active');
            });
            // !!!! element의 길이에 따라서 스크롤 이동하는 타이밍 받도록 변경해야 됨
        }

    }

    $(function() {
        $('#header a[href*="#"]').not('[href="#"]').not('[href="#0"]').click(function(e) {
            $('#header a[href*="#"]').removeClass('active');
            $(this).addClass('active');
            smoothScrollTo(this.hash, e);
        });

        smoothScrollTo(location.hash);

        $(window).on('hashchange',function (e){
            smoothScrollTo(location.hash, e);
        });
    });


    $(function (){
        
        // 스크롤 위치에 따라서 link에 클래스 바인딩을 한다.
        var sectionHeight = (function (sectionGroup) {
            var sectionGroup
            ,   max = sectionGroup.length
            ;

            var result = [];

            $.each(sectionGroup, function(i, section) {
                if (!!$(section).attr('id')) {
                    result.push({
                        id : $(section).attr('id'),
                        position : {
                            from : $(section).offset().top,
                            to : $(section).offset().top + $(section).outerHeight()
                        },
                        hash : (function (id){
                            return id === 'summary' ? null : '#'+id
                        })($(section).attr('id'))
                    })
                }
            });
            return result;

        })($('article > section'));



        var sec = [$('#polaris .corefeatures'), $('#tech .tech-sparkle'), $('#tech .tech-multiverse'), $('#tech .tech-privacy'), $('#tech .tech-incorporated')];

        var secDetail = (function (sec) {
            var sec;

            var result = [];

            $.each(sec, function(i, section) {
                result.push({
                    name : $(section).attr('class'),
                    position : {
                        from : ($(section).offset().top - $(section).outerHeight() / 2) - 250,
                        to : $(section).offset().top + $(section).outerHeight() / 2
                    }
                })
            });
            return result;

        })(sec);

        // slide-fade motion
        var slideDetail = (function (slideFade) {
            var slideFade;

            var result = [];

            $.each(slideFade, function(i, section) {
                result.push({
                    position : {
                        from : ($(section).offset().top - $(window).outerHeight() / 2) - 250,
                        to : $(section).offset().top + $(window).outerHeight()
                    }
                })
            });
            return result;

        })($('.slide-fade'));

        var sparkleChx = false;
        var sparkleTimer = null;
        
        $(document).on('scroll', function(e) {
            var scrollTop = $(document).scrollTop()
            ,   element
            ;

            // gnb active
            for (var i=0; i < sectionHeight.length; i++) {
                if (sectionHeight[i].position.from <= scrollTop && sectionHeight[i].position.to > scrollTop) {
                    element = sectionHeight[i].id;
                    if (_isSetClassName) {
                        $('#header a[href="#' + element + '"]').siblings().removeClass('active');
                        $('#header a[href="#' + element + '"]').addClass('active');
                    }
                }
                if (sectionHeight[0].position.from >= scrollTop) {
                    $('#header a[href*="#"]').removeClass('active');
                }
            }

            // 각 섹션별 클래스 active            
            for (var i=0; i < sectionHeight.length; i++) {
                if (sectionHeight[i].position.from - 250 <= scrollTop && sectionHeight[i].position.to > scrollTop) {
                    element = sectionHeight[i].id;
                    $(`article #${element}`).siblings().removeClass('active');
                    $(`article #${element}`).addClass('active');
                }
            }
            
            // 섹션 안에 detail active
            for (var i=0; i < secDetail.length; i++) {
                element = secDetail[i].name;
                if (secDetail[i].position.from <= scrollTop && secDetail[i].position.to > scrollTop) {
                    $(`.${element}`).addClass('active');
                }else {
                    $(`.${element}`).removeClass('active');
                }
            }

            // slide-fade motion
            for (var i=0; i < slideDetail.length; i++) {
                if (slideDetail[i].position.from <= scrollTop && slideDetail[i].position.to > scrollTop) {
                    $('.slide-fade').eq(i).addClass('in');
                }else {
                    $('.slide-fade').eq(i).removeClass('in');
                }
            }

            // Tech Sparkle 따로
            if (secDetail[1].position.from <= scrollTop && secDetail[1].position.to > scrollTop) {
                if(sparkleChx) {
                    spakleMotion();
                    sparkleChx = false;
                }
            }else {
                sparkleTimer = null;
                sparkleChx = true;
            }

        });

        var timerState = true;
        
        function spakleMotion(){
            const el = $('#tech .tech-sparkle');
            const node = el.find('.sparkle li');
            if(el.hasClass('active') && timerState){
                timerState = false;
                sparkleTimer = (function(){
                    for( var i = 1; i < 8; i++ ){
                        (function(index) {
                            setTimeout(function(){
                                motion(index);
                            }, 1000 * i);
                        })(i);
                    }
                })();
            }
            function motion(state){
                node.attr('class', '');
                node.each(function(){
                    const $this = $(this);
                    const idx = $this.index();
                    const max = parseInt(Math.random()*2);
                    if(state == 1) {
                        if(idx == 17) {
                            $this.addClass('node-3');
                        }else if(idx == 30){
                            $this.addClass('node-4');
                        }else if(idx == 38){
                            $this.addClass('node-5');
                        }else {
                            node.eq(idx).addClass(`node-${max+1}`);
                        }
                    }else if(state == 2) {
                        if(idx == 30) {
                            $this.addClass('node-3');
                        }else if(idx == 11){
                            $this.addClass('node-4');
                        }else if(idx == 19){
                            $this.addClass('node-5');
                        }else {
                            node.eq(idx).addClass(`node-${max+1}`);
                        }
                    }else if(state == 3) {
                        if(idx == 24) {
                            $this.addClass('node-3');
                        }else if(idx == 10){
                            $this.addClass('node-4');
                        }else if(idx == 44){
                            $this.addClass('node-5');
                        }else {
                            node.eq(idx).addClass(`node-${max+1}`);
                        }
                    }else if(state == 4) {
                        if(idx == 12) {
                            $this.addClass('node-3');
                        }else if(idx == 4){
                            $this.addClass('node-4');
                        }else if(idx == 30){
                            $this.addClass('node-5');
                        }else {
                            node.eq(idx).addClass(`node-${max+1}`);
                        }
                    }else if(state == 5) {
                        if(idx == 1) {
                            $this.addClass('node-3');
                        }else if(idx == 41){
                            $this.addClass('node-4');
                        }else if(idx == 22){
                            $this.addClass('node-5');
                        }else {
                            node.eq(idx).addClass(`node-${max+1}`);
                        }
                    }else if(state == 6) {
                        if(idx == 8) {
                            $this.addClass('node-3');
                        }else if(idx == 18){
                            $this.addClass('node-4');
                        }else if(idx == 24){
                            $this.addClass('node-5');
                        }else {
                            node.eq(idx).addClass(`node-${max+1}`);
                        }
                    }else {
                        if(idx == 33) {
                            $this.addClass('node-3');
                        }else if(idx == 1){
                            $this.addClass('node-4');
                        }else if(idx == 14){
                            $this.addClass('node-5');
                        }else {
                            node.eq(idx).addClass(`node-${max+1}`);
                        }
                        timerState = true;
                    }
                });
            }
        }

    });
})(jQuery);


// --------------------------------------------------------------------------------
// 상단 메뉴
// 모바일 기준 : 320px;
// --------------------------------------------------------------------------------

(function ($) {
    var deviceWidth = {
        mobile : 960,
    };

    $(function (){

        if ($(window).width() >= deviceWidth.mobile) {
            return false;
        }
        
        var menu = $('.m-menu');
        var header = $('#header');

        menu.on('click', function(){
            header.toggleClass('active');
            return false;
        });

    });
})(jQuery);

// --------------------------------------------------------------------------------
// 폼체크
// 
// --------------------------------------------------------------------------------

(function ($) {

    $(function (){

        var contact = $('#contact');
        var form = $('.form');
        var button = form.find('.button');
        var inputCon = form.find('.input-control');
        var input = form.find('input');
        var inputName = form.find('input#name');
        var inputEmail = form.find('input#email');
        var inputMessage = form.find('input#message');
        // var url = 'https://script.google.com/macros/s/AKfycbyRRj3mjlemg2x1MqbvNpV_MuZIoHTxYQFazq2_z4grirMRUqU/exec';
        var url = '';

        // submit 성공
        form.on('submit', function(e){
            e.preventDefault();
            if(formValidation()) {
                send();
            }
        });

        var send = function() {
            // data
            var data = {
                'name': inputName.val(), 
                'email': inputEmail.val(),
                'message': inputMessage.val()
            }

            // ajax post
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function(data) {
                    console.log('success');
                    document.getElementById('form').reset();
                    $('.bodymovin').hide();
                    inputCon.removeClass('error');
                    contact.addClass('success');
                },
                error: function(data) {
                    console.log('fail');
                }
            });
        }

        // email 체크
        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        // form validation
        function formValidation(){
            if(inputName.val() == '') {
                inputName.parent().addClass('error');
                inputName.focus();
                return false;
            }else if(!validateEmail(inputEmail.val())) {
                inputName.parent().removeClass('error');
                inputEmail.parent().addClass('error');
                inputEmail.focus();                
                return false;
            }else {
                $('.bodymovin').show();
                return true;
            }
        }

        // 완료 버튼
        $(document).on('click','.done .button',function(e){
            e.preventDefault();
            input.not('[type=submit]').prop('value', '');
            contact.removeClass('success');
            return false;
        });

    });
})(jQuery);