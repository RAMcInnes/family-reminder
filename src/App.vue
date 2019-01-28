<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <router-link to="/" tag="span" style="cursor: pointer">Family Reminder</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat>
        <router-link to="/create" tag="span">Create Profile</router-link>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn flat>
        <router-link to="/about" tag="span">About</router-link>
      </v-btn>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {}
  }
}
</script>
