
const routes = [
  {
    path: '/',
    component: () => import('layouts/SoftwareAsAServiceLayout.vue'),
    children: [
      {
        path: 'marksList',
        name: 'marksList',
        component: () => import('pages/backend/MarksList.vue')
      },
      {
        path: 'productsList',
        name: 'productsList',
        component: () => import('pages/backend/ProductsList.vue')
      },
      {
        path: 'marketsList',
        name: 'marketsList',
        component: () => import('pages/backend/MarketsList.vue')
      },
      {
        path: 'usersList',
        name: 'usersList',
        component: () => import('pages/backend/UsersList.vue')
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('pages/backend/Profile.vue')
      },
      {
        path: 'cart',
        name: 'cart',
        component: () => import('pages/backend/Cart.vue')
      },
      {
        path: 'listOfProducts/:id',
        name: 'listOfProducts',
        component: () => import('pages/backend/listOfProducts.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/Index.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/frontend/Register.vue')
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/frontend/Login.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
