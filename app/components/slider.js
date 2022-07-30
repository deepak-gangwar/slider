export default class Slider {
    constructor(options = {}) {
        this.bind()

        this.opts = {
        }
      
        this.slider = document.querySelector('.js-loopContainer')
        this.slides = [...this.slider.querySelectorAll('.js-loopItem')]
        this.clones = []
        this.disableScroll = false
        this.scrollHeight = 0  // can be renamed to slider height
        this.scrollPos = 0
        this.clonesHeight = 0

        this.rAF = undefined
    }

    bind() {
        ['getPos', 'setPos', 'getClonesHeight', 'reCalc', 'scrollUpdate', 'onResize', 'addEventListeners', 'init'].forEach((fn) => this[fn] = this[fn].bind(this))
    }

    getPos() {
        return (this.slider.pageYOffset || this.slider.scrollTop) - (this.slider.clientTop || 0)
    }

    setPos(position) {
        this.slider.scrollTop = position
    }

    getClonesHeight() {
        this.clonesHeight = 0

        this.clones.forEach(clone => {
            this.clonesHeight += clone.offsetHeight
        })

        return this.clonesHeight
    }

    reCalc() {
        this.scrollPos = this.getPos
        this.scrollHeight = this.slider.scrollHeight
        this.clonesHeight = this.getClonesHeight()

        if (this.scrollPos <= 0) {
            this.setPos(1)
        }
    }

    scrollUpdate() {
        if (!this.disableScroll) {
            this.scrollPos = this.getPos()

            if (this.clonesHeight + this.scrollPos >= this.scrollHeight) {
                this.setPos(1)
                this.disableScroll = true
            }
            else if (this.scrollPos <= 0) {
                this.setPos(this.scrollHeight - this.clonesHeight)
                this.disableScroll = true
            }
        }

        if (this.disableScroll) {
            window.setTimeout(() => {
                this.disableScroll = false
            }, 40)
        }

        this.requestAnimationFrame(this.scrollUpdate)
    }
    
    requestAnimationFrame() {
        this.rAF = requestAnimationFrame(this.scrollUpdate)
    }

    cancelAnimationFrame() {
      cancelAnimationFrame(this.rAF)
    }

    // onScroll() {
    //     window.requestAnimationFrame(this.scrollUpdate)
    // }

    onResize() {
        window.requestAnimationFrame(this.reCalc)
    }

    addEventListeners() {
        // this.scrollUpdate()
        this.slider.addEventListener('scroll', this.scrollUpdate, false)
        window.addEventListener('resize', this.onResize, false)
    }

    init() {
        this.slides.forEach(slide => {
            let clone = slide.cloneNode(true)
            this.slider.appendChild(clone)
            clone.classList.add('js-clone')
        })
        
        this.clones = this.slider.querySelectorAll('.js-clone')
        
        this.reCalc()
    }
}