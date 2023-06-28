import projects from "./projectData.js"

// Agregando las Card projects
const cardWrapper = document.getElementById("card-wrapper");

projects.forEach((project, index) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.classList.add("swiper-slide");
  card.classList.add("open-modal");
  card.setAttribute("id", project.id);
  card.setAttribute("data-card-index", index);

  const cardContent = document.createElement("div");
  cardContent.setAttribute("data-card-index", index);
  const body = document.querySelector("body");
  const horizontalScrollWidth = window.innerWidth - body.clientWidth;
  // Verificar si hay scroll en la ventana para tomarlo en cuenta
  if (horizontalScrollWidth > 0) {
    cardContent.classList.add("card-content");
  }
  else {
    cardContent.classList.add("card-content-no-scroll");
  }

  card.appendChild(cardContent);
  cardWrapper.appendChild(card);
});

// Funcionalidad de botones
var emailButton = document.getElementById("email-button");
emailButton.addEventListener("click", () => {
  // Copiando texto a portapapeles
  navigator?.clipboard?.writeText("missaelvarelayocupicio@gmail.com");
  // Lanzando notificación
  showNotification({ type: notificationTypes.Success, text: "Copied to clipboard"});
});

//#region MODAL

// funciones
function showModal(modal) {
  modal.classList.add("modal-shown");
}
function closeModal(modal) {
  modal.classList.remove("modal-shown");
}
function updateModal({title, subtitle, description, extra, images = [], buttons = []}) {
  modalTitle.textContent = title;
  modalSubtitle.textContent = subtitle;
  modalDescription.textContent = description;
  modalExtra.textContent = extra;
  // Limpiar swipers
  cleanSwiper(imageGallerySwiper);
  cleanSwiper(visualizerSwiper);
  //modalImagesContainer.innerHTML = "";
  //visualizerModalImagesContainer.innerHTML = "";
  images.forEach(image => {
    // Agregamos las imagenes al Swiper Gallery
    const element = createImageElement(image);
    //modalImagesContainer.appendChild(element);
    imageGallerySwiper.appendSlide(element);

    // Agregamos las images al Swiper espejo Visualizer
    const elementCopy = createImageElementVisualizer(image);
    //visualizerModalImagesContainer.appendChild(elementCopy);
    visualizerSwiper.appendSlide(elementCopy);
  })

  modalButtonsContainer.innerHTML = "";
  buttons.forEach(button => {
    const element = createButtonElement(button);
    modalButtonsContainer.appendChild(element);
  })
}
function createImageElement({ id, src }) {
  // Crear elemento
  const path = "./assets/img/projects/";
  const element = document.createElement("div");
  element.className = "swiper-slide";
  element.innerHTML = `
  <img src="${path + src}" class="modal-image open-visualizer-modal" id="${id}">
  `;
  // Retornar elemento
  return element;
}
function createImageElementVisualizer({ id, src }) {
  // Crear elemento
  const path = "./assets/img/projects/";
  const element = document.createElement("div");
  element.className = "swiper-slide";
  element.innerHTML = `
    <div class="swiper-zoom-container visualizer-image-container">
      <img src="${path + src}" class="visualizer-modal-image" />
    </div>
  `;

  // Retornar elemento
  return element;
}
function createButtonElement({ type, href }) {
  // Elegir variables
  const path = "./assets/svg/";
  switch(type) {
    case "Code": 
      var icon = "github.svg";
      var text = "Code";
      break;
    case "Deployment":
      var icon = "deployment.svg";
      var text = "Deployment";
      break;
    case "Design":
      var icon = "design.svg";
      var text = "Design";
      break;
    case "Documentation":
      var icon = "document.svg";
      var text = "Documentation";
      break;
    default:
      var icon = "";
      var text = ""
  }

  // Crear elemento
  const element = document.createElement("a");
  element.classList.add("icon-text-button");
  element.classList.add("scale-hover");
  element.setAttribute("href", href);
  element.setAttribute("target", "_blank");
  element.innerHTML = `
    <img src="${path + icon}" class="small-icon-svg">
    <p>${text}</p>
  `;

  // Retornar elemento
  return element;
}
function getProjectData(id) {
  return projects.find(project => project.id === id)
}

// PROJECT MODAL
const modal = document.querySelector("#modal");
const modalTitle = document.querySelector("#modal-title");
const modalSubtitle = document.querySelector("#modal-subtitle");
const modalDescription = document.querySelector("#modal-description");
const modalExtra = document.querySelector("#modal-extra");
const modalImagesContainer = document.querySelector("#modal-images-container");
const modalButtonsContainer = document.querySelector("#modal-buttons-container");

const openElements = document.querySelectorAll(".open-modal");
const closeElements = document.querySelectorAll(".close-modal");

// Agregando el evento mostrar modal
openElements.forEach((element) => {
  element.addEventListener("click", (e) => {
    // Detectar target. Si la target card es la activa mostrar modal, si no, poner la target card como activa.
    const target = e.target;
    if(swiper.activeIndex != target.dataset?.cardIndex) {
      swiper.slideTo(target.dataset.cardIndex);
      return;
    }

    // Obtener la data
    const data = getProjectData(element.id);

    // Actualizar info del modal
    updateModal(data);

    // Deshabiltamos el Card Swiper
    swiper.disable();
    // Reiniciamos el Gallery Swiper y lo movemos para que se ejecute el evento SlideChange y se actualice el estado enable de los botones
    imageGallerySwiper.slideTo(1);
    imageGallerySwiper.slideTo(0);
    // Mostrar modal
    showModal(modal);
  })
})
// Agregando el evento cerrar modal
closeElements.forEach((element) => {
  element.addEventListener("click", (e) => {
    // Detectar target
    const target = e.target;
    if (target.id !== modal.id) return;

    // Cerrar modal
    swiper.enable();
    closeModal(modal);
  })
})

// IMAGE VISUALIZER MODAL
const visualizerModal = document.querySelector("#visualizer-modal");
const visualizerModalImagesContainer = document.querySelector("#modal-images-visulizer");

const openVisualizerElements = document.querySelectorAll(".open-visualizer-modal");
const closeVisualizerElements = document.querySelectorAll(".close-visualizer-modal");
// Agregando el evento mostrar modal con click
openVisualizerElements.forEach((element) => {
  element.addEventListener("click", (e) => {
    // Detectar target
    const target = e.target;
    if (target.tagName !== "IMG") return;

    // Mostrar modal
    showModal(visualizerModal);
  })
})
// Agregando el evento cerrar modal
closeVisualizerElements.forEach((element) => {
  element.addEventListener("click", (e) => {
    // Detectar target
    const target = e.target;
    if (target.tagName === "IMG") return;

    // Cerrar modal
    closeModal(visualizerModal);
  })
})

//#endregion


//#region TOAST NOTIFICATION
let currentNotification;
const notificationTypes = {
  Success: Symbol(0),
  Info: Symbol(1),
  Warning: Symbol(2),
  Error: Symbol(3),
}
async function showNotification({ type, text = "", time = 2000 }){
  if (currentNotification) {
    currentNotification.remove();
  } 

  switch(type) {
    case notificationTypes.Success:
      var iconSrc = "./assets/svg/correct.svg";
      break;
    case notificationTypes.Info:
      throw Error("Info notification sin implementar.");
    case notificationTypes.Warning:
      throw Error("Warning notification sin implementar.");
    case notificationTypes.Error:
      throw Error("Error notification sin implementar.");
    default:
      var iconSrc = null;
  }

  var container = document.getElementById("toast-container");
  var notification = document.createElement("div");
  notification.className = "toast-notification slide-in";
  notification.innerHTML = `
    <img src="${iconSrc}" alt="" class="small-icon-svg">
    <p class="toast-notification-text">${text}</p>
  `;
  container.appendChild(notification);
  currentNotification = notification;

  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => {
      notification?.remove();
    }, 1000)
  }, time);
}
//#endregion


//#region SWIPERS
// Creando el Swiper Project
var swiper = new Swiper(".slide-content", {
  slidesPerView: 2,
  spaceBetween: 30,
  centeredSlides: true,
  grabCursor: true,
  initialSlide: 3,
  speed: 750,
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
    depth: 100,
    modifier: 0.25,
    slideShadows: true,
  },
  keyboard: {
    enabled: true,
  },
});

// Creando el Swiper Visualizer que es espejo del Image Gallery
var visualizerSwiper = new Swiper(".visualizer-swiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  zoom: true,
});


// Creando el Swiper Image Gallery
var imageGallerySwiper = new Swiper(".modal-swiper", {
  grabCursor: true,
  navigation: {
    nextEl: ".image-gallery-swiper-button-next",
    prevEl: ".image-gallery-swiper-button-prev",
  },
  pagination: {
    el: '.image-gallery-swiper-pagination',
    type: 'fraction',
  },  
  keyboard: {
    enabled: true,
  },
  thumbs: {
    swiper: visualizerSwiper,
  },
});

// Relacionar los dos swiper para que sean espejo uno de otro:
// agregar uno de los swiper como thumbs es el primer paso para relacionarlos.

visualizerSwiper.on("slideChange", (e) => {
  // Modificar el otro swiper
  if (imageGallerySwiper.activeIndex !== e.activeIndex) {
    imageGallerySwiper.slideTo(e.activeIndex)
  }
});

// Bloqueando botones de navegacion manualmente
const gallerySwiperNextButton = document.querySelector(".image-gallery-swiper-button-next");
const gallerySwiperPrevButton = document.querySelector(".image-gallery-swiper-button-prev");

imageGallerySwiper.on("slideChange", enableNavButton);

// Funciones de Swiper
function cleanSwiper(swiper) {
  swiper.removeAllSlides();
}
function enableNavButton() {
  console.log(imageGallerySwiper.isBeginning, imageGallerySwiper.isEnd);
  if(imageGallerySwiper.isBeginning) gallerySwiperPrevButton.classList.add("button-disable");
  else gallerySwiperPrevButton.classList.remove("button-disable");

  if(imageGallerySwiper.isEnd) gallerySwiperNextButton.classList.add("button-disable");
  else gallerySwiperNextButton.classList.remove("button-disable");
}

//#endregion



