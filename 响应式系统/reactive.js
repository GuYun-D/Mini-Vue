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

  motify() {
    this.subscriber.forEach(effect => {
      effect()
    })
  }
}

const dep = new Dep()

let activeEffect = null
function watchEffect(effect) {
  activeEffect = effect;
  dep.depend()
  effect()
  activeEffect = null
}

const info = {
  counter: 100
}

watchEffect(function doubleCounter() {
  console.log(info.counter * 2);
})

watchEffect(function powerCounter() {
  console.log(info.counter + info.counter);
})

info.counter++
dep.motify()