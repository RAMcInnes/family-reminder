<template>
  <v-container>
    <v-layout text-xs-center justify-center row wrap>
      <v-flex>
        <!-- Image -->
        <v-img
          :src="this.profile.image"
          height="300px"
          contain
        ></v-img>
        <!-- Full Name -->
        <v-text-field
          :value="fullName(this.profile)"
          label="Solo"
          solo
          disabled
        ></v-text-field>
        <!-- Gender -->
        <v-text-field
          :value="this.profile.gender"
          label="Solo"
          solo
          disabled
        ></v-text-field>
        <!-- Birthday -->
        <v-text-field
          :value="this.profile.birthDate"
          label="Solo"
          solo
          disabled
        ></v-text-field>
        <!-- Occupation -->
        <v-text-field
          :value="this.profile.occupation"
          label="Solo"
          solo
          disabled
        ></v-text-field>
        <!-- Lives In -->
        <v-text-field
          :value="this.profile.livesIn"
          label="Solo"
          solo
          disabled
        ></v-text-field>
        <!-- Relationship -->
        <v-text-field
          :value="this.profile.relationship"
          label="Solo"
          solo
          disabled
        ></v-text-field>
        <!-- RelationshipPerson -->
        <v-text-field
          :value="getProfileById(this.profile.relationshipPerson)"
          label="Solo"
          solo
          disabled
        ></v-text-field>
        <!-- Family -->
        <div v-for="member in this.profile.familyMembers" :key="member.id" style="display:flex">
          <v-text-field
            :value="member.relation"
            prepend-icon="people_outline"
            readonly
          ></v-text-field>
          <v-text-field
            :value="fullName(member.person)"
            prepend-icon="remove"
            readonly
          ></v-text-field>
        </div>
        <!-- Notes -->
        <v-text-field
          :value="this.profile.notes"
          label="Solo"
          solo
          disabled
        ></v-text-field>

        <v-btn @click="editProfile()">Edit Profile</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import store from '../store'
import router from '../router'

export default {
  data () {
    return {
      profile: {}
    }
  },
  // Used when going from ProfileCard -> PersonProfile
  beforeRouteEnter (to, from, next) {
    next(vm => {
      console.log('ENTER to', to)
      console.log('ENTER from', from)
      vm.profile = store.getters.getProfileById(to.params.profileId)
    })
  },
  // Used when going from PersonProfile -> PersonProfile
  beforeRouteUpdate (to, from, next) {
    console.log('UPDATE to', to)
    console.log('UPDATE from', from)
    this.profile = store.getters.getProfileById(to.params.profileId)
    next()
  },
  methods: {
    fullName (profile) {
      return typeof profile === 'object' ? `${profile.firstName} ${profile.lastName}` : profile
    },
    getProfileById (profileId) {
      return store.getters.getProfileById(profileId)
    },
    editProfile () {
      router.push({ name: 'edit', params: { profile: this.profile } })
    }
  }
}
</script>

<style>
</style>
