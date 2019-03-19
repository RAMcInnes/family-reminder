<template>
    <v-card @click="goToProfile(profile)" color="#659DBD" class="profCard" hover>
        <v-img v-if="profile.image"
            :src="profile.image"
            class="profCardImage"
            contain
        ></v-img>
        <v-card-title primary-title class="profCardTitle">
            <div class="profCardText">{{displayName}}</div>
        </v-card-title>
    </v-card>
</template>

<script>
import router from '../router'

export default {
  props: ['profile'],
  computed: {
    displayName () {
      // If nickName exists, use it. Otherwise, just use firstName
      return this.profile.nickName ? `${this.profile.lastName}, ${this.profile.nickName}` : `${this.profile.lastName}, ${this.profile.firstName}`
    }
  },
  methods: {
    goToProfile (profileObj) {
      // Route to PersonProfile.vue w/ uniqueId
      router.push({ name: 'profile', params: { profileId: profileObj.uniqueId } })
    }
  }
}
</script>

<style>
    .profCard {
        display: flex;
        height: 50px;
        width: 50%;
        margin-bottom: 5px;
        margin-left: 10px;
        justify-content: center;
        align-items: center;
    }
    .profCardImage {
      height:45px
    }
    .profCardTitle {
      padding-top: 16px;
      flex: 1 1 auto;
    }
    .profCardText {
        font-size: 100%;
        color: white;
    }
</style>
