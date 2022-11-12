var puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const id = '1891134';
    const pw = 'password';
    
    await page.goto('https://learn.hansung.ac.kr/login.php');
    await page.evaluate((id, pw) => {
    document.querySelector('input[name="username"]').value = id;
    document.querySelector('input[name="password"]').value = pw;
    }, id, pw);

    await page.click('input[name="loginbutton"]');

    await page.waitForTimeout(500);

    if(page.url() === 'https://learn.hansung.ac.kr/login.php'){
        student_id = 'nope';
        name = 'nope';
    }
  
    else{
        await page.goto('http://learn.hansung.ac.kr/');
        const options = await page.$$eval('div[class="course-title"]', options => {
          return options.map(option => option.textContent);
        });
        console.log(options);
        
        await page.screenshot({path: 'example.png'});
        
    }
    await browser.close();        
    
})();