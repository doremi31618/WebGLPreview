let Scene, Material, Showroom, Load, currentModel, object, child_list, rotateOn = false;
const reader = new FileReader();

let raycaster, mouse = { x: 0, y: 0 };
function letsPlay() {
	init();
	animate();
}

async function init() {
	raycaster = new THREE.Raycaster();
	let container = document.createElement('div');
	document.body.appendChild(container);
	window.addEventListener('resize', onWindowResize, false);

	Scene = new SceneInit();
	Showroom = new ShowroomInit();
	Load = new LoadInit();
	Scene.createScene();
	Scene.createRenderer();

	container.appendChild(Scene.renderer.domElement);

	Scene.createControls();

	await Load.loadSample('static/assets/models/gltf/street_car.glb');
	addGUI(currentModel);
}

function onWindowResize() {
	Scene.camera.aspect = window.innerWidth / window.innerHeight;
	Scene.camera.updateProjectionMatrix();
	Scene.renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
	Scene.renderer.render(Scene.scene, Scene.camera);
	rotateModel();
}

function onMouseDown(e) {
	// console.log(e);

	//1. sets the mouse position with a coordinate system where the center
	//   of the screen is the origin
	mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

	//2. set the picking ray from the camera position and mouse coordinates
	raycaster.setFromCamera(mouse, Scene.camera);
	raycaster.far = 1000;
	
	//3. compute intersections
	var intersects = raycaster.intersectObjects(Scene.scene.children, true);

	if (intersects.length>0){
		console.log(intersects[0].object.name);
		currentModel = intersects[0].object;
		setMaterial();
	}
	
}



// document.addEventListener('mouseup', onMouseDown)
letsPlay();

