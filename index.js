const inquier = require('inquirer')
const Choices = require('inquirer/lib/objects/choices')
const scraper = require('./scraper/index')

inquier.prompt({
    name: "busqueda",
    message: "¿Qué película quieres buscar?"
}).then(async(answer) => {
    console.log(`-- Buscando ${answer.busqueda} ...`)
    const res = await scraper({name : answer.busqueda})
    resultadosBusqueda(res)

})
const resultadosBusqueda= (res)=>{
    Nombres = []
    res.resultados.forEach(resultado => {
        Nombres.push(resultado.nombre)
    });
    inquier.prompt({
        type: 'rawlist',
        name: 'Pelicula',
        message: `se han econtrado ${res.numResultados} resultados`,
        choices: Nombres
    }).then((answer)=>{
        console.log(`Mostrando ${answer.Pelicula}:`)
        console.log('')
        const index = Nombres.indexOf(answer.Pelicula)
        console.log(`-- Portada: ${res.resultados[index].imagen}`)
        console.log('')
        console.log(`-- Enlace Torrent: ${res.resultados[index].torrent}`)
        console.log('')
        console.log(`-- Info:`)
        console.log(res.resultados[index].Info)
        inquier.prompt({
            name: "Descargar",
            message: "¿Deseas descargar la película?",
            choices: ["Si", "No"],
            type: "rawlist"
        }).then((answer)=>{
            if(answer.Descargar === "Si"){
                console.log(`-- Descargando Torrent ...`)
                descargarTorrent(res, index)
            }else{
                resultadosBusqueda(res)
            }
        })
    })
}
const descargarTorrent = (res, index)=>{
    console.log('Torrent')
    process.exit()
}