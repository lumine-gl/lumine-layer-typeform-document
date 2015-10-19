(function(){

  var THREE = require('three'),
      _ = require('lodash');

  var LayoutGeometry = require('./layout-geometry'),
      LayoutContent = require('./layout-content');

  function Layout(lumine, canvas, scene, camera){

    this._lumine = lumine;
    this._canvas = canvas;
    this._scene = scene;

    this._layoutContent = new LayoutContent(lumine, canvas);

  }

  Layout.prototype.update = function(boxes, modules){

    if(modules) this._modules = modules;

    if(this._init){

      this._layoutGeometry.updatePlanes(boxes);

    }else{

      this._layoutGeometry = new LayoutGeometry(boxes, this._modules);

      this._layoutMaterial = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        side: THREE.DoubleSide,
        transparent: true
      });

      this._planeMeshes = {};

      _.each(boxes, function(box, k){

        var material = this._layoutMaterial.clone();

        this._planeMeshes[k] = new THREE.Mesh(this._layoutGeometry._planes[k], material);

        this._scene.add( this._planeMeshes[k] );

      }.bind(this));

      this._init = true;

    }

    this._layoutContent.setMaps(boxes, this._modules, this._canvas.density, this._planeMeshes);

  };

  Layout.prototype.render = function(delta, update, boxes, modules){

    if(update){
      this.update(boxes, modules);
    }

    this._layoutGeometry.render(delta, updateScrollProxy);
    this._layoutContent.render(delta);

  };

  module.exports = Layout;

})();