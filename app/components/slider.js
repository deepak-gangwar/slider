import { _getClosest } from "../utils/math"
import { number } from "../utils/math"
import { lerp } from "../utils/math"
    
export default class Slider {
    constructor(options = {}) {
        this.bind()

        this.opts = {
        }
      
        this.slider = document.querySelector('.js-slider__inner')
        this.slides = [...this.slider.querySelectorAll('.js-slide')]
        this.clones = []
        this.disableScroll = false
        this.scrollHeight = 0  // can be renamed to slider height
        this.scrollPos = 0
        this.clonesHeight = 0

        // this.onY = 0
        // this.offY = 0

        // this.currentY = 0
        // this.lastY = 0

        // this.min = 0
        // this.max = 0

        // this.centerY = window.innerHeight / 2

        this.rAF = undefined

        this.init()
    }

    bind() {
        ['on', 'off', 'getScrollPos', 'setScrollPos', 'clone', 'setBounds', 'scrollUpdate', 'resize', 'addEventListeners', 'init'].forEach((fn) => this[fn] = this[fn].bind(this))
    }

    getScrollPos() {
        return (this.slider.pageYOffset || this.slider.scrollTop) - (this.slider.clientTop || 0)
    }

    setScrollPos(position) {
        this.slider.scrollTop = position
    }

    // clamp() {
    //     this.currentY = Math.max(Math.min(this.currentY, this.min), this.max)
    // }

    clone() {
        this.slides.forEach(slide => {
            let clone = slide.cloneNode(true)
            this.slider.appendChild(clone)
            clone.classList.add('clone')
            this.clones.push(clone)
        })
    }

    getClonesHeight() {
        let clonesHeight = 0
        this.clones.forEach(clone => {
            clonesHeight += clone.offsetHeight
        })

        return clonesHeight
    }

    setBounds() {
        this.scrollPos = this.getScrollPos()
        this.scrollHeight = this.slider.scrollHeight
        this.clonesHeight = this.getClonesHeight()

        if (this.scrollPos <= 0) {
            this.setScrollPos(1)
        }
    }

    scrollUpdate() {
        if (!this.disableScroll) {
            this.scrollPos = this.getScrollPos()

            if (this.clonesHeight + this.scrollPos >= this.scrollHeight) {
                // Scroll to top when you've reached the bottom
                this.setScrollPos(1) // Scroll down 1 pixel to allow upwards scrolling
                this.disableScroll = true
            }
            else if (this.scrollPos <= 0) {
                // Scroll to the bottom when you reach the top
                this.setScrollPos(this.scrollHeight - this.clonesHeight)
                this.disableScroll = true
            }
        }

        if (this.disableScroll) {
            // Disable scroll-jumping for a short time to avoid flickering
            window.setTimeout(() => {
                this.disableScroll = false
            }, 40)
        }

        // this.requestAnimationFrame(this.scrollUpdate)
    }

    on() {
        this.slider.classList.add('is-scrolling')
        console.log("scrolling")
    }

    off() {
        this.slider.classList.remove('is-scrolling')
        console.log('not scrolling')
    }
    // on(e) {
        // this.onY = window.scrollY
        // console.log("i am on")
    // }

    // off(e) {
    //     this.snap()
    //     this.offY = this.currentY
    //     console.log("i am off")
    // }

    // closest() {
    //     const numbers = []
    //     this.slides.forEach((slide, index) => {
    //         const bounds = slide.getBoundingClientRect()
    //         const diff = this.currentY - this.lastY
    //         const center = (bounds.y + diff) + (bounds.height / 2)
    //         const fromCenter = this.centerY - center
    //         numbers.push(fromCenter)
    //     })
        
    //     let closest = number(0, numbers)
    //     closest = numbers[closest]
        
    //     return {
    //         closest
    //     }
    // }
    
    // snap() {
    //     const { closest } = this.closest()

    //     this.currentY = this.currentY + closest
    //     this.clamp()
    // }

    requestAnimationFrame() {
        this.rAF = requestAnimationFrame(this.scrollUpdate)
    }

    // cancelAnimationFrame() {
    //   cancelAnimationFrame(this.rAF)
    // }

    addEventListeners() {
        this.slider.addEventListener('scroll', this.scrollUpdate, { passive: true })
        this.slider.addEventListener('scroll', this.on, { passive: true })

        let timer = null;
        this.slider.addEventListener('scroll', () => {
            if(timer !== null) {
                clearTimeout(timer);        
            }
            timer = setTimeout(() => {
                // do something
                this.off()
            }, 150);
        }, false);
        
        window.addEventListener('resize', this.resize, false)
    }

    removeEventListeners() {
        this.slider.removeEventListener('scroll', this.scrollUpdate, { passive: true })
        this.slider.removeEventListener('scroll', this.on, { passive: true })
    }

    resize() {
        this.setBounds()
    }

    destroy() {
        this.removeEventListeners()
        this.opts = {}
    }

    init() {
        this.clone()
        this.setBounds()
        this.addEventListeners()
    }
}