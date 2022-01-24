const fs = require('fs');

const axios = require('axios');
class busquedas {
    historial = [];
    dbpath = './db/database.json';



    constructor() {
        //leer db si exist
        this.leerdb();
    }

    get historialcapitalizado() {
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1)); /*capitalzando cada palabra*/
            return palabras.join(' ')
        })
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

        this.historial = this.historial.splice(0, 5);

        this.historial.unshift(lugar.toLocaleLowerCase());
        this.guardardb();
    }



    guardardb() {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbpath, JSON.stringify(payload))
    }
    leerdb() {
        if (!fs.existsSync(this.dbpath)) {
            return;
        }
        const info = fs.readFileSync(this.dbpath, { encoding: 'utf-8' });
        const data = JSON.parse(info);
        this.historial = data.historial;

    }

}


module.exports = busquedas;