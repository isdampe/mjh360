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

var mjh360 = function () {
  function mjh360() {
    _classCallCheck(this, mjh360);
  }

  _createClass(mjh360, [{
    key: 'contructor',
    value: function contructor() {
      console.log('test');
      // Create viewer.
      this.viewer = new Marzipano.Viewer(document.getElementById('pano'));

      // Create source.
      this.sourc = Marzipano.ImageUrlSource.fromString("/img/angra.jpg");

      // Create geometry.
      this.geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);

      // Create view.
      this.limiter = Marzipano.RectilinearView.limit.traditional(1024, 100 * Math.PI / 180);
      this.view = new Marzipano.RectilinearView({ yaw: Math.PI }, limiter);

      // Create scene.
      this.scene = viewer.createScene({
        source: this.sourc,
        geometry: this.geometry,
        view: this.view,
        pinFirstLevel: true
      });

      // Display scene.
      this.scene.switchTo();
    }
  }]);

  return mjh360;
}();

var viewer = new mjh360();
//# sourceMappingURL=mjh360.js.map
