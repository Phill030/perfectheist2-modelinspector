<template>
  <div class="window">
    <MultiComponent
      :mapName="mapName"
      :textures="availableTextures"
      :mapModels="mapModels"
      @updateTexture="selectTexture"
    />
    <ResModelList
      class="resourceList prop"
      :objectList="models"
      @updateModel="updateModel"
    />
    <ThreeRender
      class="renderer prop"
      :selectedModel="selectedModel"
      :selectedTexture="selectedTexture"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ResModelList, { LoadModel } from "../components/ResModelList.vue";
import ThreeRender from "../components/ThreeRender.vue";
import MultiComponent from "../components/MultiComponent.vue";
export default defineComponent({
  data() {
    return {
      mapName: "" as string,
      resourcePath: "" as string,
      models: {} as Model[],

      selectedModel: {} as LoadModel,
      currentIdx: -1 as number,

      availableTextures: [] as
        | Array<{ pack: string; texture: string }>
        | undefined,
      selectedTexture: {} as { pack: string; texture: string },
      selectedTextureIdx: -1 as number,

      mapModels: [] as Array<string>,
    };
  },
  methods: {
    updateModel(idx: number, obj: LoadModel) {
      this.selectedModel = obj;
      this.currentIdx = idx;

      this.availableTextures = this.models
        .find((model) => model.name == obj.packname)
        ?.textures.map((x) => {
          return {
            texture: x,
            pack: obj.packname,
          };
        });
    },
    selectTexture(index: number, texture: { pack: string; texture: string }) {
      this.selectedTexture = texture;
      this.selectedTextureIdx = index;
    },
  },
  async mounted() {
    this.resourcePath = this.$route.query.resourceFolder as string;
    this.mapName = this.$route.query.mapName as string;

    const req = await fetch(`http://localhost:5050/api/setResourcePath`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resourceFolder: this.resourcePath,
        mapName: this.mapName,
      }),
    });

    const response = JSON.parse(await req.text());

    const resourceJson = JSON.parse(response["resource"]) as Model[];
    this.models = resourceJson;

    const mapJson = JSON.parse(response["map"]) as Array<string>;
    this.mapModels = mapJson;

    console.log(
      `[Debug] Selected map ${this.mapName} & Loaded ${this.models
        .flatMap((x) => x.models.length)
        .reduce((p, c) => p + c)} objects`
    );
  },
  computed: {},
  components: { ResModelList, ThreeRender, MultiComponent },
});

export interface Model {
  name: string;
  models: string[];
  textures: string[];
}

export interface MapResources {
  models: string[];
}
</script>

<style scoped>
@import "../css/views/modelInspector.css";
</style>
