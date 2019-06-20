import ga from 'src/components/reports/analytics.js'

export default ({
  router
}) => {
  router.afterEach((to, from) => {
    ga.logPage(to.path, to.name)
  })
}
