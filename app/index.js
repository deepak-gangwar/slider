import Slider from "./components/slider"

class App {
  constructor() {
    this.init()
  }

  init() {
    new Slider()
  }
}
new App()

// var slider = document.querySelector('.js-slider__inner'),
//   slides = [...slider.querySelectorAll('.js-slide')],
//   clones = [],
//   disableScroll = false,
//   scrollHeight = 0,
//   scrollPos = 0,
//   clonesHeight = 0

// function getScrollPos () {
//   return (slider.pageYOffset || slider.scrollTop) - (slider.clientTop || 0)
// }

// function setScrollPos (pos) {
//   slider.scrollTop = pos
// }

// function getClonesHeight () {
//   clonesHeight = 0
  
//   clones.forEach(clone => {
//     clonesHeight = clonesHeight + clone.offsetHeight
//   })
      
//   return clonesHeight
// }

// function reCalc () {
//   scrollPos = getScrollPos()
//   scrollHeight = slider.scrollHeight
//   clonesHeight = getClonesHeight()

//   if (scrollPos <= 0) {
//     setScrollPos(1) // Scroll 1 pixel to allow upwards scrolling
//   }
// }

// function scrollUpdate () {
//   if (!disableScroll) {
//     scrollPos = getScrollPos()

//     if (clonesHeight + scrollPos >= scrollHeight) {
//       // Scroll to the top when you’ve reached the bottom
//       setScrollPos(1) // Scroll down 1 pixel to allow upwards scrolling
//       disableScroll = true
//     } else if (scrollPos <= 0) {
//       // Scroll to the bottom when you reach the top
//       setScrollPos(scrollHeight - clonesHeight)
//       disableScroll = true
//     }
//   }

//   if (disableScroll) {
//     // Disable scroll-jumping for a short time to avoid flickering
//     window.setTimeout(function () {
//       disableScroll = false
//     }, 40)
//   }
// }

// function onLoad () {
//   slides.forEach(slide => {
//     let clone = slide.cloneNode(true)
//     slider.appendChild(clone)
//     clone.classList.add('clone')
//   })

//   clones = slider.querySelectorAll('.clone')

//   reCalc()

//   slider.addEventListener('scroll', function () {
//     window.requestAnimationFrame(scrollUpdate)
//   }, false)

//   window.addEventListener('resize', function () {
//     window.requestAnimationFrame(reCalc)
//   }, false)
// }

// window.onload = onLoad
