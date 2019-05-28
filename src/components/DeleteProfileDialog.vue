<template>
    <v-dialog v-model="dialog" persistent max-width="315">
      <v-btn slot="activator">Delete</v-btn>
      <v-card>
        <v-card-title class="headline">Delete Profile</v-card-title>
        <v-card-text>Are you sure you wish to delete the profile of: <strong>{{this.profile.firstName}} {{this.profile.lastName}}</strong></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" flat @click="cancelDialog()">Cancel</v-btn>
          <v-btn color="red" flat @click="deleteProfile()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  props: ['profile'],
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    cancelDialog () {
      this.dialog = false
    },
    deleteProfile () {
      this.deleteProfileFromRelationship(this.profile)
      this.deleteProfileFromFamily(this.profile)
      this.$store.dispatch('deleteProfile', this.profile)
      this.dialog = false
    },
    deleteProfileFromRelationship (profile) {
      let relationship = profile.relationshipPerson
      if (relationship && relationship.profileId) {
        let relationshipProfile = this.$store.getters.getProfileById(relationship.profileId)
        relationshipProfile.relationshipPerson = null
        relationshipProfile.relationship = null
        this.$store.dispatch('editProfile', relationshipProfile)
      }
    },
    deleteProfileFromFamily (profile) {
      // Rare case when familyMembers is 'undefined', just use []
      let familyMembers = profile.familyMembers || []
      for (let member of familyMembers) {
        // If a profileId exists, then a profile of that person exists.
        if (member.profileId) {
          let memberProfile = this.$store.getters.getProfileById(member.profileId)
          let memberFamilyMembers = memberProfile.familyMembers
          // Loop through all of the familyMembers and find that one that matches the deleted profile.
          memberFamilyMembers.forEach((fm, index) => {
            if (fm.profileId === this.profile.uniqueId) {
              memberFamilyMembers.splice(index, 1)
              this.$store.dispatch('editProfile', memberProfile)
            }
          })
        }
      }
    }
  }
}
</script>
