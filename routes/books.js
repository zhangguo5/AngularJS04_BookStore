/*
 * 使用monk访问mongodb
 * 以rest的方式向前台提供服务
 */

//依赖monk模块
var monk = require('monk');
//连接并打开数据库
var db = monk('localhost:27017/BookStore');
//从数据库中获得books集合，类似表，并非所有数据， key
var books = db.get('books');

//列出所有的图书json
exports.list = function(req, res) {
	//无条件查找所有的图书，then是当查找完成时回调的异步方法
	books.find({}).then((docs) => {
		//返回json给客户端
		res.json(docs);
	}).then(() => db.close());   //关闭数据库
};

//获得最大id
exports.getMax=function(req,res){
	//找一个，根据id降序排序，
	books.findOne({}, {sort: {id: -1}}).then((bookObj)=>{
		res.json(bookObj);
	}).then(() => db.close());;
}

//添加图书
exports.add = function(req, res) {
	//先找到最大的图书编号
	books.findOne({}, {sort: {id: -1}}).then((obj)=>{
		//从客户端发送到服务器的图书对象
		var book=req.body;
		//设置图书编号为最大的图书编号+1
		book.id=(parseInt(obj.id)+1)+"";
		//执行添加
		books.insert(book).then((docs) => {
		//返回添加成功的对象
		 res.json(docs);
	   }).then(() => db.close());
	});
};

//删除图书
exports.del = function(req, res) {
	//从路径中取参数id,/:id
	var id=req.params.id;
	//移除编号为id的图书
	books.remove({"id":id}).then((obj)=>{
		//返回移除结果
		res.json(obj);
	}).then(() => db.close());
};

//更新
exports.update = function(req, res) {
	//获得提交给服务器的json对象
	var book=req.body;
	//执行更新,第1个参数是要更新的图书查找条件，第2个参数是要更新的对象
	books.update({"id":book.id}, book).then((obj)=>{
		//返回更新完成后的对象
		res.json(obj);
	   }).then(() => db.close());
};
