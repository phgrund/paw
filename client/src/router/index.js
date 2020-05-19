import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../layouts/Auth.vue'),
    children: [
      {
        path: '',
        redirect: {
          name: 'Login'
        }
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('../components/Login.vue'),
        meta: {
          guest: true
        }
      },
      {
        path: 'registrar',
        name: 'Register',
        component: () => import('../components/Register.vue'),
        meta: {
          guest: true
        }
      }
    ]
  },
  {
    path: '/home',
    component: () => import('../layouts/Dashboard.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue'),
      },
      {
        path: 'perfil/:id?',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        props: true
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  if (!to.meta.guest && !token) {
    next({
      name: 'Login'
    })
  }
  if((to.name === 'Login' || to.name == 'Register') && token) {
    next({
      name: 'Home'
    })
  }
  next()
})

export default router
