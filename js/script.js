// Funcionalidad de Copiado a portapales:
var emailButton = document.getElementById("email-button");
emailButton.addEventListener("click", () => {
 navigator?.clipboard?.writeText("missaelvarelayocupicio@gmail.com");
 showNotification();
});

// Comportamiento de las notificaciones toast:
let currentNotification;
async function showNotification(){
  if (currentNotification) {
    currentNotification.remove();
  } 
  var container = document.getElementById("toast-container");
  var notification = document.createElement("div");
  notification.className = "toast-notification slide-in";
  notification.innerHTML = `
    <img src="./assets/svg/correct.svg" alt="" class="small-icon-svg">
    <p class="toast-notification-text">Copied to clipboard</p>
  `;
  container.appendChild(notification);
  currentNotification = notification;
  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => {
      notification?.remove();
    }, 1000)
  }, 2000);
}

// Creando el Swiper:
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