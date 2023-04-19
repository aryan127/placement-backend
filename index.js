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
    usertype:String,
    firstname:String,
    lastname:String,
    city:String,
    address:String,
    phoneno:Number,
    college:String,
    stream:String,
    dateofbirth:Number,
    skill:String



})

const userSchema2 =new mongoose.Schema({

  companyname:String,
  address:String,
  city:String,
  state:String,
  zipcode:Number
})

const User3=new mongoose.model("user3" ,userSchema2 )

const User = new mongoose.model("user", userSchema) 

app.put("/profile" ,async(req,res)=>{

  const {firstname,lastname,city,address,email,phoneno,college,stream,dateofbirth,skill }=req.body;
  console.log(req.body)
  try{
    const user=await User.findOne({email:email});
    
    if(!user){

      res.send({ message: "This Email hasn't been registered yet!"}); 
    }
    else{

      user.firstname = firstname;
      user.lastname = lastname;
      user.city = city;
      user.address = address;
      user.phoneno = phoneno;
      user.college = college;
      user.stream = stream;
      user.dateofbirth = dateofbirth;
      user.skill = skill;

      // Save updated user document
      await user.save();

      res.send({ message: "Profile successfully updated!" });
    }
  }
  catch (err) {
    res.send(err);
  }
  



} )

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

app.get("/login/get-details/:email",async (req,res)=>{
  const em = req.params.email
  const user = await User.findOne({ email:em})

  if(!user)
  {
    res.send({message:"Not exist"});
  }
  res.status(200).json(user);

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

app.post("/company",async (req,res)=>{
  const {companyname,address,city,state,zipcode}=req.body
  console.log(req.body)
  try{
    const user3=await User3.findOne({companyname :companyname});
    if(user3){
      res.send({ message: "This company is already in Everyone's feed" });

    }
    else{
      const newUser2=new User3({
        companyname,
        address,
        city,
        state,
        zipcode

      });
      await newUser2.save();
      res.send({ message: "Successfully Registered" });

    }

  }catch(err){
    res.send(err);
  }
})

app.get("/companydata" ,async (req,res)=>{
  try {
    const users = await User3.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }

})


const userSchema4 =new mongoose.Schema({
 email:String
})

const User4=new mongoose.model("user4" ,userSchema4 )

app.post("/addmem" , async (req,res)=>{
  const {email}=req.body
  console.log(req.body)
  try{
    const user4=await User4.findOne({email:email});
    if(user4)
    {
      res.send({message : "Already Added! "});
    }
    else{
      const user4=await User.findOne({email:email});
      if(user4)
      {
        const newUser = new User4({
          email
        });
        await newUser.save();
        res.send({ message : "Added Successfully !!"});
      }
      else{
        res.send({ message : "Not Found"});
      }
    }

  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }

})


app.get("/getmem" ,async (req,res)=>{
  try {
    const users = await User4.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }

})


app.get("/memornot/get-details/:email",async (req,res)=>{
  const em = req.params.email
  console.log(em);
  const user4=await User4.findOne({email:em});
  if(user4)
  {
    res.send({message:"True"});
  }
  else{
    res.send({message:"False"});

  }
 

})

app.delete("/memornot/delete/:email",async(req,res)=>{
  const em=req.params.email
  console.log(em);
  try {
    const user = await User4.findOneAndDelete({email: em});
    res.json(user);
   } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
  

})




app.listen(9002,() => {
    console.log("started at port 9002")
})