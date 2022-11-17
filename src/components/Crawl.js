import axios from "axios";

const url = "/api/crawl";

export const getCrawlData = (params) => {
    return axios.post(url, params);
}

const homeworkURL = "/api/crawl/homework";

export const getHomworkData = (params) => {
    return axios.post(homeworkURL, params);
}

const noticeURL = "/api/crawl/notice";

export const getNoticeData = (params) => {
    return axios.post(noticeURL, params);
}