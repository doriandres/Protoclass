/**
 * @interface
 */
var IUser = proto.interface(function(proto){
    proto.define(String, "email");
    proto.define(String, "password");
});
/**
 * @interface
 */
var IPerson = proto.interface(function(proto){
    proto.define(String, "id");
    proto.define(String, "name");
});

/**
 * @class
 */
var User = proto.class([IUser], function(proto){   
    proto.define(String,"email");
    proto.define(String, "password");
    proto.constructor(function(email, password){
        this.email = email;
        this.password = password;
    });
});

/**
 * @class
 */
var Employee = proto.class(User, [IUser, IPerson], function(proto){
    proto.define(String, "id");
    proto.define(String, "name");
    proto.constructor(function(base, email, password, name, department){
        base(email, password);
        this.id = Date.now().toString();
        this.name = name;        
        this.department = department;
    });
    proto.define(Function, "sayHello", function(){
        console.log("Hello my name is "+this.name);
    });
});

var user = new User("doro@gmail.com", "123");
var employee = new Employee("e@c.com", "abc", "Name", "Dep");