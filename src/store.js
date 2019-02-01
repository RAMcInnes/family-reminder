import Vue from 'vue'
import Vuex from 'vuex'

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
          // Adds "uniqueId" to DB
          // TODO: Find better way of doing this as this way is redundant / has an extra call
          dispatch('editProfile', profile)
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
        },
        error => {
          console.log(error)
        }
      )
    },
    deleteProfile ({ commit }, uniqueId) {
      Vue.http.delete(`profiles/${uniqueId}.json`).then(
        response => {
          console.log('--deleteProfile--', response)
          commit('deleteProfile', uniqueId)
        },
        error => {
          console.log(error)
        }
      )
    }
  },
  getters: {
    profiles (state) {
      return state.profiles
    }
  }
})
