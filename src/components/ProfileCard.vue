<template>
    <v-container>
        <v-card @click="goToProfile(profile)" color="#659DBD" class="white--text" hover>
            <v-layout justify-center align-center>
                <v-flex lg4>
                    <v-img v-if="profile.image"
                    :src="profile.image"
                    height="125px"
                    width="125px"
                    contain
                    ></v-img>
                    <div v-else class="noImage">
                        {{initials}}
                    </div>
                </v-flex>
                <v-flex xs12 lg8>
                    <v-card-title primary-title>
                        <div class="nameText">{{displayName}}</div>
                    </v-card-title>
                </v-flex>
            </v-layout>
        </v-card>
    </v-container>
</template>

<script>
import router from '../router'

export default {
  props: ['profile'],
  computed: {
    initials () {
      return this.profile.firstName.charAt(0) + this.profile.lastName.charAt(0)
    },
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
    .noImage {
        height: 125px;
        width: 125px;
        background-color: #DAAD86;
        text-align: center;
        line-height: 125px;
        font-size: 400%;
    }
    .nameText {
        font-size: 400%;
    }
</style>
