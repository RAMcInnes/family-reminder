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
      state.familyMembers = fetchedProfiles
    },
    addProfile (state, profile) {
      state.familyMembers.push(profile)
    },
    editProfile (state, profile) {

    },
    deleteProfile (state, uniqueId) {

    }
  },
  actions: {
    fetchProfiles ({ commit }) {
      Vue.http.get().then(
        response => {
          console.log('--fetchProfiles--', response)
          commit('setProfiles', response.data)
        },
        error => {
          console.log(error)
        }
      )
    },
    addProfile ({ commit }, profile) {
      Vue.http.put(`${profile.uniqueId}.json`, profile).then(
        response => {
          console.log('--addProfile--', response)
          commit('addProfile', profile)
        },
        error => {
          console.log(error)
        }
      )
    },
    editProfile ({ commit }, profile) {
      Vue.http.put(`${profile.uniqueId}.json`, profile).then(
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
      Vue.http.delete(`${uniqueId}.json`).then(
        response => {
          console.log('--deleteProfile--', response)
          commit('deleteProfile', uniqueId);
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
