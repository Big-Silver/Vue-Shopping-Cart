import Vue from 'vue'
import Router from 'vue-router'
import ShopCart from '@/components/ShopCart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ShopCart',
      component: ShopCart
    }
  ]
})
