const slides = document.getElementsByClassName('product-box__img');

let indexSlide = 0;

slides[indexSlide].classList.add('isActive');

document.getElementById('prefBtn').onclick = function () {
    indexSlide = (indexSlide - 1 + slides.length) % slides.length;
    changeSlide(indexSlide)
}

document.getElementById('nextBtn').onclick = function () {
    indexSlide = (indexSlide + 1) % slides.length;
    changeSlide(indexSlide)
}

function changeSlide(i) {
    document.querySelector('.isActive').classList.remove('isActive');

    slides[i].classList.add('isActive');
}