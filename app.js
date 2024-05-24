document.addEventListener('DOMContentLoaded', function () {
    const scrollDownBtn = document.getElementById('scroll-down-btn');
    const speedControl = document.getElementById('speed-control');
    const readingArea = document.querySelector('.reading-area');
    const navbarButtons = document.querySelectorAll('.button');
    const rewindButton = document.querySelector('.reset');

    let scrollInterval = null;
    let scrollStep, scrollHeight, scrollCount;

    function smoothScroll() {
        if (scrollCount >= scrollHeight) {
            window.scrollTo(0, document.documentElement.scrollHeight);
        } else {
            window.scrollBy(0, scrollStep);
            scrollCount += scrollStep;
            requestAnimationFrame(smoothScroll);
        }
    }

    scrollDownBtn.addEventListener('click', function () {
        cancelAnimationFrame(scrollInterval); 
        const speed = parseInt(speedControl.value, 10) * 100;
        scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollStep = scrollHeight / 100; 
        scrollCount = 0;
        scrollInterval = requestAnimationFrame(smoothScroll);
    });

    speedControl.addEventListener('input', function () {
        if (scrollInterval) {
            cancelAnimationFrame(scrollInterval);
            scrollInterval = requestAnimationFrame(smoothScroll);
        }
    });

    rewindButton.addEventListener('click', function () {
        window.scrollTo(0, 0);
    });

    window.addEventListener('scroll', function () {
        if (isElementInViewport(readingArea)) {
            readingArea.classList.add('hide');
        } else {
            readingArea.classList.remove('hide');
        }
    });

    navbarButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            if (button.classList.contains('active')) {
                button.classList.remove('active');
            }
        });
    });

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    let timerInterval;
    function startTimer() {
        let startTime = new Date().getTime();
        timerInterval = setInterval(function () {
            let currentTime = new Date().getTime();
            let elapsed = currentTime - startTime;
            let seconds = Math.floor((elapsed / 1000) % 60);
            let minutes = Math.floor((elapsed / (1000 * 60)) % 60);
            let hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
            $('.clock').text(
                (hours < 10 ? "0" : "") + hours + ":" +
                (minutes < 10 ? "0" : "") + minutes + ":" +
                (seconds < 10 ? "0" : "") + seconds
            );
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    let isPlaying = false;
    $('.icon-play').click(function () {
        if (isPlaying) {
            stopTimer();
            $(this).removeClass('fa-pause').addClass('fa-play');
        } else {
            startTimer();
            $(this).removeClass('fa-play').addClass('fa-pause');
        }
        isPlaying = !isPlaying;
    });

    $('.font_size.slider').slider({
        min: 20,
        max: 100,
        value: 60,
        slide: function (event, ui) {
            $('.font_size_label span').text('(' + ui.value + ')');
            $('.teleprompter').css('font-size', ui.value + 'px');
        }
    });

    $('.speed.slider').slider({
        min: 10,
        max: 100,
        value: 35,
        slide: function (event, ui) {
            $('.speed_label span').text('(' + ui.value + ')');
        }
    });

    $('.margin.slider').slider({
        min: 0,
        max: 20,
        value: 2,
        slide: function (event, ui) {
            $('.margin_label span').text('(' + ui.value + '%)');
            $('.teleprompter').css('padding-left', ui.value + '%').css('padding-right', ui.value + '%');
        }
    });

    $('#text-color-picker').change(function () {
        $('.teleprompter').css('color', $(this).val());
    });

    $('#background-color-picker').change(function () {
        $('.teleprompter').css('background-color', $(this).val());
    });

    $('.text-align').click(function () {
        $('.teleprompter').css('text-align', 'center');
    });

    $('.reset').click(function () {
        $('.teleprompter').scrollTop(0);
    });

    $('.flipx').click(function () {
        $('.teleprompter').css('transform', 'scaleX(-1)');
    });

    $('.flipy').click(function () {
        $('.teleprompter').css('transform', 'scaleY(-1)');
    });

    $('.open').click(function () {
        $('input.load-file').click();
    });

    $('.save').click(function () {
        let scriptContent = $('.teleprompter').html();
        let blob = new Blob([scriptContent], { type: 'text/plain' });
        let url = URL.createObjectURL(blob);
        let a = document.getElementById('mycustomimage');
        a.href = url;
        a.download = 'script.txt';
        a.click();
    });

    $('input.load-file').change(function (event) {
        let reader = new FileReader();
        reader.onload = function (e) {
            $('.teleprompter').html(e.target.result);
        }
        reader.readAsText(event.target.files[0]);
    });
});