const { nanoid } = require('nanoid');
const books = require('./books.js');

function addBookHandler(req, h) {
	const { name, pageCount, readPage } = req.payload;

	const id = nanoid(16);
	const finished = pageCount === readPage;
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;

	if (name === undefined) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. Mohon isi nama buku',
		});

		response.code(400);
		return response;
	}

	if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message:
				'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
		});

		response.code(400);
		return response;
	}

	books.push({
		id,
		...req.payload,
		finished,
		insertedAt,
		updatedAt,
	});

	const isSuccess = books.filter((book) => book.id === id).length > 0;

	if (isSuccess) {
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil ditambahkan',
			data: {
				bookId: id,
			},
		});

		response.code(201);
		return response;
	}

	const response = h.response({
		status: 'error',
		message: 'Buku gagal ditambahkan',
	});

	response.code(500);
	return response;
}

function getAllBooksHandler(req, h) {
	if (books.length > 0) {
		const query = req.query;
		const key = Object.keys(query)[0];
		const filteredBooks = key
			? books.filter((book) => {
					if (key === 'name') {
						return book.name.toLowerCase().includes(query[key].toLowerCase());
					}

					return Number(query[key]) === Number(book[key]);
			  })
			: books;

		return {
			status: 'success',
			data: {
				books: filteredBooks.map((book) => ({
					id: book.id,
					name: book.name,
					publisher: book.publisher,
				})),
			},
		};
	}

	return {
		status: 'success',
		data: {
			books: [],
		},
	};
}

function getBookWithIdHandler(req, h) {
	const id = req.params.bookId;
	const book = books.filter((book) => book.id === id)[0];

	if (book !== undefined) {
		return {
			status: 'success',
			data: {
				book,
			},
		};
	}

	const response = h.response({
		status: 'fail',
		message: 'Buku tidak ditemukan',
	});

	response.code(404);
	return response;
}

function editBookWithIdHandler(req, h) {
	const { name, pageCount, readPage } = req.payload;
	const id = req.params.bookId;
	const index = books.findIndex((book) => book.id === id);

	if (name === undefined) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Mohon isi nama buku',
		});

		response.code(400);
		return response;
	}

	if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message:
				'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
		});

		response.code(400);
		return response;
	}

	if (index === -1) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Id tidak ditemukan',
		});

		response.code(404);
		return response;
	}

	books[index] = {
		...books[index],
		...req.payload,
		updatedAt: new Date().toISOString(),
	};

	return {
		status: 'success',
		message: 'Buku berhasil diperbarui',
	};
}

function deleteBookWithIdHandler(req, h) {
	const id = req.params.bookId;
	const index = books.findIndex((book) => book.id === id);

	if (index === -1) {
		const response = h.response({
			status: 'fail',
			message: 'Buku gagal dihapus. Id tidak ditemukan',
		});

		response.code(404);
		return response;
	}

	books.splice(index, 1);

	return {
		status: 'success',
		message: 'Buku berhasil dihapus',
	};
}

module.exports = {
	addBookHandler,
	getAllBooksHandler,
	getBookWithIdHandler,
	editBookWithIdHandler,
	deleteBookWithIdHandler,
};
