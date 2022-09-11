<template>
  <div class="list">
    <div class="header">
      <p class="headerText" v-if="mapName">{{ mapName }}</p>
      <p class="headerText" v-else>Resourcepath</p>
    </div>
    <div class="initialList">
      <div
        class="object"
        v-for="(x, idx) in filteredModels"
        :key="idx"
        @click="clickModel(idx, x)"
        :class="{ active: currentIndex == idx }"
      >
        {{ x.modelname.replace(".fbx", "") }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      currentIndex: -1 as number,
      models: [] as Model[],
      selectedModel: {} as LoadModel
    };
  },
  props: {
    mapName: {
      type: String,
      required: false,
    },
    objectList: {
      type: Object,
      required: true,
    },
  },
  watch: {
    objectList() {
      this.models = this.objectList as Model[];
    },
  },
  methods: {
    clickModel(idx: number, x: LoadModel) {
      console.log(`[Debug] Current index: ${idx} | Model: ${x.modelname}`);

      if(this.currentIndex == idx) {
        console.log(`[Debug] Clicked on object with same index! (avoiding loading)`)
        return;
      }

      this.$emit('updateModel', idx, x)
      this.currentIndex = idx;
    },
  },
  computed: {
    filteredModels() {
        const load: LoadModel[] = [];

        Object.values(this.models).forEach((model) => {
          model.models.forEach((modelName) => {
            load.push({
              modelname: modelName,
              packname: model.name,
            });
          });
        });

        return load;
    },
  },
});

export interface Model {
  name: string;
  models: string[];
  textures: string[];
}

export interface LoadModel {
  packname: string;
  modelname: string;
}
</script>

<style scoped>
@import "../css/components/resmodelList.css";
</style>
