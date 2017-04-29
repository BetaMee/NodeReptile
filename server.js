var Tracker = require('bittorrent-tracker')
var magnet = require('magnet-uri')

var magnetURI = "magnet:?xt=urn:btih:670f4993c4e25d17bd9380145fcc515bfcb7fd6a&tr=http://tracker.openbittorrent.com/announce&tr=udp://tracker.openbittorrent.com:80/announce&tr=udp://tr.cili001.com:6666/announce&tr=http://tracker.publicbt.com/announce&tr=udp://open.demonii.com:1337&tr=udp://tracker.opentrackr.org:1337/announce&tr=http://tr.cili001.com:6666/announce"

var parsedTorrent = magnet(magnetURI)

var opts = {
  infoHash: parsedTorrent.infoHash,
  announce: parsedTorrent.announce,
  peerId: new Buffer('01234567890123456789'), // hex string or Buffer
  port: 6881 // torrent client port
}
console.log(parsedTorrent);

var client = new Tracker(opts)

client.scrape()

client.on('scrape', function (data) {
  console.log("dd");
  console.log(data)
})