Hello App Academy Student!



Are you tired of having check in three times a day? Well fret no more. This tool runs quietly in the background and, within two minutes of when you are able to check in, will automatically deploy and check in for you.



Notes on Installation: This application uses the npm package "puppeteer", which interfaces with Chromium (the open source base of google chrome). For users who do not already have Chromium installed, it will be automatically installed by NPM.

FOR WINDOWS USERS!!!!!!!!!
WSL does not currently support puppeteer; however, puppeteer has no problems if run through command prompt. As long as you have NPM and Node installed within windows (which, on my machine, was done automatically) the only difference is navigating to the package. Download from github (either with git or through your browser). Use command prompt to navigate to the directory ("cd" is still "cd", "ls" is now "DIR"). Run npm i. Then npm start.





Use:

On first use, Chromium will open up a window so that you can configure your settings. Because App Academy uses github to log students in, you will provide your credentials there. ALL INFORMATION IS STORED ONLY ON YOUR MACHINE AND IS NEVER ACCESSED BESIDES TO LOG YOU IN.

This application can be run headlessly or not. If headless, the application will check you in without any visible Chromium window opening up. If not headless, Chromium will open upon launch and close again after check in. 
Either way, a message will print out in the terminal confirming that you were checked in.



On computer startup, run "npm start" from the application's directory. It will run in the background and only launch during check in (and will never launch over the weekend). If you ever want to reconfigure, "run npm run config", or delete the config.json file and restart the program. 



Ethics:

Of course, this application is only to be used when you are at the computer. This is to keep you from worrying about forgetting to check in...not to forge your attendance. Always use in an ethical manner :)



Disclaimer:

I tried to iron out all the bugs in testing. Of course, there is always the possibility of a bug that is currently unforeseen (we haven't graduated yet, after all). So, I do not take any responsibility for possible strikes incurred from over-reliance on this application. That being said, if you have any trouble, please contact me so that I can sort it out to make this application better. Thanks :)
