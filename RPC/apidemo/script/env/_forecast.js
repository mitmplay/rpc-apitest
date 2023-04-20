const headers = {'Content-Type': 'application/json'}
const cities = {
  Canberra:  {latitude : '-35.28', longitude: '149.13'},
  Jakarta:   {latitude :  '-6.18', longitude: '106.82'},
  Singapore: {latitude :   '1.29', longitude: '103.85'},
}
module.exports = {
  base_url: 'https://api.open-meteo.com/v1/forecast',
  action: {
    get: {
      headers,
      method: 'get',
      path: (all={}) => {
        let {city, ...opts} = all
        if (cities[city]) {
          opts = {
            ...opts,
            ...cities[city]
          }
        }
        path_opts = {
          latitude : '52.52',
          longitude: '13.41',
          current_weather: 'true',
          // hourly: 'temperature_2m,relativehumidity_2m,windspeed_10m',
          ...opts,
        }
        let kvalues = []
        for (const k in path_opts) {
          kvalues.push(`${k}=${path_opts[k]}`)
        }
        return `?${kvalues.join('&')}`
      }
    }
  }
}
//RPC.demo.log(RPC.demo.forecast({opt:{city:'Jakarta'}}))
//RPC.demo.log(RPC.demo.forecast({opt:{city:'Singapore',hourly:'temperature_2m'}}))