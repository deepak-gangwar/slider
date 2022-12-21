class Sniffer {
    constructor() {
        this.uA = navigator.userAgent.toLowerCase()
        this.pf = navigator.platform.toLowerCase()
        this.safari = /^((?!chrome|android).)*safari/.test(this.uA)
        this.safariVersion = +(this.uA.match(/version\/[\d\.]+.*safari/) || ["-1"])[0].replace(/^version\//, "").replace(/ safari$/, "")
        this.firefox = this.uA.indexOf("firefox") > -1
        this.chrome = /chrome/.test(this.uA)
        this.ie = /msie|trident/.test(this.uA)
        this.webkit = /webkit/.test(this.uA)
        this.edge = /edge\/\d./.test(this.uA)
        this.ios = /ip(hone|[ao]d)/.test(this.uA)
        this.mac = this.pf.indexOf("mac") > -1
        this.windows = this.pf.indexOf("win") > -1
        this.android = /android/.test(this.uA)
        this.androidMobile = /android.*mobile/.test(this.uA)
        this.mobile = this.androidMobile || this.ios || (navigator.platform === "MacIntel" && 1 < navigator.maxTouchPoints)
        this.touchDevice = "ontouchstart" in window
        this.mutationObserver = "MutationObserver" in window
    }
}
export const Sniff = new Sniffer()