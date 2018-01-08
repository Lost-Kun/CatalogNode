const fs = require('fs');
const path = require('path');
const mime = require('mime');
const config = require('../config/config');

/**
 * 入口
 * 
 * @param {*} req 
 * @param {*} res 
 */
const staticFn = (req, res) => {
    let url = decodeURI(req.url);
    // let fpath = path.join(__dirname + '/..'+url);
    let fpath = path.join(config.dirPath, url.replace(/^\/static(\/?)/g,''));
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

/**
 * 文件直接返回
 * 
 * @param {String} filePath 
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * 返回目录内容页面
 * 
 * @param {String} dirPath 
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * 生成页面模板
 * 
 * @param {Array} fileAndDirList 
 * @param {String} url 
 */
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

/**
 * 生成目录内容html
 * 
 * @param {Array} fileAndDirList 
 * @param {String} url 
 */
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