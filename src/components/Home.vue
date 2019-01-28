<template>
  <v-container>
    <v-layout v-if="familyMembers.length === 0" text-xs-center wrap>
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
        <app-profile v-for="member in familyMembers" :key="member.id" :profile="member"></app-profile>
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
    familyMembers () {
      return this.$store.getters.familyMembers
    }
  }
}
</script>

<style>
</style>
