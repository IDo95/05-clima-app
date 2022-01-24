const fs = require('fs');

const axios = require('axios');
class busquedas {
    historial = [];
    dbpath = './db/database.json';
    constructor() {
        //leer db si exist
    }


    async ciudad(lugar = '') {
        console.log('ciudad', lugar);
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: {
                    'language': 'es',
                    'access_token': process.env.MAPBOX_KEY,
                    'limit': 5
                }
            });

            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                long: lugar.center[0],
                lat: lugar.center[1]
            }));



        } catch (error) {
            return [];
        }


    }

    async climalugar(lat, long) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    lat: lat,
                    lon: long,
                    appid: process.env.OPENWEATHER,
                    units: 'metric',
                    lang: 'es'
                }
            });
            const resp = await instance.get();

            const descripcion = resp.data.weather[0].description;
            return {
                desc: descripcion,
                min: resp.data.main.temp_min,
                max: resp.data.main.temp_max,
                temp: resp.data.main.temp

            };

        } catch (error) {
            console.log(error);
        }
    }

    agregarhistorial(lugar = '') {
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }

        this.historial.unshift(lugar);
        this.guardardb();
    }



    guardardb() {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbpath, JSON.stringify(payload))
    }

}


module.exports = busquedas;