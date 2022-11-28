const express = require("express");
const bodyParser = require("body-parser");
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const loginURL = "https://learn.hansung.ac.kr/login.php";
const attendURL = "https://learn.hansung.ac.kr/report/ubcompletion/user_progress_a.php?id=";
const homeworkURL = "http://learn.hansung.ac.kr/mod/assign/index.php?id=";
const noticeURL = "http://learn.hansung.ac.kr/mod/ubboard/view.php?id=";

const sessionKey = {};

const broswers = {};
const pages = {};
const templates = {};

const getCrawlData = async (key) => {
    if(key === undefined || key === null)
        return [];

    if(sessionKey[key] === undefined || sessionKey[key] === null)
        return [];

    const { userid, userpassword } = sessionKey[key];
    if(broswers[key] === undefined || broswers[key] === null) {
        const result = await login(userid, userpassword);
        if(!result)
            return [];
    }
    const page = pages[key][0];
    

    if(templates[key] === undefined || templates[key] === null) {
        await page.goto("http://learn.hansung.ac.kr/");
        const wait = await page.waitForSelector("div.course_lists", { timeout: 5000 })
            .then(() => true)
            .catch(() => false);
        
        if(!wait)
            return [];

        templates[key] = await page.evaluate(() => {
            const contentsList = Array.from(document.querySelectorAll("li.course_label_re_02"));
            const contentObjList = contentsList.map(item => {
                const titleText = item.querySelector("h3").innerText;
                const link = item.querySelector(".course_link");
                const classId = link.href.split("id=")[1];

                let title = titleText.trim();
                if(title.substring(title.length - 3).toLowerCase() === "new")
                    title = title.substring(0, title.length - 3);

                return { title, link: link.href, classId }
            });
            return contentObjList;
        });
    }

    const template = templates[key];
    const searchData = [...template];

    const searchDataWithAttend = [];
    for(let a = 0; a < searchData.length; a ++) {
        await page.goto(`${attendURL}${searchData[a].classId}`);
        await page.waitForSelector(".user_progress_table", { timeout: 5000 })
        const attendList = await page.evaluate(() => {
            const contentsList = Array.from(document.querySelectorAll(".user_progress_table tbody tr"));
            const contentObjList = [];
            let span = 0;
            let index = -1;
            let at_index = 0;

            const timestampToInt = (timestamp) => {
                const timeS = timestamp.split(":").reverse();
                let time = 0;
                for(let a = 0; a < timeS.length; a ++)
                    time += parseInt(timeS[a]) * (60 ** a);
                return time;
            };

            for(let a = 0; a < contentsList.length; a ++) {
                let lectureTitle = "";
                let current = "";
                let maxTime = 0;
                let currentTime = 0;

                const max = contentsList[a].querySelector(".hidden-sm").innerText.trim();
                maxTime = timestampToInt(max);

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
                        currentTime = timestampToInt(current);
                    } catch(err) {}
                }

                if(lectureTitle !== "")
                    contentObjList[index][at_index] = { lectureTitle, currentTime, maxTime }
                at_index ++
                span --;
            }
            return contentObjList;
        });

        try {
            await page.goto(searchData[a].link);
            await page.waitForSelector(".total_sections", { timeout: 5000 });
            const vodIdList = await page.evaluate(() => {
                const contentsList = Array.from(document.querySelectorAll(".total_sections .modtype_vod .activityinstance a"));
                return contentsList.map(item => item.href.split("id=")[1]);
            });
            
            let vodIndex = 0;
            for(let v = 0; v < attendList.length; v ++) {
                if(attendList[v].length == 0)
                    continue;
                for(let atv = 0; atv < attendList[v].length; atv ++) {
                    const vodLink = `http://learn.hansung.ac.kr/mod/vod/viewer.php?id=${vodIdList[vodIndex ++]}`;
                    attendList[v][atv] = { ...attendList[v][atv], url: vodLink }
                }
            }
        } catch(err) {}


        searchDataWithAttend[a] = { ...searchData[a], attendList }
    }

    return searchDataWithAttend;
};

const getHomworkData = async (key) => {
    if(key === undefined || key === null)
        return [];

    if(sessionKey[key] === undefined || sessionKey[key] === null)
        return [];

    const { userid, userpassword } = sessionKey[key];
    if(broswers[key] === undefined || broswers[key] === null) {
        const result = await login(userid, userpassword);
        if(!result)
            return [];
    }
    const page = pages[key][1];
    

    if(templates[key] === undefined || templates[key] === null) {
        await page.goto("http://learn.hansung.ac.kr/");
        const wait = await page.waitForSelector("div.course_lists", { timeout: 5000 })
            .then(() => true)
            .catch(() => false);
        
        if(!wait)
            return [];

        templates[key] = await page.evaluate(() => {
            const contentsList = Array.from(document.querySelectorAll("li.course_label_re_02"));
            const contentObjList = contentsList.map(item => {
                const titleText = item.querySelector("h3").innerText;
                const link = item.querySelector(".course_link");
                const classId = link.href.split("id=")[1];

                let title = titleText.trim();
                if(title.substring(title.length - 3).toLowerCase() === "new")
                    title = title.substring(0, title.length - 3);

                return { title, link: link.href, classId }
            });
            return contentObjList;
        });
    }

    const template = templates[key];
    const searchData = [...template];

    const searchDataWithHomework = [];
    for(let a = 0; a < searchData.length; a ++) {
        let homeworkList = [];

        try {
            await page.goto(`${homeworkURL}${searchData[a].classId}`);

            await page.waitForSelector("#region-main", { timeout: 5000 });

            homeworkList = await page.evaluate(() => {
                const contentsList = Array.from(document.querySelectorAll(".generaltable tbody tr"));
                const contentsObjList = [];

                let offset = 0;
                for(let a = 0; a < contentsList.length; a ++) {
                    const item = contentsList[a];

                    let name, deadline, url, report, attach;

                    try {
                        const link = item.querySelector(".c1 a");
                        name = link.innerText;
                        deadline = item.querySelector(".c2").innerText;
                        url = link.href;
                        report = item.querySelector(".c3").innerText === "제출 완료";
                        attach = [];
                    } catch(err) {
                        continue;
                    }

                    contentsObjList[offset ++] = { name, deadline, url, report, attach };
                }

                return contentsObjList;
            });
        } catch(err) {}

        searchDataWithHomework[a] = { ...searchData[a], homework: homeworkList }
    }

    return searchDataWithHomework;
};

const getNoticeData = async (key) => {
    if(key === undefined || key === null)
        return [];

    if(sessionKey[key] === undefined || sessionKey[key] === null)
        return [];

    const { userid, userpassword } = sessionKey[key];
    if(broswers[key] === undefined || broswers[key] === null) {
        const result = await login(userid, userpassword);
        if(!result)
            return [];
    }
    const page = pages[key][2];
    

    if(templates[key] === undefined || templates[key] === null) {
        await page.goto("http://learn.hansung.ac.kr/");
        const wait = await page.waitForSelector("div.course_lists", { timeout: 5000 })
            .then(() => true)
            .catch(() => false);
        
        if(!wait)
            return [];

        templates[key] = await page.evaluate(() => {
            const contentsList = Array.from(document.querySelectorAll("li.course_label_re_02"));
            const contentObjList = contentsList.map(item => {
                const titleText = item.querySelector("h3").innerText;
                const link = item.querySelector(".course_link");
                const classId = link.href.split("id=")[1];

                let title = titleText.trim();
                if(title.substring(title.length - 3).toLowerCase() === "new")
                    title = title.substring(0, title.length - 3);

                return { title, link: link.href, classId }
            });
            return contentObjList;
        });
    }

    const template = templates[key];
    const searchData = [...template];

    for(let a = 0; a < searchData.length; a ++) {
        await page.goto(searchData[a].link);
        await page.waitForSelector("#region-main", { timeout: 5000 });

        const nLink = await page.evaluate(() => {
            try {
                const activityList = Array.from(document.querySelectorAll(".activityinstance a"));
                return activityList[0].href;
            } catch(err) {
                return null;
            }
        });

        await page.goto(nLink);
        await page.waitForSelector(".ubboard_table", { timeout: 5000 });

        const pageCount = await page.evaluate(() => {
            let pageCount = 0;
            try {
                const pages = Array.from(document.querySelectorAll(".pagination li"));
                return pages.length == 0 ? 1 : pages.length;
            } catch(err) {
                return 1;
            }
        });

        let notification = [];
        for(let b = 0; b < pageCount; b ++) {
            if(b != 0) {
                await page.goto(`${ nLink }&page=${ b + 1 }`);
                await page.waitForSelector("#region-main", { timeout: 5000 });
            }
            const newNoti = await page.evaluate(() => {
                try {
                    const notiList = Array.from(document.querySelectorAll(".ubboard_table tbody tr"));
                    return notiList.map(item => {
                        const tdList = item.querySelectorAll("td");
                        const notiLink = tdList[1].querySelector("a");
                        return { title: tdList[1].innerText.trim(), url: notiLink.href, date: tdList[3].innerText.trim(), author: tdList[2].innerText.trim() };
                    });
                } catch(err) {
    
                }
                return [];
            });
            notification = [ ...notification, ...newNoti ];
        }

        searchData[a] = { ...searchData[a], notification };
    }

    return searchData;
};

const login = async (userid, userpassword) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(loginURL);
    
    await page.type("input[name=username]", userid);
    await page.type("input[name=password]", userpassword);
    await page.click("input[name=loginbutton]");

    const wait = await page.waitForSelector("div.course_lists", { timeout: 5000 })
        .then(() => true)
        .catch(() => false);

    if(wait) {
        const name = await page.evaluate(() => {
            return document.querySelector(".usermenu .user_department").innerText;
        });

        sessionKey[name] = { userid, userpassword };

        broswers[name] = browser;
        pages[name] = [null, null, null];
        pages[name][0] = page;
        pages[name][1] = await browser.newPage();
        await pages[name][1].goto("http://learn.hansung.ac.kr/");
        pages[name][2] = await browser.newPage();
        await pages[name][2].goto("http://learn.hansung.ac.kr/");

        return name;
    }
    
    return null;
};

const logout = (sessionKey) => {
    sessionKey[sessionKey] = null;
    broswers[sessionKey] = null;
    pages[sessionKey] = null;
};

app.post("/api/login", (req, res) => {
    const { uid, upw } = req.body;
    login(uid, upw)
        .then(result =>res.send(result))
        .catch(console.error);
});

app.post("/api/logout", (req, res) => {
    const { key } = req.body;
    logout(key);
    res.send(key);
});

app.post("/api/crawl", (req, res) => {
    const { key } = req.body;
    getCrawlData(key)
        .then(result => res.json(result))
        .catch(console.error);
});

app.post("/api/crawl/homework", (req, res) => {
    const { key } = req.body;
    getHomworkData(key)
        .then(result => res.json(result))
        .catch(console.error);
});

app.post("/api/crawl/notice", (req, res) => {
    const { key } = req.body;
    getNoticeData(key)
        .then(result => res.json(result))
        .catch(console.error);
});

app.listen(PORT, () => {
    console.log(`Server Activate: http://localhost:${PORT}/`);
});