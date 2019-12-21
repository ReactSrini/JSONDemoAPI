var express        =         require("express");
var bodyParser     =         require("body-parser");
var app            =         express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(3000,function(){
  console.log('listening...')
});


app.post('/parsing',function(req,res)
{

  
  var question=req.body.question;
  console.log("question : " + question);
  var splitArray = question.split('||')
  
  //console.log("API Object Context : " + req.body.apiObj)
  var data;
  if(splitArray.length>0)
  {
      data=[ {module  :splitArray[0],
      question : splitArray[1],
      response : 'pass'
    }];
  }
  else
  {
    data=[ {module  :splitArray[0],
      question : splitArray[1],
      response : 'pass'
    }];
  }
   //res.end("yes");
  res.json({data});
});
