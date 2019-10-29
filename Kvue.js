class kVue {
    constructor(options){

        this.$options = options;
        this.$data = options.data;
        this.observe(this.$data);

        // new Watcher();
        // this.$data.test;
        new Compile(options.el,this) ;
        if(options.created){
            options.created.call(this);
        }
    }
    observe(value){
        if(!value || typeof value !=='object'){
            return;
        }
        Object.keys(value).forEach(key => {
            this.defineReactive(value,key,value[key])
            //为了代理data中属性到vue实例中
            this.proxyData(key)

        })
    }
    proxyData(key){
            Object.defineProperty(this,key,{
                get(val){
                    return this.$data[key];
                },
                set(newVal){
                    this.$data[key] = newVal;
                }
            })
    }
    defineReactive(obj,key,val){
    
            this.observe(val) //解决数据嵌套对象问题

            const dep = new Dep();

            Object.defineProperty(obj,key,{
                get(){
                    Dep.target && dep.addDep(Dep.target)
                    return val;
                },
                set(newVal){
                    if(newVal===val){
                        return
                    }
                    val = newVal;
                    dep.notify();
                    console.log(`${key}更新了：${val}`)
                }

            })

    }
}

//依赖收集 管理watcher

class Dep {
    constructor(){
        //存放依赖
        this.deps = [];
    }

    addDep(dep){
        this.deps.push(dep)
    }

    notify(){
        this.deps.forEach(dep=> dep.update(),{

        })
    }

}

class Watcher {
    constructor(vm,key,cb){
        this.key = key;
        this.vm = vm;
        this.cb = cb;
        Dep.target = this ;
        this.vm[this.key];  
        Dep.target = null;
    }

    update(){
        console.log("开始更新了")
        this.cb.call(this.vm,this.vm[this.key])
    }

}