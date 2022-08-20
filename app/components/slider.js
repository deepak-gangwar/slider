import { _getClosest } from "../utils/math"
import { number } from "../utils/math"
import { lerp } from "../utils/math"
    
export default class Slider {
    constructor(options = {}) {
        this.bind()

        this.opts = {
            ease: 0.075
        }
      
        this.slider = document.querySelector('.js-slider')
        this.sliderInner = this.slider.querySelector('.js-slider__inner')
        this.slides = [...this.slider.querySelectorAll('.js-slide')]
        
        this.currentY = 0
        this.targetY = 0
        this.smoothTarget = []

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
        ['on', 'onClick', 'update', 'resize']
            .forEach((fn) => this[fn] = this[fn].bind(this))
    }

    // clamp() {
    //     this.current = Math.max(Math.min(this.current, this.min), this.max)
    // }

    clone() {
        this.slides.forEach(slide => {
            let clone = slide.cloneNode(true)
            this.sliderInner.appendChild(clone)
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
        this.slider.scrollTop = 1
        
        this.scrollHeight = this.slider.scrollHeight
        this.clonesHeight = this.getClonesHeight()
        this.itemHeight = this.slides[0].getBoundingClientRect().height
        this.sliderHalfHeight = this.scrollHeight - this.clonesHeight

        // this.max = this.clonesHeight * 2
    }

    update() {      
        this.targetY = lerp(this.targetY, this.currentY, this.opts.ease)
        this.targetY = Math.round(this.targetY * 100) / 100
        this.diff = this.currentY - this.targetY

        this.sliderInner.style.transform = `translateY(${this.targetY}px)`

        if(this.targetY > 0) {
            this.currentY = this.diff -this.sliderHalfHeight 
            this.targetY = -this.sliderHalfHeight
            this.sliderInner.style.transform = `translateY(${this.targetY}px)`
            this.disableScroll = true
        } else if(Math.abs(this.targetY) > this.scrollHeight / 2) {
            this.targetY = 0
            this.currentY = this.diff
            this.sliderInner.style.transform = `translateY(0)px`
            this.disableScroll = true
        }
        
        this.requestAnimationFrame(this.update)
    }

    on(e) {
        this.currentY -= e.deltaY
        this.slider.classList.add('is-scrolling')
        // this.onY = window.scrollY
    }
    
    off() {
        // this.snap()
        this.slider.classList.remove('is-scrolling')
        // this.offY = this.currentY
    }

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

    //     this.current = this.current + closest
    //     this.clamp()
    // }

    onClick() {
        this.goToNextItem()
    }

    goToNextItem() {
        // this.currentItem++
        this.nextItem()
    }

    nextItem() {
        this.currentY -= this.slides[0].getBoundingClientRect().height
    }

    requestAnimationFrame() {
        this.rAF = requestAnimationFrame(this.update)
    }

    cancelAnimationFrame() {
      cancelAnimationFrame(this.rAF)
    }

    addEventListeners() {
        this.slider.addEventListener('scroll', this.update, { passive: true })
        this.slider.addEventListener('wheel', this.on, { passive: true })
        window.addEventListener('click', this.onClick, false)

        let timer = null;
        this.slider.addEventListener('wheel', () => {
            if(timer !== null) {
                clearTimeout(timer);        
            }
            timer = setTimeout(() => {
                // do something
                this.off()
            }, 300);
        }, false);
        
        window.addEventListener('resize', this.resize, false)
    }
    
    removeEventListeners() {
        this.slider.removeEventListener('scroll', this.update, { passive: true })
        this.slider.removeEventListener('wheel', this.on, { passive: true })

        window.removeEventListener('resize', this.resize, false)
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