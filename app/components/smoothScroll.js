import Prefix from 'prefix'
import { lerp } from '../utils/math'

export default class Smooth {
  constructor(element, elements) {
    this.bindMethods()

    this.element = element
    this.elements = elements

    this.scroll = {
      ease: 0.1,
      current: 0,
      target: 0,
      rounded: 0
    }

    this.rAF = null
    this.transformPrefix = Prefix('transform')
    this.init()
  }

  bindMethods() {
    ['onScroll', 'onResize', 'update']
    .forEach((fn) => this[fn] = this[fn].bind(this))
  }

  setStyles() {
    Object.assign(this.element.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      overflow: 'hidden'        
    })   
  }

  setHeight() {
    document.body.style.height = `${this.elements.wrapper.getBoundingClientRect().height}px`
  }

  onResize() {
    this.setHeight()
    this.onScroll()
    this.scroll.rounded = this.scroll.current = this.scroll.target
  }

  onScroll() {
    this.scroll.target = window.scrollY
  }

  transform(element, y) {
    element.style[this.transformPrefix] = `translate3d(0, -${y}px, 0)`
  }

  /**
   * Loop
   */
  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease)
    this.scroll.rounded = Math.round(this.scroll.current * 100) / 100
    
    if (this.elements.wrapper) {
      this.transform(this.elements.wrapper, this.scroll.rounded)
    }
    this.requestAnimationFrame()
  }

  /**
   * To turn it off on some devices like mobile
   */
  off() {
    this.cancelAnimationFrame()
    this.removeEventListeners()
  }

  requestAnimationFrame() {
    this.rAF = requestAnimationFrame(this.update)
  }

  cancelAnimationFrame() {
    cancelAnimationFrame(this.rAF)
  }

  destroy() {
    document.body.style.height = ''

    this.scroll = null

    this.removeEventListeners()
    this.cancelAnimationFrame()
  }

  /**
   * Listeners
   */

  addEventListners() {
    window.addEventListener('resize', this.onResize, { passive: true })
    window.addEventListener('scroll', this.onScroll, { passive: true })
  }

  removeEventListeners() {
    window.removeEventListener('resize', this.onResize, { passive: true })
    window.removeEventListener('scroll', this.onScroll, { passive: true })
  }

  init() { 
    this.setStyles()
    this.setHeight()
    this.addEventListners()
    this.requestAnimationFrame()
  }
}