

const materialList = [
    'MeshBasicMaterial',
    'MeshLambertMaterial',
    'MeshMatcapMaterial',
    'MeshPhongMaterial',
    'MeshToonMaterial',
    'MeshStandardMaterial',
    'MeshPhysicalMaterial',
    // 'MeshDepthMaterial',
    'MeshNormalMaterial',
    // 'LineBasicMaterial'
]
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const constants = {

    combine: {

        'THREE.MultiplyOperation': THREE.MultiplyOperation,
        'THREE.MixOperation': THREE.MixOperation,
        'THREE.AddOperation': THREE.AddOperation

    },

    side: {

        'THREE.FrontSide': THREE.FrontSide,
        'THREE.BackSide': THREE.BackSide,
        'THREE.DoubleSide': THREE.DoubleSide

    },

    blendingMode: {

        'THREE.NoBlending': THREE.NoBlending,
        'THREE.NormalBlending': THREE.NormalBlending,
        'THREE.AdditiveBlending': THREE.AdditiveBlending,
        'THREE.SubtractiveBlending': THREE.SubtractiveBlending,
        'THREE.MultiplyBlending': THREE.MultiplyBlending,
        'THREE.CustomBlending': THREE.CustomBlending

    },

    equations: {

        'THREE.AddEquation': THREE.AddEquation,
        'THREE.SubtractEquation': THREE.SubtractEquation,
        'THREE.ReverseSubtractEquation': THREE.ReverseSubtractEquation

    },

    destinationFactors: {

        'THREE.ZeroFactor': THREE.ZeroFactor,
        'THREE.OneFactor': THREE.OneFactor,
        'THREE.SrcColorFactor': THREE.SrcColorFactor,
        'THREE.OneMinusSrcColorFactor': THREE.OneMinusSrcColorFactor,
        'THREE.SrcAlphaFactor': THREE.SrcAlphaFactor,
        'THREE.OneMinusSrcAlphaFactor': THREE.OneMinusSrcAlphaFactor,
        'THREE.DstAlphaFactor': THREE.DstAlphaFactor,
        'THREE.OneMinusDstAlphaFactor': THREE.OneMinusDstAlphaFactor

    },

    sourceFactors: {

        'THREE.DstColorFactor': THREE.DstColorFactor,
        'THREE.OneMinusDstColorFactor': THREE.OneMinusDstColorFactor,
        'THREE.SrcAlphaSaturateFactor': THREE.SrcAlphaSaturateFactor

    }

};

const _envMaps = (function () {

    const path = 'static/textures/cube/SwedishRoyalCastle/';
    const format = '.jpg';
    const urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];
    // console.log(urls);
    const reflectionCube = cubeTextureLoader.load(urls);
    reflectionCube.format = THREE.RGBFormat;

    const refractionCube = cubeTextureLoader.load(urls);
    refractionCube.mapping = THREE.CubeRefractionMapping;
    refractionCube.format = THREE.RGBFormat;

    return {
        none: null,
        reflection: reflectionCube,
        refraction: refractionCube
    };

})();

let envMaps = _envMaps;

let diffuseMaps = (function () {

    const bricks = textureLoader.load('static/textures/brick_diffuse.jpg');
    bricks.wrapS = THREE.RepeatWrapping;
    bricks.wrapT = THREE.RepeatWrapping;
    bricks.repeat.set(9, 1);

    return {
        none: null,
        bricks: bricks
    };

})();

const roughnessMaps = (function () {

    const bricks = textureLoader.load('static/textures/brick_roughness.jpg');
    bricks.wrapT = THREE.RepeatWrapping;
    bricks.wrapS = THREE.RepeatWrapping;
    bricks.repeat.set(9, 1);

    return {
        none: null,
        bricks: bricks
    };

})();

const matcaps = (function () {

    return {
        none: null,
        porcelainWhite: textureLoader.load('static/textures/matcaps/matcap-porcelain-white.jpg')
    };

})();

const alphaMaps = (function () {

    const fibers = textureLoader.load('static/textures/alphaMap.jpg');
    fibers.wrapT = THREE.RepeatWrapping;
    fibers.wrapS = THREE.RepeatWrapping;
    fibers.repeat.set(9, 1);

    return {
        none: null,
        fibers: fibers
    };

})();

const gradientMaps = (function () {

    const threeTone = textureLoader.load('static/textures/gradientMaps/threeTone.jpg');
    threeTone.minFilter = THREE.NearestFilter;
    threeTone.magFilter = THREE.NearestFilter;

    const fiveTone = textureLoader.load('static/textures/gradientMaps/fiveTone.jpg');
    fiveTone.minFilter = THREE.NearestFilter;
    fiveTone.magFilter = THREE.NearestFilter;

    return {
        none: null,
        threeTone: threeTone,
        fiveTone: fiveTone
    };

})();
function getObjectsKeys(obj) {

    const keys = [];

    for (const key in obj) {

        if (obj.hasOwnProperty(key)) {

            keys.push(key);

        }

    }

    return keys;

}

const envMapKeys = getObjectsKeys(envMaps);
let diffuseMapKeys = getObjectsKeys(diffuseMaps);
const roughnessMapKeys = getObjectsKeys(roughnessMaps);
const matcapKeys = getObjectsKeys(matcaps);
const alphaMapKeys = getObjectsKeys(alphaMaps);
const gradientMapKeys = getObjectsKeys(gradientMaps);
function handleColorChange( color ) {
    //don't know why add this line could works
    // needsUpdateAll(template_material);
    return function ( value ) {
        console.log(value);
        if ( typeof value === 'string' ) {

            value = value.replace( '#', '0x' );

        }

        color.setHex( value );
    };

}
// function needsUpdate( material, geometry ) {

//     return function () {
//         needsUpdateAll(template_material);
//     };

// }
function needUpdate(material){
    return function(){
        material.needsUpdate = true;
    }
    
}

function needsUpdateAll(){
    return function(){
        Scene.model.traverseVisible(function (child) {
		if (child.material != undefined) {
            // 自發光功能需要引入emissive map
            // child.material.emissive = material.emissive;
            // child.material.emissiveIntensity = material.emissiveIntensity;
            child.material.refractionRatio = template_material.refractionRatio;
            child.material.wireframe = template_material.wireframe;
            child.material.roughness = template_material.roughness;
            child.material.metalness = template_material.metalness;
			child.material.transparent = template_material.transparent;
            child.material.opacity = template_material.opacity;
            child.material.envMaps = template_material.envMaps;
            child.material.needsUpdate = true;
		}
	});
    };
    
}

// function updateCombine( material ) {

//     return function ( combine ) {

//         material.combine = parseInt( combine );
//         material.needsUpdate = true;
//         needsUpdateAll(template_material);

//     };

// }
function updateAllTexture ( materialKey, textures ){
    return function (key){
        Scene.scene.traverseVisible(function (child) {
            if (child.name !== "skybox" && child.material != undefined) {
                child.material[ materialKey ] = textures[ key ];
                child.material.needsUpdate = true;
            }
        
        });
    }
        
}
function updateAllEnvTexture ( materialKey, textures ){
    Scene.scene.traverseVisible(function (child) {
        if (child.name !== "skybox" && child.material != undefined) {
            child.material[ materialKey ] = textures[ 'reflection' ];
            child.material.needsUpdate = true;
        }
    
    });
        
}
function updateTexture( material, materialKey, textures ) {

    return function ( key ) {

        material[ materialKey ] = textures[ key ];
        material.needsUpdate = true;
        needsUpdateAll();

    };

}


let template_material;
function createTemplateMaterial() {

    template_material = new THREE.MeshStandardMaterial();
    guiMaterial(template_material);
    //guiMeshStandardMaterial(gui, mesh, template_material, geometry);


    return template_material;

    

}
