class Dep {
  constructor() {
    // 订阅者
    this.subscriber = new Set()
  }

  // 收集依赖
  addEfect(effect) {
    this.subscriber.add(effect)
  }

  motify() {
    this.subscriber.forEach(effect => {
      effect()
    })
  }
}


const dep = new Dep()

const info = {
  counter: 100
}

function doubleCounter() {
  console.log(info.counter * 2);
}

function powerCounter() {
  console.log(info.counter + info.counter);
}

dep.addEfect(doubleCounter)
dep.addEfect(powerCounter)

doubleCounter()

dep.motify()