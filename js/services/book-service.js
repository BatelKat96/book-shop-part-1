'use strict';

const BOOK_KEY = 'bookDB';
const LAYOUT_KEY='layout_db'

var gLayout = loadFromStorage(LAYOUT_KEY) || 'table'
var gBooks = loadFromStorage(BOOK_KEY) || _createBooks(6);
var gFilterBy = { title: '' };


function getBooksForDisplay() {
    var books = gBooks.filter(
        (book) =>
            book.title.toLowerCase().includes(gFilterBy.title.toLowerCase()) 
    )
    return books
}

function getLayout() {
    return gLayout;
}

function setLayout(layout) {
    gLayout = layout;
    saveToStorage(LAYOUT_KEY, layout)
}

function getBook(bookId) {
    return gBooks.find((book) => book.id === bookId);
}

function getFilterBy() {
    return gFilterBy;
}

function addBook(title, price, imgUrl) {
    gBooks.push(_createBook(title, price, imgUrl));
    _saveBooksToStorage();
}

function updateBook(bookId, newPrice) {
    const idx = gBooks.findIndex((book) => book.id === bookId);
    gBooks[idx].price = newPrice;
    _saveBooksToStorage();
}

function removeBook(bookId) {
    const idx = gBooks.findIndex((book) => book.id === bookId);
    gBooks.splice(idx, 1);
    _saveBooksToStorage();
}

function changeRating(bookId, rating) {
    const idx = gBooks.findIndex((book) => book.id === bookId);
    gBooks[idx].rating = rating;
    _saveBooksToStorage();
}

function setFilterBy(filterBy) {
    gFilterBy = filterBy;
}

function _saveBooksToStorage() {
    saveToStorage(BOOK_KEY, gBooks);
}

function _createBooks(count) {
    const books = [];
    for (let i = 0; i < count; i++) {
        books.push(
            _createBook(
                `Harry Potter ${i + 1}`,
                Math.random() * 100,
                `img/Harry_Potter_${i + 1}.jpg`
            )
        );
    }
    saveToStorage(BOOK_KEY, books);
    return books;
}

function _createBook(title, price, imgUrl) {
    return {
        id: makeId(),
        title,
        price,
        imgUrl,
        desc: makeLorem(100),
        rating: 0,
    };
}

