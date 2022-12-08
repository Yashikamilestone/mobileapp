let express = require("express");
const path = require("path");
const publicPath = path.join(__dirname, '..', 'public');
let bodyParser = require("body-parser");
let app = express();
app.use(bodyParser.json());
app.use(function (req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods",
    "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers", 
        "Origin,X-Requested-With,Content-Type,Accept"
    );
    next();

});
const port= process.env.PORT || 2410;
app.listen(port,()=> console.log(`Node app Listining on port ${port}!`));
const { Client } = require("pg");
const client = new Client({
    user: "postgres",
    password: "bde4d27c953ee4bce4abdd8c3fe94a0b6a37877511678075283d06e161066450",
    database: "postgres",
    port: 5432,
    host: "db.nmcwsrkeenkdtdwefhdh.supabase.co",
    ssl: { rejectUnauthorized: false },
});
client.connect(function (res, error) {console.log(`Connected!!!`);});
app.get("/mobiles/brand/:brandname" , function(req,res){
    let name = req.params.brandname;
    let sql = `SELECT * FROM mobiles WHERE brand = $1`;
    client.query(sql,[name], function (err, result) {
        if (err) {
             res.status(400).send(err);
             console.log(err);
            }
        res.send(result.rows); 
    });
})
app.get("/mobiles/RAM/:ramname" , function(req,res){
    let name = req.params.ramname;
    let sql = `SELECT * FROM mobiles WHERE ram = $1`;
    client.query(sql,[name], function (err, result) {
        if (err) {
             res.status(400).send(err);
             console.log(err);
            }
        res.send(result.rows); 
    });
})
app.get("/mobiles/ROM/:romname" , function(req,res){
    let name = req.params.romname;
    let sql = `SELECT * FROM mobiles WHERE rom = $1`;
    client.query(sql,[name], function (err, result) {
        if (err) {
             res.status(400).send(err);
             console.log(err);
            }
        res.send(result.rows); 
    });
})

app.get("/mobiles/OS/:osname" , function(req,res){
    let name = req.params.osname;
    let sql = `SELECT * FROM mobiles WHERE os = $1`;
    client.query(sql,[name], function (err, result) {
        if (err) {
             res.status(400).send(err);
             console.log(err);
            }
        res.send(result.rows); 
    });
})
app.get("/mobiles/:name" , function(req,res){
    let name = req.params.name;
    let sql = `SELECT * FROM mobiles WHERE name = $1`;
    client.query(sql,[name], function (err, result) {
        if (err) {
             res.status(400).send(err);
             console.log(err);
            }
        res.send(result.rows); 
    });
})
app.get("/mobiles" , function(req,res){
    let brandstr = req.query.brand;
    let ramstr = req.query.ram;
    let romstr = req.query.rom; 
    let sql = "SELECT * FROM mobiles";
    client.query(sql, function (err, result) {
        if (err) {
             res.status(400).send(err);
             console.log(err);
            }
        else{
            let mobiles = result.rows;
            if(brandstr){
                let brandArr = brandstr.split(",");
                mobiles = mobiles.filter((f1)=>brandArr.find((b1)=>f1.brand===b1));
            }
            if(ramstr){
                let ramArr = ramstr.split(",");
                mobiles = mobiles.filter((f1)=>ramArr.find((b1)=>f1.ram===b1));
            }
            if(romstr){
                let romArr = romstr.split(",");
                mobiles = mobiles.filter((f1)=>romArr.find((b1)=>f1.rom===b1));
            }
            res.send(mobiles); 
        }
        
    });
});

app.post("/mobiles", function(req,res){
    var values = Object.values(req.body);
    let body = req.body;
    console.log(values)
    let sql = `INSERT INTO mobiles (name,price,brand,ram,rom,os) VALUES($1,$2,$3,$4,$5,$6)`;
    client.query(sql ,values, function(err,result){
        if(err) res.status(404).send(err)
        else res.send(`${result.rowCount} insertion successful`);
    })
})
app.put("/mobiles/:name", function(req,res){
    let name = req.params.name;
    let body = req.body;
    let data = [body.price,body.brand,body.ram,body.rom,body.os,name];
    console.log(data)
   
    let sql = `update mobiles SET price = $1 , brand = $2 , ram = $3 , rom = $4 , os= $5 WHERE name = $6`;
    client.query(sql ,data, function(err,result){
        if(err) res.status(404).send(err)
        else  res.send(`${result.rowCount} updation successful`);
    })
})
app.delete("/mobiles/:name", function(req,res){
    let name = req.params.name;
    let data = [name]
    let sql = `DELETE FROM mobiles WHERE name = $1 `;
    client.query(sql, data, function(err,result){
        if(err) res.status(404).send(err)
        else {
            if(result.rows.length>0) res.send(result.rows);
            else res.send("No detail Found")
        }
    });
})
