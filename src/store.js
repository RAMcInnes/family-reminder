import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // idToken: null,
    // userId: null,
    familyMembers: []
  },
  mutations: {
    setFamilyMembers (state, fetchedFamilyMembers) {
      state.familyMembers = fetchedFamilyMembers
    },
    addProfile (state, profile) {
      state.familyMembers.push(profile)
    }
  },
  actions: {
    // fetchFamilyMembers (via Firebase)

    addProfile ({ commit }, profile) {
      Vue.http.post(`${profile.firstName}.json`, profile).then(
        response => {
          console.log('--addProfile--', response)
          commit('addProfile', profile)
        },
        error => {
          console.log(error)
        }
      )
    },
    deleteProfile ({ commit }, profileName) {
      Vue.http.delete(`${profileName}.json`).then(
        response => {
          console.log('--deleteProfile--', response)
        },
        error => {
          console.log(error)
        }
      )
    }
  },
  getters: {
    familyMembers (state) {
      return state.familyMembers
    }
  }
})
