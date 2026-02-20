// Main Navigation & Scroll
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar")
  const mobileMenuBtn = document.getElementById("mobile-menu-btn")
  const navLinks = document.getElementById("nav-links")

  // Sticky Navbar
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Mobile Menu Toggle
  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active")
    const icon = mobileMenuBtn.querySelector("i")
    if (navLinks.classList.contains("active")) {
      icon.classList.remove("fa-bars")
      icon.classList.add("fa-times")
    } else {
      icon.classList.remove("fa-times")
      icon.classList.add("fa-bars")
    }
  })

  // Close mobile menu on link click
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active")
      mobileMenuBtn.querySelector("i").classList.remove("fa-times")
      mobileMenuBtn.querySelector("i").classList.add("fa-bars")
    })
  })

  // Intersection Observer for scroll animations
  const animationObservers = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
          // Optional: unobserve after animating to keep it visible
          // animationObservers.unobserve(entry.target);
        }
      })
    },
    {
      threshold: 0.1,
    },
  )

  const animatedElements = document.querySelectorAll(
    ".slide-up, .fade-in, .scale-in, .slide-right, .slide-left",
  )
  animatedElements.forEach((el) => animationObservers.observe(el))

  // Dynamic Gallery Generation
  const galleryContainer = document.getElementById("gallery-container")
  const galleryItems = [
    { img: "assets/gallery-1.jpg", title: "Porta Malas Personalizado" },
    { img: "assets/gallery-2.jpg", title: "Central Multimídia" },
    { img: "assets/gallery-3.jpg", title: "Projeto Alta Fidelidade" },
    { img: "assets/gallery-4.jpg", title: "Iluminação Interna LED" },
    { img: "assets/gallery-5.jpg", title: "Aplicação Insulfilm Nano" },
    { img: "assets/gallery-6.jpg", title: "Som para Competição" },
  ]

  galleryItems.forEach((item, index) => {
    const delay = index * 0.1
    const div = document.createElement("div")
    div.className = `gallery-item fade-in`
    div.style.transitionDelay = `${delay}s`
    div.innerHTML = `
            <img src="${item.img}" alt="${item.title}" loading="lazy">
            <div class="gallery-overlay">
                <h4>${item.title}</h4>
            </div>
        `
    galleryContainer.appendChild(div)
    animationObservers.observe(div)
  })

  // Contact Form to WhatsApp
  const contactForm = document.getElementById("contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const name = document.getElementById("name").value
      const phone = document.getElementById("phone").value
      const message = document.getElementById("message").value

      const whatsappNumber = "5563999999999"
      const text = `Olá, me chamo ${name}.%0A%0AMeu telefone é: ${phone}%0A%0A*Mensagem:*%0A${message}`
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`

      window.open(whatsappUrl, "_blank")
      contactForm.reset()
    })
  }

  // Canvas Background Sequence Animation (Simulation)
  initCanvasAnimation()
})

function initCanvasAnimation() {
  const canvas = document.getElementById("hero-canvas")
  if (!canvas) return

  const ctx = canvas.getContext("2d")

  // Resize canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  window.addEventListener("resize", resizeCanvas)
  resizeCanvas()

  // The user requested an image sequence from public/assets.
  // We will preload a generated sequence of images. Since we might not have real images yet,
  // we'll implement the logic assuming files are named frame_0001.webp to frame_0060.webp.
  // For fallback when images don't exist, we will draw a nice animated abstract effect.

  const frameCount = 254 // 0 to 253
  const imagesDesktop = []
  const imagesMobile = []
  let imagesLoadedDesktop = 0
  let imagesLoadedMobile = 0
  const prefixDesktop = "original-3b362f19987e09fbeb2b092dc029db17-"
  const prefixMobile = "original-3b362f19987e09fbeb2b092dc029db17 (1)-"

  // Attempt to load images
  for (let i = 0; i < frameCount; i++) {
    const imgD = new Image()
    imgD.src = `assets/${prefixDesktop}${i}.jpg`
    imgD.onload = () => {
      imagesLoadedDesktop++
    }
    imgD.onerror = () => {
      imgD.error = true
    }
    imagesDesktop.push(imgD)

    const imgM = new Image()
    imgM.src = `assetsmobile/${prefixMobile}${i}.jpg`
    imgM.onload = () => {
      imagesLoadedMobile++
    }
    imgM.onerror = () => {
      imgM.error = true
    }
    imagesMobile.push(imgM)
  }

  let currentFrame = 0
  let fallbackTime = 0

  function renderLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const isMobile = window.innerWidth < 1100
    const activeImages = isMobile ? imagesMobile : imagesDesktop

    // Check if we have at least some images loaded to play sequence
    const validImages = activeImages.filter((img) => !img.error && img.complete)

    if (validImages.length > 5) {
      // If sequence works
      const img = validImages[currentFrame % validImages.length]

      // Draw image covering canvas (cover logic)
      const hRatio = canvas.width / img.width
      const vRatio = canvas.height / img.height
      const ratio = Math.max(hRatio, vRatio)
      const centerShift_x = (canvas.width - img.width * ratio) / 2
      const centerShift_y = (canvas.height - img.height * ratio) / 2

      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio,
      )

      currentFrame++
    } else {
      // FALLBACK ABSTRACT ANIMATION
      // Render a techy grid/particles effect since car images are missing
      fallbackTime += 0.01
      drawFallbackAnimation(ctx, canvas, fallbackTime)
    }

    // To control framerate for the sequence, you might want to wrap requestAnimationFrame in setTimeout,
    // but for smooth fallback, requestAnimationFrame is best.
    setTimeout(() => {
      requestAnimationFrame(renderLoop)
    }, 1000 / 24) // 24 FPS for image sequence
  }

  renderLoop()
}

function drawFallbackAnimation(ctx, canvas, time) {
  // A digital wave effect complementing the Neon/Red theme
  ctx.fillStyle = "#050505"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.lineWidth = 1

  for (let i = 0; i < 20; i++) {
    ctx.beginPath()
    const colorFactor = (Math.sin(time + i * 0.2) + 1) / 2
    // Blend between neon blue and red
    const r = Math.floor(0 + colorFactor * 230) // 0 to 230 (red)
    const g = Math.floor(229 * (1 - colorFactor) + 25 * colorFactor)
    const b = Math.floor(255 * (1 - colorFactor) + 25 * colorFactor)

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.2)`

    for (let x = 0; x < canvas.width; x += 20) {
      const y =
        canvas.height / 2 + Math.sin(x * 0.01 + time + i * 0.2) * (50 + i * 15)
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
}
