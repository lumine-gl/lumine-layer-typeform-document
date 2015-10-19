(function(){

  var _ = require('lodash'),
      THREE = require('three');

  var SHADER_MAP = 'tDiffuse';

  function LayoutContent(lumine, canvas){

    this._lumine = lumine;
    this._renderer = canvas.renderer;
    this._canvas = canvas;

    this._canvases = {};

  }

  LayoutContent.prototype.setMaps = function(boxes, modules, density, meshes, cb){

    _.each(boxes, function(box, k){

      var boxModule = modules[k];

      if(_.has(boxModule, 'scene')){

        var sceneOpts = boxModule.scene;

        if(!_.has(this._canvases, k)){

          meshes[k].material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(this._lumine.Shaders.copy.uniforms),
            vertexShader: this._lumine.Shaders.copy.vertexShader,
            fragmentShader: this._lumine.Shaders.copy.fragmentShader,
            transparent: true
          });

          var scene = new this._lumine.Scenes[sceneOpts.type](null, this._lumine, _.extend({canvas: {
            width: box.width,
            height: box.height,
            offsetX: box.left,
            offsetY: box.top,
            density: density,
            renderer: this._renderer,
            format: THREE.RGBAFormat,
            clearColor: 0x000000,
            clearAlpha: 0,
            parent: this._canvas
          }}, sceneOpts));

          this._canvases[k] = scene.canvas;

          _.last(scene.canvas.composer.passes).clear = false;

          scene.canvas.on('render', function(){

            meshes[k].material.uniforms[SHADER_MAP].value = this._canvases[k].composer.readBuffer;
            meshes[k].material.needsUpdate = true;

          }.bind(this));

        }else{

          this._canvases[k].setSize(box.width, box.height, density, box.left, box.top);
          this._canvases[k].needsResize = true;

        }

      }

    }.bind(this));

  };

  LayoutContent.prototype.render = function(delta){

    _.each(this._canvases, function(canvas, k){

      canvas.render(delta);

    }.bind(this));

  };

  module.exports = LayoutContent;

})();