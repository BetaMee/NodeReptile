// const jquery = require('jquery');
// const WebTorrent = require('webtorrent');

const client = new WebTorrent();
console.log(client);

const magentURL = 'magnet:?xt=urn:btih:dc1138392beb1f0ecc2d2c84a40fcd9d68aba0e9&tr=http://tracker.openbittorrent.com/announce&tr=udp://tracker.openbittorrent.com:80/announce&tr=udp://tr.cili001.com:6666/announce&tr=http://tracker.publicbt.com/announce&tr=udp://open.demonii.com:1337&tr=udp://tracker.opentrackr.org:1337/announce&tr=http://tr.cili001.com:6666/announce';


client.add(magentURL,function(torrent) {
  console.log('CLient is Downloading');
  console.log(torrent);

});

client.on('torrent',function(torrent) {
  console.log(torrent);
});