var swiper = new Swiper(".slide-content", {
    slidesPerView: 2,
    spaceBetween: 30,
    centeredSlides: true,
    grabCursor: true,
    initialSlide: 3,
    //loop: true,
    pagination: {
      el: ".swiper-pagination",
      //dynamicBullets: true,
      clickable: true
    },
    
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    effect: "coverflow",
    coverflowEffect: {
      rotate: 130,
      stretch: 0,
      depth: 200,
      modifier: 0.25,
      slideShadows: false,
    },
    keyboard: {
      enabled: true,
    },
  });