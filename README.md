# Deepak Gangwar Frontend Developer Portfolio '22

## 🧊 About Webpack config
Simple webpack configuration to start writing projects. Currently using Webpack 5.

All the things from `shared` folder will be copied to public folder.

Only the images and fonts that are being used will be imported in public folder.

### Installation
```bash
# Clone the repo on you local machine
git clone git@github.com:deepak-gangwar/bundler-webpack-config.git

# To install dependencies
npm install

# To start a dev server locally
npm run dev

# To build the project (output in public folder)
npm run build
```

### HTML
We are using Pug as a template engine for HTML. If you want to use plain HTML and remove pug, you can 
- remove the `pug-loader` in webpack.common.js
- change `index.pug` to `index.html` in HtmlWebpackPlugin in webpack.common.js 

### CSS
We are using SCSS. 
Especially because of the ability to add partials and write modular styles. 
So that we can separate our styles of individual views and components into separate files. 
All these styles reside in the `styles` folder.

### Images
Keep all the images in ~~`assets`~~ `shared` folder

**How to access them**
- As `'a.png'` in JavaScript
- As ~~`'assets/a.png'`~~ `'a.png'`in HTML

### Fonts
Currently I have kept fonts in the `assets/fonts`. You can also keep them in `fonts` folder in `root` directory as well. 

**How to access them**
- `('../fonts/abc.woff2')` if fonts folder is in root
- `('../assets/fonts/abc.woff2')` if fonts folder is in assets
