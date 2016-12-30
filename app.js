var express = require('express'),
	routes = require('./routes'),
	books = require('./routes/books'),
	http = require('http'),
	path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "content-type");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1')
	res.header("Content-Type", "application/json;charset=utf-8");
	if(req.method == "OPTIONS") {
		res.send("200");
	} else {
		next();
	}
});

// development only
if('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', books.list);
//获得所有的图书列表
app.get('/books', books.list);
//最大的编号
app.get('/books/maxid', books.getMax);
//添加
app.post('/books/book', books.add);
//删除
app.delete('/books/id/:id', books.del);
//更新
app.put('/books/book', books.update);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});