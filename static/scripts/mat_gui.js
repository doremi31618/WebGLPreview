let matFolder;//mat : material
function updateGui(gui, scene) {

}
function guiScene(gui, scene) {

    const folder = gui.addFolder('Scene');

    const data = {
        background: '#000000',
        'ambient light': ambientLight.color.getHex()
    };

    folder.addColor(data, 'ambient light').onChange(handleColorChange(ambientLight.color));

    guiSceneFog(folder, scene);

}

function guiSceneFog(folder, scene) {

    const fogFolder = folder.addFolder('scene.fog');

    const fog = new THREE.Fog(0x3f7b9d, 0, 60);

    const data = {
        fog: {
            'THREE.Fog()': false,
            'scene.fog.color': fog.color.getHex()
        }
    };

    fogFolder.add(data.fog, 'THREE.Fog()').onChange(function (useFog) {

        if (useFog) {

            scene.fog = fog;

        } else {

            scene.fog = null;

        }

    });

    fogFolder.addColor(data.fog, 'scene.fog.color').onChange(handleColorChange(fog.color));

}

function checkIfFolderEmplty(gui, folder) {
    if (folder != null) {
        gui.removeFolder(folder.name);
    }
}

let gui_material_list = new dat.GUI();
let folder_material_list;
var customContainer = document.getElementById('material-list');
customContainer.appendChild(gui_material_list.domElement);
//on call when load model
function generateMaterialList(){
    //iterate each material
    let index = 0;
    checkIfFolderEmplty(gui_material_list, folder_material_list);
    folder_material_list= gui_material_list.addFolder('Materials');
    Scene.model.traverseVisible(function (child){
        if (child.material != undefined){
            
            generateMaterialUI(child.material, folder_material_list, index);
            index ++;
        }
    });


}

function generateMaterialUI(material, parentFolder, index){
    foldername = material.name + index.toString();
    folderMaterial = parentFolder.addFolder(foldername);
    const data = {
        envMaps: envMapKeys[1],
        emissive: material.emissive.getHex()
    };
    folderMaterial.add(material, 'name');
    // folderMaterial.addColor(material, 'color').onChange(needUpdate(material));
    folderMaterial.addColor(data, 'emissive').onChange(handleColorChange(material.emissive));
    folderMaterial.add(material, 'transparent').onChange(needUpdate(material));
    folderMaterial.add(material, 'opacity', 0, 1).step(0.01).onChange(needUpdate(material));
    folderMaterial.add(material, 'roughness', 0, 1).onChange(needUpdate(material));
    folderMaterial.add(material, 'metalness', 0, 1).onChange(needUpdate(material));
    folderMaterial.add(material, 'refractionRatio', 0, 1).step(0.01).onChange(needUpdate(material));
    folderMaterial.add(material, 'wireframe').onChange(needUpdate(material));
    folderMaterial.add(data, 'envMaps', envMapKeys).onChange(updateAllTexture('envMap', envMaps));
}


//on call when remove model
function removeMaterialList(){
    checkIfFolderEmplty(gui_material_list, folder_material_list);
}

let three_material;
function guiMaterial() {
    const data = {
        color: template_material.color.getHex(),
        emissive: template_material.emissive.getHex(),
        envMaps: envMapKeys[1],
        alphaMap: alphaMapKeys[0]
    };
    checkIfFolderEmplty(gui, three_material);
    three_material = gui.addFolder('Global Material Properties');
    // three_material.addColor(template_material, 'emissive').onChange(needsUpdateAll());
    // three_material.add(template_material, 'emissiveIntensity', 0, 1).step(0.01).onChange(needsUpdateAll());
    three_material.add(template_material, 'transparent').onChange(needsUpdateAll());
    three_material.add(template_material, 'opacity', 0, 1).step(0.01).onChange(needsUpdateAll());
    three_material.add(template_material, 'roughness', 0, 1).onChange(needsUpdateAll());
    three_material.add(template_material, 'metalness', 0, 1).onChange(needsUpdateAll());
    three_material.add(template_material, 'refractionRatio', 0, 1).step(0.01).onChange(needsUpdateAll());
    three_material.add(template_material, 'wireframe').onChange(needsUpdateAll());
    three_material.add(data, 'envMaps', envMapKeys).onChange(updateAllTexture('envMap', envMaps));

    // folder.add( material, 'blending', constants.blendingMode );
    // folder.add( material, 'blendSrc', constants.destinationFactors );
    // folder.add( material, 'blendDst', constants.destinationFactors );
    // folder.add( material, 'blendEquation', constants.equations );
    // three_material.add(material, 'depthTest').onChange(needsUpdate(material, geometry));
    // three_material.add(material, 'depthWrite').onChange(needsUpdate(material, geometry));
    // folder.add( material, 'polygonOffset' );
    // folder.add( material, 'polygonOffsetFactor' );
    // folder.add( material, 'polygonOffsetUnits' );
    // three_material.add(material, 'alphaTest', 0, 1).step(0.01).onChange(needsUpdate(material, geometry));
    // three_material.add(material, 'visible').onChange(needsUpdate(material, geometry));
    // three_material.add(material, 'side', constants.side).onChange(needsUpdate(material, geometry));


}

function guiMeshBasicMaterial(gui, mesh, material, geometry) {
    checkIfFolderEmplty(gui, matFolder);
    try {
        const data = {
            color: material.color.getHex(),
            envMaps: envMapKeys[0],
            map: diffuseMapKeys[0],
            alphaMap: alphaMapKeys[0]
        };

        matFolder = gui.addFolder('MeshBasicMaterial');

        //matFolder.addColor( data, 'color' ).onChange( handleColorChange( material.color ) );
        matFolder.add(material, 'wireframe').onChange(needsUpdateAll(material));
        matFolder.add(material, 'vertexColors').onChange(needsUpdateAll(material));
        matFolder.add(material, 'fog').onChange(needsUpdateAll(material));

        matFolder.add(data, 'envMaps', envMapKeys).onChange(updateTexture(material, 'envMap', envMaps));
        // matFolder.add( data, 'map', diffuseMapKeys ).onChange( updateTexture( material, 'map', diffuseMaps ) );
        matFolder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));
        // matFolder.add(material, 'combine', constants.combine).onChange(updateCombine(material));
        matFolder.add(material, 'reflectivity', 0, 1).onChange(needsUpdateAll(material));
        matFolder.add(material, 'refractionRatio', 0, 1).onChange(needsUpdateAll(material));

    } catch {
        // console.log(matFolder)
    }

}

function guiMeshDepthMaterial(gui, mesh, material) {
    checkIfFolderEmplty(gui, matFolder);
    const data = {
        alphaMap: alphaMapKeys[0]
    };

    matFolder = gui.addFolder('MeshDepthMaterial');

    matFolder.add(material, 'wireframe').onChange(needsUpdateAll(material));

    matFolder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));

}

function guiMeshNormalMaterial(gui, mesh, material, geometry) {
    checkIfFolderEmplty(gui, matFolder);
    matFolder = gui.addFolder('MeshNormalMaterial');

    matFolder.add(material, 'flatShading').onChange(needsUpdateAll(material));
    matFolder.add(material, 'wireframe').onChange(needsUpdateAll(material));

}

function guiLineBasicMaterial(gui, mesh, material, geometry) {
    checkIfFolderEmplty(gui, matFolder);
    const data = {
        color: material.color.getHex()
    };

    matFolder = gui.addFolder('LineBasicMaterial');

    matFolder.addColor(data, 'color').onChange(handleColorChange(material.color));
    matFolder.add(material, 'linewidth', 0, 10).onChange(needsUpdateAll(material));
    matFolder.add(material, 'linecap', ['butt', 'round', 'square']).onChange(needsUpdateAll(material));
    matFolder.add(material, 'linejoin', ['round', 'bevel', 'miter']).onChange(needsUpdateAll(material));
    matFolder.add(material, 'vertexColors').onChange(needsUpdateAll(material));
    matFolder.add(material, 'fog');

}

function guiMeshLambertMaterial(gui, mesh, material, geometry) {
    checkIfFolderEmplty(gui, matFolder);
    const data = {
        color: template_material.color.getHex(),
        emissive: template_material.emissive.getHex(),
        envMaps: envMapKeys[0],
        alphaMap: alphaMapKeys[0]
    };

    matFolder = gui.addFolder('MeshLambertMaterial');

    matFolder.addColor(data, 'color').onChange(handleColorChange(material.color));
    // matFolder.addColor(data, 'emissive').onChange(handleColorChange(material.emissive));

    matFolder.add(material, 'wireframe').onChange(needsUpdateAll(material));
    matFolder.add(material, 'vertexColors').onChange(needsUpdateAll(material));
    matFolder.add(material, 'fog').onChange(needsUpdateAll(material));

    matFolder.add(data, 'envMaps', envMapKeys).onChange(updateTexture(material, 'envMap', envMaps));
    //matFolder.add( data, 'map', diffuseMapKeys ).onChange( updateTexture( material, 'map', diffuseMaps ) );
    matFolder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));
    matFolder.add(material, 'combine', constants.combine).onChange(updateCombine(material));
    matFolder.add(material, 'reflectivity', 0, 1).onChange(needsUpdateAll(material));
    // matFolder.add(material, 'refractionRatio', 0, 1).onChange(needsUpdate(material, geometry));

}

function guiMeshMatcapMaterial(gui, mesh, material) {
    checkIfFolderEmplty(gui, matFolder);
    const data = {
        color: material.color.getHex(),
        matcap: matcapKeys[1],
        alphaMap: alphaMapKeys[0]
    };

    matFolder = gui.addFolder('MeshMatcapMaterial');

    // matFolder.addColor(data, 'color').onChange(handleColorChange(material.color));

    matFolder.add(material, 'flatShading').onChange(needsUpdate(material, mesh.geometry));
    matFolder.add(data, 'matcap', matcapKeys).onChange(updateTexture(material, 'matcap', matcaps));
    matFolder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));

}

function guiMeshPhongMaterial(gui, mesh, material, geometry) {
    checkIfFolderEmplty(gui, matFolder);
    const data = {
        color: material.color.getHex(),
        emissive: material.emissive.getHex(),
        specular: material.specular.getHex(),
        envMaps: envMapKeys[0],
        map: diffuseMapKeys[0],
        alphaMap: alphaMapKeys[0]
    };

    matFolder = gui.addFolder('MeshPhongMaterial');

    // matFolder.addColor(data, 'color').onChange(handleColorChange(material.color));
    // matFolder.addColor(data, 'emissive').onChange(handleColorChange(material.emissive));
    matFolder.addColor(data, 'specular').onChange(handleColorChange(material.specular));

    matFolder.add(material, 'shininess', 0, 100).onChange(needsUpdateAll(material));
    matFolder.add(material, 'flatShading').onChange(needsUpdateAll(material));
    matFolder.add(material, 'wireframe').onChange(needsUpdateAll(material));
    matFolder.add(material, 'vertexColors').onChange(needsUpdateAll(material));
    matFolder.add(material, 'fog').onChange(needsUpdateAll(material));
    // matFolder.add(data, 'envMaps', envMapKeys).onChange(updateTexture(material, 'envMap', envMaps));
    //matFolder.add( data, 'map', diffuseMapKeys ).onChange( updateTexture( material, 'map', diffuseMaps ) );
    // matFolder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));
    matFolder.add(material, 'combine', constants.combine).onChange(updateCombine(material));
    matFolder.add(material, 'reflectivity', 0, 1).onChange(needsUpdateAll(material));
    // matFolder.add(material, 'refractionRatio', 0, 1).onChange(needsUpdate(material, geometry));

}



function guiMeshToonMaterial(gui, mesh, material) {
    checkIfFolderEmplty(gui, matFolder);
    const data = {
        color: material.color.getHex(),
        map: diffuseMapKeys[0],
        gradientMap: gradientMapKeys[1],
        alphaMap: alphaMapKeys[0]
    };

    matFolder = gui.addFolder('MeshToonMaterial');

    matFolder.addColor(data, 'color').onChange(handleColorChange(material.color));
    //matFolder.add( data, 'map', diffuseMapKeys ).onChange( updateTexture( material, 'map', diffuseMaps ) );
    // matFolder.add(data, 'gradientMap', gradientMapKeys).onChange(updateTexture(material, 'gradientMap', gradientMaps));
    // matFolder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));

}

function guiMeshStandardMaterial(gui, mesh, material, geometry) {
    checkIfFolderEmplty(gui, matFolder);
    const data = {
        color: material.color.getHex(),
        emissive: material.emissive.getHex(),
        envMaps: envMapKeys[0],
        map: diffuseMapKeys[0],
        roughnessMap: roughnessMapKeys[0],
        alphaMap: alphaMapKeys[0]
    };

    matFolder = gui.addFolder('MeshStandardMaterial');

    matFolder.addColor(data, 'color').onChange(handleColorChange(material.color));
    // matFolder.addColor(data, 'emissive').onChange(handleColorChange(material.emissive));

    matFolder.add(material, 'roughness', 0, 1).onChange(needsUpdateAll(material));
    matFolder.add(material, 'metalness', 0, 1).onChange(needsUpdateAll(material));
    matFolder.add(material, 'flatShading').onChange(needsUpdateAll(material));
    matFolder.add(material, 'wireframe').onChange(needsUpdateAll(material));
    matFolder.add(material, 'vertexColors').onChange(needsUpdateAll(material));
    matFolder.add(material, 'fog').onChange(needsUpdateAll(material));
    // matFolder.add(data, 'envMaps', envMapKeys).onChange(updateTexture(material, 'envMap', envMaps));
    // matFolder.add(data, 'map', diffuseMapKeys).onChange(updateTexture(material, 'map', diffuseMaps));
    // matFolder.add(data, 'roughnessMap', roughnessMapKeys).onChange(updateTexture(material, 'roughnessMap', roughnessMaps));
    // matFolder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));

    // TODO metalnessMap

}

function guiMeshPhysicalMaterial(gui, mesh, material, geometry) {
    checkIfFolderEmplty(gui, matFolder);
    const data = {
        color: material.color.getHex(),
        emissive: material.emissive.getHex(),
        envMaps: envMapKeys[0],
        map: diffuseMapKeys[0],
        roughnessMap: roughnessMapKeys[0],
        alphaMap: alphaMapKeys[0]
    };

    matFolder = gui.addFolder('MeshPhysicalMaterial');

    // matFolder.addColor(data, 'color').onChange(handleColorChange(material.color));
    // matFolder.addColor(data, 'emissive').onChange(handleColorChange(material.emissive));

    matFolder.add(material, 'roughness', 0, 1).onChange(needsUpdateAll(material));
    matFolder.add(material, 'metalness', 0, 1).onChange(needsUpdateAll(material));
    matFolder.add(material, 'reflectivity', 0, 1).onChange(needsUpdateAll(material));
    matFolder.add(material, 'clearcoat', 0, 1).step(0.01).onChange(needsUpdateAll(material));
    matFolder.add(material, 'clearcoatRoughness', 0, 1).step(0.01).onChange(needsUpdateAll(material));
    matFolder.add(material, 'flatShading').onChange(needsUpdateAll(material));
    matFolder.add(material, 'wireframe').onChange(needsUpdateAll(material));
    matFolder.add(material, 'vertexColors').onChange(needsUpdateAll(material));
    matFolder.add(material, 'fog').onChange(needsUpdateAll(material));
    // matFolder.add(data, 'envMaps', envMapKeys).onChange(updateTexture(material, 'envMap', envMaps));
    // matFolder.add(data, 'map', diffuseMapKeys).onChange(updateTexture(material, 'map', diffuseMaps));
    // matFolder.add(data, 'roughnessMap', roughnessMapKeys).onChange(updateTexture(material, 'roughnessMap', roughnessMaps));
    // matFolder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));

    // TODO metalnessMap

}