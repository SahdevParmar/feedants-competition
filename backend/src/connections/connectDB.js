import mongoose from "mongoose";

export  async function connectDB(){
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('connected to DB')
    })
    .catch((error)=>{
        console.log('error:',error)
    })
}