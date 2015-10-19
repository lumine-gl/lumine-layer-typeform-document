(function(){

  var _ = require('lodash'),
      THREE = require('three');

  function LayoutGeometry(boxes, modules){

    this.makePlanes(boxes, modules);

  }

  /**
   * Returns a collection of planes anew from boxes.
   * @param boxes
   * @param modules
   */
  LayoutGeometry.prototype.makePlanes = function(boxes, modules){
    var self = this;

    this._planes = {};

    _.each(boxes, function(box, k){

      if(!this._planes[k]) this._planes[k] = new THREE.PlaneBufferGeometry();

      var c = new THREE.Color(modules[k].fill);

      this._planes[k].addAttribute('color', new THREE.BufferAttribute( new Float32Array(4 * 3), 3 ));

      for(var j = 0; j < 4; ++j){

        this._planes[k].getAttribute('color').array[j * 3    ] = c.r;
        this._planes[k].getAttribute('color').array[j * 3 + 1] = c.g;
        this._planes[k].getAttribute('color').array[j * 3 + 2] = c.b;

      }

      this._planes[k].getAttribute('color').needsUpdate = true;

    }.bind(this));

    this.updatePlanes(boxes);

  };

  /**
   * Updates the positions of planes' vertices directly from boxes.
   * @param boxes
   */
  LayoutGeometry.prototype.updatePlanes = function(boxes){

    _.each(boxes, function(box, k){

      var plane = this._planes[k];

      var coords = [

        box.top,
        box.left,
        0,

        box.top + box.height,
        box.left,
        0,

        box.top + box.height,
        box.left + box.width,
        0,

        box.top,
        box.left + box.width,
        0

      ];

      _.each(coords, function(coord, i){
        plane.getAttribute('position').array[i] = coord;
      });

      plane.getAttribute('position').needsUpdate = true;
      plane.computeBoundingSphere();

    }.bind(this));

  };

  module.exports = LayoutGeometry;

})();