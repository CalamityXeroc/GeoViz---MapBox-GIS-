<template>
  <div id="app">
    <Maps />
  </div>
</template>

<script>
import Maps from './views/Maps.vue';

export default {
  name: 'App',
  components: {
    Maps
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>
