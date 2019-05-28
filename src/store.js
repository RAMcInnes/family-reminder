import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'

import FamilyRelationMap from './utilities/FamilyRelationMap.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // idToken: null,
    // userId: null,
    profiles: []
  },
  mutations: {
    setProfiles (state, fetchedProfiles) {
      state.profiles = fetchedProfiles
    },
    addProfile (state, profile) {
      state.profiles.push(profile)
    },
    editProfile (state, profile) {
      for (let index in state.profiles) {
        const profileMatch = state.profiles[index]
        // Match based on uniqueId
        if (profileMatch.uniqueId === profile.uniqueId) {
          state.profiles[index] = profile
        }
      }
    },
    deleteProfile (state, uniqueId) {
      for (let index in state.profiles) {
        const profileMatch = state.profiles[index]
        // Match based on uniqueId
        if (profileMatch.uniqueId === uniqueId) {
          state.profiles.splice(index, 1)
        }
      }
    }
  },
  actions: {
    fetchProfiles ({ commit }) {
      Vue.http.get('profiles.json').then(
        response => {
          console.log('--fetchProfiles--', response)
          let profiles = response.body
          let fetchedProfiles = []
          for (let uniqueId in profiles) {
            const profile = profiles[uniqueId]
            // Ensure no indexes contain 'null'
            if (profile) {
              fetchedProfiles.push(profile)
            }
          }
          commit('setProfiles', fetchedProfiles)
        },
        error => {
          console.log(error)
        }
      )
    },
    addProfile ({ commit, dispatch }, profile) {
      Vue.http.post(`profiles.json`, profile).then(
        response => {
          console.log('--addProfile--', response)
          // Create uniqueId for each profile based on one provided by Firebase
          profile.uniqueId = response.body.name
          commit('addProfile', profile)
          // Auto-populate family memeber relations in other Profiles
          dispatch('populateFamilyRelations', profile)
          // Auto-populate relationship in other Profile
          dispatch('populateRelationship', profile)
          // Adds "uniqueId" to DB
          dispatch('editProfile', profile)
          // TODO: Find better way of doing this as this way is redundant / has an extra call
        },
        error => {
          console.log(error)
        }
      )
    },
    editProfile ({ commit }, profile) {
      Vue.http.put(`profiles/${profile.uniqueId}.json`, profile).then(
        response => {
          console.log('--editProfile--', response)
          commit('editProfile', profile)
          // Go back to Home page after Edit is made.
          router.push({ name: 'home' })
        },
        error => {
          console.log(error)
        }
      )
    },
    deleteProfile ({ commit }, profile) {
      Vue.http.delete(`profiles/${profile.uniqueId}.json`).then(
        response => {
          console.log('--deleteProfile--', response)
          commit('deleteProfile', profile.uniqueId)
          // Go back to Home page after Delete is made.
          router.push({ name: 'home' })
        },
        error => {
          console.log(error)
        }
      )
    },
    populateFamilyRelations ({ commit, dispatch, getters }, profile) {
      // Loop through each familyMemeber
      for (let member of profile.familyMembers) {
        // Get Profile of familyMemeber
        let memberProfile = getters.getProfileById(member.profileId)
        // If gender is not provided, then use the "Other" naming
        let gender = profile.gender || 'Other'
        if (memberProfile) {
          // Create a new familyObj that contains the relation to 'profile'
          let familyObj = {
            person: `${profile.firstName} ${profile.lastName}`,
            relation: FamilyRelationMap[member.relation][gender],
            profileId: `${profile.uniqueId}`
          }
          memberProfile.familyMembers.push(familyObj)
          dispatch('editProfile', memberProfile)
        }
      }
    },
    populateRelationship ({ commit, dispatch, getters }, profile) {
      // Get Profile of relationshipPerson
      let relationshipProfile = getters.getProfileById(profile.relationshipPerson.profileId)

      if (relationshipProfile) {
        // Only do this for  relationships that make sense
        if (profile.relationship === 'In a Relationship' || profile.relationship === 'Engaged' || profile.relationship === 'Married') {
          if (relationshipProfile) {
            // Their relationship would be the same as yours
            relationshipProfile.relationship = profile.relationship
            relationshipProfile.relationshipPerson = {
              person: `${profile.firstName} ${profile.lastName}`,
              profileId: `${profile.uniqueId}`
            }
          }
        } else {
          if (relationshipProfile) {
            // If Profile changes to "Single", "Divorced", or "Widowed", then remove this Profile from other Profile
            relationshipProfile.relationship = null
            relationshipProfile.relationshipPerson = null
          }
        }
        dispatch('editProfile', relationshipProfile)
      }
    },
    removeFamilyRelations ({ commit, dispatch, getters }, { profile, profilesToDelete }) {
      for (let member of profilesToDelete) {
        // Only do this for profiles that are "linked" (both profiles exist)
        if (member.profileId) {
          let memberProfile = getters.getProfileById(member.profileId)
          let memberFamilyMembers = memberProfile.familyMembers
          // Loop through each familyMember
          for (let index in memberFamilyMembers) {
            let familyMember = memberFamilyMembers[index]
            // Once a match is found, remove it from familyMembers
            if (familyMember.profileId === profile.uniqueId) {
              memberFamilyMembers.splice(index, 1)
            }
            dispatch('editProfile', memberProfile)
          }
        }
      }
    }
  },
  getters: {
    profiles (state) {
      return state.profiles
    },
    getProfileById: (state) => (uniqueId) => {
      return state.profiles.find(profile => profile.uniqueId === uniqueId)
    },
    // TODO: Probably don't need this because it could return multiple profiles (of the same name)
    getProfileByName: (state, getters) => (fullName) => {
      let profiles = getters.profiles
      return profiles.filter(profile => {
        return ((profile.firstName || '').toLowerCase().indexOf((fullName || '').toLowerCase()) > -1) &&
          ((profile.lastName || '').toLowerCase().indexOf((fullName || '').toLowerCase()) > -1)
      })
    }
  }
})
