This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# React Pan and Zoom

A react component for zooming and panning images.

### Features

-   Zoom-in/out with mouse wheel
-   Zoom-in/out with pinch-out/in on touch devices
-   Drag and pan image
-   Double click for zoom-in/out
-   Double tap for zoom-in/out on touch devices

## Installation

### npm

```bash
npm install @peyman-mohtashami/react-pan-and-zoom
```

### local

```bash
git clone https://github.com/peyman-mohtashami/react-pan-and-zoom.git
npm install
npm start
```

## Options

-   `width` (string, default: `500px`): container width - `"50%", "500px", "100vh"`
-   `height` (string, default: `500px`): container height - `"500px", "100vh"`

## Example

```js
import PanAndZoom from "@peyman-mohtashami/react-pan-and-zoom";

<PanAndZoom height="500px" width="100%">
	<img src="http://sample.image.url.com" alt="Sample Image" />
</PanAndZoom>;
```

**Tested on**

-   Chrome 75.0.3770.100
-   Firefox 68.0
-   Edge 42.17134.1.0
-   Opera 62.0.3331.72
-   Chrome Android 75.0.3770.143
-   Samsung Internet 9.2.10.15
-   Brave 0.66.99

## License

Licensed under the [MIT License](http://opensource.org/licenses/MIT).

## Credits

Inspired by:

-   [iv-viewer by Sudhanshu Yadav](https://github.com/s-yadav/iv-viewer)
-   [react-pan-and-zoom-hoc by woutervh-](https://github.com/woutervh-/react-pan-and-zoom-hoc)
-   [pinchzoom by Manuel Stofer](https://github.com/manuelstofer/pinchzoom)
-   [stackoverflow: Simplest way to detect a pinch](https://stackoverflow.com/a/11183333/11672145)
