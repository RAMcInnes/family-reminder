<template>
  <v-container>
    <v-layout text-xs-center justify-center row wrap>
      <v-flex xs12>
        <div v-if="!image">
          <h2>Select a Profile Image</h2>
          <!-- Small 'hack' to prevent the default text from file input from showing up -->
          <input
            type="file"
            ref="selectedImage"
            @change="changeImage($event)"
            style="display: none;">
          <v-btn @click="$refs.selectedImage.click()">Change Image</v-btn>
        </div>
        <div v-else>
          <v-img
            :src="image"
            height="125px"
            contain
          ></v-img>
          <!-- Small 'hack' to prevent the default text from file input from showing up -->
          <input type="file" ref="selectedImage" @change="changeImage($event)" style="display: none;">
          <v-btn @click="$refs.selectedImage.click()">Change Image</v-btn>
          <v-btn @click="removeImage()">Remove Image</v-btn>
        </div>
      </v-flex>
      <v-flex xs12 lg8>
       <v-form ref=form>
          <v-text-field
            v-model="firstName"
            prepend-icon="person"
            label="First Name"
            :rules="[v => !!v || 'First Name is required']"
            required
          ></v-text-field>
          <v-text-field
            v-model="lastName"
            prepend-icon="person"
            label="Last Name"
            :rules="[v => !!v || 'Last Name is required']"
            required
          ></v-text-field>
          <v-text-field
            v-model="nickName"
            prepend-icon="person_outline"
            label="Nickname"
          ></v-text-field>
          <v-select
            v-model="gender"
            :items="genderList"
            prepend-icon="wc"
            label="Gender"
          ></v-select>
          <v-menu
            ref="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            v-model="menu"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px">
            <v-text-field
              slot="activator"
              v-model="birthDate"
              label="Birthday"
              prepend-icon="cake"
              readonly
            ></v-text-field>
            <v-date-picker
              ref="picker"
              v-model="birthDate"
              :max="new Date().toISOString().substr(0, 10)"
              min="1930-01-01"
              @change="saveBirthday()"
            ></v-date-picker>
          </v-menu>
          <v-text-field
            v-model="occupation"
            prepend-icon="domain"
            label="Occupation"
          ></v-text-field>
          <v-select
            v-model="relationship"
            :items="relationshipList"
            prepend-icon="favorite"
            label="Relationship"
          ></v-select>
          <v-text-field
            v-model="livesIn"
            prepend-icon="language"
            label="Lives in (Location)"
          ></v-text-field>
          <div id="relationsList">
            <span>Related To</span>
            <div v-for="(member, index) in familyMembers" :key="member.id" style="display:flex">
              <v-text-field
                :value="member.relation"
                prepend-icon="people_outline"
                readonly
              ></v-text-field>
              <v-text-field
                :value="member.person"
                prepend-icon="remove"
                readonly
              ></v-text-field>
              <v-btn
                fab
                small
                color="red"
                @click="removeFamilyMember(index)"
              >
                <v-icon>remove</v-icon>
              </v-btn>
            </div>
            <div style="display:flex">
              <v-select
                v-model="relation"
                :items="relationList"
                prepend-icon="people"
                label="Relation"
                :rules="[v => familyMembers.length > 0 || 'Relation is required']"
              ></v-select>
              <v-text-field
                v-model="relationPerson"
                prepend-icon="remove"
                label="Person"
                :rules="[v => familyMembers.length > 0 || 'Person is required']"
              ></v-text-field>
              <v-btn
                fab
                small
                color="blue"
                :disabled="isAddFamilyMemberDisabled"
                @click="addFamilyMember()"
              >
                <v-icon>add</v-icon>
              </v-btn>
            </div>
          </div>
          <v-textarea
            v-model="notes"
            auto-grow
            prepend-icon="description"
            label="Notes"
            rows="1"
          ></v-textarea>
          <div v-if="isProfileEmpty(this.profile)">
            <v-btn @click="submitProfile()">Submit</v-btn>
            <v-btn @click="clearProfile()">Clear</v-btn>
          </div>
          <div v-else>
            <v-btn @click="editProfile()">Edit</v-btn>
            <v-btn @click="deleteProfile()">Delete</v-btn>
          </div>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: {
    profile: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      image: this.profile.image || false,
      firstName: this.profile.firstName,
      lastName: this.profile.lastName,
      nickName: this.profile.nickName,
      gender: this.profile.gender,
      genderList: ['Male', 'Female', 'Other'],
      menu: false,
      birthDate: this.profile.birthDate,
      occupation: this.profile.occupation,
      relationship: this.profile.relationship,
      relationshipList: ['Single', 'In a Relationship', 'Engaged', 'Married', 'Divorced', 'Widowed'],
      livesIn: this.profile.livesIn,
      relation: this.profile.relation,
      relationList: ['Grandfather', 'Grandmother', 'Father', 'Mother', 'Brother', 'Sister', 'Son', 'Daughter', 'Uncle', 'Aunt', 'Cousin', 'Nephew', 'Niece', 'Husband', 'Wife', 'Fiance', 'Boyfriend', 'Girlfriend'],
      relationPerson: this.profile.relationPerson,
      familyMembers: this.profile.familyMembers || [],
      notes: this.profile.notes
    }
  },
  watch: {
    menu (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  computed: {
    isAddFamilyMemberDisabled () {
      // Not sure if this is the best way to do this...
      return !(!!this.relation && !!this.relationPerson)
    }
  },
  methods: {
    isProfileEmpty (obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) { return false }
      }
      return true
    },
    changeImage (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.createImage(files[0])
    },
    createImage (file) {
      var reader = new FileReader()
      reader.onload = (e) => {
        this.image = e.target.result
      }
      reader.readAsDataURL(file)
    },
    removeImage (item) {
      this.image = false
    },
    saveBirthday (date) {
      this.$refs.menu.save(date)
    },
    removeFamilyMember (index) {
      this.familyMembers.splice(index, 1)
    },
    addFamilyMember () {
      let familyObj = {
        relation: this.relation,
        person: this.relationPerson
      }
      if (!!this.relation && !!this.relationPerson) {
        this.familyMembers.push(familyObj)
        // Clear out the current data
        this.$nextTick(() => {
          this.relation = null
          this.relationPerson = null
        })
      }
    },
    submitProfile () {
      if (this.$refs.form.validate()) {
        var profileObj = {
          image: this.image,
          firstName: this.firstName,
          lastName: this.lastName,
          nickName: this.nickName,
          gender: this.gender,
          birthDate: this.birthDate,
          occupation: this.occupation,
          relationship: this.relationship,
          livesIn: this.livesIn,
          familyMembers: this.familyMembers,
          notes: this.notes
        }
        // console.log('profileObj', profileObj)
        this.$store.dispatch('addProfile', profileObj)
        this.clearProfile()
        this.$refs.form.resetValidation()
      }
    },
    clearProfile () {
      this.image = false
      this.firstName = null
      this.lastName = null
      this.nickName = null
      this.gender = null
      this.birthDate = null
      this.occupation = null
      this.relationship = null
      this.livesIn = null
      this.familyMembers = []
      this.notes = null
    },
    editProfile () {
      console.log('EDIT PROFILE')
    },
    deleteProfile () {
      console.log('DELETE PROFILE')
      // Add Confirmation / Warning
      this.$store.dispatch('deleteProfile', this.firstName)
    }
  }
}
</script>

<style>
</style>
