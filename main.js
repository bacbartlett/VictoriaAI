const puppeteer = require("puppeteer");
const {setup} = require("./setup.js")
const fs = require("fs");




const main = (forceConfig = false)=>{
    const settings = {username:"needsconfig", password:"needsconfig", headless:false, test:true};
    let needsConfig = false;

    let lastRunDate = new Date();
    let morningCheckin = {done:false};
    let lunchCheckin = {done:false};
    let afternoonCheckin = {done:false};

    const checkConfig = async (settings) => {
        if(needsConfig || (settings.username === "needsconfig" || settings.password === "needsconfig")){
            setup();
            const browser = await puppeteer.launch({headless: false});
            const page = await browser.newPage();
            await page.goto("http://localhost:3333/")
            page.on("close", ()=>{
                console.log("Refreshing settings")
                readConfig(settings)
            });
        }
    }

    const readConfig = (settings, forceConfig = false) =>{
        if(forceConfig){
            needsConfig = true;
            checkConfig(settings);
            return;
        }
        fs.readFile("./config.json", "utf-8", (err, data) =>{
            try{newSettings = JSON.parse(data);
                settings.username = newSettings.username;
                settings.password = newSettings.password;
                settings.headless = newSettings.headless;
                settings.test = newSettings.test;
                console.log("Configure sucessful. Automatic checkin is running")
                if(settings.test){
                    checkin(null, null, true)
                }
            }catch(e){
                console.log("Configure file missing. Running configurer process");
                needsConfig = true;
                checkConfig(settings)
            }
        })
    }

    const setTestToFalse = () =>{
        settings.test = false;
        fs.writeFile("./config.json", JSON.stringify(settings), ()=>{
            return;
        })
    }

    const checkin = async (checker, name, test = false) =>{
        let browser;
        if(test){
            browser = await puppeteer.launch({headless: false});
            setTestToFalse();
        }else{
            browser = await puppeteer.launch({headless: settings.headless});
        }
        const page = await browser.newPage();
        page.on("domcontentloaded", async ()=>{
            if(page.url() === "https://progress.appacademy.io/me"){
                try{
                await page.click(".student-check-in-form button");
                checker.done = true;
                console.log(`${name} checkin has been completed`)
                browser.close();
                } catch(e){
                    if(test){
                        console.log("Test sucessful. Please close browser")
                    } else{
                        console.log(e);
                        console.log("Could not find the checkin button. Please click manually")
                    }
                }
                
            }
        });
        await page.goto("https://progress.appacademy.io/students/auth/github");
        await page.type("#login_field", settings.username, {delay: 100});
        await page.type("#password", settings.password, {delay: 50});
        await page.click(".btn-primary");
    }

    const setToFalse = () =>{
        morningCheckin.done = false;
        lunchCheckin.done = false;
        afternoonCheckin.done = false;
    }

    const dateChecker = () =>{
        const date = new Date();
        //check if new day
        if(lastRunDate.getUTCDay() !== date.getUTCDay()){
            setToFalse()
        }
        //check if weekend
        if(date.getUTCDay() === 0 || date.getUTCDay() === 6){
            return;
        }
        
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();


        if(!morningCheckin.done && ((hours === 14 && minutes > 55)||(hours === 15 && minutes < 3))){
            checkin(morningCheckin, "Morning");
            return;
        } else if(!lunchCheckin.done && ((hours === 19 && minutes > 25)&&(hours === 19 && minutes < 35))){
            checkin(lunchCheckin, "Lunch");
            return;
        } else if(!afternoonCheckin.done && ((hours === 21 && minutes > 55)||(hours === 22 && minutes < 3))){
            checkin(afternoonCheckin, "Afternoon");
            return;
        }

    }

    readConfig(settings, forceConfig)
    setInterval(dateChecker, 120000);
}
module.exports = {main}