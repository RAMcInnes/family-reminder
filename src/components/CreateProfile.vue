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
          <!-- FIRST NAME -->
          <v-text-field
            v-model.trim="firstName"
            prepend-icon="person"
            label="First Name"
            :rules="[v => !!v || 'First Name is required']"
            required
          ></v-text-field>

          <!-- LAST NAME -->
          <v-text-field
            v-model.trim="lastName"
            prepend-icon="person"
            label="Last Name"
            :rules="[v => !!v || 'Last Name is required']"
            required
          ></v-text-field>

          <!-- NICKNAME -->
          <v-text-field
            v-model.trim="nickName"
            prepend-icon="person_outline"
            label="Nickname"
          ></v-text-field>

          <!-- GENDER-->
          <v-select
            v-model="gender"
            :items="genderList"
            prepend-icon="wc"
            label="Gender"
          ></v-select>

          <!-- BIRTHDAY -->
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

          <!-- OCCUPATION -->
          <v-text-field
            v-model.trim="occupation"
            prepend-icon="domain"
            label="Occupation"
          ></v-text-field>

          <div style="display:flex">
            <!-- RELATIONSHIP -->
            <v-select
              v-model="relationship"
              :items="relationshipList"
              prepend-icon="favorite"
              label="Relationship"
              style="flex: 1 1 auto"
            ></v-select>

            <!-- RELATIONSHIP PARTNER -->
            <div v-if="relationshipCheck"  style="flex: 1 1 auto">
              <v-combobox
                v-model="relationshipPerson"
                prepend-icon="remove"
                label="Partner"
                :items="filteredProfiles"
                :item-text="fullName"
                :search-input.sync="partnerSearchProfile"
                flat
                hide-no-data
                hide-selected
                return-object
              >
                <template slot="selection" slot-scope="data">
                  {{ fullName(data.item) }}
                </template>
                <template slot="item" slot-scope="data">
                  <div>
                    <v-img v-if="data.item.image"
                      :src="data.item.image"
                      height="45px"
                      contain
                    ></v-img>
                    <div>{{ fullName(data.item) }}</div>
                  </div>
                </template>
              </v-combobox>
            </div>
          </div>

          <!-- LIVES IN -->
          <v-text-field
            v-model.trim="livesIn"
            prepend-icon="language"
            label="Home Location"
          ></v-text-field>

          <!-- RELATIONS -->
          <span>Related To</span>
          <div v-for="(member, index) in familyMembers" :key="member.id" style="display:flex">
            <v-text-field
              :value="member.relation"
              prepend-icon="people_outline"
              readonly
              style="flex: 1 1 auto"
            ></v-text-field>
            <v-text-field
              :value="fullName(member.person)"
              prepend-icon="remove"
              readonly
              style="flex: 1 1 auto"
            ></v-text-field>
            <v-btn
              fab
              small
              color="red"
              @click="removeFamilyMember(member,index)"
            >
              <v-icon>remove</v-icon>
            </v-btn>
          </div>

          <!-- (NEW) RELATIONS -->
          <div style="display:flex">
            <!-- RELATION -->
            <v-select
              v-model="relation"
              :items="relationList"
              prepend-icon="people"
              label="Relation"
              :rules="[v => (!!relation) || (familyMembers.length > 0) || 'Relation is required']"
            ></v-select>

            <!-- (NEW) RELATION PERSON -->
            <v-combobox
              v-model="relationPerson"
              prepend-icon="remove"
              label="Person"
              :items="filteredProfiles"
              :item-text="fullName"
              :search-input.sync="personSearchProfile"
              :rules="[v => (!!relationPerson) || (familyMembers.length > 0) || 'Person is required']"
              flat
              hide-no-data
              hide-selected
              return-object
            >
              <template slot="selection" slot-scope="data">
                {{ fullName(data.item) }}
              </template>
              <template slot="item" slot-scope="data">
                <div>
                  <v-img v-if="data.item.image"
                    :src="data.item.image"
                    height="45px"
                    contain
                  ></v-img>
                  <div>{{ fullName(data.item) }}</div>
                </div>
              </template>
            </v-combobox>
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

          <!-- NOTES -->
          <v-textarea
            v-model.trim="notes"
            auto-grow
            prepend-icon="description"
            label="Notes"
            rows="1"
          ></v-textarea>

          <!-- BUTTONS -->
          <div v-if="isObjectEmpty(this.profile)">
            <v-btn @click="submitProfile()">Submit</v-btn>
            <v-btn @click="clearProfile()">Clear</v-btn>
          </div>
          <div v-else>
            <v-btn @click="editProfile()">Edit</v-btn>
            <delete-profile-dialog :profile="this.profile"></delete-profile-dialog>
          </div>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import DeleteProfileDialog from './DeleteProfileDialog.vue'

export default {
  props: {
    profile: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  components: {
    deleteProfileDialog: DeleteProfileDialog
  },
  beforeRouteEnter (to, from, next) {
    // console.log(`${from.name.toUpperCase()} -> ${to.name.toUpperCase()}`)
    // console.log(`${to.name.toUpperCase()} - ENTER to`, to)
    // console.log(`${to.name.toUpperCase()} - ENTER from`, from)
    // console.log(`----------`)
    if (to.name === 'create' && from.name === 'edit') {
      // When going from Edit -> Create Profile, the profile needs to be wiped
      next(vm => vm.clearProfile())
    }
    next()
  },
  beforeRouteLeave (to, from, next) {
    // console.log(`${from.name.toUpperCase()} -> ${to.name.toUpperCase()}`)
    // console.log(`${from.name.toUpperCase()} - LEAVE from`, from)
    // console.log(`${from.name.toUpperCase()} - LEAVE to`, to)
    // console.log(`----------`)
    if (from.name === 'create' || from.name === 'edit') {
      // Add a dialog for "are you sure you wish to leave this page"
      next()
    }
    next()
  },
  data () {
    return {
      uniqueId: this.profile.uniqueId,
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
      partnerSearchProfile: null,
      relationshipPerson: this.profile.relationshipPerson,
      filteredProfiles: [],
      livesIn: this.profile.livesIn,
      relation: this.profile.relation,
      relationList: ['Grandfather', 'Grandmother', 'Grandparent', 'Father', 'Mother', 'Parent', 'Uncle', 'Aunt', 'Brother', 'Sister', 'Sibling', 'Son', 'Daughter', 'Child', 'Cousin', 'Nephew', 'Niece', 'Nibling', 'Grandson', 'Granddaughter', 'Grandchild'],
      personSearchProfile: null,
      relationPerson: this.profile.relationPerson,
      familyMembers: this.profile.familyMembers || [],
      removedFamilyMembers: [],
      notes: this.profile.notes
    }
  },
  watch: {
    menu (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
    partnerSearchProfile (val) {
      val && val !== this.relationshipPerson && this.searchAllProfilesByNameForRelationship(val)
    },
    personSearchProfile (val) {
      val && val !== this.relationPerson && this.searchAllProfilesByNameForFamily(val)
    }
  },
  computed: {
    isAddFamilyMemberDisabled () {
      // Not sure if this is the best way to do this...
      return !(!!this.relation && !!this.relationPerson)
    },
    relationshipCheck () {
      return this.relationship === 'In a Relationship' || this.relationship === 'Engaged' || this.relationship === 'Married'
    }
  },
  methods: {
    isObjectEmpty (obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) { return false }
      }
      return true
    },
    changeImage (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.createImage(files[0])
    },
    createImage (file) {
      let reader = new FileReader()
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
    removeFamilyMember (familyMember, index) {
      this.familyMembers.splice(index, 1)
      this.removedFamilyMembers.push(familyMember)
    },
    addFamilyMember () {
      let familyObj = {
        person: this.fullName(this.relationPerson),
        relation: this.relation,
        profileId: this.relationPerson.uniqueId
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
    fullName (profile) {
      // Apparently null is of type Object
      if (typeof profile === 'object' && profile !== null) {
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
    // TODO: This should probably be in the "getters" of the store - this.$store.getters.searchAllProfiles(name)
    // Not the best name. I know. Might want to combine this with searchAllProfilesByNameForFamily and pass in parameter.
    searchAllProfilesByNameForRelationship (name) {
      const profiles = this.$store.getters.profiles
      // Filter out current Profile from the list
      this.filteredProfiles = profiles.filter(profile => {
        return ((profile.firstName !== this.firstName) || (profile.lastName !== this.lastName))
      })
      // Filter out Profiles in relationships
      this.filteredProfiles = this.filteredProfiles.filter(profile => {
        return ((!profile.relationship) ||
          (profile.relationship === 'Single') ||
          (profile.relationship === 'Divorced') ||
          (profile.relationship === 'Widowed'))
      })
      // Filter out firstNames, or lastNames, or fullNames that don't match "name"
      this.filteredProfiles = this.filteredProfiles.filter(profile => {
        return ((profile.firstName || '').toLowerCase().indexOf((name || '').toLowerCase()) > -1) ||
          ((profile.lastName || '').toLowerCase().indexOf((name || '').toLowerCase()) > -1) ||
          (this.fullName(profile).toLowerCase().indexOf((name || '').toLowerCase()) > -1)
      })
    },
    // TODO: This should probably be in the "getters" of the store - this.$store.getters.searchAllProfiles(name)
    // Not the best name. I know. Might want to combine this with searchAllProfilesByNameForRelationship and pass in parameter.
    searchAllProfilesByNameForFamily (name) {
      const profiles = this.$store.getters.profiles
      // Filter out current Profile from the list
      this.filteredProfiles = profiles.filter(profile => {
        return ((profile.firstName !== this.firstName) || (profile.lastName !== this.lastName))
      })
      // Filter out firstNames, or lastNames, or fullNames that don't match "name"
      this.filteredProfiles = this.filteredProfiles.filter(profile => {
        return ((profile.firstName || '').toLowerCase().indexOf((name || '').toLowerCase()) > -1) ||
          ((profile.lastName || '').toLowerCase().indexOf((name || '').toLowerCase()) > -1) ||
          (this.fullName(profile).toLowerCase().indexOf((name || '').toLowerCase()) > -1)
      })
    },
    submitProfile () {
      if (this.$refs.form.validate()) {
        let profileObj = {
          uniqueId: '',
          image: this.image,
          firstName: this.firstName,
          lastName: this.lastName,
          nickName: this.nickName,
          gender: this.gender,
          birthDate: this.birthDate,
          occupation: this.occupation,
          relationship: this.relationship,
          relationshipPerson: {
            person: this.fullName(this.relationshipPerson),
            profileId: this.relationshipPerson ? this.relationshipPerson.uniqueId : undefined
          },
          livesIn: this.livesIn,
          familyMembers: this.familyMembers,
          notes: this.notes
        }

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
      this.relationshipPerson = null
      this.livesIn = null
      this.relation = null
      this.relationPerson = null
      this.familyMembers = []
      this.removedFamilyMembers = []
      this.notes = null
      this.$refs.form.resetValidation()
    },
    editProfile () {
      if (this.$refs.form.validate()) {
        let profileObj = {
          uniqueId: this.uniqueId,
          image: this.image,
          firstName: this.firstName,
          lastName: this.lastName,
          nickName: this.nickName,
          gender: this.gender,
          birthDate: this.birthDate,
          occupation: this.occupation,
          relationship: this.relationship,
          relationshipPerson: {
            person: this.fullName(this.relationshipPerson),
            profileId: this.relationshipPerson.profileId ? this.relationshipPerson.profileId : this.relationshipPerson.uniqueId
          },
          livesIn: this.livesIn,
          familyMembers: this.familyMembers,
          notes: this.notes
        }

        // Delete family remember relation in other Profile (if applicable)
        this.$store.dispatch('removeFamilyRelations', { profile: profileObj, profilesToDelete: this.removedFamilyMembers })
        // Auto-populate family memeber relations in other Profiles
        this.$store.dispatch('populateFamilyRelations', profileObj)
        // Auto-populate relationship in other Profile
        this.$store.dispatch('populateRelationship', profileObj)
        // If the person is single, then no relationship should be "stored" with them
        if (!this.relationshipCheck) {
          profileObj.relationshipPerson = null
        }
        this.$store.dispatch('editProfile', profileObj)
        this.$refs.form.resetValidation()
      }
    }
  }
}
</script>

<style>
</style>
