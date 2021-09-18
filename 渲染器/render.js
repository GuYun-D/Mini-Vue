const h = (tag, props, children) => {

  // vnode就是一个对象
  return {
    tag,
    props,
    children
  }
}

const mount = (vnode, container) => {
  /**
   * 1.根据虚拟节点创建出真实的dom，并在虚拟节点上保留一份真实DOM
   */
  const el = vnode.el = document.createElement(vnode.tag)

  /**
   * 2.处理props
   */
  if (vnode.props) {
    for (const key in vnode.props) {
      const value = vnode.props[key]

      // 事件监听的判断
      if (key.startsWith("on")) {
        el.addEventListener(key.slice(2).toLowerCase(), value)
      } else {
        // 属性添加
        el.setAttribute(key, value)
      }


    }
  }

  /**
   * 4.处理children
   * 数组和字符串的形式，其他的不管了
   */
  if (vnode.children) {
    if (typeof vnode.children === "string") {
      el.textContent = vnode.children
    } else {
      vnode.children.forEach(item => {
        mount(item, el)
      })
    }
  }

  /**
   * 将el挂载到container上面
   */
  container.appendChild(el)
}