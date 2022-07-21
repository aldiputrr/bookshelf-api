const {
	addBookHandler,
	getAllBooksHandler,
	getBookWithIdHandler,
	editBookWithIdHandler,
	deleteBookWithIdHandler,
} = require('./handler.js');

const routes = [
	{
		method: 'POST',
		path: '/books',
		handler: addBookHandler,
	},
	{
		method: 'GET',
		path: '/books',
		handler: getAllBooksHandler,
	},
	{
		method: 'GET',
		path: '/books/{bookId}',
		handler: getBookWithIdHandler,
	},
	{
		method: 'PUT',
		path: '/books/{bookId}',
		handler: editBookWithIdHandler,
	},
	{
		method: 'DELETE',
		path: '/books/{bookId}',
		handler: deleteBookWithIdHandler,
	},
];

module.exports = routes;
