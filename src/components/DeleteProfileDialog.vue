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
      dialog: false,
      uniqueId: this.profile.uniqueId
    }
  },
  methods: {
    cancelDialog () {
      this.dialog = false
    },
    deleteProfile () {
      this.$store.dispatch('deleteProfile', this.uniqueId)
      this.dialog = false
    }
  }
}
</script>
