const fs = require('fs');
const path = require('path');
const mime = require('mime');

const staticFn = (req, res) => {
    let url = decodeURI(req.url);
    let fpath = path.join(__dirname + '/..'+url);
    fs.access(fpath, (err) => {
        if(err){
            res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
            res.end(`<h3>${err.message}</h3>`);
            return;
        }

        let stats = fs.statSync(fpath);
        if(stats.isFile()){
            fileFn(fpath, req, res);
        }else{
            dirFn(fpath, req, res);
        }
    })
};

const fileFn = (filePath, req, res) => {
    fs.readFile(filePath,(err, data) => {
        if(err){
            res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
            res.end(`<h3>${err.message}</h3>`);
            return;
        }

        res.writeHead(200,{'Content-Type':mime.lookup(filePath)+';charset=utf-8'});
        res.end(data);
    })
};

const dirFn = (dirPath, req, res) => {
	fs.readdir(dirPath, (err, files) => {
		if(err){
			res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
			res.end(`<h3>${err.message}</h3>`);
			return;
		}

		res.writeHead(200,{'Content-Type':'text/html'});
		res.end(template(files, req.url));
	})
};

const template = (fileAndDirList, url) => {
	let fileAndDirListHtml = fileAndDirListHtmlFactory(fileAndDirList, url);
    return `<!DOCTYPE html>
    <html>
			<head>
				<meta charset="utf-8">
				<title>目录</title>
			</head>
			<body>
				${fileAndDirListHtml}
			</body>
    </html>
    `;
};

const fileAndDirListHtmlFactory = (fileAndDirList, url)=> {
	fileAndDirList = fileAndDirList.sort((x, y) => {
		if(!/\./.test(x)){
			return false;
		}else{
			if(!/\./.test(y)){
				return true;
			}else{
				return false;
			}
		}
	});
	let resultStr = '<ul>';
	url = url.replace(/\/[\/]+/g,'/').replace(/\/$/,'');
	if(!(url === '/static')){
		let newUrlArr = url.split('/');
		newUrlArr.pop();
		resultStr += `<li><a href='${newUrlArr.join('/')}'>...</a></li>`
	}
	fileAndDirList.forEach((item) => {
		resultStr += `<li><a href='${url}/${item}'>${item}</a></li>`;
	})
	resultStr += '</ul>';
	return resultStr;
}

module.exports = staticFn;