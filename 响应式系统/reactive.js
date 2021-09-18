class Dep {
  constructor() {
    // 订阅者
    this.subscriber = new Set()
  }

  depend() {
    if (activeEffect) {
      this.subscriber.add(activeEffect)
    }
  }

  notify() {
    this.subscriber.forEach(effect => {
      effect()
    })
  }
}

const dep = new Dep()

let activeEffect = null
function watchEffect(effect) {
  activeEffect = effect;
  effect()
  activeEffect = null
}

const targetMap = new WeakMap()
function getDep(target, key) {
  // 1.取出对应的Map对象
  let depMap = targetMap.get(target)
  if (!depMap) {
    depMap = new Map()
    targetMap.set(target, depMap)
  }

  // 2.取出具体的dep对象
  let dep = depMap.get(key)
  if (!dep) {
    dep = new Dep()
    depMap.set(key, dep)
  }
  return dep;
}

/**
 * vue2的数据劫持
 */
function reactive(raw) {
  Object.keys(raw).forEach(key => {
    const dep = getDep(raw, key)
    let value = raw[key]

    Object.defineProperty(raw, key, {
      get() {
        dep.depend()
        return value
      },

      set(newValue) {
        if (value !== newValue) {
          value = newValue
          dep.notify()
        }
      }
    })
  })

  return raw
}


const info = reactive({
  counter: 100,
  name: "哈哈哈"
})

const foo = reactive({
  height: "1px"
})

watchEffect(function doubleCounter() {
  console.log(info.counter * 2, info.name);
})

watchEffect(function powerCounter() {
  console.log(info.counter + info.counter);
})

info.counter++
info.name = "二狗子"