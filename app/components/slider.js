import gsap from "gsap"
import { lerp } from "../utils/math"
    
export default class Slider {
    constructor(options = {}) {
        this.bind()

        this.opts = {
            ease: 0.095
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

        this.state = {
            snap: {
                points: []
            },
            index: {
                last: 0,
                current: 0
            },
            flags: {
                dragging: !1,
                scrolling: !1,
                initialised: !1,
                off: !1,
                snapped: !1
            },
        }

        this.rAF = undefined

        this.init()
    }

    bind() {
        ['onScroll', 'onClick', 'update', 'resize']
            .forEach((fn) => this[fn] = this[fn].bind(this))
    }

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

        this.state.snap.points = null
        this.state.snap.points = []

        this.slides.forEach(item => {
            let n = item.getBoundingClientRect().bottom
            this.state.snap.points.push(-n + 0.75 * window.innerHeight)
        })
        this.clones.forEach(item => {
            let n = item.getBoundingClientRect().bottom
            this.state.snap.points.push(-n + 0.75 * window.innerHeight)
        })
        // the thing happening with snap glitch is that in snap array we are only adding 
        // points from the slides and not from the clones, so it forces at last slide item and it also does not
        // loop back until first clone reaches the top of screen. 
        // SOLUTION: Add clones points to snap array as well.
        
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

    onScroll(e) {
        this.state.flags.scrolling = true

        this.currentY -= e.deltaY
        
        let currentRounded = this.state.index.current % this.slides.length
        this.slides[currentRounded].classList.remove('is-active')
        if(this.state.index.current == this.slides.length) {
            this.clones[0].classList.remove('is-active')
        }

        this.slider.classList.add('is-scrolling')
        // this.onY = window.scrollY
    }
    
    offScroll() {
        this.state.flags.scrolling = false

        // this.snap()
        this.snap(this.state)
        this.state.index.last = this.state.index.current
        this.state.index.current = this.state.snap.points.indexOf(this.currentY)
        
        // LOT OF WORK TO ADD CLASS 'is-active'
        let lastRounded = this.state.index.last % this.slides.length
        let currentRounded = this.state.index.current % this.slides.length

        this.slides[lastRounded].classList.remove('is-active')
        // this.slides[currentRounded].classList.add('is-active')

        // for the last item
        // still sometimes it is happening that first item does not get class is-active
        if(this.state.index.current == this.slides.length) {
            // comment this line to add active class to first slide as well
            this.slides[0].classList.remove('is-active')
            this.clones[0].classList.add('is-active')
        } else {
            this.clones[0].classList.remove('is-active')
            this.slides[currentRounded].classList.add('is-active')
        }
        // 'is-active' ENDS
        
        this.slider.classList.remove('is-scrolling')
        // this.offY = this.currentY
    }

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

    snap() {
        this.currentY = gsap.utils.snap(this.state.snap.points, this.currentY)
    }

    requestAnimationFrame() {
        this.rAF = requestAnimationFrame(this.update)
    }

    cancelAnimationFrame() {
      cancelAnimationFrame(this.rAF)
    }

    addEventListeners() {
        this.slider.addEventListener('scroll', this.update, { passive: true })
        this.slider.addEventListener('wheel', this.onScroll, { passive: true })
        window.addEventListener('click', this.onClick, false)

        let timer = null;
        this.slider.addEventListener('wheel', () => {
            if(timer !== null) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                // do something
                this.offScroll()
            }, 300)
        }, false)
        
        window.addEventListener('resize', this.resize, false)
    }
    
    removeEventListeners() {
        this.slider.removeEventListener('scroll', this.update, { passive: true })
        this.slider.removeEventListener('wheel', this.onScroll, { passive: true })

        window.removeEventListener('resize', this.resize, false)
    }

    resize() {
        this.setBounds()
        this.snap()
    }

    destroy() {
        this.removeEventListeners()

        this.opts = this.state = {}
    }

    init() {
        this.clone()
        this.setBounds()
        this.addEventListeners()
    }
}