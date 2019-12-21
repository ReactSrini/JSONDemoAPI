var fs = require ('fs');
var config = require ('./Config.json');
var axios=require('axios');
var bluebird=require('bluebird');
//Reading input file info from Config
var inputFolder = config.inputFolder;
var moduleName,sectionName,cardName,outputString = "";
var questionArray=[];
var fileNameArray=[];
var fileNameGlobal;
var promise1,promise2,promise3;

 promise1 =  new Promise((resolve,reject)=>
{
   fs.readdir(inputFolder,(err,files)=>
   {
    
   resolve(files);
   reject(err);
   })
    
} )
.then(value=>{
    fileNameArray=value;
    fileNameArray.map((fileName,i)=>
    {      
       
           promise2 =  new Promise((resolve,reject)=>
            {
                 fs.readFile(inputFolder+"/"+fileName,'utf8',(err,data)=>
                    {
                     resolve(data);
                     reject(err);
                    })
             } )
             .then(value=>
             {
                promise3 =  new Promise((resolve,reject)=>
                {
                    var jsonData="";
                    jsonData= JSON.parse(value);
                    fileNameGlobal=fileName;
                    extractJSON(jsonData,"",fileNameGlobal); //to loop through and get questions
                    if(fileNameArray.length-1==i)   resolve(questionArray)
                })
                .then(data=>{
                    callAPI(data) // data is question array
                })
                .catch(err=>{
                    console.log(err);
                })
                             
             })
             .catch(err=>{
                 console.log(err);
             })
      
    })


})
.catch(err=>{
    console.log(err);
})

//Parsing logic
function extractJSON(obj,objectPath,fileName=fileNameGlobal)
{
    var identifier;
    for(const i in obj)
    {
        identifier=i;
        if(Array.isArray(obj[i]) || typeof obj[i]==='object') // header
        {
            //>sections>>0>>cards>>0>>items>>0>question : key metrics and deltas
            //to remove numeric values from object name  to make test cases  (just display data will be modified,original data will never be afftected)
            if(isFinite(identifier)===true) 
             {
                extractJSON(obj[i],objectPath); 
             }
            else
             {
                extractJSON(obj[i],objectPath + '>' + i + '>');    
             }  
        }
        else
        {
            switch(objectPath + i)
            {
                case '>sections>name' :
                    sectionName = obj[i];
                    break;
                case '>sections>>cards>name' :
                    cardName=obj[i];
                    break;
                case '>sections>>cards>>items>question' :
                // questions list for API request
                   questionArray.push(fileName+'||' + obj[i])
                    sectionName=cardName="";
                    break;
                    case 'name': //module name,  this case will become true only once
                    moduleName=obj[i];
                    
            }
        
        }
    
}

}
    function callAPI(data)
    {
        var context=new Object()   //empty object to pass to API
        bluebird.map(data,
            function(que){
            return  axios.post('http://localhost:3000/parsing', {
               question: que, 
               apiObj  :context          
              }).then(res=>res.data.data)
            })
            .then(function(res)
            {            
              console.log(res);             
            })
            .catch(err=>{
                console.log(err);
            })
       
    }