require('dotenv').config()
const { leerinput, inquirermenu, pausa, listarlugares } = require('./helpers/inquirer')
const busquedas = require('./models/busquedas');



const main = async() => {
    let opt;

    const busqudamodel = new busquedas;


    do {
        opt = await inquirermenu();
        switch (opt) {

            case 1:
                const termino = await leerinput('Ciudad: ');
                const lugares = await busqudamodel.ciudad(termino);
                const id = await listarlugares(lugares);
                console.clear();
                if (id === '0')
                    continue;

                const lugarsel = lugares.find(l => l.id === id);
                busqudamodel.agregarhistorial(lugarsel.nombre);

                const clima = await busqudamodel.climalugar(lugarsel.lat, lugarsel.long);
                // console.log('DESC', clima);

                //    console.log({ temper });
                // console.log({ id });
                //  console.log(lugares);
                console.log('\n Informacion de la ciudad \n'.green);
                console.log('Ciudad: ', lugarsel.nombre);
                console.log('Latitud: ', lugarsel.lat);
                console.log('longitud: ', lugarsel.long);
                console.log('Temperatura: ', clima.temp);
                console.log('Minima: ', clima.min);
                console.log('Maxima: ', clima.max);
                console.log('Tiempo:', clima.desc.green);

                break;

            case 2:
                //console.log('esta en 2');
                // console.log(busqudamodel.historial);

                busqudamodel.historialcapitalizado.forEach((lugar, i) => {
                    const idx = `${i+1}`.green;
                    console.log(`${idx}. ${lugar}`)

                })
                break;

        }

        if (opt !== 0)
            await pausa();
    } while (opt !== 0);


}
main();