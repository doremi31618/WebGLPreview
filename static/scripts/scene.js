class SceneInit {
	createScene() {
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000);
		this.camera.position.set(250, 180, 280);
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0xa0a0a0);
		this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({
			color: 0xcfcfcf
		}));
		// this.plane.rotation.x = -Math.PI / 2;
		// this.plane.receiveShadow = true;
		// this.scene.add(this.plane);
		this.model = null;
		this.skybox = null;
		this.material = new THREE.MeshBasicMaterial({ color: 0x049EF4 });
		Showroom.createLights();
		this.createLights();
	}

	createLights() {
		// this.hemLight = new THREE.HemisphereLight(0xffffff, 0x404040, 1);
		this.scene.add(this.hemLight);

		this.directionLight = new THREE.DirectionalLight(0x000000);

		this.ambientLight = new THREE.AmbientLight(0x000000);



		this.scene.fog =new THREE.FogExp2(0xffffff,0.001);
		this.scene.fog.density = 0;
		this.scene.add(this.ambientLight);
		this.scene.add(this.directionLight);

	}

	createControls() {
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		this.controls.maxPolarAngle = Math.PI;
		this.controls.maxDistance = 20000;
		this.controls.target = new THREE.Vector3(0, 15, 0);
		this.controls.panSpeed = 0.1;
		this.controls.update();
	}

	createRenderer() {
		
		
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
		this.renderer.gammaFactor = 2.2;
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
		// this.pmremGenerator = new THREE.PMREMGenerator( this.renderer );
		// pmremGenerator.compileEquirectangularShader();

		this.pano = new THREE.TextureLoader().load( 'static/textures/2294472375_24a3b8ef46_o.jpg' );
		this.pano.mapping = THREE.EquirectangularReflectionMapping;
		this.pano.encoding = THREE.sRGBEncoding;
		
		var geometry = new THREE.SphereGeometry( 5000, 50, 50 );
		geometry.scale( - 1, 1, 1 );
		var material = new THREE.MeshBasicMaterial( {
			map : this.pano
		});
		this.skybox = new THREE.Mesh( geometry, material );
		this.skybox.name = "skybox";
		this.scene.add(this.skybox);

		this.scene.environment = this.pano;
		this.scene.background = this.pano;

		// this.scene.background = this.pano;
		// this
		// this.renderer.outputEncoding = THREE.sRGBEncoding;
	}
}
