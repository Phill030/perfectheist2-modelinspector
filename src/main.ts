import { createApp } from 'vue'
import App from './App.vue'
import { TroisJSVuePlugin } from 'troisjs';
import { createRouter, createWebHistory } from "vue-router";
import ModelInspector from "./views/ModelInspector.vue";
import MapSelection from "./views/MapSelection.vue";
import ResourcePath from './views/ResourcePath.vue';

const routes = [
  {
    path: "/",
    name: "MapSelection",
    component: MapSelection,
  },
  {
    path: '/resourcePath',
    name: 'ResourcePath',
    component: ResourcePath
  },
  {
    path: "/modelInspector",
    name: "ModelInspector",
    component: ModelInspector,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(TroisJSVuePlugin).use(router).mount('#app')
