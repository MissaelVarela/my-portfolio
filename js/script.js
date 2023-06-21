import projects from "./projectData.js"

// Agregando las Card projects
const cardWrapper = document.getElementById("card-wrapper");

projects.forEach((project) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.classList.add("swiper-slide");
  card.classList.add("open-modal");
  card.setAttribute("id", project.id);

  const cardContent = document.createElement("div");
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
  modalImagesContainer.innerHTML = "";
  images.forEach(image => {
    const element = createImageElement(image);
    modalImagesContainer.appendChild(element);
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
    <div class="swiper-zoom-container modal-image-container">
      <img src=${path + src} class="modal-image open-visualizer-modal" id="${id}">
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
  element.className = "icon-text-button";
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
function updateVisualizerModal(src) {
  visualizerModalImage.setAttribute("src", src);
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
  element.addEventListener("click", () => {
    // Detectar target
    const data = getProjectData(element.id);

    // Actualizar info del modal
    updateModal(data);

    // Mostrar modal
    swiper.disable()
    showModal(modal);
  })
})
// Agregando el evento cerrar modal
closeElements.forEach((element) => {
  element.addEventListener("click", () => {
    // Cerrar modal
    swiper.enable()
    closeModal(modal);
  })
})

// IMAGE VISUALIZER MODAL
const visualizerModal = document.querySelector("#visualizer-modal");
const visualizerModalImage = document.querySelector("#visualizer-modal-image");

const openVisualizerModals = document.querySelectorAll(".open-visualizer-modal");
const closeVisualizerModals = document.querySelectorAll(".close-visualizer-modal");

// Agregando el evento mostrar modal
openVisualizerModals.forEach((element) => {
  element.addEventListener("click", (e) => {
    // Detectar target
    const target = e.target;
    if (target.tagName !== "IMG") {
      return;
    }
    const src = target.src;

    // Actualizar info del modal
    updateVisualizerModal(src);

    // Mostrar modal
    showModal(visualizerModal);
  })
})
// Agregando el evento cerrar modal
closeVisualizerModals.forEach((element) => {
  element.addEventListener("click", () => {
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
// Creando el Swiper Project Gallery
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
    depth: 100,
    modifier: 0.25,
    slideShadows: true,
  },
  keyboard: {
    enabled: true,
  },
});

// Creando el Swiper Image Gallery
var imageGallerySwiper = new Swiper(".modal-swiper", {
  zoom: true,
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
});

//#endregion



