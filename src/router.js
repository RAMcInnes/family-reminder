import Home from './components/Home.vue'
import CreateProfile from './components/CreateProfile.vue'

export const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ './components/About.vue')
  },
  {
    path: '/create',
    component: CreateProfile
  }
]
