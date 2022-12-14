var puppeteer = require('puppeteer');

const attendURL = "https://learn.hansung.ac.kr/report/ubcompletion/user_progress_a.php?id=";

const getCrawlData = async (userid, userpassword) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("https://learn.hansung.ac.kr/login.php");
    
    await page.type("input[name=username]", userid);
    await page.type("input[name=password]", userpassword);
    await page.click("input[name=loginbutton]");

    const wait = await page.waitForSelector("div.course_lists", { timeout: 5000 })
        .then(() => true)
        .catch(() => false);
    
    if(!wait) //login failed
        return {};

    const searchData = await page.evaluate(() => {
        const contentsList = Array.from(page.querySelectorAll("li.course_label_re_02"));
        const contentObjList = contentsList.map(item => {
            const titleText = item.querySelector("h3").innerText;
            const link = item.querySelector(".course_link");
            const classId = link.href.split("id=")[1];

            let title = titleText;
            if(title.substring(title.length - 3, 3).toLowerCase() === "new")
                title = title.substring(0, title.length - 3);

            return { title, link: link.href, classId }
        });
        return contentObjList;
    });

    const searchDataWithAttend = [];
    for(let a = 0; a < searchData.length; a ++) {
        await page.goto(`${attendURL}${searchData[a].classId}`);
        await page.waitForSelector(".user_progress_table", { timeout: 5000 })
        const attendList = await page.evaluate(() => {
            const contentsList = Array.from(page.querySelectorAll(".user_progress_table tbody tr"));
            const contentObjList = [];
            let span = 0;
            let index = -1;
            let at_index = 0;

            for(let a = 0; a < contentsList.length; a ++) {
                let lectureTitle = "";
                let current = "";
                let maxTime = 0;
                let currentTime = 0;

                const max = contentsList[a].querySelector(".hidden-sm").innerText.trim();
                const maxt = max.split(":");
                maxTime = (60 * parseInt(maxt[0])) + (parseInt(maxt[1]));

                const tdList = Array.from(contentsList[a].querySelectorAll(".text-center"));

                const titleTd = contentsList[a].querySelector(".text-left");
                if(titleTd != null)
                    lectureTitle = titleTd.innerText.trim();

                if(span <= 0) {
                    for(let b = 0; b < tdList.length; b ++) {
                        span = tdList[b].getAttribute("rowspan");
                        if(span != null)
                            break;
                        span = 1;
                    }
                    contentObjList[++ index] = [];
                    at_index = 0;
                }

                const buttonNode = contentsList[a].querySelector("button");
                if(buttonNode != null) {
                    current = buttonNode.parentNode.innerText;
                    try {
                        current = current.split("\n")[0].trim();
                        const currentt = current.split(":");
                        currentTime = (60 * parseInt(currentt[0])) + (parseInt(currentt[1]));
                    } catch(err) {}
                }

                if(lectureTitle !== "")
                    contentObjList[index][at_index] = { lectureTitle, currentTime, maxTime }
                at_index ++
                span --;
            }
            return contentObjList;
        });
        searchDataWithAttend[a] = { ...searchData[a], attendList }
    }

    await browser.close();

    return searchDataWithAttend;
};

getCrawlData("1891266", "password").then(console.log).catch(console.error);