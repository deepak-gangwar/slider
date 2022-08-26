import gsap from "gsap"
import { lerp } from "../utils/math"
    
export default class Slider {
    constructor(options = {}) {
        this.bind()

        this.opts = {
            speed: 1,
            ease: 0.095
        }
      
        this.slider = document.querySelector('.js-slider')
        this.sliderInner = this.slider.querySelector('.js-slider__inner')
        this.slides = [...this.slider.querySelectorAll('.js-slide')]
        
        this.currentY = 0
        this.targetY = 0
        this.dragStartY = 0

        // to scale items while moving
        this.targetScale = 1
        this.scale = []

        this.clones = []
        this.disableScroll = false
        this.scrollHeight = 0  // can be renamed to slider height
        this.scrollPos = 0
        this.clonesHeight = 0

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

        this.timer = null
        this.rAF = undefined

        this.init()
    }

    bind() {
        ['onScroll', 'onDragStart', 'onDrag', 'onDragEnd', 'update', 'resize']
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

        // Combining slides and clones to items
        this.items = [...this.slides, ...this.clones]
        this.items.forEach(item => {
            let n = item.getBoundingClientRect().bottom
            this.state.snap.points.push(-n + 0.68 * window.innerHeight)
        })

        this.items.forEach((item, i) => {
            this.scale[i] = 1
        })
        
        this.scrollHeight = this.slider.scrollHeight
        this.clonesHeight = this.getClonesHeight()
        this.itemHeight = this.slides[0].getBoundingClientRect().height
        this.sliderHalfHeight = this.scrollHeight - this.clonesHeight
    }

    update() {
        this.targetY = lerp(this.targetY, this.currentY, this.opts.ease)
        this.targetY = Math.round(this.targetY * 100) / 100
        this.diff = this.currentY - this.targetY

        // SLIDER TRANSFORMS 
        this.sliderInner.style.transform = `translateY(${this.targetY}px)`
        // while moving targetScale becomes 0.9 else it is 1
        this.items.forEach((item, i) => {
            this.scale[i] += (this.targetScale - this.scale[i]) * 0.225
            this.items[i].firstElementChild.style.transform = `scale(${this.scale[i]}) translateZ(0)`
        })
        

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

    setKeyboard() {
        window.addEventListener("keydown", e => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                this.targetScale = 0.9
                this.goToNextItem()
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                this.targetScale = 0.9
                this.goToPrevItem()
            } else if (e.key === "Enter") {
                // this.goFocus()
            } else if (e.key === "Escape") {
                // this.leaveFocus()
            }
        })
        
        // window.addEventListener('keydown', () => this.targetScale = 0.9)
        window.addEventListener('keyup', () => this.targetScale = 1)
    }

    onScroll(e) {
        this.currentY -= e.deltaY
        this.state.flags.scrolling = true
        
        this.slides[this.state.index.current % this.slides.length].classList.remove('is-active')
        if(this.state.index.current == this.slides.length) {
            this.clones[0].classList.remove('is-active')
        }

        this.slider.classList.add('is-scrolling')
        // this.targetScale = 0.9
        this.checkScroll()
    }

    checkScroll() {
        if(this.timer !== null) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
            // do something when scrolling stops
            // this.targetScale = 1
            this.offScroll()
        }, 300)
    }
    
    offScroll() {
        this.state.flags.scrolling = false
        this.onCurrentItemChange()
        this.slider.classList.remove('is-scrolling')
    }

    // DRAG CONTROLS
    onDragStart(e) {
        let y = e.y
        // this.targetScale = 0.9
        this.state.flags.dragging = true
        this.dragStartY = this.currentY - y * this.opts.speed
        this.slider.classList.add('is-grabbing')
    }

    onDrag(e) {
        let y = e.y
        // this.targetScale = 1
        if (this.state.flags.dragging) {
            this.currentY = this.dragStartY + y * this.opts.speed
        }
    }

    onDragEnd() {
        this.state.flags.dragging = false
        this.onCurrentItemChange()
        this.slider.classList.remove('is-grabbing')
    }
    // DRAG CONTROLS ENDS

    // LOT OF WORK TO ADD CLASS 'is-active'
    onCurrentItemChange() {
        this.snap(this.state)
        this.state.index.last = this.state.index.current
        this.state.index.current = this.state.snap.points.indexOf(this.currentY)

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
    }

    goToNextItem() {
        this.currentY -= this.itemHeight
        this.onCurrentItemChange()
    }

    goToPrevItem() {
        this.currentY += this.itemHeight
        this.onCurrentItemChange()
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

        window.addEventListener('mousemove', this.onDrag, { passive: true })
        window.addEventListener('mousedown', this.onDragStart, false)
        window.addEventListener('mouseup', this.onDragEnd, false)

        window.addEventListener('resize', this.resize, false)
    }
    
    removeEventListeners() {
        this.slider.removeEventListener('scroll', this.update, { passive: true })
        this.slider.removeEventListener('wheel', this.onScroll, { passive: true })

        window.removeEventListener('mousemove', this.onDrag, { passive: true })
        window.removeEventListener('mousedown', this.onDragStart, false)
        window.removeEventListener('mouseup', this.onDragEnd, false)

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
        this.setKeyboard()
        this.addEventListeners()
    }
}