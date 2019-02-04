<template>
  <v-app>
    <app-toolbar></app-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import Toolbar from './components/Toolbar.vue'

export default {
  name: 'App',
  components: {
    appToolbar: Toolbar
  },
  created () {
    this.$store.dispatch('fetchProfiles')
  }
}
</script>
