const three = require('three');
const Swiper = require('swiper');
import { SceneManager } from './SceneManager';

// Here we create a new instance of Swiper
let controller = new Swiper('.swiper-container', {
  direction: 'vertical',
  pagination: '.swiper-pagination',
  keyboardControl: true,
  simulateTouch: true,
  threshold: 50,
  hashnav: true,
  speed: 700,
  scrollbarHide: true,
  followFinger: false,
  touchAngle: 45,
  effect: "fade",
  fade: {
    crossFade: true
  },
  onTap: function() {
    swiper.slideNext();
  }
});

let loader = new three.ObjectLoader();

loader.load('resources/initialScene.json', loadedScene => {
  let sceneManager = new SceneManager(loadedScene);
  sceneManager.firstScene(); // We'll initialize the SceneManager to the first scene
  sceneManager.startCurrentAnimation();
  
  // This will make swiper call delegate update with the proper index when the user triggers a slide change
  controller.on('onSlideChangeStart', function() {
    delegateUpdate(controller.activeIndex)
  });

  // This function will call the proper scene on SceneManager depending on the index passed in
  function delegateUpdate(index) {
    // If the user triggers a scene change before the previous scene's animations finished, we'll want to stop
    // and clear those animations
    sceneManager.clearCurrentAnimation();

    // Here we use a case statement to trigger the proper scene based on the index
    switch (index) {
      case 0:
        sceneManager.firstScene();
        break;
      case 1:
        sceneManager.secondScene();
        break;
      case 2:
        sceneManager.thirdScene();
    }
    
    // Finally we start the scene's animation sequence
    sceneManager.startCurrentAnimation();
  }
});