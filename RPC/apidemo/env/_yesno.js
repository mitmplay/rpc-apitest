const headers = {'Content-Type': 'application/json'}

module.exports = { 
  base_url: 'https://yesno.wtf',
  action: {
    get: {
      headers,
      method: 'get',
      path: _ => `/api`,
    }
  }
}
