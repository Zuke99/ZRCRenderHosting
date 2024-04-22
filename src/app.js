const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const server = express();
server.use(bodyParser.json());
const cors = require("cors");
const path = require("path");
server.use(cors({ origin: "*" }));
const multer = require("multer");
const bodyparser = require("body-parser");
server.use(bodyparser.urlencoded({ extended: false }));
server.use("/uploads", express.static("uploads"));
const moment = require("moment-timezone");
const dotenv = require("dotenv");
server.use(express.static(__dirname));
const jwt = require("jsonwebtoken");
const secretKey = "zrc";
server.use(express.static(path.join(__dirname, "dist")));
const https = require('https');

const db = mysql.createConnection({
  host     : 'sql12.freemysqlhosting.net',
  user     : 'sql12628553',
  password : 'zLJ6cKrMxy',
  database : 'sql12628553',
});
console.log("ZRC APP");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "password",
//   database: "sql12628553",
//   port: 3307,
// });

db.connect(function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log("db conected");
  }
});

server.listen(8085, function check(error) {
  if (error) {
    console.log("Error....dddd!!!!");
  } else {
    console.log("Started....!!!! ", 8085);
  }
});


// setInterval(() => {
//   db.query('SELECT 1', (error, results, fields) => {
//     if (error) throw error;
//     console.log('Keep-alive query executed successfully');
//   });
// }, 5 * 60 * 1000); // 5 minutes in milliseconds
setInterval(pingApplication, 5 * 60 * 1000);

dotenv.config({
  path: "./data/config.env",
});

function mysql_real_escape_string (str) {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
      switch (char) {
          case "\0":
              return "\\0";
          case "\x08":
              return "\\b";
          case "\x09":
              return "\\t";
          case "\x1a":
              return "\\z";
          case "\n":
              return "\\n";
          case "\r":
              return "\\r";
          
          case "'":
          
            case "\"":
          case "\\":
       
              return "\\"+char; // prepends a backslash to backslash, percent,
                                // and double/single quotes
          default:
              return char;
      }
  });
}

const decodeToken = (token) => {
  try {
    // Verify and decode the token
    // console.log("Received for Token decoding" , token)
    const tokenValue = token.split(" ")[1];
    const decoded = jwt.verify(tokenValue, secretKey); // Replace 'your_secret_key' with your actual secret key

    // The payload information is available in the 'decoded' object
    const { username, role ,serial} = decoded;

    // Return the payload information
    return {
      username,
      role,
      serial
    };
  } catch (error) {
    // Token verification failed, handle the error

    throw new Error("Invalid token");
  }
};

// Middleware for 'MasterAdmin' role
const masterAdminMiddleware = (req, res, next) => {
  // Check if the user has the 'MasterAdmin' role
  const token = req.headers.authorization;
  //  console.log("token value from headers",token)
  const decodedToken = decodeToken(token);
  const role = decodedToken.role;
  console.log("role is ", role);
  if (role === "MasterAdmin") {
    next(); // Allow access to the route
  } else {
    res.status(403).json({ message: "Access Denied" });
  }
};

// Middleware for 'Contributor' role
const contributorMiddleware = (req, res, next) => {
  // Check if the user has the 'Contributor' role
  const token = req.headers.authorization;
  // console.log("token value from headers",token)
  const decodedToken = decodeToken(token);
  const role = decodedToken.role;
  console.log("role is ", role);
  if (role === "Contributor" || role === "MasterAdmin") {
    next(); // Allow access to the route
  } else {
    res.status(403).json({ message: "Access Denied" });
  }
};

// Middleware for 'User' role
const userMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  //console.log("token value from headers",token)
  const decodedToken = decodeToken(token);
  const role = decodedToken.role;
  console.log("role is ", role);
  // Check if the user has the 'User' role
  if (role === "User" || role === "MasterAdmin" || role === "Contributor") {
    next(); // Allow access to the route
  } else {
    res.status(403).json({ message: "Access Denied" });
  }
};

server.get('/ping', (req, res) => {
  res.status(200).send('Ping successful');
});

function pingApplication() {
  const options = {
    hostname: 'zrcrenderhosting.onrender.com', // Replace with your application's domain or IP address
    port: 80, // Specify the port your application is running on (usually 80 for HTTP, 443 for HTTPS)
    path: '/ping', // Specify the ping route
    method: 'GET'
  };

  const req = https.request(options, (res) => {
    console.log(`Ping response: ${res.statusCode}`);
  });

  req.on('error', (error) => {
    console.error('Error pinging application:', error);
  });

  req.end();
}

//User Registration

server.post(
  "/api/zrc/register/registeruser",
  [masterAdminMiddleware],
  (req, res) => {
    console.log("Register user Called");
    let userData = {
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      role: req.body.role,
    };
    let sql = "INSERT INTO users SET?";
    db.query(sql, userData, (error, result) => {
      if (error) {
        console.log("Error adding user to db", error);
      } else {
        res.send({ status: true, data: result });
      }
    });
  }
);

//get all users
//Get all users
server.get("/api/zrc/register/getuser/:username", (req, res) => {
  console.log("Get all users called");
  let sql = `SELECT * FROM users ;`;
  db.query(sql, (error, result) => {
    if (error) {
      console.log("error getting usernames from db", error);
    } else {
      if (!result) {
        res.send({ status: false, data: result });
      } else {
        res.send({ status: true, data: result });
      }
    }
  });
});

server.delete("/api/zrc/user/delete/deleteuser/:serial", (req, res) => {
  console.log("Delete Users Called");
  let sql = `DELETE FROM users
  WHERE serial = ${req.params.serial};`;
  db.query(sql, (error, result) => {
    if (error) {
      res.send({ status: false, message: "Error" });
    } else {
      res.send({ status: true, message: "Deleted User" });
    }
  });
});

//LOGIN API

server.post("/api/zrc/login/loginuser", (req, res) => {
  console.log("Login Called");
  console.log(req.body.username + " " + req.body.password);
  let userData = {
    username: req.body.username,
    password: req.body.password,
  };
  let sql = `SELECT * FROM users WHERE username = '${req.body.username}';`;
  db.query(sql, userData, (error, result) => {
    if (error) {
      console.log("error connecting to db for user login", error);
    } else if (!result[0]) {
      console.log("no user with username ", req.body.username);
      res.send({ status: false, message: "nouser" });
    } else if (result[0].password != req.body.password) {
      console.log("wrong pass", result[0].password + " " + req.body.password);
      res.send({
        status: false,
        message: "Wrong password for user " + req.body.username,
      });
      // res.send({data:result})
    } else {
      console.log("logged in");
      const payload = {
        serial: result[0].serial,
        username: req.body.username,
        role: result[0].role,
        name: result[0].name,
      };
      console.log("Payload= ", payload);
      const options = {
        expiresIn: "7h",
      };
      const token = jwt.sign(payload, secretKey, options);
      res.json({ token: token });
    }
  });
});

//ADD MASTER LISt

server.post(
  "/api/zrc/master/addmaster",
  [contributorMiddleware],
  (req, res) => {
    console.log("Register user Called");
    let userData = {
      product_name: req.body.product_name,
      ph_number: req.body.ph_number,
    };
    let sql = "INSERT INTO zrc_master_list2 SET?";
    db.query(sql, userData, (error, result) => {
      if (error) {
        console.log("Error adding master list to db", error);
      } else {
        res.send({ status: true, data: result });
      }
    });
  }
);

//file Handling
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});

var upload = multer({ storage: storage }).single("file");

// //upload File
// server.post('/api/zrc/file',(req,res)=>{
//   upload(req,res,(err)=>{
//     if(err){
//       console.log(err)
//     }

//   })
// })
//get Tracking Details
server.get("/api/zrc/simple", (req, res) => {
  console.log("SIMPLE CALLED");
  res.send({ status: true, message: " SIMPLE API" });
});

server.get("/", (req, res) => {
  console.log("API WORKING");
  res.send({ status: true, message: "API WORKING" });
});

//add to IndentTable USER)
server.post("/api/zrc/indent/userindent", [userMiddleware], (req, res) => {
  console.log("ADD UserIndent Table Called");

  const datetime1 = req.body.zrc_valid_from;
  // Create a new Date object from the datetime string
  const dateObj1 = new Date(datetime1);
  // Get the individual components of the date
  const year1 = dateObj1.getFullYear();
  const month1 = dateObj1.getMonth() + 1; // Months are zero-based, so add 1
  const day1 = dateObj1.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime1 = `${year1}-${month1.toString().padStart(2, "0")}-${day1
    .toString()
    .padStart(2, "0")} 00:00:00`;

  const datetime2 = req.body.zrc_valid_upto;
  // Create a new Date object from the datetime string
  const dateObj2 = new Date(datetime2);
  // Get the individual components of the date
  const year2 = dateObj2.getFullYear();
  const month2 = dateObj2.getMonth() + 1; // Months are zero-based, so add 1
  const day2 = dateObj2.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime2 = `${year2}-${month2.toString().padStart(2, "0")}-${day2
    .toString()
    .padStart(2, "0")} 00:00:00`;

  const datetime6 = req.body.date_of_indent;
  // Create a new Date object from the datetime string
  const dateObj6 = new Date(datetime6);
  // Get the individual components of the date
  const year6 = dateObj6.getFullYear();
  const month6 = dateObj6.getMonth() + 1; // Months are zero-based, so add 1
  const day6 = dateObj6.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime6 = `${year6}-${month6.toString().padStart(2, "0")}-${day6
    .toString()
    .padStart(2, "0")} 00:00:00`;

  let details = {
    ph_number: req.body.ph_number,
    product_name: req.body.product_name,
    balance_available: req.body.balance_available,
    qty_required: req.body.qty_required,
    zrc_number: req.body.zrc_number,
    zrc_valid_from: mysqlDateTime1,
    zrc_valid_upto: mysqlDateTime2,
    zrc_serial: req.body.zrc_serial,
    date_of_indent: mysqlDateTime6,
    user_name: req.body.user_name,
    approval_status: req.body.status,
    balance_hand: req.body.balance_hand,
    fresh_stock_date: req.body.fresh_stock_date,
    remarks: req.body.remarks,
    indents_sl: req.body.indents_sl,
    zrc_fy: req.body.zrc_fy,
    acknowledge: req.body.acknowledge,
    fy: req.body.fy,
    irpTextBox:req.body.irpTextBox
  };
  let sql = "INSERT INTO user_indents SET ?";
  db.query(sql, details, (error, result) => {
    if (error) {
      res.send({ status: false, message: "Error" + error, data: result });
    } else {
      res.send({ status: true, message: "Indent placed Successfully" });
    }
  });
});
server.post("/api/zrc/addindent", [contributorMiddleware], (req, res) => {
  console.log("ADD Indent Table Called");

  console.log(
    "from angular" +
      req.body.last_indent_date +
      " type of " +
      typeof req.body.last_indent_date
  );
  new_date = new Date(req.body.last_indent_date);

  const datetime1 = req.body.zrc_valid_from;
  // Create a new Date object from the datetime string
  const dateObj1 = new Date(datetime1);
  // Get the individual components of the date
  const year1 = dateObj1.getFullYear();
  const month1 = dateObj1.getMonth() + 1; // Months are zero-based, so add 1
  const day1 = dateObj1.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime1 = `${year1}-${month1.toString().padStart(2, "0")}-${day1
    .toString()
    .padStart(2, "0")} 00:00:00`;

  const datetime2 = req.body.zrc_valid_upto;
  // Create a new Date object from the datetime string
  const dateObj2 = new Date(datetime2);
  // Get the individual components of the date
  const year2 = dateObj2.getFullYear();
  const month2 = dateObj2.getMonth() + 1; // Months are zero-based, so add 1
  const day2 = dateObj2.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime2 = `${year2}-${month2.toString().padStart(2, "0")}-${day2
    .toString()
    .padStart(2, "0")} 00:00:00`;

  const datetime3 = req.body.qty_indented_supl_date;
  // Create a new Date object from the datetime string
  const dateObj3 = new Date(datetime3);
  // Get the individual components of the date
  const year3 = dateObj3.getFullYear();
  const month3 = dateObj3.getMonth() + 1; // Months are zero-based, so add 1
  const day3 = dateObj3.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime3 = `${year3}-${month3.toString().padStart(2, "0")}-${day3
    .toString()
    .padStart(2, "0")} 00:00:00`;

  const datetime4 = req.body.qty_recd_supl_date;
  // Create a new Date object from the datetime string
  const dateObj4 = new Date(datetime4);
  // Get the individual components of the date
  const year4 = dateObj4.getFullYear();
  const month4 = dateObj4.getMonth() + 1; // Months are zero-based, so add 1
  const day4 = dateObj4.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime4 = `${year4}-${month4.toString().padStart(2, "0")}-${day4
    .toString()
    .padStart(2, "0")} 00:00:00`;

  const datetime5 = req.body.last_indent_date;
  // Create a new Date object from the datetime string
  const dateObj5 = new Date(datetime5);
  // Get the individual components of the date
  const year5 = dateObj5.getFullYear();
  const month5 = dateObj5.getMonth() + 1; // Months are zero-based, so add 1
  const day5 = dateObj5.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime5 = `${year5}-${month5.toString().padStart(2, "0")}-${day5
    .toString()
    .padStart(2, "0")} 00:00:00`;

  const datetime6 = req.body.date_of_indent;
  // Create a new Date object from the datetime string
  const dateObj6 = new Date(datetime6);
  // Get the individual components of the date
  const year6 = dateObj6.getFullYear();
  const month6 = dateObj6.getMonth() + 1; // Months are zero-based, so add 1
  const day6 = dateObj6.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime6 = `${year6}-${month6.toString().padStart(2, "0")}-${day6
    .toString()
    .padStart(2, "0")} 00:00:00`;

  const datetime7 = req.body.qty_expended_date;
  // Create a new Date object from the datetime string
  const dateObj7 = new Date(datetime7);
  // Get the individual components of the date
  const year7 = dateObj7.getFullYear();
  const month7 = dateObj7.getMonth() + 1; // Months are zero-based, so add 1
  const day7 = dateObj7.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime7 = `${year7}-${month7.toString().padStart(2, "0")}-${day7
    .toString()
    .padStart(2, "0")} 00:00:00`;

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

  console.log("after conversion", mysqlDateTime5);

  let details = {
    ph_number: req.body.ph_number,
    product_name: req.body.product_name,
    balance_available: req.body.balance_available,
    qty_required: req.body.qty_required,
    zrc_number: req.body.zrc_number,
    zrc_valid_from: mysqlDateTime1,
    zrc_valid_upto: mysqlDateTime2,
    indent_ami: req.body.indent_ami,
    qty_annual_indent: req.body.qty_annual_indent,
    qty_pcmd: req.body.qty_pcmd,
    qty_indented: req.body.qty_indented,
    qty_recd: req.body.qty_recd,
    qty_indented_supl: req.body.qty_indented_supl,
    qty_recd_supl: req.body.qty_recd_supl,
    qty_indented_supl_date: mysqlDateTime3,
    qty_recd_supl_date: mysqlDateTime4,
    balance_hand: req.body.balance_hand,
    fresh_stock_date: req.body.fresh_stock_date,
    remarks: req.body.remarks,
    last_indent_date: mysqlDateTime5,
    qty_last_indent: req.body.qty_last_indent,
    zrc_serial: req.body.zrc_serial,
    date_of_indent: mysqlDateTime6,
    zrc_fy: req.body.zrc_fy,
    indents_sl: req.body.indents_sl,
    extra_remarks: req.body.extra_remarks,
    po_status: req.body.po_status,
    supply_status: req.body.supply_status,
    qty_expended_date: mysqlDateTime7,
    qty_expended: req.body.qty_expended,
    irpTextBox: req.body.irpTextBox,
    qty_additional: req.body.qty_additional,
    equal_substitute: req.body.equal_substitute,
    fy: req.body.fy,
    supplier_name : req.body.supplier_name
  };
  //also add to lower bodyData
  let sql;
  if (new_date.getYear() + 1900 < 1100) {
    console.log("empty date");

    console.log("new Date", new_date);
    new_date = null;

    details = {
      ph_number: req.body.ph_number,
      product_name: req.body.product_name,
      balance_available: req.body.balance_available,
      qty_required: req.body.qty_required,
      zrc_number: req.body.zrc_number,
      zrc_valid_from: mysqlDateTime1,
      zrc_valid_upto: mysqlDateTime2,
      indent_ami: req.body.indent_ami,
      qty_annual_indent: req.body.qty_annual_indent,
      qty_pcmd: req.body.qty_pcmd,
      qty_indented: req.body.qty_indented,
      qty_recd: req.body.qty_recd,
      qty_indented_supl: req.body.qty_indented_supl,
      qty_recd_supl: req.body.qty_recd_supl,
      qty_indented_supl_date: mysqlDateTime3,
      qty_recd_supl_date: mysqlDateTime4,
      balance_hand: req.body.balance_hand,
      fresh_stock_date: req.body.fresh_stock_date,
      remarks: req.body.remarks,
      last_indent_date: new_date,
      qty_last_indent: req.body.qty_last_indent,
      zrc_serial: req.body.zrc_serial,
      date_of_indent: mysqlDateTime6,
      zrc_fy: req.body.zrc_fy,
      indents_sl: req.body.indents_sl,
      extra_remarks: req.body.extra_remarks,
      po_status: req.body.po_status,
      supply_status: req.body.supply_status,
      qty_expended_date: mysqlDateTime7,
      qty_expended: req.body.qty_expended,
      irpTextBox: req.body.irpTextBox,
      qty_additional: req.body.qty_additional,
      equal_substitute: req.body.equal_substitute,
      fy: req.body.fy,
      supplier_name : req.body.supplier_name
    };

    console.log("null valid date by sql", new_date);
    sql = "INSERT INTO indents SET ?";
  } else {
    sql = "INSERT INTO indents SET ?";
  }
  db.query(sql, details, (error) => {
    if (error) {
      res.send({ status: false, message: "Indent Table Failed" + error });
    } else {
      res.send({ status: true, message: "Indent created successfully" });
    }
  });
});
//Get Indents (USER) for Home Screen
server.get(
  "/api/zrc/indents/getuserindents/:userName",
  [userMiddleware],
  (req, res) => {
    console.log("get Indents USer Called", req.params.userName);
    let i = 0;
    let sql = `SELECT * FROM user_indents WHERE user_name = '${
      req.params.userName
    }' AND acknowledge= ${0}`;
    db.query(sql, (error, result) => {
      if (error) {
        res.send({ status: false, message: "error" });
      } else {
        res.send({ status: true, data: result });
      }
    });
  }
);

//GET ALL INDENTS FOR HOMESCREEN ADMIN AND CONTRIBUTOR
server.get(
  "/api/zrc/indents/getalluserindents",
  [contributorMiddleware],
  (req, res) => {
    console.log("get Indents USer Called");
    let i = 0;
    let sql = `SELECT * FROM user_indents WHERE approval_status = 'Pending'`;
    db.query(sql, (error, result) => {
      if (error) {
        res.send({ status: false, message: "error" });
      } else {
        res.send({ status: true, data: result });
      }
    });
  }
);

//Update to IndentTable (ADMIN/CONTRIBUTOR)
server.put(
  "/api/zrc/indent/updateindent/:serial",
  [contributorMiddleware],
  (req, res) => {
    console.log("UPdate Indent Table Called");

    console.log(
      "from angular" +
        req.body.last_indent_date +
        " type of " +
        typeof req.body.last_indent_date
    );
    new_date = new Date(req.body.last_indent_date);

    const datetime1 = req.body.zrc_valid_from;
    // Create a new Date object from the datetime string
    const dateObj1 = new Date(datetime1);
    // Get the individual components of the date
    const year1 = dateObj1.getFullYear();
    const month1 = dateObj1.getMonth() + 1; // Months are zero-based, so add 1
    const day1 = dateObj1.getDate();
    // Format the DateTime string in MySQL format
    const mysqlDateTime1 = `${year1}-${month1
      .toString()
      .padStart(2, "0")}-${day1.toString().padStart(2, "0")} 00:00:00`;

    const datetime2 = req.body.zrc_valid_upto;
    // Create a new Date object from the datetime string
    const dateObj2 = new Date(datetime2);
    // Get the individual components of the date
    const year2 = dateObj2.getFullYear();
    const month2 = dateObj2.getMonth() + 1; // Months are zero-based, so add 1
    const day2 = dateObj2.getDate();
    // Format the DateTime string in MySQL format
    const mysqlDateTime2 = `${year2}-${month2
      .toString()
      .padStart(2, "0")}-${day2.toString().padStart(2, "0")} 00:00:00`;

    const datetime3 = req.body.qty_indented_supl_date;
    // Create a new Date object from the datetime string
    const dateObj3 = new Date(datetime3);
    // Get the individual components of the date
    const year3 = dateObj3.getFullYear();
    const month3 = dateObj3.getMonth() + 1; // Months are zero-based, so add 1
    const day3 = dateObj3.getDate();
    // Format the DateTime string in MySQL format
    const mysqlDateTime3 = `${year3}-${month3
      .toString()
      .padStart(2, "0")}-${day3.toString().padStart(2, "0")} 00:00:00`;

    const datetime4 = req.body.qty_recd_supl_date;
    // Create a new Date object from the datetime string
    const dateObj4 = new Date(datetime4);
    // Get the individual components of the date
    const year4 = dateObj4.getFullYear();
    const month4 = dateObj4.getMonth() + 1; // Months are zero-based, so add 1
    const day4 = dateObj4.getDate();
    // Format the DateTime string in MySQL format
    const mysqlDateTime4 = `${year4}-${month4
      .toString()
      .padStart(2, "0")}-${day4.toString().padStart(2, "0")} 00:00:00`;

    const datetime5 = req.body.last_indent_date;
    // Create a new Date object from the datetime string
    const dateObj5 = new Date(datetime5);
    // Get the individual components of the date
    const year5 = dateObj5.getFullYear();
    const month5 = dateObj5.getMonth() + 1; // Months are zero-based, so add 1
    const day5 = dateObj5.getDate();
    // Format the DateTime string in MySQL format
    const mysqlDateTime5 = `${year5}-${month5
      .toString()
      .padStart(2, "0")}-${day5.toString().padStart(2, "0")} 00:00:00`;

    const datetime6 = req.body.date_of_indent;
    // Create a new Date object from the datetime string
    const dateObj6 = new Date(datetime6);
    // Get the individual components of the date
    const year6 = dateObj6.getFullYear();
    const month6 = dateObj6.getMonth() + 1; // Months are zero-based, so add 1
    const day6 = dateObj6.getDate();
    // Format the DateTime string in MySQL format
    const mysqlDateTime6 = `${year6}-${month6
      .toString()
      .padStart(2, "0")}-${day6.toString().padStart(2, "0")} 00:00:00`;

    const datetime7 = req.body.qty_expended_date;
    // Create a new Date object from the datetime string
    const dateObj7 = new Date(datetime7);
    // Get the individual components of the date
    const year7 = dateObj7.getFullYear();
    const month7 = dateObj7.getMonth() + 1; // Months are zero-based, so add 1
    const day7 = dateObj7.getDate();
    // Format the DateTime string in MySQL format
    const mysqlDateTime7 = `${year7}-${month7
      .toString()
      .padStart(2, "0")}-${day7.toString().padStart(2, "0")} 00:00:00`;

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

    console.log("after conversion", mysqlDateTime5);

    let details = {
      ph_number: req.body.ph_number,
      product_name: req.body.product_name,
      balance_available: req.body.balance_available,
      qty_required: req.body.qty_required,
      zrc_number: req.body.zrc_number,
      zrc_valid_from: mysqlDateTime1,
      zrc_valid_upto: mysqlDateTime2,
      indent_ami: req.body.indent_ami,
      qty_annual_indent: req.body.qty_annual_indent,
      qty_pcmd: req.body.qty_pcmd,
      qty_indented: req.body.qty_indented,
      qty_recd: req.body.qty_recd,
      qty_indented_supl: req.body.qty_indented_supl,
      qty_recd_supl: req.body.qty_recd_supl,
      qty_indented_supl_date: mysqlDateTime3,
      qty_recd_supl_date: mysqlDateTime4,
      balance_hand: req.body.balance_hand,
      fresh_stock_date: req.body.fresh_stock_date,
      remarks: req.body.remarks,
      last_indent_date: mysqlDateTime5,
      qty_last_indent: req.body.qty_last_indent,
      zrc_serial: req.body.zrc_serial,
      date_of_indent: mysqlDateTime6,
      zrc_fy: req.body.zrc_fy,
      indents_sl: req.body.indents_sl,
      extra_remarks: req.body.extra_remarks,
      po_status: req.body.po_status,
      supply_status: req.body.supply_status,
      qty_expended_date: mysqlDateTime7,
      qty_expended: req.body.qty_expended,
      irpTextBox: req.body.irpTextBox,
      qty_additional: req.body.qty_additional,
      equal_substitute: req.body.equal_substitute,
    };
    let sql;
    if (new_date.getYear() + 1900 < 1100) {
      console.log("empty date");

      console.log("new Date", new_date);
      new_date = null;

      details = {
        ph_number: req.body.ph_number,
        product_name: req.body.product_name,
        balance_available: req.body.balance_available,
        qty_required: req.body.qty_required,
        zrc_number: req.body.zrc_number,
        zrc_valid_from: mysqlDateTime1,
        zrc_valid_upto: mysqlDateTime2,
        indent_ami: req.body.indent_ami,
        qty_annual_indent: req.body.qty_annual_indent,
        qty_pcmd: req.body.qty_pcmd,
        qty_indented: req.body.qty_indented,
        qty_recd: req.body.qty_recd,
        qty_indented_supl: req.body.qty_indented_supl,
        qty_recd_supl: req.body.qty_recd_supl,
        qty_indented_supl_date: mysqlDateTime3,
        qty_recd_supl_date: mysqlDateTime4,
        balance_hand: req.body.balance_hand,
        fresh_stock_date: req.body.fresh_stock_date,
        remarks: req.body.remarks,
        last_indent_date: new_date,
        qty_last_indent: req.body.qty_last_indent,
        zrc_serial: req.body.zrc_serial,
        date_of_indent: mysqlDateTime6,
        zrc_fy: req.body.zrc_fy,
        indents_sl: req.body.indents_sl,
        extra_remarks: req.body.extra_remarks,
        po_status: req.body.po_status,
        supply_status: req.body.supply_status,
        qty_expended_date: mysqlDateTime7,
        qty_expended: req.body.qty_expended,
        irpTextBox: req.body.irpTextBox,
        qty_additional: req.body.qty_additional,
        equal_substitute: req.body.equal_substitute,
      };

      console.log("null valid date by sql", new_date);
      sql = "UPDATE indents SET ? WHERE serial = " + req.params.serial;
    } else {
      sql = "UPDATE indents SET ? WHERE serial = " + req.params.serial;
    }
    db.query(sql, details, (error) => {
      if (error) {
        res.send({ status: false, message: "Indent Table Failed" + error });
      } else {
        res.send({ status: true, message: "Indent created successfully" });
      }
    });
  }
);
//Get Indents (USER) for Home Screen
server.get(
  "/api/zrc/indents/getuserindents/:userName",
  [userMiddleware],
  (req, res) => {
    console.log("get Indents USer Called", req.params.userName);
    let i = 0;
    let sql = `SELECT * FROM user_indents WHERE user_name = '${
      req.params.userName
    }' AND acknowledge= ${0}`;
    db.query(sql, (error, result) => {
      if (error) {
        res.send({ status: false, message: "error" });
      } else {
        res.send({ status: true, data: result });
      }
    });
  }
);

//GET ALL INDENTS FOR HOMESCREEN ADMIN AND CONTRIBUTOR
server.get(
  "/api/zrc/indents/getalluserindents",
  [contributorMiddleware],
  (req, res) => {
    console.log("get Indents USer Called");
    let i = 0;
    let sql = `SELECT * FROM user_indents WHERE approval_status = 'Pending'`;
    db.query(sql, (error, result) => {
      if (error) {
        res.send({ status: false, message: "error" });
      } else {
        res.send({ status: true, data: result });
      }
    });
  }
);

//Rejecting user INdent

//UPDATING USER INDENT STATUS
server.put("/api/zrc/userindent/updatestatus/:serial", (req, res) => {
  console.log("Update status of user Indent Called");
  let sql = `UPDATE user_indents SET approval_status = '${req.body.approval_status}' , reject_remarks = '${req.body.reject_remarks}' , executive = '${req.body.executive}'
  WHERE serial = ${req.params.serial}`;
  db.query(sql, (error, result) => {
    if (error) {
      res.send({ status: false, message: "Error updating from DB" });
    } else {
      res.send({ status: true, message: "Success in updating userindent" });
    }
  });
});

//Mark As REad (USER) Homescreen
server.put("/api/zrc/userindent/update/markasread/:serial", (req, res) => {
  console.log("Mark as Read called");
  let sql = `UPDATE user_indents SET acknowledge = ${req.body.acknowledge} WHERE serial = ${req.params.serial};`;
  db.query(sql, (error, result) => {
    if (error) {
      res.send({ status: false, message: " Failed to connect to db" });
    } else {
      res.send({ status: true, message: "Marked as Read" });
    }
  });
});

//Create the Records add zrc
server.post("/api/zrc/add", [contributorMiddleware], (req, res) => {
  console.log("ZRC ADD Called");

  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    }

   

    let newPhNumber = req.body.ph_number;
    let newQty = req.body.qty;
    let po_status = 1;
    let supply_status = 1;

    //converting string to suitable SQL Date Format
    console.log("from angular ", req.body.zrc_date);
    console.log("from angular ", req.body.zrc_valid_from);
    console.log("from angular ", req.body.zrc_valid_upto);

    const dateParts1 = req.body.zrc_date.split("/");
    const formattedDate1 = `${dateParts1[2]}-${dateParts1[1]}-${dateParts1[0]}`;
    const isoDate1 = new Date(formattedDate1);
    //isoDate1.setDate(isoDate1.getDate() + 2);

    const dateParts2 = req.body.zrc_valid_from.split("/");
    const formattedDate2 = `${dateParts2[2]}-${dateParts2[1]}-${dateParts2[0]}`;
    const isoDate2 = new Date(formattedDate2);
    //isoDate2.setDate(isoDate2.getDate() + 2);

    const dateParts3 = req.body.zrc_valid_upto.split("/");
    const formattedDate3 = `${dateParts3[2]}-${dateParts3[1]}-${dateParts3[0]}`;
    const isoDate3 = new Date(formattedDate3);
    //isoDate2.setDate(isoDate2.getDate() + 2);

    console.log("date after conversion", isoDate1);
    console.log("date after conversion", isoDate2);
    console.log("date after conversion", isoDate3);

    console.log(req.body.product_name);
    let details = {
      zrc_fy: req.body.zrc_fy,
      product_name: req.body.product_name,
      ph_number: newPhNumber,
      supplier_name: req.body.supplier_name,
      zrc_number: req.body.zrc_number,
      zrc_date: isoDate1,
      qty: newQty,
      zrc_valid_from: isoDate2,
      zrc_valid_upto: isoDate3,
      file: req.file.filename,
      Balance: req.body.qty,
      drive_file: req.body.drive_file,
      po_status: po_status,
      supply_status: supply_status,
    };
    values = details;
    let sql = "INSERT INTO zrc_table SET ?";
    db.query(sql, values, (error) => {
      if (error) {
        res.send({ status: false, message: "ZRC creation Failed" + error });
      } else {
        res.send({ status: true, message: "ZRC created successfully" });
      }
    });
  });
});
//GET TRACK OF LAST INDENT SERIAL
server.get("/api/zrc/tracker/indentsl", (req, res) => {
  console.log("last indent serial function called");
  let sql = `SELECT last_indent_sl FROM tracker WHERE pk=1;`;
  db.query(sql, (error, result) => {
    if (error) {
      console.log("Error getting last indent sl data ", error);
    } else {
      res.send({ status: true, data: result });
    }
  });
});

//GET TRACK OF LAST UPDATED YEAR
server.get("/api/zrc/tracker/lastyearchange", (req, res) => {
  console.log("Last Year change get called");
  sql = `SELECT last_year_change FROM tracker WHERE pk=1;`;
  db.query(sql, (error, result) => {
    if (error) {
      res.send({status : false , message:"Error getting last year change data"+ error});
    } else {
      res.send({ status: true, data: result });
    }
  });
});

//UPDATE THE LAST SERIAL FOR INDENTS
server.put("/api/zrc/tracker/updatelastsl", (req, res) => {
  console.log("Update last serial of indents called");
  let value = req.body.last_indent_sl;
  let pk = 1;
  let sql = "UPDATE tracker SET last_indent_sl=" + value + " WHERE pk=" + pk;
  db.query(sql, (error, result) => {
    if (error) {
      res.send({
        status: false,
        message: "Error updating last serial for Indent Sl",
        error,
      });
    } else {
      res.send({ status: true, message: "Update Indent Serial Successful" });
    }
  });
});

//UPDATE LAST YEAR UPDATE
server.put("/api/zrc/tracker/lastyearchange", (req, res) => {
  console.log("Last Year change update method called");
  const datetime1 = req.body.last_year_change;
  // Create a new Date object from the datetime string
  const dateObj1 = new Date(datetime1);
  // Get the individual components of the date
  const year1 = dateObj1.getFullYear();
  const month1 = dateObj1.getMonth() + 1; // Months are zero-based, so add 1
  const day1 = dateObj1.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime1 = `${year1}-${month1.toString().padStart(2, "0")}-${day1
    .toString()
    .padStart(2, "0")} 00:00:00`;

  const pk = 1;
  let sql =
    "UPDATE tracker SET last_year_change='" +
    mysqlDateTime1 +
    "' WHERE pk=" +
    pk;
  // let sql=`UPDATE tracker SET last_year_change = ${mySQLDateString} WHERE pk=1;`
  db.query(sql, (error, result) => {
    if (error) {
      console.log({
        status: false,
        message: "Error updating last year change",
        error,
      });
    } else {
      console.log({
        status: true,
        message: "Update Last Year change Successful",
      });
    }
  });
});

//Get ALL Indents
server.get("/api/zrc/getallindents", (req, res) => {
  console.log("get all indents called");
  var sql = "SELECT * FROM indents";
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error Getting All Indent Details from DB", error);
    } else {
      res.send({ status: true, data: result });
    }
  });
});

//GET ALL USER INDENTS
server.get("/api/zrc/userindent/getallindents", (req, res) => {
  console.log("get all USER indents called");
  var sql = "SELECT * FROM user_indents";
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error Getting All Indent Details from DB", error);
    } else {
      res.send({ status: true, data: result });
    }
  });
});

//GET USER INDENTS BY SERIAL
server.get("/api/zrc/user/userindents/getbyserial/:serial",(req,res) => {
  console.log("Get USer Indents By Serial Called")
  const sql= `SELECT * FROM user_indents WHERE serial = ${req.params.serial}`
  db.query(sql, (error , result) => {
    if(error){
      res.send({status : false , message : "getting user indent by serial failed"})
    } else {
      res.send({status : true, data : result})
    }
  })
})


//GET Indents By Serial

server.get("/api/zrc/indents/getindentbyserial/:serial", (req, res) => {
  console.log("Get INdent By Serial Called", req.params.serial);
  let sql = `SELECT * FROM indents WHERE serial = ${req.params.serial}`;
  db.query(sql, (error, result) => {
    if (error) {
      res.send({ status: true, message: "error", data: result });
    } else {
      res.send({ status: true, data: result });
    }
  });
});

//GET ALL DATA
server.get("/api/zrc", (req, res) => {
  console.log("Get all ZRC s called");
  var sql = "SELECT * FROM zrc_table";
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB(GET ALL DATA)", error);
    } else {
      res.send({ status: true, data: result });
    }
  });
});

//GET BY SERIAL
server.get("/api/zrc/getindentserial/:indent_serial", (req, res) => {
  console.log("Get Indent By serial Called");
  var indent_serial = req.params.indent_serial;
  var sql = "SELECT * FROM indents WHERE serial=" + indent_serial;
  db.query(sql, function (error, result) {
    if (error) {
      console.log("error getting indent by serial", error);
    } else {
      res.send({ status: true, data: result });
    }
  });
});

//GET BY PH NUMBER
server.get("/api/zrc/:ph_number", (req, res) => {
  console.log("Get By PH NUMber Called");
  var ph_number = req.params.ph_number;
  console.log("phnumber...." + ph_number);
  var sql = "SELECT * FROM zrc_table z WHERE z.ph_number=" + ph_number;
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB(Get by ph number)", error);
    } else {
      res.send({ status: true, data: result });
    }
  });
});

//GET BY PRODUCT NAME in HOME
server.get("/api/zrc/product/:product_name", (req, res) => {
  const decodedParameter = decodeURIComponent(req.params.product_name);
  
 
  var product_name = mysql_real_escape_string(decodedParameter);
  console.log("Get By product Name called", product_name);

  var sql = `SELECT * FROM zrc_table WHERE product_name= '${product_name}'  `;
  db.query(sql, function (error, result) {
    if (error) {
      res.send({status: false, message :"Error Connecting to DB(GET BY PRODUCT NAME)", error});
    } else {
      res.send({ status: true, data: result });
    }
  });
});

//GET BY PRODUCT NAME IN INDENT REPORTS (USER)
server.post(
  "/api/zrc/userindentproduct/:product_name",
  [userMiddleware],
  (req, res) => {
    const decodedParameter = decodeURIComponent(req.params.product_name);

    console.log("Get By User Indents product Name called", decodedParameter);
    var product_name = mysql_real_escape_string(decodedParameter);
    // var sql =
    //   "SELECT * FROM user_indents WHERE  AND product_name='" +
    //   product_name +
    //   "' ORDER BY date_of_indent DESC AND user_name = '"+ req.body.user_name+"'";
    var sql="";
    if(req.body.masterReq){
      sql=`SELECT * FROM user_indents WHERE product_name =  '${product_name}' ORDER BY date_of_indent DESC `
    } else {
     sql=`SELECT * FROM user_indents WHERE product_name =  '${product_name}' AND user_name= '${req.body.user_name}' ORDER BY date_of_indent DESC `
    }
    db.query(sql, function (error, result) {
      if (error) {
        console.log("Error Connecting to DB(GET BY PRODUCT NAME)", error);
      } else {
        res.send({ status: true, data: result });
      }
    });
  }
);

//GET BY PRODUCT NAME in Indent Reports
server.get(
  "/api/zrc/indentproduct/:product_name",
  [contributorMiddleware],
  (req, res) => {
    const decodedParameter = decodeURIComponent(req.params.product_name);

    console.log("Get By Indents product Name called", decodedParameter);
    var product_name = mysql_real_escape_string(decodedParameter);
    var sql =
      "SELECT * FROM indents WHERE product_name='" +
      product_name +
      "' ORDER BY date_of_indent DESC";
    db.query(sql, function (error, result) {
      if (error) {
        console.log("Error Connecting to DB(GET BY PRODUCT NAME)", error);
      } else {
        res.send({ status: true, data: result });
      }
    });
  }
);

// GET BY USER INDENT RANGE

server.post("/api/zrc/indent/usergetindentrange", [userMiddleware], (req, res ) => {
  console.log("GET USER INDENT RANGE CALLED" )
  const datetime1 = req.body.user_indent_date_from;
  // Create a new Date object from the datetime string
  const dateObj1 = new Date(datetime1);
  // Get the individual components of the date
  const year1 = dateObj1.getFullYear();
  const month1 = dateObj1.getMonth() + 1; // Months are zero-based, so add 1
  const day1 = dateObj1.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime1 = `${year1}-${month1
    .toString()
    .padStart(2, "0")}-${day1.toString().padStart(2, "0")} 00:00:00`;

  const datetime2 = req.body.user_indent_date_upto;
  // Create a new Date object from the datetime string
  const dateObj2 = new Date(datetime2);
  // Get the individual components of the date
  const year2 = dateObj2.getFullYear();
  const month2 = dateObj2.getMonth() + 1; // Months are zero-based, so add 1
  const day2 = dateObj2.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime2 = `${year2}-${month2
    .toString()
    .padStart(2, "0")}-${day2.toString().padStart(2, "0")} 00:00:00`;

    sql = `SELECT * FROM user_indents WHERE date_of_indent >= '${mysqlDateTime1}' AND date_of_indent <= '${mysqlDateTime2}' AND user_name = '${req.body.user_name}'`
    db.query(sql, (error, result) => {
      if (error) {
        console.log("error getting indent range from db", error);
      } else {
        res.send({ status: true, data: result });
      }
    });

})

//GET BY INDENT RANGE
server.get(
  "/api/zrc/indent/getindentrange",
  [contributorMiddleware],
  (req, res) => {
    console.log(
      "indent range function called " +
        req.query.indent_date_from +
        " and " +
        req.query.indent_date_upto
    );
    const datetime1 = req.query.indent_date_from;
    // Create a new Date object from the datetime string
    const dateObj1 = new Date(datetime1);
    // Get the individual components of the date
    const year1 = dateObj1.getFullYear();
    const month1 = dateObj1.getMonth() + 1; // Months are zero-based, so add 1
    const day1 = dateObj1.getDate();
    // Format the DateTime string in MySQL format
    const mysqlDateTime1 = `${year1}-${month1
      .toString()
      .padStart(2, "0")}-${day1.toString().padStart(2, "0")} 00:00:00`;

    const datetime2 = req.query.indent_date_upto;
    // Create a new Date object from the datetime string
    const dateObj2 = new Date(datetime2);
    // Get the individual components of the date
    const year2 = dateObj2.getFullYear();
    const month2 = dateObj2.getMonth() + 1; // Months are zero-based, so add 1
    const day2 = dateObj2.getDate();
    // Format the DateTime string in MySQL format
    const mysqlDateTime2 = `${year2}-${month2
      .toString()
      .padStart(2, "0")}-${day2.toString().padStart(2, "0")} 00:00:00`;
    let po_status = req.query.po_status;
    let supply_status = req.query.supply_status;
    if (po_status == 1) {
      po_status = 0;
    } else {
      po_status = 1;
    }

    if (supply_status == 1) {
      supply_status = 0;
    } else {
      supply_status = 1;
    }
    console.log(po_status, supply_status);
    let sql;
    if (po_status == 1 && supply_status == 1) {
      sql = `SELECT * FROM indents WHERE date_of_indent >= '${mysqlDateTime1}' AND date_of_indent <= '${mysqlDateTime2}'`;
    } else {
      sql = `SELECT * FROM indents WHERE date_of_indent >= '${mysqlDateTime1}' AND date_of_indent <= '${mysqlDateTime2}' 
    AND supply_status=${supply_status} AND po_status= ${po_status}`;
    }
    db.query(sql, (error, result) => {
      if (error) {
        console.log("error getting indent range from db", error);
      } else {
        res.send({ status: true, data: result });
      }
    });
  }
);

//GetAllUserIndent Range
  server.post("/api/zrc/userindent/getalluserindentrange",(req,res) => {
    console.log("Get All user Indents range called")

    const datetime1 = req.body.indent_date_from;
    // Create a new Date object from the datetime string
    const dateObj1 = new Date(datetime1);
    // Get the individual components of the date
    const year1 = dateObj1.getFullYear();
    const month1 = dateObj1.getMonth() + 1; // Months are zero-based, so add 1
    const day1 = dateObj1.getDate();
    // Format the DateTime string in MySQL format
    const mysqlDateTime1 = `${year1}-${month1
      .toString()
      .padStart(2, "0")}-${day1.toString().padStart(2, "0")} 00:00:00`;

    const datetime2 = req.body.indent_date_upto;
    // Create a new Date object from the datetime string
    const dateObj2 = new Date(datetime2);
    // Get the individual components of the date
    const year2 = dateObj2.getFullYear();
    const month2 = dateObj2.getMonth() + 1; // Months are zero-based, so add 1
    const day2 = dateObj2.getDate();
    // Format the DateTime string in MySQL format
    const mysqlDateTime2 = `${year2}-${month2
      .toString()
      .padStart(2, "0")}-${day2.toString().padStart(2, "0")} 00:00:00`;

      sql = `SELECT * FROM user_indents WHERE date_of_indent >= '${mysqlDateTime1}' AND date_of_indent <= '${mysqlDateTime2}'`;
      db.query(sql, (error, result) => {
        if (error) {
          res.send({status : false , message :"error getting all user indent range from db", error});
        } else {
          res.send({ status: true, data: result });
        }
      });
  })
//Update Indent Report checkbox
server.put(
  "/api/zrc/indentreport/status",
  [contributorMiddleware],
  (req, res) => {
    console.log("Indent Report Checkbox Update Called");
    let sql = `UPDATE indents SET po_status = ${req.body.po_status} , supply_status = ${req.body.supply_status} WHERE serial = ${req.body.serial}`;
    db.query(sql, (error, result) => {
      if (error) {
        console.log("error connecting to db for indent update");
      } else {
        res.send({
          status: true,
          message: "Successfull updated ZRC Indent " + result,
        });
      }
    });
  }
);

//Update ZRC PO/Supply status
server.put(
  "/api/zrc/update/updatestatus/:serial",
  [contributorMiddleware],
  (req, res) => {
    console.log("UPDATE PO / SUPPLY IN ZRC CALLED");
    let sql = `UPDATE zrc_table SET po_status = ${req.body.po_status} , supply_status = ${req.body.supply_status} WHERE serial = ${req.params.serial}`;
    db.query(sql, (error, result) => {
      if (error) {
        console.log("Error connecting to db for ZRC PO/SUPPLY status update");
      } else {
        res.send({
          status: true,
          message: "ZRC updated successfully PO/SUPPLY " + result,
        });
      }
    });
  }
);

//downloadFile

server.get("/api/zrc/download/:name", function (req, res, next) {
  console.log("API WORKING Download FILE CALLED");
  var fileName = req.params.name;
  console.log("Download File Name", fileName);
  var filePath = path.join(__dirname, "/uploads/", fileName);
  res.download(filePath, fileName, function (err) {
    if (err) {
      next("DOWNLOAD FILE ERROR", err);
      // return res.status(500).send("Failed to Download File")
    } else {
      console.log("success");
    }
  });
});

//Get All FileNames from DB
function searchAllFiles(str) {
  console.log("first val" + str);
  var sql = "SELECT * FROM zrc_table WHERE file='" + str + "'";
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error Connecting to db (GET ALL FILENAMES)" + error);
    } else {
      console.log("SEARCH" + result + " STR VAL= " + str);
    }
  });
}

//updateFile
server.put("/api/zrc/updatefile/:serial", (req, res) => {
  console.log("UPDATE FILE CALLED");
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    }
    let details = {
      file: req.file.filename,
    };
    values = details;
    let sql =
      "UPDATE zrc_table SET file='" +
      req.file.filename +
      "' WHERE serial=" +
      req.params.serial;
    let a = db.query(sql, (error, result) => {
      if (error) {
        res.send({ status: false, message: "UPDATE FILE ERROR" + error });
      } else {
        res.send({ status: true, message: "File Update Success" });
      }
    });
  });
});

//Load Indent Data

server.get("/api/zrc/indent/:serial", (req, res) => {
  console.log("API WORKING LOAD INDENT DATA CALLED");
  var serial = req.params.serial;
  console.log(req.params.serial);
  var sql = "SELECT * FROM zrc_table WHERE serial=" + serial;
  db.query(sql, function (error, result) {
    if (error) {
      res.send({status : false , mesdsage :"Error Connecting to DB (Load Indent Data)" + error});
    } else {
      res.send({ status: true, data: result });
    }
  });
});

//update ZRC Balance
server.put("/api/zrc/balanceUpdate/:serial", (req, res) => {
  console.log("API WORKING UPDATING ZRC BALANCE");
  let sql =
    "UPDATE zrc_table SET Balance='" +
    req.body.zrc_balance +
    "',qty_indented='" +
    req.body.qty_indented +
    "',supply_status='" +
    req.body.supply_status +
    "',po_status='" +
    req.body.po_status +
    "'WHERE serial=" +
    req.params.serial;
  let a = db.query(sql, (error, result) => {
    if (error) {
      res.send({ status: false, message: "Update ZRC BALANCE error" + error });
    } else {
      res.send({ status: true, message: "ZRC Updated BALANCE successfully" });
    }
  });
});

//update
server.put("/api/zrc/update/:serial", [contributorMiddleware], (req, res) => {
  console.log("ZRC UPdating by serial");

  const datetime1 = req.body.zrc_date;
  // Create a new Date object from the datetime string
  const dateObj1 = new Date(datetime1);
  // Get the individual components of the date
  const year1 = dateObj1.getFullYear();
  const month1 = dateObj1.getMonth() + 1; // Months are zero-based, so add 1
  const day1 = dateObj1.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime1 = `${year1}-${month1.toString().padStart(2, "0")}-${day1
    .toString()
    .padStart(2, "0")} 00:00:00`;

  const datetime2 = req.body.zrc_valid_from;
  // Create a new Date object from the datetime string
  const dateObj2 = new Date(datetime2);
  // Increase the date by 1 day

  // Get the individual components of the date
  const year2 = dateObj2.getFullYear();
  const month2 = dateObj2.getMonth() + 1; // Months are zero-based, so add 1
  const day2 = dateObj2.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime2 = `${year2}-${month2.toString().padStart(2, "0")}-${day2
    .toString()
    .padStart(2, "0")} 00:00:00`;

  const datetime3 = req.body.zrc_valid_upto;
  // Create a new Date object from the datetime string
  const dateObj3 = new Date(datetime3);
  // Increase the date by 1 day

  // Get the individual components of the date
  const year3 = dateObj3.getFullYear();
  const month3 = dateObj3.getMonth() + 1; // Months are zero-based, so add 1
  const day3 = dateObj3.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime3 = `${year3}-${month3.toString().padStart(2, "0")}-${day3
    .toString()
    .padStart(2, "0")} 00:00:00`;

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

  console.log("date from angular", req.body.zrc_date);
  console.log("date from angular", req.body.zrc_valid_from);
  console.log("date from angular", req.body.zrc_valid_upto);

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

  console.log("after conversion", mysqlDateTime1);
  console.log("after conversion", mysqlDateTime2);
  console.log("after conversion", mysqlDateTime3);

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
    "',Balance='" +
    req.body.Balance +
    "',zrc_valid_from='" +
    mysqlDateTime2 +
    "',zrc_valid_upto='" +
    mysqlDateTime3 +
    "',drive_file='" +
    req.body.drive_file +
    "',remarks='"+
    req.body.remarks +
    "'  WHERE serial=" +
    req.params.serial;

  let a = db.query(sql, (error, result) => {
    if (error) {
      res.send({ status: false, message: "Update error" + error });
    } else {
      res.send({ status: true, message: "ZRC Updated successfully" });
    }
  });
});

//For Search Bar in Home page
server.get("/api/zrc/searchvalues/:searchTerm", (req, res) => {
  const decodedParameter = decodeURIComponent(req.params.searchTerm);

  console.log("Get By product Name called", decodedParameter);
  var product_name = decodedParameter;
  console.log("SEARCH NEW CALLED");
  const searchTerm = mysql_real_escape_string(product_name);

  console.log("term" + searchTerm);
  const query = `SELECT DISTINCT ph_number,product_name FROM zrc_table WHERE CAST(ph_number AS CHAR) LIKE '%${searchTerm}%' OR product_name LIKE '%${searchTerm}%' LIMIT 10;`;
  const search = `%${searchTerm}%`
 
  db.query(query,[search,search], (err, results) => {
    if (err) throw err;
    console.log("success");
    res.json(results);
  });
});

//USER INDENT REPORTS SEARCH ENGINE
server.post(
  "/api/zrc/userindentsearchvalues/:searchTerm",
  [userMiddleware],
  (req, res) => {
    console.log("SEARCH USER REPORT INDENT");
    const search = decodeURIComponent(req.params.searchTerm);
    const searchTerm=mysql_real_escape_string(search)
    console.log("term and user = " + searchTerm + " username " + req.body.user_name);
    let query="";
    if(req.body.masterReq){
      console.log("MasterReq")
      query=`SELECT DISTINCT ph_number,product_name FROM user_indents WHERE  CAST(ph_number AS CHAR) LIKE '%${searchTerm}%' OR product_name LIKE '%${searchTerm}%'`;
    } else {
       query = `SELECT DISTINCT ph_number,product_name FROM user_indents WHERE  CAST(ph_number AS CHAR) LIKE '%${searchTerm}%' OR product_name LIKE '%${searchTerm}%' AND user_name = '${req.body.user_name}' ;`;
    }
   
    //const search = `%${searchTerm}%`
    db.query(query,[search, search], (err, results) => {
      if (err) throw err;
      console.log("success");
      res.json(results);
    });
  }
);
//For SearchBar in Indent Reports Page
server.get(
  "/api/zrc/indentsearchvalues/:searchTerm",
  [contributorMiddleware],
  (req, res) => {
    console.log("SEARCH NEW CALLED");
    const search = decodeURIComponent(req.params.searchTerm);
    const searchTerm=mysql_real_escape_string(search)
    console.log("term" + searchTerm);
    const query = `SELECT DISTINCT ph_number,product_name FROM indents WHERE CAST(ph_number AS CHAR) LIKE '%${searchTerm}%' OR product_name LIKE '%${searchTerm}%' ;`;
    //const search = `%${searchTerm}%`
    db.query(query,[search, search], (err, results) => {
      if (err) throw err;
      console.log("success");
      res.json(results);
    });
  }
);

//Search Indents by ZRC_SERIAL
server.get("/api/zrc/indent/getindentby/zrcserial/:zrcserial", (req, res) => {
  console.log("SEARCH indents by zrc SERIAL CALLED");
  let sql = `SELECT * FROM indents WHERE zrc_serial = ${req.params.zrcserial}`;
  db.query(sql, (error, result) => {
    if (error) {
      res.send({ status: false, message: "Error Updating data in db" + error });
    } else {
      res.send({ status: true, data: result });
    }
  });
});

//Search Suggestion in ADD ZRC
server.get("/api/zrc/master/searchvalues/:searchTerm", (req, res) => {
  console.log("Master SEARCH NEW CALLED");
  const search =  decodedParameter = decodeURIComponent(req.params.searchTerm);
  const searchTerm = mysql_real_escape_string(search);

  console.log("term" + searchTerm);
  const query = `SELECT ph_number, product_name
  FROM zrc_master_list
  WHERE CAST(ph_number AS CHAR) LIKE '%${searchTerm}%'
     OR product_name LIKE '%${searchTerm}%'
  UNION
  SELECT ph_number, product_name
  FROM zrc_master_list2
  WHERE CAST(ph_number AS CHAR) LIKE '%${searchTerm}%'
     OR product_name LIKE '%${searchTerm}%';`;

  db.query(query, (err, results) => {
    if (err) throw err;
    console.log("search success");
    res.json(results);
  });
});

server.get("/api/zrc/getallindents-by-zrc-serial/:zrc_serial", (req, res) => {
  console.log("GET ALL INDENTS BY SERIAL");
  const zrc_serial = req.params.zrc_serial;
  const sql = ` SELECT * FROM indents WHERE zrc_serial= ${zrc_serial}`;
  db.query(sql, (err, results) => {
    if (err) {
      console.log("Error getting indents using zrc serial", err);
    } else {
      res.send({ status: true, data: results });
    }
  });
});

//Load DropDown Values for ZRC FY
server.get("/api/zrc/tracker/zrcfyload", (req, res) => {
  console.log(" Load DropDOwn Called");
  let sql = "SELECT zrc_fy FROM tracker";
  db.query(sql, (error, result) => {
    if (error) {
      res.send({
        status: false,
        message: " Error from DB while fetching zrc_fy from Tracker " + error,
      });
    } else {
      res.send({ status: true, data: result });
    }
  });
});

server.get("/api/zrc/expiring/expirydate/:month", (req, res) => {
  console.log("expiring ZRC Function Called");
  let month = req.params.month;
  let todayDate = new Date();
  let thirtyDays = new Date();
  console.log("months from angular", month);
  thirtyDays.setDate(todayDate.getDate() + month * 31);

  const datetime1 = todayDate;
  // Create a new Date object from the datetime string
  const dateObj1 = new Date(datetime1);
  // Get the individual components of the date
  const year1 = dateObj1.getFullYear();
  const month1 = dateObj1.getMonth() + 1; // Months are zero-based, so add 1
  const day1 = dateObj1.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime1 = `${year1}-${month1.toString().padStart(2, "0")}-${day1
    .toString()
    .padStart(2, "0")} 00:00:00`;

  const datetime2 = thirtyDays;
  // Create a new Date object from the datetime string
  const dateObj2 = new Date(datetime2);
  // Increase the date by 1 day

  // Get the individual components of the date
  const year2 = dateObj2.getFullYear();
  const month2 = dateObj2.getMonth() + 1; // Months are zero-based, so add 1
  const day2 = dateObj2.getDate();
  // Format the DateTime string in MySQL format
  const mysqlDateTime2 = `${year2}-${month2.toString().padStart(2, "0")}-${day2
    .toString()
    .padStart(2, "0")} 00:00:00`;

  console.log("today date =", mysqlDateTime1);
  console.log(month + " months from now= ", mysqlDateTime2);
  let sql = `SELECT * FROM zrc_table WHERE zrc_valid_upto <  '${mysqlDateTime2}' AND zrc_valid_upto > '${mysqlDateTime1}';`;
  db.query(sql, (error, result) => {
    if (error) {
      console.log("error getting zrc valid upto results from db", error);
    } else {
      res.send({ status: true, data: result });
    }
  });
});

server.get("/api/zrc/getbyserial/:serialno", (req, res) => {
  console.log("Get ZRC by serial called", req.params.serialno);
  let sql = `SELECT * FROM zrc_table WHERE serial= ${req.params.serialno};`;
  db.query(sql, (error, result) => {
    if (error) {
      res.send({status: false, message : "error getting productname by serial from db", error});
    } else {
      res.send({ status: true, data: result });
    }
  });
});

//get zrc reports
server.get("/api/zrctable/:zrcfy", [userMiddleware], (req, res) => {
  //const decodedParameter = decodeURIComponent(req.params.zrc_fy);
  console.log("get all ZRC report from zrc_table called");
  let zrc_fy = req.params.zrcfy;
  let sql = ``;
  if (zrc_fy == "Show All") {
    sql = `SELECT * FROM zrc_table`;
  } else {
    sql = `SELECT * FROM zrc_table WHERE zrc_fy = '${zrc_fy}'`;
  }

  db.query(sql, (error, result) => {
    if (error) {
      console.log("Error getting zrc info for reports ", error);
    } else {
      res.send({ status: true, data: result });
    }
  });
});

//GET USER CREDENTIALS
server.get("/api/zrc/user/usercredentials/:serial",(req, res) => {
  console.log("Getting UserCredentials Called",req.params.serial);
  let sql=`SELECT * FROM users WHERE serial = ${req.params.serial}`;
  db.query(sql,(error,result) => {
    if(error){
      res.send({status : false})
    } else {
      res.send({status : true , data :result})
    }
  })
})

//CHANGE PASSWORD
server.put("/api/zrc/user/update/usercredentails/:serial",(req, res) => {
  console.log("UPDATE PASSWORD CALLED")
  let sql=`UPDATE users SET security_question = '${req.body.security_question}' , security_answer = '${req.body.security_answer}' , password= '${req.body.password}'  WHERE serial = ${req.params.serial}`
  db.query(sql ,(error, result) => {
    if(error){
      res.send({status : false , data : result , message : error})
    } else {
      res.send({status : true , data : result})
    }
  })
})

//GET USERNAMES
server.get("/api/zrc/users/username/:username",(req,res) => {
  console.log("GET ALL USERNAMES CALLED")
  let sql=`SELECT * FROM users WHERE username = '${req.params.username}'`
  db.query(sql,(error,result) => {
    if(error){
      res.send({ status:false , message: error, data : result})
    } 
    // else if(result){

    // } 
    
    else {
      res.send({status : true, data : result})
    }
  })
})

server.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});
