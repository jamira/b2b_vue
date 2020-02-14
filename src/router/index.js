import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/attraction',
    name: 'attraction',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visitd.
    component: () => import(/* webpackChunkName: "attraction" */ '../views/Attraction.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/test',
    name: 'test',
    component: () => import(/* webpackChunkName: "test" */ '../views/Test.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/ferry',
    name: 'ferry',
    component: () => import(/* webpackChunkName: "ferry" */ '../views/Ferry.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '/ferry/search', name: 'search', component: () => import(/* webpackChunkName: "search" */ '../components/Ferry/Search.vue') },
      { path: '/ferry/booking', name: 'booking', component: () => import(/* webpackChunkName: "booking" */ '../components/Ferry/Bookings.vue') }
    ]
  },
  {
    path: '/reservations',
    name: 'reservations',
    component: () => import(/* webpackChunkName: "reservations" */ '../views/Reservations.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '/reservations/list', name: 'list', component: () => import(/* webpackChunkName: "list" */ '../components/Reservation/List.vue') },
      { path: '/reservations/view/:id', name: 'view', component: () => import(/* webpackChunkName: "view" */ '../components/Reservation/View.vue') }
    ]
  },
  {
    path: '/top-up',
    name: 'topup',
    component: () => import(/* webpackChunkName: "topup" */ '../views/TopUp.vue'),
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let token = localStorage.getItem('token');
    if (token === null) {
      next("/login")
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
});

export default router;

