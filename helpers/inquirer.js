const inquirer = require('inquirer');
require('colors');

const preguntas = [{
    type: 'list',
    name: 'opcion',
    message: 'Que desea hacer?',
    choices: [{
            value: 1, //puede ser string o numero (si apostrofes)
            name: `${'1.'.green} Buscar lugar`
        },
        {
            value: 2,
            name: `${'2.'.green} Historial`
        },
        {
            value: 0,
            name: `${'0.'.green} Salir`
        }
    ]


}];

const parapausar = [{
    type: 'input',
    name: 'opcionp',
    message: `Presione ${'ENTER'.green} para continuar `
}];





const inquirermenu = async() => {
    console.clear();
    console.log('===================================='.green);
    console.log('SELECCIONE UNA OPCION'.white);
    console.log('====================================\n'.green);

    const { opcion } = await inquirer.prompt(preguntas);
    return opcion;
}


const leerinput = async(message) => {
    const question = [{
        type: 'input',
        name: 'desc',
        message,
        validate(value) {
            if (value.length === 0) {
                return 'Ingrese un valor';
            }
            return true;
        }
    }];

    const { desc } = await inquirer.prompt(question);
    return desc;
}


const pausa = async() => {
    //console.log('PRESIONE ENTER PARA CONTINUAR'.green);
    //console.log('====================================\n'.green);
    console.log();
    await inquirer.prompt(parapausar);
    // return name;
}



const listarlugares = async(lugares = []) => {
    const choices = lugares.map((lugar, i) => { //revisar a funcion map y los parametros q trae (asi como el foreach tra --value, index, array--)
        const idx = /*`${index+1}`.green;*/ `${i + 1}`.green;
        return {
            value: lugar.id,
            name: `${idx}. ${lugar.nombre} ${lugar.lat} ${lugar.long}`
        }
    });


    const preguntas = {
        type: 'list',
        name: 'id',
        message: 'Seleccione lugar',
        choices
    }

    choices.unshift({
        value: '0',
        name: '0.'.green + 'Cancelar'
    });

    const { id } = await inquirer.prompt(preguntas);



    return id;

}



module.exports = { inquirermenu, pausa, leerinput, listarlugares };