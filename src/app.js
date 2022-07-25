const express = require('express');
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const app = express();
require("./db/conn");
const Register = require("./models/register");
const AddStudent = require("./models/studentSchema");
const { json } = require("express");
const port = process.env.PORT || 3000;
const XLSX = require("xlsx");
const cors=require('cors');

const static_path = (path.join(__dirname, "../public"));
const template_path = (path.join(__dirname, "../templates/views"));
const partials_path = (path.join(__dirname, "../templates/partials"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/addstudent", (req, res) => {
    res.render("addstudent");
})

app.get("/updatestudent", (req, res) => {
    res.render("updatestudent");
})

app.get("/viewstudent", (req, res) => {
    res.render("viewstudent");
})

app.get("/login", (req, res) => {
    res.render("login");
});

// download excel sheet
app.get("/downloadsheet", async (req, res) => {
    const studentsdata = await AddStudent.find({});
    let finalData = [];
    for(let i = 0; i < studentsdata.length; i++){
        let newData = {
            "Name": studentsdata[i].name,
            "Dob": studentsdata[i].dob,
            "School": studentsdata[i].school,
            "Class": studentsdata[i].class,
            "Division": studentsdata[i].division,
            "Status": studentsdata[i].status,
        };
        finalData.push(newData);
    };
    const workSheet = XLSX.utils.json_to_sheet(finalData);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
    XLSX.writeFile(workBook, "Students.xlsx");
    res.status(200).send({message: "Success", data: true});
});

// get students data
app.post("/getdatabyid", async (req, res) => {
    const studentsdata = await AddStudent.findOne({_id: req.body.id});
    res.status(200).send({message: "Success", data: studentsdata});
});

// update students data
app.post("/updatestudentsdata", async (req, res) => {
    const studentsdata = await AddStudent.updateOne({_id: req.body.id}, req.body.values);
 res.status(200).send({message: "Success", data: true});
});

// get students data
app.get("/getstudentsdata", async (req, res) => {
    const studentsdata = await AddStudent.find({});
    res.status(200).send({message: "Success", data: studentsdata});
});

// delete students data
app.post("/deletestudent", async (req, res) => {
    const studentsdata = await AddStudent.remove({_id: req.body.id});
    res.status(200).send({message: "Success", data: studentsdata});
});

// add students
app.post("/addstudentdata", async (req, res) => {
    try {
        const studentData = new AddStudent({
            name: req.body.name,
            dob: req.body.dob,
            school: req.body.school,
            class: req.body.class,
            division: req.body.division,
            status: req.body.status,
        });
        const registered = await studentData.save();
        res.status(200).send({message: "Success", data: true});
    }
    catch(err){
        console.log(err);
        res.status(400).send(err);
    }
});

// create a new user in our database
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            const registerStudent = new Register({
                email: req.body.email,
                password: password,
                confirmpassword: cpassword,
            });
            const registered = await registerStudent.save();
            res.status(201).render("login");
        } else {
            res.send("passwords are not matching");
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

//login check
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await Register.findOne({ email: email });
        const isMatch = await bcrypt.compare(password, useremail.password);

        if (isMatch) {
            res.status(201).render("addstudent");
        } else {
            res.send("Invaid login details");
        }
    } catch (error) {
        res.status(400).send("invalid login details");
    }
});

app.listen(port, () => {
    console.log(`server is runing at port no ${port}`);
})
