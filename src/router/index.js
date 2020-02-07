import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/attraction',
    name: 'attraction',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "attraction" */ '../views/Attraction.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import(/* webpackChunkName: "test" */ '../views/Test.vue')
  },
  {
    path: '/ferry',
    name: 'ferry',
    component: () => import(/* webpackChunkName: "ferry" */ '../views/Ferry.vue'),
    children: [
      { path: '/ferry/search', name: 'search', component: () => import(/* webpackChunkName: "search" */ '../components/Ferry/Search.vue') },
      { path: '/ferry/booking', name: 'booking', component: () => import(/* webpackChunkName: "booking" */ '../components/Ferry/Bookings.vue') }
    ]
  },
  {
    path: '/reservations',
    name: 'reservations',
    component: () => import(/* webpackChunkName: "reservations" */ '../views/Reservations.vue'),
    children: [
      { path: '/reservations/list', name: 'list', component: () => import(/* webpackChunkName: "list" */ '../components/Reservation/List.vue') },
      { path: '/reservations/view/:id', name: 'view', component: () => import(/* webpackChunkName: "view" */ '../components/Reservation/View.vue') }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
