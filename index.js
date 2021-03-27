var http = require('http');
var fs = require('fs');

http.createServer(function (req,res){
   res.writeHead(200,{'Content-Type':'text/html'}) ;
    var url = req.url;

    if(url == '/') {
        fs.readFile('index.html', function (erro, data) {
            if (!erro) {
                res.write(data);
                res.end();
            } else {
                res.end('404 not found');
            }
        });
    }
}).listen(process.env.PORT || '1234');
