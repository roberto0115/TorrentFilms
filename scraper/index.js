const {chromium} = require('playwright')
const Elitetorrent = require('./Webs/Elitetorrent')

const Buscar = async(params)=>{
    params.length = typeof params.length !== 'number' ? 30: params.length
    const browser = await chromium.launch({headless: true});
    const page = await browser.newPage()
    //Buscar en las diferentes paginas
   
    const res = await Elitetorrent(page,params)
    
    
    await browser.close();
    return res

}

module.exports =Buscar