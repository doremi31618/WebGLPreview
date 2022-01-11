//this script is dealing with most of ui appearence and its function to call
//only the material ui is inside the mat_gui scripts 
class HierachyObject{
	constructor(model){
		let object = model;

	}
	changeSelectedModel(){
		currentModel = object;
	}
}

let gui = new dat.GUI();
function addGUI(object) {
	const params = {
		posX: 0,
		posY: 0,
		posZ: 0,
		scaleX: 0,
		scaleY: 0,
		scaleZ: 0,
		rotY: 0,
		rotX: 0,
		ambient_intens: 1,
		ambient_color: 0xffffff,
		direction_intens: 1,
		direction_color: 0xffffff,
		direction_rotX: 0,
		direction_rotY:0,
		mode: false,
		turn: false,
		material:'MeshBasicMaterial',
		gamma: 2.2,
		fog_enable: false,
		fog_density: 1,
		fog_color: 0xffffff,
		model: function () {
			Scene.scene.remove(Scene.model);
			Scene.scene.remove(currentModel);
			const input = document.createElement('input');
			input.type = 'file';
			input.click();
			input.onchange = e => {
				this.remove();
				const file = e.target.files[0];
				Load.loadFile(file, object);
			}
		},
		selectObject: [],
		remove: function () {
			Scene.scene.remove(Scene.model);
			Scene.scene.remove(currentModel);
			removeMaterialList();
		},
		export: function() {
			const exporter = new THREE.GLTFExporter();
			Scene.model.scale.set(1,1,1);
			const option = {
				trs: false,
				onlyVisible: false,
				truncateDrawRange: false,
				binary: true,
				maxTextureSize: 4096
			};
			exporter.parse(
				Scene.model,
				// called when the gltf has been generated
				function ( gltf ) {

					console.log( gltf );
					downloadJSON( gltf, Scene.model.name + '.glb');
					Scene.model.scale.set(100,100,100);
				},
				// called when there is an error in the generation
				function ( error ) {

					console.log( 'An error happened' );

				}
			);
		},
		normal: function () {
			Scene.scene.background = new THREE.Color(0xa0a0a0);
			Scene.hemLight.visible = true;
			Scene.light.visible = true;
			Showroom.turnOff();
		},
		loadPano: function() {
			const input = document.createElement('input');
			input.type = 'file';
			input.click();
			input.onchange = e => {
				const file = e.target.files[0];
				Load.loadPano(file);
			};
		},
		showroom: function () {
			if (this.mode === false) this.normal();
			else {
				// Scene.scene.background = new THREE.Color(0x000000);
				Scene.hemLight.visible = false;
				Scene.light.visible = false;
				Showroom.turnOn();
			}
		},
		rotate: function () {
			this.turn == true ? rotateOn = true : rotateOn = false;
		},
		reset: function () {
			this.normal();
			Showroom.setPos();
			Showroom.setColor();
			rotateOn = false;
			currentModel.position.set(0, 0, 0);
			currentModel.scale.set(100, 100, 100);
			currentModel.rotation.set(0, 0, 0);
		},
		scaleUp: function () {
			currentModel.scale.x += 1;
			currentModel.scale.y += 1;
			currentModel.scale.z += 1;
		},
		scaleDown: function () {
			currentModel.scale.x -= 1;
			currentModel.scale.y -= 1;
			currentModel.scale.z -= 1;
			errorScale(params);
		},
		randomPos: function () {
			Showroom.randomPos();
		},
		randomColor: function () {
			Showroom.randomColor();
		},
		resetGamma: function() {
			Scene.gammaInput = true;
			Scene.gammaOutput = true;
			Scene.renderer.gammaFactor = this.gamma;
			Scene.scene.traverse( function ( child ) {
				if ( child.material ) {
				  child.material.needsUpdate = true;
				}
			  } );
		},
		addLight: function() {

		}
	}
	setGUI(params);
}

//solution from :https://discourse.threejs.org/t/downloadjson-not-define/17224/8
function downloadJSON( json, filename ) {

	saveString( JSON.stringify( json ), filename );  

}

var link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link ); // Firefox workaround, see #6594

function save( blob, filename ) {

	link.href = URL.createObjectURL( blob );
	link.download = filename;
	link.click();

	// URL.revokeObjectURL( url ); breaks Firefox...

}

function saveString( text, filename ) {

	save( new Blob( [ text ], { type: 'text/glb' } ), filename );

}

function setGUI(params) {
	setModel(params);
	setBackground(params);
	setLight(params);
	addMaterial(params);
}
function setMaterial(){
	if (currentModel.name == 'skybox'){
		return;
	}
	if(currentModel.material){
		currentModel.material = chooseFromHash(gui, currentModel, currentModel.geometry);
	}
}

function addLight(parentFolder){
	
	var folderDirection = parentFolder.addFolder("Direction Light");
	var newLight = new THREE.DirectionalLight(0xffffff, 0);
	Scene.model.add(newLight);
	const data = {
		light_color: newLight.color.getHex(),
		deleteLight: function(){
			Scene.model.remove(newLight);
		}
	}
	
	folderDirection.addColor(data, 'light_color').name('direct color').onChange(() => {
		handleColorChange(newLight.color);
	});
	folderDirection.add(newLight, 'intensity', 0, 10).name('direct intensity');
	folderDirection.add(data, 'delete Light');
}


function addMaterial(params){
	Material = params.material;
	createTemplateMaterial();
}

function setBackground(params){
	const folderBackground = gui.addFolder('Background');
	
	
	folderBackground.add(params, 'loadPano').name("Background (pano picture)");
	folderBackground.add(params, 'fog_enable').onChange(function(){
		if (params.fog_enable){
			Scene.scene.fog.density = 0.001;
		}else{
			Scene.scene.fog.density = 0;
		}
	});
	folderBackground.add(params, 'fog_density', 0, 0.001).onChange(function(){
		Scene.scene.fog.density = params.fog_density;
	});
	folderBackground.addColor(params, 'fog_color').onChange(function(){
		Scene.scene.fog.color.set(params.fog_color);
	});
	
}
function setLight(params){
	const folderLight = gui.addFolder('Light');
	// folderLight.add(params, 'addLight').name("Add Light");
	const ambientLightFolder = folderLight.addFolder("Ambient light");
	ambientLightFolder.addColor(params, 'ambient_color').name('ambient color').onChange(() => {
		Scene.ambientLight.color.set(params.ambient_color);
	});
	ambientLightFolder.add(params, 'ambient_intens', 0, 10).name('ambient intensity').onChange(() => {
		Scene.ambientLight.color.set(params.ambient_color);
		Scene.ambientLight.intensity = params.ambient_intens;
	});

	const directionLightFolder = folderLight.addFolder("Direction light");
	directionLightFolder.addColor(params, 'direction_color').name('direct color').onChange(() => {
		Scene.directionLight.color.set(params.direction_color);
	});
	directionLightFolder.add(params, 'direction_intens', 0, 10).name('direct intensity').onChange(() => {
		Scene.directionLight.color.set(params.direction_color);
		Scene.directionLight.intensity = params.direction_intens;
	});
}

function setRender(params, parent_gui){
	// const renderFolder = parent_gui.addFolder('Render');
	parent_gui.add(params, "gamma").onChange(params.resetGamma());

}
function setTransform(params, parent_gui){
	const folderTransform = parent_gui.addFolder('Transform');
	//set position
	const folderPos = folderTransform.addFolder('Position');
	folderPos.add(params, 'posX', -140, 140).name('X').onChange(() => {
		currentModel.position.x = (params.posX);
	});
	folderPos.add(params, 'posY', -140, 140).name('Y').onChange(() => {
		currentModel.position.z = (params.posY);
	});
	folderPos.add(params, 'posZ', -140, 140).name('Z').onChange(() => {
		currentModel.position.y = (params.posZ);
	});
	//set rotation
	const folderRot = folderTransform.addFolder('Rotation');
	folderRot.add(params, 'rotY', -5, 5).name('Y').onChange(() => {
		currentModel.rotation.y = (params.rotY);
	});
	folderRot.add(params, 'rotX', -5, 5).name('X').onChange(() => {
		currentModel.rotation.x = (params.rotX);
	});
	//set scale
	const folderScale = folderTransform.addFolder('Scale');
	folderScale.add(params, 'scaleX', -500, 500).name('X').onChange(() => {
		currentModel.scale.x = (params.scaleX);
	});
	folderScale.add(params, 'scaleY', -500, 500).name('Y').onChange(() => {
		currentModel.scale.y = (params.scaleY);
	});
	folderScale.add(params, 'scaleZ', -500, 500).name('Z').onChange(() => {
		currentModel.scale.z = (params.scaleZ);
	});
	folderScale.add(params, 'scaleUp').name('+');
	folderScale.add(params, 'scaleDown').name('-');
	folderTransform.add(params, 'reset').name('Reset');

}


function setModel(params) {
	const folderModel = gui.addFolder('Model');

	// folderModel.add(params, 'material', materialList).name("Material").onChange(() => {
	// 	addMaterial(params);
	// 	// console.log(currentModel);
	// });

	
	let dropdown = folderModel.add(sampleModels, 'samples', sampleModels.samples).onChange((value) => {
		let path = value;
		params.remove();
		Load.loadSample(path);
		generateMaterialList();
	});
	folderModel.add(params, 'model').name('Load model');
	folderModel.add(params, 'remove').name('Remove model');
	folderModel.add(params, 'export').name('Export model');
	setTransform(params,folderModel);
	folderModel.open();
}


function SetSceneHierachy(params) {
}

function SelectModel(model){
	console.log(model.name);
}
