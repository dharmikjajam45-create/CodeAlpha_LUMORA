// ==========================================
// LUMORA — COMPLETE JAVASCRIPT
// Gallery, Filters, Search, Lightbox & Preloader
// ==========================================


// PHOTO COLLECTION
const photos = [
    {
        src: "images/photo1.jpg",
        title: "The Beginning",
        category: "campus"
    },
    {
        src: "images/photo2.jpg",
        title: "A Day to Remember",
        category: "celebration"
    },
    {
        src: "images/photo3.jpg",
        title: "Campus Stories",
        category: "campus"
    },
    {
        src: "images/photo4.jpg",
        title: "Together We Celebrate",
        category: "celebration"
    },
    {
        src: "images/photo5.jpg",
        title: "Culture in Colour",
        category: "culture"
    },
    {
        src: "images/photo6.jpg",
        title: "The Good Times",
        category: "campus"
    },
    {
        src: "images/photo7.jpg",
        title: "A Shared Moment",
        category: "celebration"
    },
    {
        src: "images/photo8.jpg",
        title: "Our Traditions",
        category: "culture"
    },
    {
        src: "images/photo9.jpg",
        title: "Campus Life",
        category: "campus"
    },
    {
        src: "images/photo10.jpg",
        title: "The Celebration",
        category: "celebration"
    },
    {
        src: "images/photo11.jpg",
        title: "Colours of Culture",
        category: "culture"
    },
    {
        src: "images/photo12.jpg",
        title: "Unforgettable Days",
        category: "campus"
    },
    {
        src: "images/photo13.jpg",
        title: "Together Forever",
        category: "celebration"
    },
    {
        src: "images/photo14.jpg",
        title: "One Campus Story",
        category: "culture"
    }
];


// ==========================================
// DOM ELEMENTS
// ==========================================

const preloader = document.getElementById("preloader");

const galleryGrid = document.getElementById("galleryGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("gallerySearch");
const photoCount = document.getElementById("photoCount");
const emptyState = document.getElementById("emptyState");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxCount = document.getElementById("lightboxCount");

const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

const featuredImage = document.getElementById("featuredImage");

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");


// ==========================================
// PRELOADER — FIXED
// ==========================================

function hidePreloader() {
    if (preloader) {
        preloader.classList.add("hide");
    }
}

// Hide after the page finishes loading
window.addEventListener("load", () => {
    setTimeout(hidePreloader, 500);
});

// Safety fallback: prevents endless loading
setTimeout(hidePreloader, 3000);


// ==========================================
// GALLERY VARIABLES
// ==========================================

let currentFilter = "all";
let currentSearch = "";
let currentPhotoIndex = 0;

let visiblePhotos = [...photos];


// ==========================================
// SCROLL REVEAL
// ==========================================

function initScrollReveal() {

    const elements = document.querySelectorAll(
        ".hero-copy, .hero-feature, .section-heading, " +
        ".photo-card, .about-section, .gallery-note"
    );

    if (!("IntersectionObserver" in window)) {
        elements.forEach(element => {
            element.classList.add("visible");
        });
        return;
    }

    const observer = new IntersectionObserver(
        (entries, activeObserver) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    activeObserver.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.08
        }
    );

    elements.forEach(element => {
        element.classList.add("reveal");
        observer.observe(element);
    });
}


// ==========================================
// RENDER GALLERY
// ==========================================

function renderGallery() {

    if (!galleryGrid) return;

    galleryGrid.innerHTML = "";

    visiblePhotos = photos.filter(photo => {

        const matchesCategory =
            currentFilter === "all" ||
            photo.category === currentFilter;

        const matchesSearch =
            photo.title.toLowerCase().includes(currentSearch);

        return matchesCategory && matchesSearch;

    });


    visiblePhotos.forEach((photo, index) => {

        const card = document.createElement("article");

        card.className = "photo-card";


        const button = document.createElement("button");

        button.className = "photo-open";

        button.type = "button";

        button.setAttribute(
            "aria-label",
            "View " + photo.title
        );


        const frame = document.createElement("div");

        frame.className = "photo-frame";


        const image = document.createElement("img");

        image.src = photo.src;

        image.alt = photo.title;

        image.loading = "lazy";


        image.addEventListener("error", () => {

            image.alt = "Image could not be loaded";

            image.style.opacity = "0.2";

            frame.style.background = "#ebe5d9";

        });


        const overlay = document.createElement("div");

        overlay.className = "photo-overlay";

        overlay.innerHTML = "<span>↗</span>";


        frame.appendChild(image);

        frame.appendChild(overlay);


        const info = document.createElement("div");

        info.className = "photo-info";


        const heading = document.createElement("h3");

        heading.textContent = photo.title;


        const category = document.createElement("span");

        category.textContent = photo.category;


        info.appendChild(heading);

        info.appendChild(category);


        button.appendChild(frame);

        button.appendChild(info);


        button.addEventListener("click", () => {

            openLightbox(index);

        });


        card.appendChild(button);

        galleryGrid.appendChild(card);

    });


    // Update photo count
    if (photoCount) {

        photoCount.textContent =
            visiblePhotos.length + " PHOTOGRAPHS";

    }


    // Show empty state when no results
    if (emptyState) {

        emptyState.hidden = visiblePhotos.length !== 0;

    }


    initScrollReveal();

}


// ==========================================
// CATEGORY FILTERS
// ==========================================

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderGallery();

    });

});


// ==========================================
// SEARCH
// ==========================================

if (searchInput) {

    searchInput.addEventListener("input", event => {

        currentSearch = event.target.value
            .trim()
            .toLowerCase();

        renderGallery();

    });

}


// ==========================================
// LIGHTBOX
// ==========================================

function openLightbox(index) {

    if (!lightbox || visiblePhotos.length === 0) return;

    currentPhotoIndex = index;

    updateLightbox();

    lightbox.classList.add("active");

    document.body.classList.add("no-scroll");

}


function updateLightbox() {

    const photo = visiblePhotos[currentPhotoIndex];

    if (!photo) return;

    lightboxImage.src = photo.src;

    lightboxImage.alt = photo.title;

    lightboxTitle.textContent = photo.title;

    lightboxCategory.textContent = photo.category;

    lightboxCount.textContent =
        String(currentPhotoIndex + 1).padStart(2, "0") +
        " / " +
        String(visiblePhotos.length).padStart(2, "0");

}


function closeLightbox() {

    if (!lightbox) return;

    lightbox.classList.remove("active");

    document.body.classList.remove("no-scroll");

}


function nextPhoto() {

    if (visiblePhotos.length === 0) return;

    currentPhotoIndex =
        (currentPhotoIndex + 1) % visiblePhotos.length;

    updateLightbox();

}


function previousPhoto() {

    if (visiblePhotos.length === 0) return;

    currentPhotoIndex =
        (currentPhotoIndex - 1 + visiblePhotos.length) %
        visiblePhotos.length;

    updateLightbox();

}


// Lightbox button events

if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
}

if (lightboxNext) {
    lightboxNext.addEventListener("click", nextPhoto);
}

if (lightboxPrev) {
    lightboxPrev.addEventListener("click", previousPhoto);
}


// Close by clicking the dark background

if (lightbox) {

    lightbox.addEventListener("click", event => {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });

}


// Keyboard controls

document.addEventListener("keydown", event => {

    if (!lightbox || !lightbox.classList.contains("active")) return;

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowRight") {
        nextPhoto();
    }

    if (event.key === "ArrowLeft") {
        previousPhoto();
    }

});


// ==========================================
// MOBILE NAVIGATION
// ==========================================

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });


    navLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("open");

            menuToggle.setAttribute("aria-expanded", "false");

        });

    });

}


// ==========================================
// FEATURED IMAGE
// ==========================================

if (featuredImage) {

    featuredImage.addEventListener("error", () => {

        featuredImage.alt = "Featured campus photograph unavailable";

    });

}


// ==========================================
// START LUMORA
// ==========================================

renderGallery();
initScrollReveal();