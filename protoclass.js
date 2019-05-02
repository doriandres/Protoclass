var proto = {};
proto.interface = function(){
    var definitionFunction;
    var implementations = [];
    if(arguments.length === 1){
        definitionFunction = arguments[0];
    }
    else if(arguments.length === 2){
        implementations = arguments[1]
        definitionFunction = arguments[1];
    }
    var interfaceSelf = {};
    interfaceSelf.protointerface = {};
    interfaceSelf.define = function(type, name){
        if(!(type instanceof Function)){
            throw new TypeError();
        }
        if(!name){
            throw new Error("Missing name");
        }
        interfaceSelf.protointerface[name] = type;
    }
    definitionFunction(interfaceSelf);

    if(implementations){
        for(var i = 0; i <  implementations.length; implementations++){
            implementations[0].assert(interfaceSelf.protointerface);
        }
    }

    interfaceSelf.assert = function(protoX){
        var protoClassProps  = Object.keys(protoX);
        var interfaceProps = Object.keys(interfaceSelf.protointerface);
        if(protoClassProps.length < interfaceProps.length){
            throw new Error("Missing defintions");
        }
        for(var i = 0; i < interfaceProps.length; interfaceProps++){
            var index = protoClassProps.indexOf(interfaceProps[i]);
            if (index === -1){
                throw new Error("Missing defintions");
            }
            if(protoX[protoClassProps[index]] !== interfaceSelf.protointerface[interfaceProps[i]]){
                throw new TypeError();
            }
        }
    }

    return interfaceSelf;
}
proto.class = function (){
    var definitionFunction;
    var baseClass;
    var implementations = [];
    if(arguments.length === 1){
        definitionFunction = arguments[0];
    }
    else if(arguments.length === 2){        
        if(Array.isArray(arguments[0])){
            implementations = arguments[0];
        }else{
            baseClass = arguments[0];
        }
        definitionFunction = arguments[1];
    }
    else if(arguments.length === 3){
        baseClass = arguments[0];
        implementations = arguments[1]
        definitionFunction = arguments[2];
    }
    var classConstructor;
    var classSelf = function(){
        if(classConstructor instanceof Function){
            args =  [];
            var calledBase = false;
            if(baseClass instanceof Function){
                var base  = function(){
                    calledBase = true;
                    baseClass.apply(this, arguments); 
                };
                base = base.bind(this);
                args.push(base);
            }            
            for(var ai = args.length; ai < arguments.length; ai++){
                args[ai] = arguments[ai];
            }      
            classConstructor.apply(this, args);
            if(baseClass instanceof Function && !calledBase){
                throw new Error("Must call base constructor");
            }
        }
    }
    classSelf.protoclass = {};
    if(baseClass){
        classSelf.prototype = Object.create(baseClass.prototype, {constructor:{value:classSelf}});
        classSelf.protoclass = Object.assign(classSelf.protoclass, baseClass.protoclass);
    }
    classSelf.define = function(type, name, value){
        if(!(type instanceof Function)){
            throw new TypeError();
        }
        if(!name){
            throw new Error("Missing name");
        }
        if(value instanceof type || value === undefined || value === null){
            classSelf.protoclass[name] = type;
            this["__"+name] = value;
            Object.defineProperty(classSelf.prototype, name, {
                set : function(value){
                    if(value === null || value === undefined){
                        this["__"+name] = value;
                    }else{
                        if(value instanceof type || value.constructor === type){
                            this["__"+name] = value;
                        }else{
                            throw new TypeError()
                        }
                    }                    
                },
                get : function(){
                    return this["__"+name];
                }
            })
        }else{
            throw new TypeError();
        }
    };
    
    classSelf.constructor = function(constructor){
        if(constructor instanceof Function){
            classConstructor = constructor;
        }else{
            throw new TypeError();
        }
    };

    definitionFunction(classSelf);

    if(implementations){
        for(var i = 0; i <  implementations.length; implementations++){
            implementations[0].assert(classSelf.protoclass);
        }
    }

    return classSelf;
}