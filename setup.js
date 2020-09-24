const express = require("express");
const fs = require("fs");
const server = {server:""}

const setup = ()=>{
    const app = express();

    app.use(express.urlencoded());

    app.get("/", (req, res) =>{
        res.sendFile(__dirname+"\\form.html");
    })

    app.post("/config", (req, res) => {
        const {username, password, headless, test} = req.body;
        const ob = {username, password};
        if(headless){
            ob.headless = true;
        }else{
            ob.headless = false;
        }
        if(test){
            ob.test = true;
        }else{
            ob.test = false;
        }
        const data = JSON.stringify(ob)
        fs.writeFile("./config.json", data, ()=>{
            console.log("Config info saved")
        });
        res.send("Config info saved. Closing this browser window will refresh your settings")
        server.server.close();
        console.log("Server sucessfully closed")

    })
    server.server = app.listen(3333, ()=> console.log("Launching configure"))
}

module.exports = {setup}