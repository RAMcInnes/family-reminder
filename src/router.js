import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from './components/Home.vue'
import CreateProfile from './components/CreateProfile.vue'
import PersonProfile from './components/PersonProfile.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ './components/About.vue')
  },
  {
    path: '/create',
    name: 'create',
    component: CreateProfile
  },
  {
    path: '/edit',
    name: 'edit',
    // edit will also use the CreateProfile component, but information will be sent to it
    component: CreateProfile,
    props: (route) => ({ ...route.params })
  },
  {
    path: '/profile/:profileId',
    name: 'profile',
    // edit will also use the CreateProfile component, but information will be sent to it
    component: PersonProfile
  }
]

export default new VueRouter({ mode: 'history', routes })
