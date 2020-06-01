const service = require("./service");

const defaultAnswer = function(err,data,message){
  if (err) return err;
  return{
    success: 1,
    message: message?message:"Success",
    data: data
  }
}

const resObj = function(state,message,data){
  return{
   success: state,
   message: message,
   data: data
  }
 }

var add = (req,res) => {
  var adding = req.body;
  adding.login = res.locals.user.login;
  adding.dateadd = Date.now();

  service.add(adding, (err,result)=>{
    return res.json(defaultAnswer(err,result));
  });
};

var update = (req,res)=>{
  var cart = req.body;
  cart.login = res.locals.user.login;
  
  service.update(req.params.id,cart,(err,result)=>{
    return res.json(defaultAnswer(err,result));
  })
  
};

var del = (req,res)=>{
  service.delete(req.params.id,res.locals.user.login,(err,result)=>{      
    return res.json(defaultAnswer(err,result));
  });
}

var get = (req,res)=>{      
  const id = req.params.id;
  
  service.get(id,(err,result)=>{
    let resJson;

    if (err) 
      resJson = resObj(2,"SQL Trouble",err);
    else if (!result) 
      resJson = resObj(0,"Don't exists",null);
    else 
      resJson = resObj(1,"exists",result);
    
    return res.json(resJson);
  });
};

var getAll = (req,res)=>{
  console.log('here');
  console.log('here',res.locals.user);

  if (res.locals.user){
    service.getAll(res.locals.user.login,(err,results)=>{
      let resJson;
      if (err)
        resJson = resObj(2,"SQL Trouble",err);
      else if (!results)
        resJson = resObj(0,"Not Found",null);
      else 
        resJson = resObj(1,"Все заказы пользователя",results);

      return res.json(resJson);
    });
  }else{return res.json(resObj(0,"Вы не авторизованы"))};
  
};

module.exports = {
  add: add, 
  update: update, 
  delete: del, 
  get: get,
  getAll: getAll
};