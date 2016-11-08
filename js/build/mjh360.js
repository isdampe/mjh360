'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Creates a 360 virtual gallery, with before and after support.
 */
var mjh360 = function () {

  /**
   * @param sceneList array An array of objects including name, thumb, before and after
   * @return mjh360 The new mjh360 class
   */
  function mjh360(element, sceneList) {
    var _this = this;

    _classCallCheck(this, mjh360);

    //Hook the viewport container.
    this.viewport = element.querySelector('.vr-viewport');

    //Hook the time travelling buttons.
    this.goBackwardsInTime = element.querySelector('.vr-before');
    this.goForwardsInTime = element.querySelector('.vr-after');
    this.navigation = element.querySelector('.vr-nav');

    this.goBackwardsInTime.addEventListener('click', function (e) {
      return _this.sceneGoToTime(e, 'before');
    });
    this.goForwardsInTime.addEventListener('click', function (e) {
      return _this.sceneGoToTime(e, 'after');
    });

    //Create our scene container.
    this.scenes = [];

    // Create viewer.
    this.viewer = new Marzipano.Viewer(this.viewport);

    // Create geometry.
    this.geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);

    // Create view.
    this.limiter = Marzipano.RectilinearView.limit.traditional(1024, 100 * Math.PI / 180);
    this.view = new Marzipano.RectilinearView({ yaw: Math.PI }, this.limiter);

    //Build the scenes.

    var _loop = function _loop() {
      var sceneData = sceneList[i];

      sceneData.beforeSrc = Marzipano.ImageUrlSource.fromString(sceneData.before);
      sceneData.afterSrc = Marzipano.ImageUrlSource.fromString(sceneData.after);
      sceneData.beforeScene = _this.viewer.createScene({
        source: sceneData.beforeSrc,
        geometry: _this.geometry,
        view: _this.view,
        pinFirstLevel: true
      });

      if (sceneData.hasOwnProperty('after')) {

        sceneData.afterScene = _this.viewer.createScene({
          source: sceneData.afterSrc,
          geometry: _this.geometry,
          view: _this.view,
          pinFirstLevel: true
        });
      } else {
        sceneData.afterScene = false;
      }

      //Add nav item.
      sceneData.navButton = document.createElement('a');
      sceneData.navButton.className = 'nav-button';

      var img = document.createElement('img');
      img.src = sceneData.thumb;

      pr = _this;

      (function (i) {
        var dynamicOnHook = function dynamicOnHook(e) {
          e.preventDefault();
          pr.sceneActivate(false, i);
          this.classList.add('active');
        };

        sceneData.navButton.addEventListener('click', dynamicOnHook);
        sceneData.navButton.addEventListener('touchstart', dynamicOnHook);
      })(i);

      sceneData.navButton.appendChild(img);
      _this.navigation.appendChild(sceneData.navButton);

      _this.scenes.push(sceneData);

      _this.currentScene = 0;
      _this.currentTime = "before";
    };

    for (var i = 0; i < sceneList.length; i++) {
      var pr;

      _loop();
    }
  }

  /**
   * Renders the view
   * @return void
   */


  _createClass(mjh360, [{
    key: 'render',
    value: function render() {

      // Display scene.
      if (this.scenes.length < 1) {
        console.error('There are no scenes to view.');
        return false;
      }

      this.navigation.classList.add('vr-nav-active');
      this.scenes[0].navButton.classList.add('active');
      this.scenes[0].beforeScene.switchTo();
    }

    /**
     * Changes the current time of a scene to either before or after
     * @param e event The event emitter from a handler
     * @param time  string  Either "before" or "after"
     */

  }, {
    key: 'sceneGoToTime',
    value: function sceneGoToTime(e, time) {
      if (typeof e !== 'undefined' && e) e.preventDefault();

      if (this.currentTime === time) {
        console.warn('Already on ' + time + ', not changing.');
        return false;
      }

      var sceneSelector = this.sceneTimeToSelector(time);

      if (time === "after" && this.scenes[this.currentScene][sceneSelector] === false) {
        //Auto change to before.
        this.sceneGoToTime(false, 'before');
        return false;
      }

      if (time === "before") {
        this.goBackwardsInTime.classList.add('vr-button-inactive');
        this.goForwardsInTime.classList.remove('vr-button-inactive');
      } else if (time === "after") {
        this.goForwardsInTime.classList.add('vr-button-inactive');
        this.goBackwardsInTime.classList.remove('vr-button-inactive');
      }

      this.scenes[this.currentScene][sceneSelector].switchTo();
      this.currentTime = time;
    }

    /**
     * Calculates a scene selector from a requested time
     * @param time string Before or after
     * @return string beforeScene or afterScene
     */

  }, {
    key: 'sceneTimeToSelector',
    value: function sceneTimeToSelector(time) {

      var sceneSelector;
      if (time === "before") {
        sceneSelector = "beforeScene";
        this.goBackwardsInTime.classList.add('vr-button-inactive');
        this.goForwardsInTime.classList.remove('vr-button-inactive');
      } else if (time === "after") {
        sceneSelector = "afterScene";
        this.goForwardsInTime.classList.add('vr-button-inactive');
        this.goBackwardsInTime.classList.remove('vr-button-inactive');
      } else {
        sceneSelector = "before";
      }

      return sceneSelector;
    }

    /**
     * Activates a scene
     * @param e event The event emitter from a handler
     * @param scene int The scene number
     */

  }, {
    key: 'sceneActivate',
    value: function sceneActivate(e, scene) {
      if (typeof e !== 'undefined' && e) e.preventDefault();

      var goToTime = this.currentTime;

      if (!this.scenes[this.currentScene]) {
        console.warn('No scene found with this ID.');
        return false;
      }

      this.scenes[this.currentScene].navButton.classList.remove('active');
      this.currentScene = scene;
      this.currentTime = false;

      this.sceneGoToTime(false, goToTime);
    }
  }]);

  return mjh360;
}();
//# sourceMappingURL=mjh360.js.map
