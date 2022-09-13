<template>
  <div class="list">
    <div class="header">
      <p class="headerText">Textures</p>
    </div>
    <div class="headerList">
      <div
        class="object"
        v-for="(x, idx) in availableTextures"
        :key="idx"
        @click="clickTexture(idx, x)"
        :class="{ active: currentIdx == idx }"
      >
        {{ x.texture.replace(".png", "") }}
      </div>
    </div>
    <div class="footer">
      <p class="footerText">{{ mapName }}</p>
    </div>
    <div class="footerList">
      <div class="object" v-for="(x, idx) in currentMapModels" :key="idx">
        {{ x.replace(".fbx", "") }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      availableTextures: [] as
        | Array<{ pack: string; texture: string }>
        | undefined,
      selectedTexture: {} as { pack: string; texture: string },
      currentIdx: -1 as number,
      currentMapModels: [] as Array<string>,
    };
  },
  methods: {
    clickTexture(index: number, texture: { pack: string; texture: string }) {
      console.log(`[Debug] Current TextureIndex ${index} | ${texture.texture}`);

      if (this.currentIdx == index) {
        console.log(
          `[Debug] Clicked on texture with same index! (avoiding loading)`
        );
        return;
      }

      this.currentIdx = index;
      this.selectedTexture = texture;

      this.$emit("updateTexture", index, texture);
    },
  },
  props: {
    mapName: {
      type: String,
      required: false,
    },
    textures: {
      type: undefined,
      required: true,
    },
    mapModels: {
      type: Array,
      required: true,
    },
  },
  watch: {
    textures(textures: Array<{ pack: string; texture: string }>) {
      this.availableTextures = textures;
      this.currentIdx = -1;
    },
    mapModels(models: Array<string>) {
        this.currentMapModels = models;
    }
  },
});
</script>

<style scoped>
@import "../css/components/multiComponent.css";
</style>

<!-- TODO:  MapFolder Model selection &&
            show if model in map has texture file (icons)
            Convert lists into treeview from vue (DIY)
                      If the user has no maps/no folder found directly show the asset page
            If the users map has no entities, only show it after it has >= 1
            Rework the Serverside API since it uses an absolute path (use queries for selection)
-->