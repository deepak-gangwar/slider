import { Vec2, Renderer, Camera, Plane, Texture, Program, Mesh, Transform } from 'ogl'
import { lerp } from "../../utils/math"

import vertexShader from '../../shaders/vertex.glsl'
import fragmentShader from '../../shaders/fragment.glsl'

const vertex = vertexShader
const fragment = fragmentShader

export default class Mask {
    constructor() {
        this.bind()

        this.el = document.querySelector('.preview__img')
        this.el.classList.add('is-loading')

        this.maskSrc = this.el.dataset.glImageMaskSrc

        this.windowWidth = window.innerWidth
        this.windowHeight = window.innerHeight
        this.BCR = this.el.getBoundingClientRect()
        this.planeBCR = { 
            width: 1, 
            height: 1, 
            x: 0, 
            y: 0 
        }

        this.isLoaded = false

        this.maskPosition = new Vec2(1, 0)
        this.mouse = new Vec2(-0.5, -0.5)

        this.now = 0
        this.settings = {
            factor: 0,
            // factorAim: this.getData("factor"), 
            factorAim: this.el.dataset.glImageFactor, 
            speed: 0 
        }

        this.wrapper = null
        this.media = null
        // this.bgImage.size = {
        //     width: 0,
        //     height: 0
        // }

        this.rAF = undefined

        this.init()
    }

    bind() {
        ['mousemove', 'resize', 'update']
        .forEach(fn => this[fn] = this[fn].bind(this))
    }

    initRenderer() {
        const canvas = this.wrapper.querySelector('canvas')
        this.renderer = new Renderer({ canvas: canvas, dpr: 1, antialias: !0, premultiplyAlpha: !1, alpha: !0 })
        this.renderer.setSize(this.BCR.width, this.BCR.height)

        this.gl = this.renderer.gl
        // this.gl.clearColor(247 / 255, 245 / 255, 248 / 255, 1)
    }
    
    initScene() {
        this.scene = new Transform()
    }

    initCamera() {
        this.fov = 45
        this.camera = new Camera(this.gl, { fov: this.fov })
        this.camera.position.set(0, 0, 1)
    }

    initShape() {
        this.geometry = new Plane(this.gl, { width: 1, height: 1, widthSegments: 10, heightSegments: 10 })

        // Init empty texture while source loading
        this.texture = new Texture(this.gl, {
            minFilter: this.gl.LINEAR,
            generateMipmaps: false,
            width: 1920,
            height: 1080
        })

        const texture = new Texture(this.gl, { minFilter: this.gl.LINEAR })
        const image = new Image()

        image.src = this.maskSrc
        image.onload = () => {
            texture.image = image

            if(this.media instanceof HTMLVideoElement) {
                this.media.load()
                this.media.play()
            }
        }

        this.imageSize = {
            width: this.media.naturalWidth,
            height: this.media.naturalHeight
        }

        this.program = new Program(this.gl, {
            vertex,
            fragment,
            uniforms: {
                maskTexture: { value: texture },
                maskPosition: { value: new Vec2(1, 0) },
                texture: { value: this.texture },
                speed: { value: this.settings.speed },
                meshSize: { value: [window.innerWidth - 200, window.innerHeight] },
                imageSize: { value: [this.imageSize.width, this.imageSize.height] },
            },
            cullFace: null,
        })

        this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program, })

        this.updateSize()
        this.isLoaded = true
        this.el.classList.remove('is-loading')
        this.mesh.setParent(this.scene)
        this.resize()
    }

    calculateUnitSize(z) {
        const fovInRadian = (this.fov * Math.PI) / 180
        
        // basic trigonometry
        // this gives the width of plane that would cover the whole screen based on z position
        const i = 2 * Math.tan(fovInRadian / 2) * z

        return { width: i * this.camera.aspect, height: i }
    }

    updateSize() {
        // this.gap = 30
        this.gap = 0
        this.camUnit = this.calculateUnitSize(this.camera.position.z)
        this.planeBCR.width = this.camUnit.width - this.camUnit.width * (this.gap / 100)
        // this.planeBCR.width = this.camUnit.width
        this.planeBCR.height = this.planeBCR.width / this.camera.aspect

        this.geometry = new Plane(this.gl, { width: this.planeBCR.width, height: this.planeBCR.height, widthSegments: 100, heightSegments: 100 })
        this.mesh.geometry = this.geometry

        this.gl.canvas.style.width = `${this.BCR.width}px`
        this.gl.canvas.style.height = `${this.BCR.height}px`
    }

    mouseenter(e) {
        this.formatPosition({ 
            x: (e.clientX - this.BCR.left) / this.BCR.width, 
            y: (e.clientY - this.BCR.top) / this.BCR.height, 
            obj: this.mouse 
        })
        this.formatPosition({ 
            x: (e.clientX - this.BCR.left) / this.BCR.width, 
            y: (e.clientY - this.BCR.top) / this.BCR.height, 
            obj: this.maskPosition 
        })
    }

    mouseleave() {}

    mousemove(e) {
        this.formatPosition({ 
            x: (e.clientX - this.BCR.left) / this.BCR.width, 
            y: (e.clientY - this.BCR.top) / this.BCR.height, 
            obj: this.mouse 
        })
        this.formatPosition({ 
            x: (e.clientX - this.BCR.left) / this.BCR.width, 
            y: (e.clientY - this.BCR.top) / this.BCR.height, 
            obj: this.maskPosition 
        })
    }

    formatPosition(pos) {
        pos.obj.x = pos.x
        pos.obj.y = pos.y
    }

    update(t) {
        requestAnimationFrame(this.update)

        this.settings.speed = (this.maskPosition.x - this.program.uniforms.maskPosition.value.x) / (t - this.now)

        if(this.settings.speed > 0.01) {
            this.settings.speed = 0.01
        }
        if(this.settings.speed < -0.01) {
            this.settings.speed = -0.01
        }

        this.program.uniforms.maskPosition.value.x = lerp(this.program.uniforms.maskPosition.value.x, this.maskPosition.x, 0.085)
        this.program.uniforms.maskPosition.value.y = lerp(this.program.uniforms.maskPosition.value.y, this.maskPosition.y, 0.085)
        
        if(!isNaN(this.settings.speed)) {
            this.program.uniforms.speed.value = lerp(this.program.uniforms.speed.value, this.settings.speed, 0.2)
        }

        if(this.media instanceof HTMLVideoElement) {
            if (this.media.readyState >= this.media.HAVE_ENOUGH_DATA) {
                if(!this.texture.image) {
                    this.texture.image = this.media
                }
                this.texture.needsUpdate = true
            }
        } else if (this.media instanceof HTMLImageElement) {
            if(!this.texture.image) {
                this.texture.image = this.media
                this.texture.needsUpdate = true
            }
        }

        this.renderer.render({ scene: this.scene, camera: this.camera })

        this.now = t
    }

    resize() {
        // this.camera.perspective({ aspect: this.gl.canvas.width / this.gl.canvas.height })
        this.camera.aspect = this.gl.canvas.width / this.gl.canvas.height
    }

    requestAnimationFrame() {
        this.rAF = requestAnimationFrame(this.update)
    }

    cancelAnimationFrame() {
        cancelAnimationFrame(this.rAF)
    }

    addEventListeners() {
        window.addEventListener('mousemove', this.mousemove, false)
        window.addEventListener('resize', this.resize, false)
    }
    
    removeEventListeners() {
        window.removeEventListener('mousemove', this.mousemove, false)
        window.removeEventListener('resize', this.resize, false)
    }

    destroy() {
        this.removeEventListeners()
    }

    init() {
        this.wrapper = this.el.querySelector('.webgl__wrapper')

        if(this.wrapper) {
            this.media = this.el.querySelector('[data-gl-image="media"]')
            if(this.media) {
                this.initRenderer()
                this.initScene()
                this.initCamera()
                this.initShape()
                this.addEventListeners()
            }
        }
        this.update()
    }
}