'use strict';

function onInit() {
    renderBooks();
    const bookId = new URLSearchParams(window.location.search).get('bookId');
    if (bookId) onReadBook(bookId); 
}

function renderBooks() {
    let books = getBooksForDisplay();
    const layout = getLayout();

    let strHTMLs = books
        .map(layout === 'table' ? renderTable : renderCard)
        .join('');

    var currSelector =
        layout === 'table' ? '.books-content' : '.cards-container';
    document.querySelector(currSelector).innerHTML = strHTMLs;
    renderStatistics(books)
}

function renderTable(book) {
    document.querySelector('table ').style.display = 'table';
    document.querySelector('.cards-container ').style.display = 'none';
    return `<tr>
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${getCurrency(book.price)}</td>
        <td class="actions">
            <button onclick="onReadBook('${book.id
        }')" >Read</button>
            <button onclick="toggleUpdateBook('${book.id
        }')" >Update</button>
            <button onclick="onRemoveBook('${book.id
        }')" >Delete</button>
        </td>
        </tr>`;
}

function renderCard(book) {
    document.querySelector('table').style.display = 'none';
    document.querySelector('.cards-container ').style.display = 'flex';
    return `<div class="book-card">
  <img src="${book.imgUrl}" />
   <p><strong>title:</strong> ${book.title}</p>
   <p><strong>desc:</strong> ${book.desc}</p>
   <div class="actions">
    <button onclick="onReadBook('${book.id}')" >Read</button>
    <button onclick="toggleUpdateBook('${book.id}')" >Update</button>
    <button onclick="onRemoveBook('${book.id}')" >Delete</button>
    
    </div>
</div>`;
}

function onSetLayout(layout) {
    setLayout(layout);
    renderBooks();
}

function onAddBook(ev) {
    ev.preventDefault();
    const title = document.querySelector('input[name=book-title]').value;
    const price = +document.querySelector('input[name=book-price]').value;
    const imgUrl = document.querySelector('input[name=book-image]').value;
    if (!title || !price)
        return alert(
            'Please make sure to enter all required book details properly.'
        );
    addBook(title, price, imgUrl);
    toggleAddBook();
    renderBooks();
    showMsg('added')
}

function onRemoveBook(bookId) {
    if (confirm(getTrans('remove-confirm'))) removeBook(bookId);
    renderBooks();
    showMsg('deleted')
}

function onUpdateBook(ev) {
    ev.preventDefault();
    const elUpdateModal = document.querySelector('.update-book');
    const bookId = elUpdateModal.dataset.bookId;
    const newPrice = +document.querySelector('.book-update-price').value;
    elUpdateModal.querySelector('.book-update-price').value = '';
    elUpdateModal.classList.remove('shown');
    updateBook(bookId, newPrice);
    renderBooks();
    showMsg('updated')
}

function onSetFilterBy(elForm) {
    const title = elForm.elements['by-title'].value;

    const filterBy = { title };
    setFilterBy(filterBy);

    const queryStringsParams =
        title  ? `?title=${filterBy.title}` : ''
    saveQueryString(queryStringsParams);
    renderBooks();
}

function onResetFilter() {

    const filterBy = {
        title: '',
    }

    setFilterBy(filterBy)
    saveQueryString('')
    renderBooks()

    // clean the inputs 
    const elTitle = document.querySelector('.book-title')
    elTitle.value = ""
}

function showMsg(activity){
    const msg = `you successfully ${activity} the book`
    const elMsg = document.querySelector('.user-msg')
    elMsg.innerText = msg
    elMsg.classList.remove('hide')

    setTimeout(() => {
        elMsg.classList.add('hide')
    }, 3000);
}

function saveQueryString(queryStr) {
    const newUrl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        queryStr;
    window.history.pushState({ path: newUrl }, '', newUrl);
}

function onChangeRating(rating) {
    const elBookModal = document.querySelector('.read-book');
    const bookId = elBookModal.dataset.bookId;
    elBookModal.querySelector('.rate').innerText = rating;
    changeRating(bookId, +rating);
}

function toggleAddBook() {
    const elAddBook = document.querySelector('.add-book');
    elAddBook.classList.toggle('shown');
}

function toggleUpdateBook(bookId) {
    const elUpdateModal = document.querySelector('.update-book');
    elUpdateModal.classList.toggle(
        'shown',
        elUpdateModal.dataset.bookId !== bookId ||
        !elUpdateModal.classList.contains('shown')
    );
    elUpdateModal.dataset.bookId = bookId;
}

function onReadBook(bookId) {
    const book = getBook(bookId);
    const elBookModal = document.querySelector('.read-book');
    elBookModal.querySelector('.book-cover-img img').src = book.imgUrl;
    elBookModal.querySelector('.book-rating').value = book.rating;
    elBookModal.querySelector('.rate').innerText = book.rating;
    elBookModal.querySelector('.book-desc span').innerText = book.title;
    elBookModal.querySelector('.book-desc p').innerText = book.desc;

    const isShown = elBookModal.classList.toggle(
        'shown',
        elBookModal.dataset.bookId !== bookId ||
        !elBookModal.classList.contains('shown')
    );
    elBookModal.dataset.bookId = bookId;

    const queryStringsParams = isShown ? `?bookId=${bookId}` : '';
    saveQueryString(queryStringsParams);
}

function closeModal(elModal) {
    elModal.classList.remove('shown');
    saveQueryString('');
}

function getCurrency(price) {
    let langInfo = 'en-IN'
    let currency ='USD'

    return new Intl.NumberFormat(langInfo,
        { style: 'currency', currency }).format(price)
}

function renderStatistics(books){
    const expCount = books.filter(b=>b.price >200).length
    const aveCount = books.filter(b=>b.price >80 && b.price < 200).length
    const cheapCount = books.filter(b=>b.price <80).length
  
    const data = `${expCount} expensive books, ${aveCount} average price books, and ${cheapCount} cheap books`
    const elFooter = document.querySelector('footer')
    elFooter.innerText = data
}