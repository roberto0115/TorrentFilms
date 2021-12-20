const inquier = require('inquirer')
const scraper = require('./scraper/index')
const parseTorrent = require('parse-torrent')
const inquirer = require('inquirer')

inquier.prompt({
    name: "busqueda",
    message: "¿Qué película quieres buscar?"
}).then(async(answer) => {
    console.log(`-- Buscando ${answer.busqueda} ...`)
    const res = await scraper({name : answer.busqueda})
    if(res.numResultados > 0){
        resultadosBusqueda(res)
    }else{
        console.log('No se han encontrado resultados')
        process.exit()
    }

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
                AnalizarTorrent(res.resultados[index].torrent)
            }else{
                resultadosBusqueda(res)
            }
        })
    })
}
const descargarTorrent =  (torrentId,parsedTorrent)=>{
    console.log(parsedTorrent.files.length+' archivos encontrados')
     for(i = 0; i<parsedTorrent.files.length; i++){
         console.log(`${i+1}) ${parsedTorrent.files[i].path} => (${parsedTorrent.files[i].length})`)
    }
    inquirer.prompt({
        type: 'checkbox',
        name: 'files',
        mesage: '¿Que archivos del Torrent quiere descargar?',
        choices: parsedTorrent.files
    }).then((answer)=>{
        console.log('Descargando '+answer.files)
    })
    // process.exit()
}
const AnalizarTorrent = (torrentId)=>{
    parseTorrent.remote(torrentId, (err, parsedTorrent) => {
        if (err) throw err
        descargarTorrent(torrentId,parsedTorrent)
    })
}