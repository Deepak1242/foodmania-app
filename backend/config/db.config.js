import mongoose from 'mongoose';


const StartDB = async() =>{
    try{

        await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }).then(()=>{
            console.log("MongoDB connected successfully");
        }).catch((error) => {
            console.error("MongoDB connection error:", error);
        });

    }catch(error){
        console.error("Error connecting to MongoDB:", error);
    }
}

export default StartDB;