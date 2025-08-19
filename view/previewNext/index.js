const previewNext = {
  template: '<div></div>',
  created() {
    this.$router.replace({
      path: '/preview',
      query: {
        ...this.$route.query
      }
    })
  }
}
export default previewNext
