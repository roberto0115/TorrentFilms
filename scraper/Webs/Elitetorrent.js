const cliProgress = require('cli-progress')
const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)

const Buscar = async (page, params)=>{
    Res = {}
    Res.pagina = "https://elitetorrent.app"
    //PARAMS
    //params.name => nombre de la película
    //params.max => extensión de la búsqueda
    await page.goto(`https://elitetorrent.app/?s=${params.name}&x=0&y=0`)
    Res.numResultados = await NumResultados(page);
    Res.enlcesPeliculas = await getEnlaces(page,params)
    Res.resultados = await getPeliculas(page)
    return Res
}
const NumResultados= async (page)=>{
    const ExistenResultados = await page.$$("#principal .nav h3")
    if(ExistenResultados.length > 0){
        const ResultadosPag = await page.textContent("#principal .nav h3")
        const numResultados = ResultadosPag.split(":")[1].split("(")[1].split(" ")[2]
        return numResultados;
    }else{
        return 0
    }
}
const getEnlaces = async(page,params)=>{
    Enlaces = []
    for(i = 1; i<=(Res.numResultados > params.length ?params.length:Res.numResultados); i++){
        const busqueda = ":nth-match(.imagen a,"+i+")"
        const href =await page.getAttribute(busqueda,"href")
        Enlaces.push(href)
    }
    return Enlaces
}
const getPeliculas = async(page)=>{
    Resultados = []
    bar.start(100,0); 
    for(i = 1; i<=Res.enlcesPeliculas.length; i++){
        bar.update(((i)/Res.enlcesPeliculas.length)*100)
        //Ir a la pagina
        await page.goto(Res.enlcesPeliculas[i-1])
        Resultados[i-1] = {}
        //Nombre
        Resultados[i-1].nombre = await page.textContent("#principal h1")
        Resultados[i-1].nombre = Resultados[i-1].nombre.replace("Descargar ", "").replace(" por torrent", "")
        //Imagen
        Resultados[i-1].imagen = await page.getAttribute(".secc-izq img","src")
        Resultados[i-1].imagen = Resultados[i-1].imagen.includes('https://elitetorrent.app') ? Resultados[i-1].imagen : 'https://elitetorrent.app'+Resultados[i-1].imagen 
        //EnlaceTorrent
        const enlaceObtenido =  (await page.getAttribute(".enlace_torrent.degradado1","href")).split("/")
        const finalEnlace = encodeURIComponent(enlaceObtenido[enlaceObtenido.length-1])
        enlace = ""
        for (let j = 0; j <= enlaceObtenido.length-2; j++) {
            enlace += "/"+(enlaceObtenido[j])
        }
        enlace += "/"+finalEnlace
        Resultados[i-1].torrent= enlace.includes("https://") ? enlace : "https://elitetorrent.app"+enlace
        //Info
        Resultados[i-1].Info
        const numInfo = await page.locator('.descrip span').count()
        Resultados[i-1].Info = new Map()
        for(j = 1; j<= numInfo; j++){
            const busqueda = '.descrip span';
            const info = await page.textContent(":nth-match(.descrip span,"+j+")")
            const categoria = info.split(":")[0]
            const informacion = info.split(":")[1]
            Resultados[i-1].Info.set(categoria, informacion)
        }
    }
    console.log(Resultados.length)
    return Resultados
}
module.exports = Buscar;
