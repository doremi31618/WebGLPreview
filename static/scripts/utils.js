const sampleModels = {
	"samples": {
		"Street Car": "/static/assets/models/gltf/street_car.glb",
		"F1 Car": "/static/assets/models/gltf/f1_car.glb",
		"Off-Road Truck": "/static/assets/models/gltf/offroad_truck.glb",
		"Motorbike": "/static/assets/models/gltf/motorbike.glb",
		"Empire State Building": "/static/assets/models/gltf/empire_state_building.glb"
	}
};

function errorMessage(filename, error) {
	alert("Your file " + Load.filename + " was not parsed correctly." + "\n\n" + "ERROR MESSAGE : " + error.message);
}

function errorScale(params) {
	if (currentModel.scale.x === 0) {
		params.reset();
		alert("You model has been reset because his size was egal to zero");
	}
}

function rotateModel() {
	if (rotateOn == true) currentModel.rotation.y += 0.005;
}

dat.GUI.prototype.removeFolder = function(name) {
	var folder = this.__folders[name];
	if (!folder) {
	  return;
	}
	folder.close();
	this.__ul.removeChild(folder.domElement.parentNode);
	delete this.__folders[name];
	this.onResize();
  }