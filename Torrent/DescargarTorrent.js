const WebTorrent = require('webtorrent')
const fs = require('fs')
const client = new WebTorrent();
const cliProgress = require('cli-progress')
const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)

const DescargarTorrent = (torrentId,files)=>{
    client.add(torrentId, torrent =>{
        const files = torrent.files;
        let length = files.length;
        bar.start(100,0); 
        let interval = setInterval(()=>{
            //console.log("Progress : "+ (torrent.progress*100).toFixed()+"%")
            bar.update((torrent.progress*100));
        },2000); //5 sec
        files.forEach(file => {
            const source = file.createReadStream();
            const destination = fs.createWriteStream(`./pelis/${file.name}`)
            source.on('end', ()=>{
                console.log('file: '+file.name);
                length-=1;
                if(!length) {
                    bar.stop();
                    clearInterval(interval)
                    process.exit()
                }
            }).pipe(destination)
        });
    })
}