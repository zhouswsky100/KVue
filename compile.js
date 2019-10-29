class  Compile {
    constructor(el,vm){

        this.$el = document.querySelector(el);
        this.$vm = vm ;

        if(this.$el){
            this.$fragment  =  this.node2Frament(this.$el)
            this.complie(this.$fragment)
            this.$el.appendChild(this.$fragment)
        }

    }
    node2Frament(el){
                               
        const frag = document.createDocumentFragment();
        let child;
        while(child =el.firstChild){
            frag.appendChild(child)
        }
        return frag

    }
    complie(el){
        const  childNodes = el.childNodes;
        Array.from(childNodes).forEach(node =>{
            if(this.isElement(node)){
                //元素
                const nodeAttrs = node.attributes;
                if(nodeAttrs>0){
                    Array.form(nodeAttrs).forEach(attr=>{
                        const attrName = attr.name
                        const exp = attr.value;
                        if(this.isDirective(attrName)){
                            attrName.substring(2);
                            this[dir]&&this[dir](node,this.$vm,exp)
                        }
                        if(this.isEvent(attrName)){
                            const dir  = attrName.substring(1);
                            this.eventHandler(node,this.$vm,exp,dir)
                        }
                    })
                }
           
            }else if(this.isInterpolation(node)){
                //文本
                this.complieText(node)
                
            }
            if(node.childNodes && node.childNodes.length>0){
                this.complie(node)
            }
        })
    }
    update(node,vm,exp,dir){
        const update = this[dir+'Updater']
        //初始化
        update && update(node,vm[exp]);
        //依赖收集
        new Watcher(vm,exp,function(value){
            update && update(node,value);

        })
    }
    textUpdater(node,value){
        node.textContent = value
    }
    complieText(node){
        // node.textContent = this.$vm.$data[RegExp.$1];
        this.update(node,this.$vm,RegExp.$1,"text")
    }
    isElement(node){
        return node.nodeType === 1 ; 
    }
    isInterpolation(node){
        return node.nodeType === 3  && /\{\{(.*)\}\}/.test(node.textContent)
     }
    isDirective(attr){
        return attr.indexOf('k-') == 0
    }
    isEvent(attr){
        return attr.indexOf('@') == 0
    }
    eventHandler(node,vm,exp,dir){
        let fn = vm.$options.methods && vm.$options.methods[exp];
        
    }
    model(node,vm,exp){
        //指定input的value
        this.update(node,vm,exp,"model");

        node.addEventlistenr("input",e=>{
            vm[exp] = e.target.value;
        });

    }
    modelUpadter(){
        node.value  = value;
    }
    html(node,vm,exp){
        this.update(node,vm,exp,"html");

    }
    htmlUpdater(node,value){
        node.innerHTML = value;
    }

}