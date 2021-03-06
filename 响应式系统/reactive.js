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
 * proxy的优势p
 */
function reactive(raw) {
  return new Proxy(raw, {
    // target就是raw
    get(target, key) {
      const dep = getDep(target, key)
      dep.depend()
      return target[key]
    },

    set(target, key, newValue) {
      const dep = getDep(target, key)
      target[key] = newValue
      dep.notify()
    },

    // has(){
    //   // in操作符的捕获器
    // },

    // deleteProperty(){
    //   // delete操作符的捕捉器
    // }
  })
}
const proxy = reactive({ name: "张三" })
console.log(proxy);
proxy.name = "李四"


// 测试代码
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

// info.counter++
info.name = "二狗子"