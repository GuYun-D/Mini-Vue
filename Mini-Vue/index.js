function createApp(rootComponent) {
  return {
    mount(selector) {
      const container = document.querySelector(selector)

      let isMounted = false
      let oldVnode = null

      watchEffect(function () {
        if (!isMounted) {
          oldVnode = rootComponent.render()
          // 渲染器中的mount函数
          mount(oldVnode, container)
          isMounted = true
        } else {
          const newVnode = rootComponent.render()
          patch(oldVnode, newVnode)
          oldVnode = newVnode
        }
      })
    }
  }
}