<template>
  <v-container>
    <v-layout v-if="profiles.length === 0" text-xs-center wrap>
      <v-flex xs12>
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        ></v-img>
      </v-flex>
    </v-layout>
    <v-layout v-else justify-center>
      <v-flex xs12 lg8>
        <app-profile v-for="profile in profiles" :key="profile.id" :profile="profile"></app-profile>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ProfileCard from './ProfileCard'

export default {
  components: {
    appProfile: ProfileCard
  },
  computed: {
    profiles () {
      return this.$store.getters.profiles
    }
  }
}
</script>

<style>
</style>
