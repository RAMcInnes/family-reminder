import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // idToken: null,
    // userId: null,
    familyMembers: [{
      image: false,
      firstName: 'Robert',
      lastName: 'McInnes',
      nickName: null,
      gender: null,
      birthDate: null,
      occupation: null,
      relationship: null,
      livesIn: null,
      familyMembers: [{
        relation: 'Mother',
        person: 'Janice'
      }],
      notes: null
    }]
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
      console.log('--addProfile--')
      commit('addProfile', profile)
    }
  },
  getters: {
    familyMembers (state) {
      return state.familyMembers
    }
  }
})
