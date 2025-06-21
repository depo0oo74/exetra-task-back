import {connect} from "mongoose";

// Database creds
const DB_Cluster: string = process.env.DB_CLUSTER
const DB_Username: string = process.env.DB_USERNAME; 
const DB_Name: string = process.env.DB_NAME;
const DB_Password: string = process.env.DB_PASS; 

// Database connection string 
const DB_URL: string = `mongodb+srv://${DB_Username}:${DB_Password}@${DB_Cluster}.mk0uu.mongodb.net/${DB_Name}?retryWrites=true&w=majority`;

connect(DB_URL).then(() => {
    console.log("connected to database successfully!");
}).catch(err => {
    console.log(`An error occurred while connecting to database ${err}`);
})