import express from "express"
import cors from "cors"
import mongoose from "mongoose"


const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())


  

mongoose.connect("mongodb://localhost:27017/myapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>console.log("connected")).catch((err)=>console.log(err));


const userSchema =new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    usertype:String
})

const User = new mongoose.model("user", userSchema) 

app.post("/login" ,async (req,res)=>{
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        if (password === user.password) {
          res.send({ message: "Login Successfully",user:user});
        } else {
          res.send({ message: "Password didn't Match" });
        }
      } else {
        res.send({ message: "User Not Exist" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
    
})


app.post("/register", async (req, res)=> {
    const { name, email, password,usertype} = req.body
    console.log(req.body)
    try {
        const user = await User.findOne({ email: email });
        if (user) {
          res.send({ message: "User already registered" });
        } else {
          const newUser = new User({
            name,
            email,
            password,
            usertype
          });
          await newUser.save();
          res.send({ message: "Successfully Registered, Please login now." });
        }
      } catch (err) {
        res.send(err);
      }
      
    
})

app.listen(9002,() => {
    console.log("BE started at port 9002")
})