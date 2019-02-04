<template>
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
</template>

<script>
export default {}
</script>
