const three = require('three');
const tween = require('tween.js');

export class RenderManager {

  constructor(scene, TWEENS) {
    // Assign scene and a renderer
    this.scene = scene;
    this.renderer = new three.WebGLRenderer();
    
    this.TWEENS = TWEENS

    // Grab the camera from the scene's children
    this.camera = this.scene.children.find(this._findByName('renderCam'));

    // Do the same for the light
    this.light = this.scene.children.find(this._findByName('lightSource'));

    // And also the roomModel
    this.room = this.scene.children.find(this._findByName('roomModel'));
    
    // Finally, get ahold of the focalPoint
    this.focalPoint = this.scene.children.find(this._findByName('focalPoint'));

    // Set up the renderer to fill the screen
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Enable pretty shadows
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = three.PCFSoftShadowMap;

    // Some trig to set our camera up so that it does not squish and stretch on mobile
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.tanFOV = Math.tan(((Math.PI / 180) * this.camera.fov / 2));
    this.camera.fov = 1.5 * (360 / Math.PI) * Math.atan(this.tanFOV) / Math.sqrt(this.camera.aspect);
    this.camera.updateProjectionMatrix();
    this.originalWindowHeight = window.innerHeight;
    window.addEventListener('resize', () => this._onWindowResize(), false);
  }

  // Put it on the page
  start() {
    // Pipe the renderer's output to the DOM
    document.querySelector('#display').appendChild(this.renderer.domElement);
    // Start the render loop
    requestAnimationFrame(time => this._animate(time)); // Having a lexical this is important here!
                                                        // We want the this in _animate to always
                                                        // refer to RenderManager
  }
  
  // This will move our focalPoint to the desired location
  moveFocus(objName, time = 1000, easing = tween.Easing.Quadratic.InOut) {
    let obj = this.scene.children.find(this._findByName(objName));
    return new tween.Tween(this.focalPoint.position).to(obj.position, time).easing(easing);
  }
  
  // This will move our camera
  moveCamera(objName, time = 1000, easing = tween.Easing.Quadratic.InOut) {
    let obj = this.scene.children.find(this._findByName(objName));
    return new tween.Tween(this.camera.position).to(obj.position, time).easing(easing);
  }
  
  // This will move our light
  moveLight(objName, time = 1000, easing = tween.Easing.Quadratic.InOut) {
    let obj = this.scene.children.find(this._findByName(objName));
    return new tween.Tween(this.light.position).to(obj.position, time).easing(easing);
  }

  // Make it responsive with some more trig
  _onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.fov = (1.5 * (360 / Math.PI) * Math.atan(this.tanFOV * (window.innerHeight / this.originalWindowHeight))
    / Math.sqrt(this.camera.aspect));
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // This is a helper function to grab a child object.
  _findByName(name) {
    return function (child) {
      return child.name === name;
    }
  }

  _animate(t) {
    requestAnimationFrame((time) => this._animate(time)); // Lexical this is also important here
    this._render(t)
  }

  _render(time) {
    // More camera trig
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.fov = (1.5 * (360 / Math.PI) * Math.atan(this.tanFOV * (window.innerHeight / this.originalWindowHeight))
    / Math.sqrt(this.camera.aspect));
    this.camera.updateProjectionMatrix();

    // Make the camera look at the focalPoint
    this.camera.lookAt(this.focalPoint.position);
    
    // Update all our animations
    this.TWEENS.update(time);

    // Render the scene and it's children recursively from the camera's perspective
    this.renderer.render(this.scene, this.camera);
  }
}