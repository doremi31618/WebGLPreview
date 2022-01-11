class LightManager {
    init(parentFolder){
        this.parentFolder = parentFolder;
    }
    addLight(){
        this.parentFolder.addFolder("DirectionLight");
    }
}