var express = require("express");
var exe = require("./../connection");
var url = require("url"); 
var router = express.Router();

function verify_login(req,res,next)
{
    if(req.session.admin_id)
        next();
    else
        res.send("<script>location.href = document.referrer+'?login_required'</script>");
}

router.get("/", function(req,res){
    res.render("admin/login.ejs");
});

router.post("/proceed_login",async function(req,res){
    // res.send(req.body)
    var d = req.body;
    var sql = `SELECT * FROM admin_account WHERE admin_email = ? AND admin_password = ?`;
    var data = await exe(sql,[d.email, d.password]);
    if(data.length > 0)
        {
        var admin_id = data[0].admin_id;
        req.session.admin_id = admin_id;
        // Redirect back to the referrer or a default page
          let redirectUrl = req.get("/admin/")|| "index";
          redirectUrl = redirectUrl.replace("?login_required", ""); 
          // Remove login_required if present
  
          res.redirect(redirectUrl);
    }else
        res.send("login failed");
});

router.get("/logout",verify_login, function(req, res) {
    // Destroy the sessio
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
            res.send("Error logging out");
        } else {
            res.redirect("/admin"); 
        }
    });
});

router.get("/index",async function(req,res){
    var appointment = await exe (`SELECT * FROM appointments`);
    var obj = {"appointment":appointment}
    res.render("admin/index.ejs",obj)
})


router.get("/appointment",async function(req,res){
    var appointment = await exe (`SELECT * FROM appointments`);
    var obj = {"appointment":appointment}
    res.render("admin/appointment_list.ejs",obj)
})


router.get("/navbar",verify_login,async function(req,res){
    var data = await exe (`SELECT * FROM top_nav`);
    var obj = {"data":data};
    res.render("admin/navbar_edit.ejs",obj);

});
router.post("/update_top_nav",async function(req,res){
    var d = req.body;
    var sql = `INSERT INTO top_nav(mobile, email, time, whatsapp, insta, youtube, facebook) VALUES(?,?,?,?,?,?,?)`;
    var data = await exe(sql,[d.mobile, d.email, d.time, d.whatsapp, d.insta, d.youtube, d.facebook]);
    // alert("update successfully")
    res.redirect("/admin/navbar")
})

// CREATE TABLE top_nav(id INT PRIMERY KEY AUTO_INCREMENT, mobile VARCHAR(15), email VARCHAR(100), time VARCHAR(20), whatsapp TEXT, insta TEXT, youtube TEXT, facebook TEXT)



router.get("/home_slider",async function(req,res){
    var data = await exe(`SELECT * FROM home_slider`);
    var obj = {"data":data};
    res.render("admin/home slider.ejs",obj);
});
router.post("/update_home_slider",async function (req,res){
    if(req.files.slider_image1){
        slider_image1 = new Date().getTime()+req.files.slider_image1.name;
        req.files.slider_image1.mv("public/uploads/"+slider_image1);
    }
    var d = req.body;
    var sql = `INSERT INTO home_slider(slider_image1,slider_text1,slider_text2)VALUES(?,?,?)`;
    var data = await exe(sql,[slider_image1,d.slider_text1,d.slider_text2])
    res.redirect("/admin/home_slider")
    // res.send(data)
})
// CREATE TABLE home_slider(id INT PRIMARY KEY AUTO_INCREMENT,slider_image1 VARCHAR(200), slider_text1 VARCHAR(100), slider_image2 VARCHAR(200),slider_text2 VARCHAR(100),slider_image3 VARCHAR(200),slider_text3 VARCHAR(100),)
router.get("/edit_slider/:id",async function(req,res){
    var id = req.params.id;
    var data = await exe(`SELECT * FROM home_slider WHERE slider_id = ${id}`);
    var obj = {"data":data[0]}
    res.render("admin/edit_slider.ejs",obj)
})
router.post("/save_edit_slider",async function(req,res){
    if(req.files.edit_slider_image1){
        edit_slider_image1 = new Date().getTime()+req.files.edit_slider_image1.name;
        req.files.edit_slider_image1.mv("public/uploads/"+edit_slider_image1);
    }
    var d = req.body;
    var sql = await exe(`UPDATE home_slider SET slider_image1 = '${edit_slider_image1}', slider_text1= '${d.edit_slider_text1}' ,slider_text2= '${d.edit_slider_text1}'  WHERE slider_id= '${d.slider_id}'`);
    res.redirect("/admin/home_slider")
    // res.send(d);
});
router.get("/delete_slider/:id",async function(req,res){
    var id = req.params.id;
    var sql = await exe(`SELECT * FROM home_slider`)
    var sql = await exe(`DELETE FROM home_slider WHERE slider_id = '${id}'`)
    res.redirect("/admin/home_slider")
})

// router.get("/happy_patient",async function(req,res){
//     var data = await exe(`SELECT * FROM happy_patient`);
//     var obj = {"data":data};
//     res.render("admin/happy_patient.ejs",obj)
// })
// router.post("/update_happy_patient",async function(req,res){
//     var d = req.body;
//     var sql =  `INSERT INTO happy_patient(happy_patient, patient_visit, patient_likes)VALUES(?,?,?)`;
//     var data = await exe (sql,[d.happy_patient, d.patient_visit, d.patient_likes]);
//     res.redirect("/admin/happy_patient")
// })
// CREATE TABLE happy_patient(id INT PRIMARY KEY AUTO_INCREMENT,happy_patient VARCHAR(10), patient_visit VARCHAR(10), patient_likes VARCHAR(10))


router.get("/home_About",verify_login,async function(req,res){

    var data = await exe(`SELECT * FROM home_About`);
    var obj = {"data":data};
    res.render("admin/home About.ejs",obj);
});
router.post("/update_home_About",async function (req,res){

    if(req.files.About_image1){
        About_image1 = new Date().getTime()+req.files.About_image1.name;
        req.files.About_image1.mv("public/uploads/"+About_image1);
    }
    if(req.files.About_image2){
    
        About_image2 = new Date().getTime()+req.files.About_image2.name;
        req.files.About_image2.mv("public/uploads/"+About_image2);
    }
    if(req.files.About_image3){
        About_image3 = new Date().getTime()+req.files.About_image3.name;
        req.files.About_image3.mv("public/uploads/"+About_image3);
    }

    var d = req.body;
    var sql = `INSERT INTO home_About(About_image1,About_text1,sub_heding1,About_image2,About_text2,sub_heding2,About_image3,About_text3.sub_heding3)VALUES(?,?,?,?,?,?,?,?,?)`;
    var data = await exe(sql,[About_image1,d.About_text1,d.sub_heding1,About_image2,d.About_text2,d.sub_heding3,About_image3,d.About_text3,d.sub_heding3])
    res.redirect("/admin/home_About")
    // res.send(data)
});
// CREATE TABLE home_About(id INT PRIMARY KEY AUTO_INCREMENT,About_image1 VARCHAR(200), About_text1 VARCHAR(100), About_image2 VARCHAR(200),About_text2 VARCHAR(100),About_image3 VARCHAR(200),About_text3 VARCHAR(100),)


router.get("/home_Doctors",async function(req,res){

    var data = await exe(`SELECT * FROM doctors`);
    var obj = {"data":data};
    res.render("admin/doctors.ejs",obj);
});
router.post("/update_home_Doctors",async function (req,res){

    if(req.files.Doctors_image1){
        Doctors_image1 = new Date().getTime()+req.files.Doctors_image1.name;
        req.files.Doctors_image1.mv("public/uploads/"+Doctors_image1);
    }

    var d = req.body;
    var sql = `INSERT INTO doctors(Doctors_image1,Doctors_info1,Doctors_info2,Doctors_info3)VALUES(?,?,?,?)`;
    var data = await exe(sql,[Doctors_image1,d.Doctors_info1,d.Doctors_info2,d.Doctors_info3])
    res.redirect("/admin/home_Doctors")
    // res.send(data)
});
// CREATE TABLE doctors(id INT PRIMARY KEY AUTO_INCREMENT,Doctors_image1 VARCHAR(200), Doctors_info1 VARCHAR(100), Doctors_image2 VARCHAR(200),Doctors_info2 VARCHAR(100),Doctors_image3 VARCHAR(200),Doctors_info3 VARCHAR(100),)
router.get("/delete_Doctors/:id",async function(req,res){
    var id = req.params.id;
    var data = await exe(`SELECT * FROM doctors`)
    var sql = await exe(`DELETE FROM doctors WHERE doctor_id = ${id};`);

    res.redirect("/admin/home_Doctors")
})
router.get("/edit_Doctors/:id",async function(req,res){
    var id = req.params.id;
    var data =await exe (`SELECT * FROM doctors WHERE doctor_id = "${id}"`);
    var obj = {"data":data[0]}
    res.render("admin/edit_Doctors.ejs",obj)
})
router.post("/save_edit_Doctors",async function (req,res){
    if(req.files.edit_Doctors_image1){
        edit_Doctors_image1 = new Date().getTime()+req.files.edit_Doctors_image1.name;
        req.files.edit_Doctors_image1.mv("public/uploads/"+edit_Doctors_image1);
    }
    var d = req.body;
    var sql = `UPDATE doctors SET Doctors_image1 = ?, Doctors_info1 = ?, Doctors_info2 = ?, Doctors_info3 = ? WHERE doctor_id = ? `;
    var data = await exe (sql,[edit_Doctors_image1, d.edit_Doctors_info1, d.edit_Doctors_info2, d.edit_Doctors_info3, d.doctor_id])

    res.redirect("/admin/home_Doctors")
});

router.get("/blog",async function(req,res){
    var sql = await exe(`SELECT * FROM home_blog`);
    var obj = {"data":sql}
    res.render("admin/home_blog.ejs",obj);
});
router.post("/save_blog",async function (req,res){
    if(req.files.blog_image){
        blog_image = new Date().getTime()+req.files.blog_image.name;
        req.files.blog_image.mv("public/uploads/"+blog_image);
    }
    var d = req.body;
    var sql = await exe(`INSERT INTO home_blog(blog_image,blog_info )VALUES('${blog_image}','${d.blog_info}')`);
    res.redirect("/admin/blog");
});
// CREATE TABLE home_blog(blog_id INT PRIMARY KEY AUTO_INCREMENT, blog_image VARCHAR(200), blog_info TEXT)


router.get("/edit_blog/:id",async function(req,res){
    var id = req.params.id;
    var sql = await exe(`SELECT * FROM home_blog WHERE blog_id= '${id}'`);
    var obj = {"data":sql[0]}
    res.render("admin/edit_home_blog.ejs",obj);
});
router.post("/save_edit_blog",async function (req,res){
    if(req.files.edit_blog_image){
        edit_blog_image = new Date().getTime()+req.files.edit_blog_image.name;
        req.files.edit_blog_image.mv("public/uploads/"+edit_blog_image);
    }
    var d = req.body;
    var sql = await exe(`UPDATE home_blog SET blog_image = '${edit_blog_image}', blog_info ='${d.edit_blog_info}' WHERE blog_id = '${d.blog_id}'`);
    res.redirect("/admin/blog");
});
router.get("/delete_blog/:id",async function(req,res){
    var id = req.params.id;
    var sql = await exe(`SELECT * FROM home_blog`);
    var sql = await exe (`DELETE FROM home_blog WHERE blog_id = '${id}'`)
    res.redirect("/admin/blog");
});

router.get("/home_dep",async function(req,res){
    var departments = await exe (`SELECT * FROM departments`);
    var obj = {"departments":departments}
    res.render("admin/department.ejs",obj)
})

router.post("/save_department",async function(req,res){
    var d = req.body;
    var sql = `INSERT INTO departments(dept_name,dept_desc)VALUES(?,?)`;
    var data = await exe (sql,[d.dept_name,d.dept_desc]);
    res.redirect("/admin/home_dep")
})

router.get("/delete_department/:id",async function(req,res){
    var id = req.params.id;
    var departments = await exe (`SELECT * FROM departments`);
    var data = await exe (`DELETE FROM departments WHERE dept_id = '${id}'`);
    res.redirect("/admin/home_dep")

})

router.get("/edit_department/:id",async function(req,res){
    var id = req.params.id;
    var departments = await exe (`SELECT * FROM departments WHERE dept_id = '${id}'`);
    var obj = {"departments":departments[0]}
    res.render("admin/edit_home_dep.ejs",obj)

})

router.post("/save_edit_department",async function(req,res){
    var d = req.body;
    var sql = await exe(`UPDATE departments SET dept_name ='${d.edit_dept_name}', dept_desc ='${d.edit_dept_desc}' WHERE dept_id = '${d.edit_dept_id}'`);
    res.redirect("/admin/home_dep")
})


// Home department








// CREATE TABLE home_dep(dep_id INT PRIMARY KEY AUTO_INCREMENT, dep_info TEXT)


// Home Service 



// why choos


router.get("/whychoos",async function(req,res){
    var whychoos = await exe (`SELECT * FROM whychoos`);
    var obj = {"whychoos":whychoos}
    res.render("admin/whychoos.ejs",obj)
})

router.post("/save_whychoos",async function(req,res){
    var d = req.body;
    var sql = `INSERT INTO whychoos(heading,description )VALUES(?,?)`;
    var data = await exe (sql,[d.heading,d.description ]);
    res.redirect("/admin/whychoos")
})

router.get("/delete_whychoos/:id",async function(req,res){
    var id = req.params.id;
    var whychoos = await exe (`SELECT * FROM whychoos`);
    var data = await exe (`DELETE FROM whychoos WHERE why_id = '${id}'`);
    res.redirect("/admin/whychoos")

})

router.get("/edit_whychoos/:id",async function(req,res){
    var id = req.params.id;
    var whychoos = await exe (`SELECT * FROM whychoos WHERE why_id = '${id}'`);
    var obj = {"whychoos":whychoos[0]}
    res.render("admin/edit_whychoos.ejs",obj)

})

router.post("/save_edit_whychoos",async function(req,res){
    var d = req.body;
    var sql = await exe(`UPDATE whychoos SET heading ='${d.edit_heading}', description  ='${d.edit_description}' WHERE why_id = '${d.edit_why_id}'`);
    res.redirect("/admin/whychoos")
})


//CREATE TABLE whychoos(why_id INT PRIMARY KEY AUTO_INCREMENT , heading VARCHAR(200), description VARCHAR(500))

















router.get("/edit_services/:id",async function(req,res){
    var id = req.params.id;
    var sql = await exe(`SELECT * FROM home_services WHERE services_id= '${id}'`);
    var obj = {"data":sql[0]}
    res.render("admin/edit_home_services.ejs",obj);
});
router.post("/save_edit_services",async function (req,res){
     var d = req.body;
    var sql = await exe(`UPDATE home_services SET services_info ='${d.edit_services_info}' WHERE services_id = '${d.blog_id}'`);
    res.redirect("/admin/services");
});
router.get("/delete_services/:id",async function(req,res){
    var id = req.params.id;
    var sql = await exe(`SELECT * FROM home_services`);
    var sql = await exe (`DELETE FROM home_services WHERE services_id = '${id}'`)
    res.redirect("/admin/services");
});

// CREATE TABLE home_services(services_id INT PRIMARY KEY AUTO_INCREMENT, services_info TEXT)





// Gallery   

router.get("/edit_gallery/:id",async function(req,res){
    var id = req.params.id;
    var sql = await exe(`SELECT * FROM gallery WHERE gallery_id= '${id}'`);
    var obj = {"data":sql[0]}
    res.render("admin/gallery.ejs",obj);
});
router.post("/update_gallery", async function(req, res) {
    var d = req.body;
    console.log(d); // Check what data is coming from the form

    // Ensure edit_gallery_image is extracted correctly
    var edit_gallery_image = d.edit_gallery_image;

    // Check if the variable is defined
    if (!edit_gallery_image) {
        console.error("edit_gallery_image is not defined!");
        return res.status(400).send("Gallery image is required.");
    }

    var sql = await exe(`UPDATE gallery SET gallery_image = '${edit_gallery_image}', gallery_info ='${d.edit_gallery_info}' WHERE gallery_id = '${d.gallery_id}'`);
    res.redirect("/admin/gallery");
});

router.get("/delete_gallery/:id",async function(req,res){
    var id = req.params.id;
    var sql = await exe(`SELECT * FROM gallery`);
    var sql = await exe (`DELETE FROM gallery WHERE gallery_id = '${id}'`)
    res.redirect("/admin/gallery");
});






module.exports = router;








router.get("/services",function(req,res){
    res.render("admin/services.ejs");
});
router.get("/gallery",function(req,res){
    res.render("admin/gallery.ejs");
});

router.get("/",function(req,res){
    res.render("admin/.ejs");
});

router.get("/contact",function(req,res){
    res.render("admin/contact.ejs");
});

router.get("/",function(req,res){
    res.render("admin/contact.ejs");
});
module.exports = router;