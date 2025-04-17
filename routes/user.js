var express = require("express");
var exe = require("./../connection");
var url = require("url"); 
var router = express.Router();


router.post("/save_appointment",async function(req,res){
    var d = req.body;
    var sql = `INSERT INTO appointment(patient_name,patient_mobile,appo_date,appo_time,patient_address,message)VALUES(?,?,?,?,?,?)`;
    var data = await exe (sql,[d.patient_name,d.patient_mobile,d.appo_date,d.appo_time,d.patient_address,d.message]) 
    // res.redirect()
    res.send("<script>location.href = document.referrer </script>");
})
// CREATE TABLE appointment(appo_id INT PRIMARY KEY AUTO_INCREMENT, patient_name VARCHAR(100), patient_mobile VARCHAR(15),appo_date TEXT,appo_time TEXT,patient_address TEXT,message TEXT)

router.get("/",async function(req,res){
    var tn = await exe(`SELECT * FROM top_nav`);
    var hs = await exe(`SELECT * FROM home_slider`);
    var hp = await exe(`SELECT * FROM happy_patient`);
    var ha = await exe(`SELECT * FROM home_about`);
    var Dr = await exe(`SELECT * FROM doctors`);
    var hb = await exe(`SELECT * FROM home_blog`);
    var dept = await exe(`SELECT * FROM departments`);
    // var has = await exe(`SELECT * FROM home_services`);
  
    var obj = {"tn":tn[0],"hs":hs,"hp":hp[0],"ha":ha[0],"Dr":Dr,"hb":hb,"dept":dept};
    res.render("user/index.ejs",obj)

    // var obj = {"Dr":Dr};
    // res.render("user/Our doctor.ejs")

})
router.get("/about",async function(req,res){
    var tn = await exe(`SELECT * FROM top_nav`);
    var obj = {"tn":tn[0]}
    res.render("user/about.ejs",obj)
})
router.get("/services",async function(req,res){
    var tn = await exe(`SELECT * FROM top_nav`);
    var obj = {"tn":tn[0]}
    res.render("user/services.ejs",obj)
})
router.get("/Our_doctor",async function(req,res){
    var tn = await exe(`SELECT * FROM top_nav`);
    var obj = {"tn":tn[0]}
    res.render("user/Our doctor.ejs",obj)
})
router.get("/gallary",async function(req,res){
    var tn = await exe(`SELECT * FROM top_nav`);
    var obj = {"tn":tn[0]}
    res.render("user/Gallary.ejs",obj)
})
router.get("/contact",async function(req,res){
    var tn = await exe(`SELECT * FROM top_nav`);
    var obj = {"tn":tn[0]}
    res.render("user/contact.ejs",obj)
})
router.get("/about",async function(req,res){
    var tn = await exe(`SELECT * FROM top_nav`);
    var obj = {"tn":tn[0]}
    res.render("user/about.ejs",obj)
})

router.get("/FAQ",async function(req,res){
    var tn = await exe(`SELECT * FROM top_nav`);
    var obj = {"tn":tn[0]}
    res.render("user/FAQs.ejs",obj)
})
router.get("/Patient",async function(req,res){
    var tn = await exe(`SELECT * FROM top_nav`);
    var obj = {"tn":tn[0]}
    res.render("user/Patient Testimonials.ejs",obj)
})
router.get("/Apointment",async function(req,res){
    var tn = await exe(`SELECT * FROM top_nav`);
    var obj = {"tn":tn[0]}
    res.render("user/Apointment.ejs",obj)
})



// department


// appointment

router.post("/save_appointments",async function(req,res){
    var d = req.body;
    var sql = `INSERT INTO appointments(patient_name,patient_email,patient_phone,appointment_date,appointment_time )VALUES(?,?,?,?,?)`;
    var data = await exe (sql,[d.patient_name,d.patient_email,d.patient_phone,d.appointment_date,d.appointment_time]);
    res.redirect("/Apointment")
})



// router.get("/Apointment",function(req,res){
//     res.render("user/Apointment.ejs")
// })

module.exports = router;