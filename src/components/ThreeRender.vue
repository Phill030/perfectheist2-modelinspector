<template>
  <div class="render">
    <Renderer
      ref="renderer"
      :orbit-ctrl="true"
      :antialias="true"
      :resize="true"
    >
      <Camera
        :position="{ x: 0, y: 20, z: 20 }"
        :fov="75"
        :near="0.1"
        :far="1000"
        ref="camera"
      />
      <Scene :background="0xeeeeee" ref="scene">
        <PointLight
          v-for="(x, idx) in lightPositions"
          :key="idx"
          :position="{ x: x.x || 0, y: x.y || 0, z: x.z || 0 }"
          :intensity="0.7"
        />
      </Scene>
    </Renderer>
  </div>
</template>

<script lang="ts">
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Box3, BufferGeometry, MeshPhongMaterial } from "three";
import { defineComponent } from "vue";
import {
  Box,
  Camera,
  PointLight,
  Renderer,
  Scene,
  FbxModel,
  PhongMaterial,
  Texture,
} from "troisjs";

export default defineComponent({
  props: {
    selectedModel: {
      type: Object,
      required: true
    },
    selectedTexture: {
      type: undefined,
      required: true
    }
  },
  watch: {
    selectedModel(x: LoadModel) {
      console.log(`[Debug] Update in Child component, received ${JSON.stringify(x)}`);
      this.setModel(x);
    },
    selectedTexture(x: { texture: string, pack: string }) {
      this.setTexture({ texture: x.texture, packname: x.pack });
    }
  },
  data() {
    return {
      lightPositions: [
        { x: 25 },
        { x: -25 },
        { y: 25 },
        { y: -25 },
        { z: 25 },
        { z: -25 },
      ] as Array<{ x: any; y: any; z: any }>,
      currentObjects: [] as string[],
    };
  },
  methods: {
    async setModel(loadModel: LoadModel) {
      //@ts-ignore
      const scene = this.$refs.scene.scene as THREE.Scene;

      // Define Model & Texture folder
      const textureFile = `http://localhost:5050/${loadModel.packname}/Textures/${loadModel.packname}_Texture_01_A.png`;
      const modelFile = `http://localhost:5050/${loadModel.packname}/Models/${loadModel.modelname}`;

      // Remove every object if one exists
      for (const object of this.currentObjects) {
        const obj = scene.getObjectByProperty("uuid", object);
        if (obj) scene.remove(obj);
      }
      this.currentObjects = [];

      console.log(`Loading... \nTexture: ${textureFile}\nModel: ${modelFile}`)

      // Load Texture & Model ASYNC
      const [texture, model] = await Promise.all([
        await new THREE.TextureLoader().loadAsync(
          textureFile
        ),
        await new FBXLoader().loadAsync(
          modelFile
        ),
      ]);
      

      if (texture != undefined) {
        model.traverse((child) => {
          const mesh = child as THREE.Mesh<BufferGeometry, MeshPhongMaterial>;
          if (mesh.isMesh) {
            mesh.material.map = texture;
            mesh.material.needsUpdate = true;
          }
        });

        const boundingBox = new Box3().setFromObject(model);
        const xSize = boundingBox.max.x - boundingBox.min.x;
        const ySize = boundingBox.max.y - boundingBox.min.y;
        const zSize = boundingBox.max.z - boundingBox.min.z;

        this.scaleModel(model, [xSize, ySize, zSize]);
        this.centerModel(model);

        this.currentObjects.push(model.uuid);
        scene.add(model);
        console.log(`[Debug] Added new Model to scene and removed old!`);
      }
    },
    async setTexture(texture: Texture) {
      //@ts-ignore
      const scene = this.$refs.scene.scene as THREE.Scene;
      const textureFile = `http://localhost:5050/${texture.packname}/Textures/${texture.texture}`;

      console.log(`[Debug] Loading texture... ${textureFile}`)

      const [loadedTexture] = await Promise.all([
        await new THREE.TextureLoader().loadAsync(
          textureFile
        ),
      ]);

      if (loadedTexture == undefined) return;

      for (const object of this.currentObjects) {
        const obj = scene.getObjectByProperty("uuid", object);
        obj?.traverse((child) => {
          const mesh = child as THREE.Mesh<BufferGeometry, MeshPhongMaterial>;
          if (mesh.isMesh) {
            mesh.material.map = loadedTexture;
            mesh.material.map.needsUpdate = true;
            console.log(`[DEBUG] Changed texture of object to ${texture.texture}`);
          }
        });
      }
    },

    centerModel(model: THREE.Group) {
      const boundingBox = new Box3().setFromObject(model);
      const center = boundingBox.getCenter(model.position);
      model.position.set(-center.x, -center.y, -center.z);
    },
    scaleModel(object: THREE.Group, box: [number, number, number]) {
      const scale = 20 / Math.max(...box);
      object.scale.set(scale, scale, scale);
    },
  },
  components: {
    Box,
    Camera,
    Scene,
    Renderer,
    PhongMaterial,
    PointLight,
    FbxModel,
    Texture,
  }
});

export interface LoadModel {
  packname: string;
  modelname: string;
}

export interface Texture {
  packname: string;
  texture: string;
}
</script>

<style scoped>
@import "../css/components/threeRender.css";
</style>
