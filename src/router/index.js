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
    path: '/ferry',
    name: 'ferry',
    component: () => import(/* webpackChunkName: "ferry" */ '../views/Ferry.vue'),
  },
  {
    path: '/reservations',
    name: 'reservations',
    component: () => import(/* webpackChunkName: "reservations" */ '../views/Reservations.vue'),
    children: [
      { path: '/reservations/list', component: () => import(/* webpackChunkName: "list" */ '../components/Reservation/List.vue') },
      { path: '/reservations/view/:id', name: 'view', component: () => import(/* webpackChunkName: "view" */ '../components/Reservation/View.vue') },
      { path: '/reservations/edit/:id', component: () => import(/* webpackChunkName: "edit" */ '../components/Reservation/Edit.vue') }
    ]
  },
  {
    path: '/booking',
    name: 'booking',
    component: () => import(/* webpackChunkName: "booking" */ '../views/Booking.vue'),
  },
  {
    path: '/hotel',
    name: 'hotel',
    component: () => import(/* webpackChunkName: "hotel" */ '../views/Hotel.vue')
  },
  {
    path: '/other',
    name: 'other',
    component: () => import(/* webpackChunkName: "other" */ '../views/Other.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
