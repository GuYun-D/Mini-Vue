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

const patch = (n1, n2) => {
  // 判断两个是不是同一个节点
  if (n1.tag !== n2.tag) {
    // 说明两个元素不是同一个节点，直接删除旧的，添加新的
    // 获取父元素
    const n1ElParent = n1.el.parentElement
    // 删除旧的
    n1ElParent.removeChild(n1.el)
    // 添加新的
    mount(n2, n1ElParent)
  } else {
    // 1取出element对象
    const el = n2.el = n1.el
    // 2.处理props
    const oldProps = n1.props || {}
    const newProps = n2.props || {}
    // 获取到所有的newProps添加到el
    for (const key in newProps) {
      const oldValue = oldProps[key]
      const newValue = newProps[key]
      if (newValue !== oldValue) {
        // 事件监听的判断
        if (key.startsWith("on")) {
          el.addEventListener(key.slice(2).toLowerCase(), value)
        } else {
          // 属性添加
          el.setAttribute(key, newValue)
        }
      }
    }
    // 删除旧的props
    for (const key in oldProps) {
      if (!(key in newProps)) {
        // 事件监听的判断
        if (key.startsWith("on")) {
          el.removeEventListener(key.slice(2).toLowerCase(), value)
        } else {
          // 属性添加
          el.removeAttribute(key, newValue)
        }
      }
    }

    // 3.处理children
    const oldChildren = n1.children || []
    const newChildren = n2.children || []

    // 如果变成了一个字符串直接替换
    if (typeof newChildren === "string") {
      if (typeof oldChildren === "string") {
        if (newChildren != oldChildren) {
          el.textContent = newChildren
        }
      } else {
        el.innerHTML = newChildren
      }
    } else { // 如果是一个数组
      if (typeof oldChildren === "string") {
        // 清空
        el.innerHTML = ''

        newChildren.forEach(item => {
          mount(item, el)
        })
      } else {
        // 新旧都是数组时

        // 获取数组长度小的
        const commenLength = Math.min(oldChildren.length, newChildren.length)

        // 前面有相同节点的元素进行patch操作
        for (let i = 0; i < commenLength; i++) {
          patch(oldChildren[i], newChildren[i])
        }

        // 如果新节点的长度大于老节点，说明是添加操作
        if (newChildren.length > oldChildren.length) {
          newChildren.slice(oldChildren.length).forEach(item => {
            mount(item, el)
          })
        }

        // 如果老节点的长度大于新节点
        if (newChildren.length < oldChildren.length) {
          oldChildren.slice(newChildren.length).forEach(item => {
            el.removeChild(item.el)
          })
        }
      }

    }
  }
}