
var bookService=function(){
	var monk = require('monk');
	var db = monk('localhost:27017/BookStore');
	
	function Dao(){
		this.getAllBooks=function(){
			return db.get('books');
		}
	}
	
}

module.exports = bookService;