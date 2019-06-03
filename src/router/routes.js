
const routes = [
  {
    path: '/',
    component: () => import('layouts/SoftwareAsAServiceLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/Index.vue') },
      {
        path: 'marksList',
        name: 'marksList',
        component: () => import('pages/backend/MarksList.vue')
      },
      {
        path: 'productsList',
        name: 'productsList',
        component: () => import('pages/backend/ProductsList.vue')
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
