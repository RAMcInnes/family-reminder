<template>
    <div>
      Hi {{this.profile.firstName}} {{this.profile.lastName}}
      <v-img
        :src="this.profile.image"
        height="500px"
        contain
      ></v-img>
    </div>
</template>

<script>
import store from '../store'

export default {
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
  }
}
</script>

<style>

</style>
