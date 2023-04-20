const headers = {'Content-Type': 'application/json'}

module.exports = { 
  base_url: 'https://api.apicagent.com',
  action: {
    post: {
      headers,
      method: 'post',
      path: _ => `/`,
      body: {
        ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36"
      }
    },
  }
}
//https://www.apicagent.com/docs#post-api