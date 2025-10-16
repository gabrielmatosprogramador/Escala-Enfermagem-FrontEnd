const routes = [
  
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue')
  },

  
  {
    path: '/app', // Todas as páginas do app começarão com /app
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // Esta página será mostrada DENTRO do MainLayout
      { path: 'select-unit', component: () => import('pages/SelecionaUnidadePage.vue') },

      { path: 'admin/dashboard', component: () => import('pages/admin/DashboardPage.vue') }
    ]
  },

  // Redirecionamento: Se alguém aceder à raiz '/', envia-o para o login.
  {
    path: '/',
    redirect: '/login'
  },

  // Rota de erro, sempre por último.
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

