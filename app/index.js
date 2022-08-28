import Slider from "./components/slider"
import Mask from "./components/Canvas/webglMask"

class App {
  constructor() {
    this.init()
    this.styleConsoleForDevs()
  }

  init() {
    new Slider()
    new Mask()
  }

  styleConsoleForDevs() {
    // 1. Pass CSS styles in an array
    const style1 = [
        'font-family: Helvetica',
        'padding-top: 20px',
        'padding-bottom: 20px',
        'font-size: 1.2rem',
    ].join(';')// 2. Concatenate the individual array item and concatenate them into a string separated by a semi-colon (;)

    const style2 = [
        'color: red',
        'padding-top: 20px',
        'padding-bottom: 20px',
        'font-size: 1.2rem',
    ].join(';')

    const styleLink = [
        'font-size: .7rem',
        'padding-bottom: 20px',
        // 'font-family: Helvetica',
    ].join(';')

    // 3. Pass the styles variable
    console.log('%cMade with %c♥%c by Deepak Gangwar%c\n✌ https://deepakgangwar.me', style1, style2, style1, styleLink)
    // console.log('http://deepakgangwar.me');
  }
}
new App()