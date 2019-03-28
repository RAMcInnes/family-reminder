<template>
  <v-container>
    <v-layout text-xs-center justify-center row wrap>
      <v-flex>
        <!-- Image -->
        <v-img
          v-if="this.profile.image"
          :src="this.profile.image"
          height="300px"
          contain
        ></v-img>
        <!-- Full Name -->
        <v-text-field
          :value="fullName(this.profile)"
          prepend-icon="person"
          label="FullName"
          solo
          disabled
        ></v-text-field>

        <!-- TODO: ADD NICKNAME -->

        <!-- Gender -->
        <v-text-field
          v-if="this.profile.gender"
          :value="this.profile.gender"
          prepend-icon="wc"
          label="Gender"
          solo
          disabled
        ></v-text-field>
        <!-- Birthday -->
        <v-text-field
          v-if="this.profile.birthDate"
          :value="this.profile.birthDate"
          prepend-icon="cake"
          label="Birthday"
          solo
          disabled
        ></v-text-field>
        <!-- Occupation -->
        <v-text-field
          v-if="this.profile.occupation"
          :value="this.profile.occupation"
          prepend-icon="domain"
          label="Occupation"
          solo
          disabled
        ></v-text-field>
        <!-- Lives In -->
        <v-text-field
          v-if="this.profile.livesIn"
          :value="this.profile.livesIn"
          prepend-icon="language"
          label="HomeLocation"
          solo
          disabled
        ></v-text-field>
        <!-- Relationship -->
        <div style="display:flex">
          <v-text-field
            v-if="this.profile.relationship"
            :value="this.profile.relationship"
            prepend-icon="favorite"
            label="Partner"
            solo
            disabled
          ></v-text-field>
          <!-- RelationshipPerson -->
            <app-profile v-if="relationPersonUniqueIdExists" :profile="getProfileById(this.profile.relationshipPerson.profileId)"></app-profile>
            <v-text-field
              v-else-if="relationshipCheck"
              :value="fullName(this.profile.relationshipPerson.person)"
              prepend-icon="remove"
              solo
              disabled
            ></v-text-field>
        </div>
        <!-- Family -->
        <div v-for="member in this.profile.familyMembers" :key="member.id" style="display:flex">
          <v-text-field
            :value="member.relation"
            prepend-icon="people_outline"
            solo
            disabled
          ></v-text-field>
          <app-profile v-if="member.profileId" :profile="getProfileById(member.profileId)"></app-profile>
          <v-text-field
            v-else
            :value="fullName(member.person)"
            prepend-icon="remove"
            solo
            disabled
          ></v-text-field>
        </div>
        <!-- Notes -->
        <v-text-field
          v-if="this.profile.notes"
          :value="this.profile.notes"
          prepend-icon="description"
          label="Notes"
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
import ProfileCard from './ProfileCardMini'

export default {
  components: {
    appProfile: ProfileCard
  },
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
  computed: {
    relationshipCheck () {
      return this.profile.relationship === 'In a Relationship' || this.profile.relationship === 'Engaged' || this.profile.relationship === 'Married'
    },
    relationPersonUniqueIdExists () {
      return ((this.profile.relationshipPerson) && (this.profile.relationshipPerson.profileId))
    }
  },
  methods: {
    fullName (profile) {
      if (typeof profile === 'object') {
        // '.person' will exist on familyMembers and relationshipPerson (both profiles can be found via an id)
        if (profile.person) {
          return profile.person
        } else {
          // if '.person' doesn't exist, then we are dealing with a full profile, which will have a first and last name
          return `${profile.firstName} ${profile.lastName}`
        }
      } else {
        // If 'profile' is not an object, then we just want to return the String (which will be the name)
        return profile
      }
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
