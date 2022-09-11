<template>
  <div class="resourceSelection">
    <p class="info">Please input the location of your asset folder and click "OK"</p>
    <div class="form">
      <input type="text" class="resource" v-model="resourceFolder" />
      <button @click="generateJSON">OK</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const baseURL = "http://localhost:5050/api";

export default defineComponent({
  data() {
    return {
      resourceFolder: "",
      mapName: ""
    };
  },
  methods: {
    async generateJSON() {
      const res = await fetch(`${baseURL}/validateResourcePath`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resourceFolder: this.resourceFolder })
      });

      const folderValidated = JSON.parse(await res.text())['response'];
      if(folderValidated) {
        this.$router.push({ path: 'modelInspector', query: { mapName: this.mapName, resourceFolder: this.resourceFolder }  })
      }

    },
  },
  mounted() {
    this.mapName = this.$route.query.mapName as string;
  }
});
</script>

<style scoped>
body .resourceSelection {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 98.5vw;
  height: 97.5vh;
  overflow: hidden;
  align-items: center;
  justify-content: center;
}

.info {
  position: relative;
  color: white;
  font-family: ph2;
  font-size: 2vw;
}

.form {
  position: relative;
  display: flex;
  flex-direction: row;
}

.resource {
  position: relative;
  display: flex;
  width: 20vw;
  height: 3vh;
}

.form button {
  position: relative;
  margin-left: 0.5vw;
  cursor: pointer;
}
</style>
