import { RenderManager } from './RenderManager';
const tween = require('tween.js');

export class SceneManager {

  constructor(scene) {
    // Create and start a new instance of RenderManager
    this.rm = new RenderManager(scene, tween);
    this.rm.start();

    // Create a base animation sequence for the scene manager. All of our scenes will add onto this tween
    // with the chain method. When we navigate between scenes, we will call stop on currentAnimation, set
    // it to a fresh instance of tween, chain the scenes animations on the new currentAnimation and call start.
    // This may seem complicated but it will allow us to cancel animations if a user advances to the next scene
    // without waiting for the current animation to finish.
    this.currentAnimation = new tween.Tween();
  }
  
  startCurrentAnimation() {
    this.currentAnimation.start()
  }
  
  // This will stop any currently running animations and replace it with a fresh animation instance.
  clearCurrentAnimation() {
    this.currentAnimation.stop();
    this.currentAnimation = new tween.Tween();
  }
  
  firstScene() {
    this.currentAnimation.chain(
      this.rm.moveCamera('southLoc'), // These three animations will run simultaneously
      this.rm.moveLight('tubLoc'),
      this.rm.moveFocus('tubLoc')
    )
  }
  
  secondScene() {
    this.currentAnimation.chain(
      // The light will move to the doorLoc waypoint over the course of half a second
      this.rm.moveLight('doorLoc', 500).chain(
        // Then the camera will travel to the west wall over the course of 2 seconds with Elastic easing
        this.rm.moveCamera('westLoc', 2000, tween.Easing.Elastic.InOut),
        // And simultaneously, the focus will move to the bed over the course of 1 second
        this.rm.moveFocus('bedLoc').chain(
          // After which, the light will also travel to the bed
          this.rm.moveLight('bedLoc')
        )
      )
    )
  }

  thirdScene() {
    // In this scene, the camera will move to the north wall and look at the bed while the light
    // travels to the south wall
    this.currentAnimation.chain(
      this.rm.moveLight('southLoc'),
      this.rm.moveCamera('northLoc'),
      this.rm.moveFocus('bedLoc')
    )
  }
}