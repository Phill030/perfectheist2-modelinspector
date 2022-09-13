<template>
 <li>
    <div
      :class="{ bold: isFolder }"
      @click="toggle"
      @dblclick="changeType">
      {{ model?.name }}
      <span v-if="isFolder">[{{ isOpen ? '-' : '+' }}]</span>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <TreeComponent
        class="item"
        v-for="(x, idx) in model?.children"
        :key="idx"
        :model="model">
      </TreeComponent>
      <li class="add" @click="addChild">+</li>
    </ul>
  </li>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {  
    model: Object,
  },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    isFolder() {
      //@ts-ignore
      return this.model.children && this.model.children.length;
    },
  },
  methods: {
    toggle() {
      if (this.isFolder) {
        this.isOpen = !this.isOpen;
      }
    },
    changeType() {
      if (!this.isFolder && this.model) {
        this.model.children = [];
        this.addChild();
        this.isOpen = true;
      }
    },
    addChild() {
      if (this.model) {
        this.model.children.push({
          name: "new stuff",
        });
      }
    },
  },
});
</script>

<style></style>