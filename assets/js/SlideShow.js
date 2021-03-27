var SlideIndex = 0;
showSlide();

function showSlide(){
    var  i;
    var slides = document.getElementsByClassName("mySlides");
    for ( i=0; i< slides.length; i++){
        slides[i].style.display = "none";
    }
    SlideIndex++;
    if (SlideIndex > slides.length){
        SlideIndex = 1;
    }
    slides[SlideIndex-1].style.display = 'block';
    setTimeout(showSlide,2000);
}
