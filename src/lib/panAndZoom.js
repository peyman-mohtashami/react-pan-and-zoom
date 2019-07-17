/** Change layout css change (left/right on position absolute) to composite change (transform:translate)
 * For animation and better performance
 * https://medium.com/outsystems-experts/how-to-achieve-60-fps-animations-with-css3-db7b98610108 */
 import React, { Component } from "react";
 import PropTypes from "prop-types";
 
 const propTypes = {
     width: PropTypes.string,
     height: PropTypes.string
 };
 
 const defaultProps = {
     width: "500px",
     height: "500px"
 };
 
 const SCALE_FACTOR_WHEEL = 1.2;
 const SCALE_FACTOR_TOUCH = 1.03;
 //const NORMAL_SCROLL_ON_WHEEL_END = false;
 const MAXIMUM_SCALE = 10;
 const MINIMUM_SCALE = 1;
 const INITIAL_SCALE = 1;
 const DOUBLE_CLICK_SCALE = 3;
 /** Windows default double-click time is 500ms
  * https://docs.microsoft.com/en-us/windows/win32/controls/ttm-setdelaytime */
 const DOUBLE_CLICK_DELAY = 500;
 
 class PanAndZoom extends Component {
     state = {
         scale: INITIAL_SCALE,
         translateX: 0,
         translateY: 0,
         preTranslateX: 0,
         preTranslateY: 0,
         loaded: false,
         transition: "opacity 300ms ease"
     };
 
     timeout;
     lastTap;
     pan = false;
     pinchZoom = false;
     dist;
 
     componentDidMount() {
         this.child.addEventListener("wheel", this.handleWheel);
         this.child.addEventListener("mousedown", this.handleMouseDown);
         this.child.addEventListener("touchstart", this.handleTouchDown);
     }
 
     handleLoad = () => {
         this.setState({ loaded: true });
     };
 
     handleWheel = e => {
         let scale = this.state.scale;
         if (e.deltaY < 0 && scale < MAXIMUM_SCALE) scale *= SCALE_FACTOR_WHEEL;
         else if (e.deltaY > 0 && scale > MINIMUM_SCALE)
             scale /= SCALE_FACTOR_WHEEL;
         else return;
         this.zoomInOut(e.clientX, e.clientY, scale, true);
         e.preventDefault();
     };
 
     zoomInOut = (clientX, clientY, scale, transition) => {
         if (scale > MAXIMUM_SCALE) scale = MAXIMUM_SCALE;
         else if (scale < MINIMUM_SCALE) scale = MINIMUM_SCALE;
 
         /** imageCenter_new = mousePointerRelativeToContainer * (1 - scale_new/scale_old) + imageCenter_old * (scale_new/scale_old)
          * mousePointerRelativeToCntainer = evt.page - this.container.getBoundingClientRect().top|left
          * imageCenter_old = containerCenter - translate_old
          * containerCenter = this.container.getBoundingClientRect().width|height /2
          *
          * translate = imageCenter_new - containerCenter
          * containerCenter = this.container.getBoundingClientRect().width|height /2
          *
          * translate = (mouseX|Y)(1-f)+(f-1)(containerWidth|height)/2+(translate)(f)
          */
         const mouseX = clientX - this.container.getBoundingClientRect().left;
         const mouseY = clientY - this.container.getBoundingClientRect().top;
         const factor = scale / this.state.scale;
         const translateX =
             mouseX * (1 - factor) +
             ((factor - 1) * this.container.getBoundingClientRect().width) / 2 +
             factor * this.state.translateX;
         const translateY =
             mouseY * (1 - factor) +
             ((factor - 1) * this.container.getBoundingClientRect().height) / 2 +
             factor * this.state.translateY;
         const position = this.restrictBoundaries(scale, translateX, translateY);
         this.setState({
             scale,
             translateX: position.translateX,
             translateY: position.translateY,
             transition: transition ? "transform 300ms ease" : "none"
         });
     };
 
     handleMouseDown = e => {
         /**
          * Single tap and double tap detection
          * http://jsfiddle.net/brettwp/J4djY/
          */
         const currentTime = new Date().getTime();
         const tapLength = currentTime - this.lastTap;
         clearTimeout(this.timeout);
         if (tapLength < DOUBLE_CLICK_DELAY && tapLength > 0) {
             let scale = DOUBLE_CLICK_SCALE;
             if (this.state.scale > MINIMUM_SCALE) scale = MINIMUM_SCALE;
             this.zoomInOut(e.clientX, e.clientY, scale, true);
         } else {
             this.timeout = setTimeout(() => {
                 clearTimeout(this.timeout);
             }, DOUBLE_CLICK_DELAY);
             this.setState({
                 preTranslateX: e.clientX,
                 preTranslateY: e.clientY,
                 transition: "none"
             });
         }
         this.lastTap = currentTime;
         document.addEventListener("mousemove", this.handleMouseMove);
         document.addEventListener("mouseup", this.handleMouseUp);
         e.preventDefault();
     };
 
     handleMouseMove = e => {
         const {
             translateX,
             translateY,
             preTranslateX,
             preTranslateY,
             scale
         } = this.state;
         const deltaX = e.clientX - preTranslateX;
         const deltaY = e.clientY - preTranslateY;
         const position = this.restrictBoundaries(
             scale,
             translateX + deltaX,
             translateY + deltaY
         );
         this.setState({
             translateX: position.translateX,
             translateY: position.translateY,
             preTranslateX: e.clientX,
             preTranslateY: e.clientY
         });
     };
 
     handleMouseUp = () => {
         document.removeEventListener("mousemove", this.handleMouseMove);
         document.removeEventListener("mouseup", this.handleMouseUp);
     };
 
     restrictBoundaries = (scale, translateX, translateY) => {
         const {
             clientWidth: containerWidth,
             clientHeight: containerHeight
         } = this.container;
         const {
             clientWidth: childWidth,
             clientHeight: childHeight
         } = this.child;
         /** child.clientWidth/Height is always original width/Height.
          * So, for current child width/height, it should be multiplied by scale.
          *
          * limit a number between a min/max value:
          * https://stackoverflow.com/questions/5842747/how-can-i-use-javascript-to-limit-a-number-between-a-min-max-value */
         const translateXLimit = 0.5 * (childWidth * scale - containerWidth);
         if (translateXLimit <= 0) translateX = 0;
         else
             translateX = Math.min(
                 Math.max(translateX, -translateXLimit),
                 translateXLimit
             );
 
         const translateYLimit = 0.5 * (childHeight * scale - containerHeight);
         if (translateYLimit <= 0) translateY = 0;
         else
             translateY = Math.min(
                 Math.max(translateY, -translateYLimit),
                 translateYLimit
             );
 
         return { translateX, translateY };
     };
 
     handleTouchDown = e => {
         const currentTime = new Date().getTime();
         const tapLength = currentTime - this.lastTap;
         clearTimeout(this.timeout);
         let dist;
         if (e.touches.length === 2) {
             this.pan = false;
             this.pinchZoom = true;
             dist = Math.hypot(
                 e.touches[0].pageX - e.touches[1].pageX,
                 e.touches[0].pageY - e.touches[1].pageY
             );
             this.dist = dist;
         } else {
             if (tapLength < DOUBLE_CLICK_DELAY && tapLength > 0) {
                 let scale = DOUBLE_CLICK_SCALE;
                 if (this.state.scale > MINIMUM_SCALE) scale = MINIMUM_SCALE;
                 this.zoomInOut(
                     e.touches[0].clientX,
                     e.touches[0].clientY,
                     scale,
                     true
                 );
             } else {
                 this.timeout = setTimeout(() => {
                     clearTimeout(this.timeout);
                 }, DOUBLE_CLICK_DELAY);
                 this.pan = true;
                 this.pinchZoom = false;
                 this.setState({
                     preTranslateX: e.touches[0].clientX,
                     preTranslateY: e.touches[0].clientY,
                     transition: "none"
                 });
             }
             this.lastTap = currentTime;
         }
         document.addEventListener("touchmove", this.handleTouchMove);
         document.addEventListener("touchup", this.handleTouchUp);
         e.preventDefault();
     };
 
     handleTouchMove = e => {
         if (e.touches.length === 2 && this.pinchZoom && !this.pan) {
             const dist = Math.hypot(
                 e.touches[0].pageX - e.touches[1].pageX,
                 e.touches[0].pageY - e.touches[1].pageY
             );
             let scale = this.state.scale;
             const deltaDist = dist - this.dist;
             if (deltaDist > 1 && scale < MAXIMUM_SCALE)
                 scale *= SCALE_FACTOR_TOUCH;
             else if (deltaDist < -1 && scale > MINIMUM_SCALE)
                 scale /= SCALE_FACTOR_TOUCH;
             else return;
 
             const centerX = 0.5 * (e.touches[0].clientX + e.touches[1].clientX);
             const centerY = 0.5 * (e.touches[0].clientY + e.touches[1].clientY);
 
             this.dist = dist;
             this.zoomInOut(centerX, centerY, scale, false);
         } else if (this.pan && !this.pinchZoom) {
             const {
                 translateX,
                 translateY,
                 preTranslateX,
                 preTranslateY,
                 scale
             } = this.state;
             const deltaX = e.touches[0].clientX - preTranslateX;
             const deltaY = e.touches[0].clientY - preTranslateY;
             const position = this.restrictBoundaries(
                 scale,
                 translateX + deltaX,
                 translateY + deltaY
             );
             this.setState({
                 translateX: position.translateX,
                 translateY: position.translateY,
                 preTranslateX: e.touches[0].clientX,
                 preTranslateY: e.touches[0].clientY
             });
         }
     };
 
     handleTouchEnd = () => {
         this.pan = false;
         this.pinchZoom = false;
         document.removeEventListener("touchmove", this.handleTouchMove);
         document.removeEventListener("touchup", this.handleTouchEnd);
     };
 
     render() {
         const styles = {
             height: "100%",
             width: "auto",
 
             /** IMPORTANT order of multiple transform one line directives are applied from right to left
              * 1- scale, 2-translate
              * https://stackoverflow.com/questions/10765755/how-to-apply-multiple-transforms-in-css
              */
             transform: `translate(${this.state.translateX}px,${
                 this.state.translateY
             }px) scale(${this.state.scale})`,
 
             /** On panning: no transition
              * On scale: transition
              * On load: transition
              */
             transition: `${this.state.transition}`,
 
             opacity: this.state.loaded ? 1 : 0
         };
         const childWithStyles = React.cloneElement(this.props.children, {
             style: styles,
             onLoad: this.handleLoad,
             ref: node => (this.child = node)
         });
         return (
             <div
                 className="big-image-container"
                 style={{
                     height: this.props.height,
                     width: this.props.width,
                     overflow: "hidden",
                     position: "relative"
                 }}
                 ref={node => (this.container = node)}
             >
                 <div
                     style={{
                         height: "100%",
                         width: "auto",
                         position: "absolute",
                         top: "50%",
                         left: "50%",
                         transform: "translate(-50%,-50%)"
                     }}
                 >
                     {childWithStyles}
                 </div>
             </div>
         );
     }
 }
 
 PanAndZoom.propTypes = propTypes;
 PanAndZoom.defaultProps = defaultProps;
 
 export default PanAndZoom;
 