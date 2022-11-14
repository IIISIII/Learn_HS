import axios from "axios";

const url = "/api/crawl";

export const getCrawlData = (params) => {
    return axios.post(url, params);
}