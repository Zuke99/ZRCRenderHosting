const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql');
const server=express()
server.use(bodyParser.json());
const cors=require('cors')
const path=require('path')
server.use(cors({ origin: '*' }))
const multer=require('multer')
const bodyparser=require('body-parser')
server.use(bodyparser.urlencoded({extended:false}))
server.use('/uploads',express.static('uploads'))
const moment=require('moment-timezone')
const dotenv=require('dotenv')
server.use(express.static(__dirname))
const cloudinary=require('cloudinary')

server.use(express.static(path.join(__dirname,'dist')))

const db = mysql.createConnection({
  host     : 'sql12.freemysqlhosting.net',
  user     : 'sql12628553',
  password : 'zLJ6cKrMxy',
  database : 'sql12628553',
});



// const db = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'password',
//   database : 'sql12628553',
//   port:3307
// });


const options = {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
};


db.connect(function (error){
  if(error){
    console.log(error);
  }
  else{
    console.log("db conected");
  }
});

server.listen(8085,function check(error) {
  if (error)
  {
  console.log("Error....dddd!!!!");
  }

  else
  {
      console.log("Started....!!!! ",8085);

  }
});



cloudinary.config({ 
  cloud_name: 'dqnegca6p', 
  api_key: '795363611355394', 
  api_secret: 'ToXMzxQmx9RLDXuWoyS6HwbLo_s' 
});

dotenv.config({
  path:"./data/config.env",
})

//file Handling
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '/uploads/'))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

var upload = multer({ storage: storage }).single('file');

  

// //upload File
// server.post('/api/zrc/file',(req,res)=>{
//   upload(req,res,(err)=>{
//     if(err){
//       console.log(err)
//     }

//   })
// })
//get Tracking Details
server.get("/api/zrc/simple",(req,res)=>{
  console.log("SIMPLE CALLED")
  res.send({status : true , message : " SIMPLE API"})
})

server.get("/",(req,res)=>{
  console.log("API WORKING")
  res.send({status:true , message: "API WORKING"})
})

//add to IndentTable
server.post("/api/zrc/addindent",(req,res)=>{
  console.log("ADD Indent Table Called")

  console.log("from angular"+req.body.last_indent_date+" type of "+typeof(req.body.last_indent_date))
  new_date=new Date(req.body.last_indent_date)

  const datetime1 = req.body.zrc_valid_from;
  // Create a new Date object from the datetime string
  const dateObj1 = new Date(datetime1);
  // Get the individual components of the date
  const year1 = dateObj1.getFullYear();
  const month1 = dateObj1.getMonth() + 1; // Months are zero-based, so add 1
  const day1 = dateObj1.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime1 = `${year1}-${month1.toString().padStart(2, "0")}-${day1.toString().padStart(2, "0")} 00:00:00`;






  const datetime2 = req.body.zrc_valid_upto;
  // Create a new Date object from the datetime string
  const dateObj2 = new Date(datetime2);
  // Get the individual components of the date
  const year2 = dateObj2.getFullYear();
  const month2 = dateObj2.getMonth() + 1; // Months are zero-based, so add 1
  const day2 = dateObj2.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime2 = `${year2}-${month2.toString().padStart(2, "0")}-${day2.toString().padStart(2, "0")} 00:00:00`;





  const datetime3 = req.body.qty_indented_supl_date;
  // Create a new Date object from the datetime string
  const dateObj3 = new Date(datetime3);
  // Get the individual components of the date
  const year3 = dateObj3.getFullYear();
  const month3 = dateObj3.getMonth() + 1; // Months are zero-based, so add 1
  const day3 = dateObj3.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime3 = `${year3}-${month3.toString().padStart(2, "0")}-${day3.toString().padStart(2, "0")} 00:00:00`;





  const datetime4 = req.body.qty_recd_supl_date;
  // Create a new Date object from the datetime string
  const dateObj4 = new Date(datetime4);
  // Get the individual components of the date
  const year4 = dateObj4.getFullYear();
  const month4 = dateObj4.getMonth() + 1; // Months are zero-based, so add 1
  const day4 = dateObj4.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime4 = `${year4}-${month4.toString().padStart(2, "0")}-${day4.toString().padStart(2, "0")} 00:00:00`;






  const datetime5 = req.body.last_indent_date;
  // Create a new Date object from the datetime string
  const dateObj5 = new Date(datetime5);
  // Get the individual components of the date
  const year5 = dateObj5.getFullYear();
  const month5 = dateObj5.getMonth() + 1; // Months are zero-based, so add 1
  const day5 = dateObj5.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime5 = `${year5}-${month5.toString().padStart(2, "0")}-${day5.toString().padStart(2, "0")} 00:00:00`;





  const datetime6 = req.body.date_of_indent;
  // Create a new Date object from the datetime string
  const dateObj6 = new Date(datetime6);
  // Get the individual components of the date
  const year6 = dateObj6.getFullYear();
  const month6 = dateObj6.getMonth() + 1; // Months are zero-based, so add 1
  const day6 = dateObj6.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime6 = `${year6}-${month6.toString().padStart(2, "0")}-${day6.toString().padStart(2, "0")} 00:00:00`;





    // const isoDate1=new Date(req.body.zrc_valid_from)
    // const mySQLDateString1=isoDate1.toJSON().slice(0,19).replace('T',' ');

    // const isoDate2=new Date(req.body.zrc_valid_upto)
    // const mySQLDateString2=isoDate2.toJSON().slice(0,19).replace('T',' ');

    // const isoDate3=new Date(req.body.qty_indented_supl_date)
    // const mySQLDateString3=isoDate3.toJSON().slice(0,19).replace('T',' ');

    // const isoDate4=new Date(req.body.qty_recd_supl_date)
    // const mySQLDateString4=isoDate4.toJSON().slice(0,19).replace('T',' ');

    // const isoDate5=new Date(req.body.last_indent_date)
    // const mySQLDateString5=isoDate5.toJSON().slice(0,19).replace('T',' ');

    // const isoDate6=new Date(req.body.date_of_indent)
    // const mySQLDateString6=isoDate6.toJSON().slice(0,19).replace('T',' ');
    

    console.log("after conversion",mysqlDateTime5)

  let details={
    ph_number:req.body.ph_number,
    product_name:req.body.product_name,
    balance_available:req.body.balance_available,
    qty_required:req.body.qty_required,
    zrc_number:req.body.zrc_number,
    zrc_valid_from:mysqlDateTime1,
    zrc_valid_upto:mysqlDateTime2,
    indent_ami:req.body.indent_ami,
    qty_annual_indent:req.body.qty_annual_indent,
    qty_pcmd:req.body.qty_pcmd,
    qty_indented:req.body.qty_indented,
    qty_recd:req.body.qty_recd,
    qty_indented_supl:req.body.qty_indented_supl,
    qty_recd_supl:req.body.qty_recd_supl,
    qty_indented_supl_date:mysqlDateTime3,
    qty_recd_supl_date:mysqlDateTime4,
    balance_hand:req.body.balance_hand,
    fresh_stock_date:req.body.fresh_stock_date,
    remarks:req.body.remarks,
    last_indent_date:mysqlDateTime5,
    qty_last_indent:req.body.qty_last_indent,
    zrc_serial:req.body.zrc_serial,
    date_of_indent:mysqlDateTime6,
    zrc_fy:req.body.zrc_fy,
    indents_sl:req.body.indents_sl,
    extra_remarks:req.body.extra_remarks
  }
  let sql;
  if(new_date.getYear()+1900 < 1100){
    console.log("empty date" )

    console.log("new Date",new_date)
    new_date=null
   
   details={
    ph_number:req.body.ph_number,
    product_name:req.body.product_name,
    balance_available:req.body.balance_available,
    qty_required:req.body.qty_required,
    zrc_number:req.body.zrc_number,
    zrc_valid_from:mysqlDateTime1,
    zrc_valid_upto:mysqlDateTime2,
    indent_ami:req.body.indent_ami,
    qty_annual_indent:req.body.qty_annual_indent,
    qty_pcmd:req.body.qty_pcmd,
    qty_indented:req.body.qty_indented,
    qty_recd:req.body.qty_recd,
    qty_indented_supl:req.body.qty_indented_supl,
    qty_recd_supl:req.body.qty_recd_supl,
    qty_indented_supl_date:mysqlDateTime3,
    qty_recd_supl_date:mysqlDateTime4,
    balance_hand:req.body.balance_hand,
    fresh_stock_date:req.body.fresh_stock_date,
    remarks:req.body.remarks,
    last_indent_date:new_date,
    qty_last_indent:req.body.qty_last_indent,
    zrc_serial:req.body.zrc_serial,
    date_of_indent:mysqlDateTime6,
    zrc_fy:req.body.zrc_fy,
    indents_sl:req.body.indents_sl
   }
    
   console.log("null valid date by sql",new_date)
   sql="INSERT INTO indents SET ?"
  }else {
   sql="INSERT INTO indents SET ?";
  }
  db.query(sql,details,(error)=>{
    if (error) {
      res.send({ status: false, message: "Indent Table Failed" + error});
    } else {
      res.send({ status: true, message: "Indent created successfully" });
    }
  })
})

//Create the Records
server.post("/api/zrc/add", (req, res) => {
  console.log("ZRC ADD Called")

  upload(req,res,(err)=>{
    if(err){
      console.log(err)
    }


    cloudinary.v2.uploader.upload(req.file.filename ,
  { public_id: "olympic_flag" }, 
  function(error, result) {console.log("cloudinary result "+result); });


    let newPhNumber=req.body.ph_number;
    let newQty=req.body.qty;

    //converting string to suitable SQL Date Format
    console.log("from angular ",req.body.zrc_date)
    console.log("from angular ",req.body.zrc_valid_from)
    console.log("from angular ",req.body.zrc_valid_upto)

    const dateParts1 = req.body.zrc_date.split('/');
    const formattedDate1 = `${dateParts1[2]}-${dateParts1[1]}-${dateParts1[0]}`;
    const isoDate1=new Date(formattedDate1)
    //isoDate1.setDate(isoDate1.getDate() + 2);
  
    const dateParts2 = req.body.zrc_valid_from.split('/');
    const formattedDate2 = `${dateParts2[2]}-${dateParts2[1]}-${dateParts2[0]}`;
    const isoDate2=new Date(formattedDate2)
    //isoDate2.setDate(isoDate2.getDate() + 2);

    const dateParts3 = req.body.zrc_valid_upto.split('/');
    const formattedDate3 = `${dateParts3[2]}-${dateParts3[1]}-${dateParts3[0]}`;
    const isoDate3=new Date(formattedDate3)
    //isoDate2.setDate(isoDate2.getDate() + 2);


    console.log("date after conversion", isoDate1)
    console.log("date after conversion", isoDate2)
    console.log("date after conversion", isoDate3)   
    

    console.log(req.body.product_name)
    let details = {
      zrc_fy: req.body.zrc_fy,
      product_name: req.body.product_name,
      ph_number:newPhNumber,
      supplier_name: req.body.supplier_name,
      zrc_number: req.body.zrc_number,
      zrc_date: isoDate1,
      qty: newQty,
      zrc_valid_from: isoDate2,
      zrc_valid_upto: isoDate3,
      file: req.file.filename,
      Balance:req.body.qty,
      drive_file:req.body.drive_file
    };
    values=details
    let sql = "INSERT INTO zrc_table SET ?";
    db.query(sql, values, (error) => {
      if (error) {
        res.send({ status: false, message: "ZRC creation Failed" + error});
      } else {
        res.send({ status: true, message: "ZRC created successfully" });
      }
    });

  })


  
});
//GET TRACK OF LAST INDENT SERIAL
server.get("/api/zrc/tracker/indentsl",(req,res)=>{
  console.log("last indent serial function called")
  let sql=`SELECT last_indent_sl FROM tracker WHERE pk=1;`
    db.query(sql,(error,result)=>{
      if(error){
        console.log("Error getting last indent sl data ",error)
      } else {
        res.send({status : true , data : result})
      }
    })
})


//GET TRACK OF LAST UPDATED YEAR
server.get("/api/zrc/tracker/lastyearchange",(req,res)=>{
  console.log("Last Year change get called")
  sql=`SELECT last_year_change FROM tracker WHERE pk=1;`
  db.query(sql,(error,result)=>{
    if(error){
      console.log("Error getting last year change data", error)
    } else {
      res.send({status : true, data : result})
    }
  })
})

//UPDATE THE LAST SERIAL FOR INDENTS
server.put("/api/zrc/tracker/updatelastsl",(req,res)=>{
  console.log("Update last serial of indents called")
  let value=req.body.last_indent_sl;
  let pk=1;
  let sql="UPDATE tracker SET last_indent_sl="+value+" WHERE pk="+pk;
  db.query(sql,(error, result)=>{
    if(error){
      res.send({status : false, message : "Error updating last serial for Indent Sl",error})
    } else {
      res.send({status : true, message : "Update Indent Serial Successful"})
    }
  })

})

//UPDATE LAST YEAR UPDATE
server.put("/api/zrc/tracker/lastyearchange",(req,res)=>{


  console.log("Last Year change update method called")
  const datetime1 = req.body.last_year_change;
  // Create a new Date object from the datetime string
  const dateObj1 = new Date(datetime1);
  // Get the individual components of the date
  const year1 = dateObj1.getFullYear();
  const month1 = dateObj1.getMonth() + 1; // Months are zero-based, so add 1
  const day1 = dateObj1.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime1 = `${year1}-${month1.toString().padStart(2, "0")}-${day1.toString().padStart(2, "0")} 00:00:00`;





  const pk=1;
  let sql="UPDATE tracker SET last_year_change='"+mysqlDateTime1+"' WHERE pk="+pk;
  // let sql=`UPDATE tracker SET last_year_change = ${mySQLDateString} WHERE pk=1;`
  db.query(sql,(error, result)=>{
    if(error){
      console.log({status : false, message : "Error updating last year change",error})
    } else {
      console.log({status : true, message : "Update Last Year change Successful"})
    }
  })
})

//Get ALL Indents
server.get("/api/zrc/getallindents",(req,res)=>{
  console.log("get all indents called")
var sql="SELECT * FROM indents";
db.query(sql,function(error,result){
  if(error){
    console.log("Error Getting All Indent Details from DB",error);
  }else{
    res.send({status:true, data: result})
  }
})
})

//GET ALL DATA
server.get("/api/zrc", (req, res) => {
  console.log("Get all ZRC s called")
  var sql = "SELECT * FROM zrc_table";
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB(GET ALL DATA)",error);
    } else {
      res.send({ status: true, data: result });
    }
  });
});

//GET BY SERIAL
server.get("/api/zrc/getindentserial/:indent_serial",(req,res)=>{
  console.log("Get Indent By serial Called")
var indent_serial=req.params.indent_serial;
var sql="SELECT * FROM indents WHERE serial="+indent_serial;
db.query(sql,function(error,result){
  if(error){
    console.log("error getting indent by serial",error);
  }
  else{
    res.send({status:true, data:result})
  }
})
})


//GET BY PH NUMBER
server.get("/api/zrc/:ph_number", (req, res) => {
  console.log("Get By PH NUMber Called")
  var ph_number = req.params.ph_number;
  console.log("phnumber...."+ph_number)
  var sql = "SELECT * FROM zrc_table z WHERE z.ph_number=" + ph_number;
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB(Get by ph number)",error);
    } else {
      res.send({ status: true, data: result });
    }
  });
});

//GET BY PRODUCT NAME
server.get("/api/zrc/product/:product_name", (req, res) => {
   const decodedParameter = decodeURIComponent(req.params.product_name);

  console.log("Get By product Name called", decodedParameter)
  var product_name = decodedParameter;
  var sql = "SELECT * FROM zrc_table WHERE product_name='" + product_name+"'";
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB(GET BY PRODUCT NAME)",error);
    } else {
      res.send({ status: true, data: result });
    }
  });
});


//downloadFile

server.get('/api/zrc/download/:name',function(req,res,next){
  console.log("API WORKING Download FILE CALLED")
  var fileName=req.params.name;
  console.log("Download File Name", fileName)
  var filePath=path.join(__dirname,'/uploads/',fileName)
  res.download(filePath,fileName,function(err){
    if(err){
      next("DOWNLOAD FILE ERROR",err)
     // return res.status(500).send("Failed to Download File")
    }
    else{
      console.log("success")
    }
  })
})



//Get All FileNames from DB
function searchAllFiles(str){
  console.log("first val"+str)
var sql="SELECT * FROM zrc_table WHERE file='"+str+"'";
db.query(sql,function(error,result){
  if(error){
    console.log("Error Connecting to db (GET ALL FILENAMES)"+error)
  }else{
    console.log("SEARCH"+result+" STR VAL= "+str);
  
  }
})
}




//updateFile
server.put("/api/zrc/updatefile/:serial",(req,res)=>{
  console.log("UPDATE FILE CALLED")
  upload(req,res,(err)=>{
    if(err){
      console.log(err)
    }
    let details={
      file:req.file.filename
    }
    values=details
    let sql="UPDATE zrc_table SET file='"+req.file.filename+"' WHERE serial="+req.params.serial;
    let a=db.query(sql,(error,result)=>{
      if(error){
        res.send({status:false,message:"UPDATE FILE ERROR"+error})
      } else {
        res.send({status:true,message:"File Update Success"})
      }
    })
  })
})


//Load Indent Data

server.get("/api/zrc/indent/:serial",(req,res)=>{
  console.log("API WORKING LOAD INDENT DATA CALLED")
  var serial=req.params.serial;
  console.log(req.params.serial)
  var sql="SELECT * FROM zrc_table WHERE serial="+serial;
  db.query(sql,function(error,result){
    if(error){
      console.log("Error Connecting to DB (Load Indent Data)" + error);
    } else {
      res.send({status:true, data:result})
    }
  });
});



//update ZRC Balance
server.put("/api/zrc/balanceUpdate/:serial",(req,res)=>{
  console.log("API WORKING UPDATING ZRC BALANCE")
  let sql="UPDATE zrc_table SET Balance='"+
  req.body.zrc_balance+
  "',qty_indented='"+
  req.body.qty_indented+
   "'WHERE serial="+req.params.serial;
  let a = db.query(sql, (error, result) => {
    if (error) {
      res.send({ status: false, message:"Update ZRC BALANCE error"+error });
    } else {
      res.send({ status: true, message: "ZRC Updated BALANCE successfully" });
    }
  });
})


//update
server.put("/api/zrc/update/:serial", (req, res) => {
  console.log("API UPdating by serial")


const datetime1 = req.body.zrc_date;
// Create a new Date object from the datetime string
const dateObj1 = new Date(datetime1);
// Get the individual components of the date
const year1 = dateObj1.getFullYear();
const month1 = dateObj1.getMonth() + 1; // Months are zero-based, so add 1
const day1 = dateObj1.getDate();
// Format the DateTime string in MySQL format
const mysqlDateTime1 = `${year1}-${month1.toString().padStart(2, "0")}-${day1.toString().padStart(2, "0")} 00:00:00`;



const datetime2 = req.body.zrc_valid_from;
// Create a new Date object from the datetime string
const dateObj2 = new Date(datetime2);
// Increase the date by 1 day

// Get the individual components of the date
const year2 = dateObj2.getFullYear();
const month2 = dateObj2.getMonth() + 1; // Months are zero-based, so add 1
const day2 = dateObj2.getDate();
// Format the DateTime string in MySQL format
const mysqlDateTime2= `${year2}-${month2.toString().padStart(2, "0")}-${day2.toString().padStart(2, "0")} 00:00:00`;






const datetime3 = req.body.zrc_valid_upto;
// Create a new Date object from the datetime string
const dateObj3 = new Date(datetime3);
// Increase the date by 1 day

// Get the individual components of the date
const year3 = dateObj3.getFullYear();
const month3 = dateObj3.getMonth() + 1; // Months are zero-based, so add 1
const day3 = dateObj3.getDate();
// Format the DateTime string in MySQL format
const mysqlDateTime3= `${year3}-${month3.toString().padStart(2, "0")}-${day3.toString().padStart(2, "0")} 00:00:00`;






  // const isoDate1 = new Date(req.body.zrc_date);
  // const mysqlDateTime1 = isoDate1.toISOString().slice(0, 19).replace('T', ' ');
  // console.log("date after conversion",mysqlDateTime1)

  // const isoDate2 = new Date(req.body.zrc_valid_from);
  // const mysqlDateTime2 = isoDate2.toISOString().slice(0, 19).replace('T', ' ');

  // const isoDate3 = new Date(req.body.zrc_valid_upto);
  // const mysqlDateTime3 = isoDate3.toISOString().slice(0, 19).replace('T', ' ');

  // console.log("date from angular", req.body.zrc_date); // 01/01/2023
  // const dateParts1 = req.body.zrc_date.split('/');
  // const formattedDate1 = `${dateParts1[2]}-${dateParts1[1]}-${dateParts1[0]}`;
  // const isoDate1 = new Date(formattedDate1);
  
  // // Adjust the time to match your desired time zone if necessary
  // isoDate1.setHours(0, 0, 0, 0);
  // const mysqlFormattedDate1 = isoDate1.toISOString().slice(0, 19).replace('T', ' ');
  
  // console.log("after conversion", mysqlFormattedDate1);



//   console.log("date from angular", req.body.zrc_date); // 01/01/2023
// const dateParts1 = req.body.zrc_date.split('/');
// const formattedDate1 = `${dateParts1[1]}/${dateParts1[0]}/${dateParts1[2]}`;
// const isoDate1 = new Date(formattedDate1);

// // Adjust the time to match the local timezone of the server
// isoDate1.setUTCHours(0, 0, 0, 0);

// console.log("after conversion", isoDate1.toLocaleString());

//   const dateParts2 = req.body.zrc_valid_from.split('/');
//   const formattedDate2 = `${dateParts2[2]}-${dateParts2[1]}-${dateParts2[0]}`;
//   const isoDate2=new Date(formattedDate2)
//   const mysqlFormattedDate2 = isoDate2.toISOString().slice(0, 19).replace('T', ' ');

//   const dateParts3 = req.body.zrc_valid_upto.split('/');
//   const formattedDate3 = `${dateParts3[2]}-${dateParts3[1]}-${dateParts3[0]}`;
//   const isoDate3=new Date(formattedDate3)
//   const mysqlFormattedDate3 = isoDate3.toISOString().slice(0, 19).replace('T', ' ');




console.log("date from angular",req.body.zrc_date)
console.log("date from angular",req.body.zrc_valid_from)
console.log("date from angular",req.body.zrc_valid_upto)


// const datetime1=new Date(req.body.zrc_date);
// const utcDateString = datetime1.toISOString();
// const mysqlDateTime = utcDateString.replace("T", " ").replace("Z", "");
// const dateObj1=moment(mysqlDateTime, 'YYYY-MM-DDTHH:mm:ss').tz('Asia/Kolkata').toDate();
// dateObj1.setUTCDate(dateObj1.getUTCDate() + 1);

// const datetime2=req.body.zrc_valid_from;
// const dateObj2=moment(datetime2, 'YYYY-MM-DDTHH:mm:ss').tz('Asia/Kolkata').toDate();
// dateObj2.setUTCDate(dateObj2.getUTCDate() + 1);

// const datetime3=req.body.zrc_valid_upto;
// const dateObj3=moment(datetime3, 'YYYY-MM-DDTHH:mm:ss').tz('Asia/Kolkata').toDate();
// dateObj3.setUTCDate(dateObj3.getUTCDate() + 1);

console.log("after conversion" ,mysqlDateTime1)
console.log("after conversion" ,mysqlDateTime2)
console.log("after conversion" ,mysqlDateTime3)



  let sql =
 
    "UPDATE zrc_table SET zrc_fy='" +
    req.body.zrc_fy +
    "',product_name='" +
    req.body.product_name +
    "',ph_number='" +
    req.body.ph_number +
    "',supplier_name='" +
    req.body.supplier_name +
    "',zrc_number='" +
    req.body.zrc_number +
    "',zrc_date='" +
    mysqlDateTime1 +
    "',qty='" +
    req.body.qty +
    "',Balance='"+
    req.body.qty +
    "',zrc_valid_from='" +
    mysqlDateTime2 +
    "',zrc_valid_upto='" +
    mysqlDateTime3 +
    "',drive_file='"+
    req.body.drive_file +
    "'  WHERE serial=" +
    req.params.serial;
  

  let a = db.query(sql, (error, result) => {
    if (error) {
      res.send({ status: false, message:"Update error"+error });
    } else {
      res.send({ status: true, message: "ZRC Updated successfully" });
    }
  });
});


server.get("/api/zrc/searchvalues/:searchTerm",(req,res)=>{
  console.log("SEARCH NEW CALLED")
  const searchTerm=req.params.searchTerm;

  console.log("term"+searchTerm);
  const query=`SELECT ph_number,product_name FROM zrc_table WHERE CAST(ph_number AS CHAR) LIKE '%${searchTerm}%' OR product_name LIKE '%${searchTerm}%' LIMIT 10;`
  db.query(query,(err,results)=>{
    if(err) throw err;
    console.log(results);
    res.json(results);
  })
})

server.get("/api/zrc/getallindents-by-zrc-serial/:zrc_serial",(req,res)=>{
  console.log("GET ALL INDENTS BY SERIAL")
  const zrc_serial=req.params.zrc_serial;
  const sql=` SELECT * FROM indents WHERE zrc_serial= ${zrc_serial}`;
  db.query(sql,(err,results)=>{
    if(err){
      console.log("Error getting indents using zrc serial",err)
    } else {
      res.send({status:true,data:results})
    }
  })
})


//Load DropDown Values for ZRC FY
server.get("/api/zrc/tracker/zrcfyload",(req,res) => {
  console.log(" Load DropDOwn Called")
  let sql="SELECT zrc_fy FROM tracker";
  db.query(sql,(error,result)=>{
    if(error){
      res.send({status : false, message : " Error from DB while fetching zrc_fy from Tracker "+error})
    } else {
      res.send({status : true , data : result})
    }
  })
})

server.get("/api/zrc/expiring/expirydate",(req,res) => {
  console.log("expiring ZRC Function Called")

let todayDate=new Date()
let thirtyDays=new Date();
thirtyDays.setDate(todayDate.getDate()+30)

  const datetime1 = todayDate;
// Create a new Date object from the datetime string
const dateObj1 = new Date(datetime1);
// Get the individual components of the date
const year1 = dateObj1.getFullYear();
const month1 = dateObj1.getMonth() + 1; // Months are zero-based, so add 1
const day1 = dateObj1.getDate();
// Format the DateTime string in MySQL format
const mysqlDateTime1 = `${year1}-${month1.toString().padStart(2, "0")}-${day1.toString().padStart(2, "0")} 00:00:00`;


const datetime2 = thirtyDays;
// Create a new Date object from the datetime string
const dateObj2 = new Date(datetime2);
// Increase the date by 1 day

// Get the individual components of the date
const year2 = dateObj2.getFullYear();
const month2 = dateObj2.getMonth() + 1; // Months are zero-based, so add 1
const day2 = dateObj2.getDate();
// Format the DateTime string in MySQL format
const mysqlDateTime2= `${year2}-${month2.toString().padStart(2, "0")}-${day2.toString().padStart(2, "0")} 00:00:00`;


  console.log("today date =", mysqlDateTime1)
  console.log("30 days from now= ",mysqlDateTime2)
  let sql=`SELECT * FROM zrc_table WHERE zrc_valid_upto <  '${mysqlDateTime2}' AND zrc_valid_upto > '${mysqlDateTime1}';`
  db.query(sql,(error,result) => {
    if(error){
      console.log("error getting zrc valid upto results from db",error)
    } else {
      res.send({status : true , data : result})
    }
  }) 
})

server.get("/api/zrc/getbyserial/:serialno",(req,res) =>{

  let sql=`SELECT * FROM zrc_table WHERE serial= ${req.params.serialno};`
  db.query(sql,(error,result) => {
    if(error){
      console.log("error getting productname by serial from db",error)
    } else {
      res.send({status: true , data : result})
    }
  })
})



server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


