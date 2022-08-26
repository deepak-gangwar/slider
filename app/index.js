import Slider from "./components/slider"
import Mask from "./components/Canvas/webglMask"

class App {
  constructor() {
    this.init()
  }

  init() {
    new Slider()
    new Mask()
  }
}
new App()