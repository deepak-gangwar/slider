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

        // this.rAF = undefined

        this.init()
    }

    bind() {
        ['reCalc', 'scrollUpdate', 'clone', 'addEventListeners', 'init'].forEach((fn) => this[fn] = this[fn].bind(this))
    }

    getScrollPos() {
        return (this.slider.pageYOffset || this.slider.scrollTop) - (this.slider.clientTop || 0)
    }

    setScrollPos(position) {
        this.slider.scrollTop = position
    }

    getClonesHeight() {
        let clonesHeight = 0
        this.clones.forEach(clone => {
            clonesHeight += clone.offsetHeight
        })

        return clonesHeight
    }

    reCalc() {
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
    
    // requestAnimationFrame() {
    //     this.rAF = requestAnimationFrame(this.scrollUpdate)
    // }

    // cancelAnimationFrame() {
    //   cancelAnimationFrame(this.rAF)
    // }


    // onResize() {
    //     window.requestAnimationFrame(this.reCalc)
    // }

    addEventListeners() {
        this.slider.addEventListener('scroll', () => {
            window.requestAnimationFrame(this.scrollUpdate)
        }, false)
        window.addEventListener('resize', () => {
            window.requestAnimationFrame(this.reCalc)
        }, false)
    }

    clone() {
        this.slides.forEach(slide => {
            let clone = slide.cloneNode(true)
            this.slider.appendChild(clone)
            clone.classList.add('clone')
            this.clones.push(clone)
        })
    }

    init() {
        this.clone()
        this.reCalc()
        this.addEventListeners()
    }
}