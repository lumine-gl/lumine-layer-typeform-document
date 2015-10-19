(function(){

  var _ = require('lodash'),
      THREE = require('three');

  var RenderPass = require('lumine').Passes.RenderPass;

  var Layout = require('./layout');

  module.exports = function(Scene, canvas, lumine, layer){

    // Scene

    var scene = new THREE.Scene();

    // Camera

    var camera = new THREE.OrthographicCamera(0, canvas.size.width, canvas.size.height, 0, 0, 9999 * 2);
    camera.aspect = canvas.size.width / canvas.size.height;
    camera.updateProjectionMatrix();

    camera.position.z = 9999;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Layout

    var scrollProxy = new ScrollProxy();

    var layout = new Layout(lumine, canvas, scene, camera),
        sizeNeedsUpdate = false;

    layout.update(Scene._lumine_typeform_boxes, layer.modules);

    // Listeners

    canvas.on('resize', function(){
      sizeNeedsUpdate = true;
    });

    canvas.on('render', function(delta){

      if(sizeNeedsUpdate){

        camera.right = canvas.size.width;
        camera.top = canvas.size.height;

        camera.aspect = canvas.size.width / canvas.size.height;
        camera.updateProjectionMatrix();

        layout.render(delta, true, Scene._lumine_typeform_boxes);

        sizeNeedsUpdate = false;

      }else{

        layout.render(delta, false);

      }

    });

    return new RenderPass(scene, camera, undefined, new THREE.Color(0xffffff), 1);

  };

})();