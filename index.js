const puppeteer = require("puppeteer");
const username = //add username here as string
const password = //add password here as string
//this determins if you want it to run headless. 
//False will cause it to run such that you can see it pop up on your screen
//True will cause it to run silently in the background
//Either way, the console will log the fact that you were checked in
const headless = false;


let lastRunDate = new Date();
let morningCheckin = {done:false};
let lunchCheckin = {done:false};
let afternoonCheckin = {done:false};

const checkin = async (checker, name) =>{
    console.log("test")
    const browser = await puppeteer.launch({headless: headless});
    const page = await browser.newPage();
    page.on("domcontentloaded", async ()=>{
        console.log(page.url())
        if(page.url() === "https://progress.appacademy.io/me"){
            try{
            await page.click(".student-check-in-form button");
            checker.done = true;
            console.log(`${name} checkin has been completed`)
            browser.close();
            } catch(e){
                console.log(e);
                console.log("Could not find the checkin button. Please click manually")
            }
            
        }
    });
    await page.goto("https://progress.appacademy.io/students/auth/github");
    await page.type("#login_field", username, {delay: 100});
    await page.type("#password", password, {delay: 50});
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

setInterval(dateChecker, 120000);
console.log("Automatic checkin is running");