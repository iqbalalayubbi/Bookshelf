const inputTitle = document.querySelector('.input-title');
const inputAuthor = document.querySelector('.input-author');
const inputYear = document.querySelector('.input-year');
const inputSearch = document.querySelector('.input-search');
const allInput = document.querySelectorAll('input');

const result = document.querySelector('.result');

const statusRead = document.querySelector('.status-read');
const btnAdd = document.querySelector('.btn-add');
const contentBookElem = document.querySelector('.content-book');

const listBook = document.querySelectorAll('.list-book');

// data
let allBookData = [];
const key = "bookshelf";
let idSelect ;

function randomId(){
    const id = [];
    for (let i = 0;i<5;i++)id.push(parseInt(Math.random()*9).toString());
    return id.join('');
}

function bookData(){
    return {
        id:randomId(),
        title:inputTitle.value,
        author:inputAuthor.value,
        year:inputYear.value,
        isRead:statusRead.checked
    };
}

// template to add in html
function contentBook(id,title,author,year,isRead){
    let readStatus = ""
    isRead ? readStatus = "unread" : readStatus = "read";
    return `
        <div class="book" data-id=${id}>
            <p class="title-book">${title}</p>
            <p class="author-book">Author : ${author}</p>
            <p class="year-book">Year : ${year}</p>
            <span class="action">
                <button class="act act-${readStatus}">${readStatus}</button>
                <button class="act act-update">update</button>
                <button class="act act-del">Del</button>
            </span>
        </div>
    `;
}

// get book by localstorage
function getBook(){
    const books = localStorage.getItem(key);
    return JSON.parse(books);
}

// show book 
function showBooks(){
    if (localStorage.length>0){
        const books = getBook();
        books.forEach((e)=>{
            if(e.isRead){
                listBook[0].innerHTML += contentBook(e.id,e.title,e.author,e.year,e.isRead)
            }
            else{
                listBook[1].innerHTML += contentBook(e.id,e.title,e.author,e.year,e.isRead)
            }
        })
    }
}

function clearInput(){
    inputTitle.value = "";
    inputAuthor.value = "";
    inputYear.value = "";
    statusRead.checked = false;
    listBook[0].innerHTML = "";
    listBook[1].innerHTML = "";
}

// cek if user input the form or not
function validationInput(){
    if (inputTitle.value !== "" || inputAuthor.value !== "" || inputYear.value !== ""){
        return true;
    }
}

function filterBook(id){
    let book;
    const books = getBook();
    books.forEach(e => {if (e.id == id)book = e});
    return book;
}

function updateData(book){
    allBookData = getBook();
    allBookData.forEach(e =>{
        if (e.id == book.id)e.isRead ? e.isRead = false :e.isRead = true });
    localStorage.removeItem(key);
    saveData(allBookData);
    clearInput();
    showBooks();
}

function deleteData(book){
    allBookData = getBook();
    allBookData.forEach((e,i) => {
        if (e.id == book.id)allBookData.splice(i,1);
    })
    localStorage.removeItem(key);
    saveData(allBookData);
    clearInput();
    showBooks();
}

function showByTitle(book){
    if(book !== undefined){
        result.innerHTML = contentBook(book.id,book.title,book.author,book.year,book.isRead);
    }
}

function createButton(){
    const button = document.createElement('button');
    button.textContent = "Cancel";
    button.classList.add('btn-cancel');
    button.style.backgroundColor = "rgb(224, 31, 31)";
    return button;
}

function changeInput(book){
    inputTitle.value = book.title;
    inputAuthor.value = book.author;
    inputYear.value = book.year;
    statusRead.checked = book.isRead;
    btnAdd.innerHTML = "update"
    if (btnAdd.nextElementSibling == null)btnAdd.after(createButton())
}

function updateNewBook(id){
    const book = [];
    allBookData = getBook();
    allBookData.forEach((e,i) => {
        if (e.id == id ){
            book.push(e);
            allBookData.splice(i,1);
        }
    })
    book[0].title = inputTitle.value;
    book[0].author = inputAuthor.value;
    book[0].year = inputYear.value;
    book[0].isRead = statusRead.checked;
    allBookData.push(book[0]);
    saveData(allBookData);
    clearInput();
    showBooks();
}

function resetInput(){
    inputTitle.value = "";
    inputAuthor.value = "";
    inputYear.value = "";
    statusRead.checked = false;
    idSelect = undefined;
    btnAdd.innerHTML = "Add Book";   
}

function saveData(data){
    localStorage.setItem(key,JSON.stringify(data));
}

// all event 
window.addEventListener('load',() => {
    clearInput();
    showBooks();
})

// user submit book
btnAdd.addEventListener('click',() => {
    if(validationInput()){
        if (idSelect !== undefined){
            updateNewBook(idSelect);
            resetInput();
            btnAdd.nextElementSibling.remove();
        }else{
            if (localStorage.length>0 ){
                allBookData = getBook();
                allBookData.push(bookData());
                saveData(allBookData);
            }else{
                allBookData.push(bookData());
                saveData(allBookData);
            }
        }
    }else{
        alert("please input your book data");
    }
    clearInput();
    showBooks();
})

// action for bookshelf to delete,edit,and change status
listBook.forEach(e => {
    e.addEventListener('click',(e) => {
        if(e.target.classList.contains('act')){
            const target = e.target;
            const parentElement = target.parentElement.parentElement;
            const book = filterBook(parentElement.getAttribute('data-id'));
            if (e.target.innerHTML == "unread" || e.target.innerHTML == "read"){
                updateData(book);
            }
            if(e.target.innerHTML == "update"){
                idSelect = book.id;
                changeInput(book);
            }
            if(e.target.innerHTML == "Del" && confirm('you want to delete the book?')){
                deleteData(book);
                parentElement.remove();
            }
        }
    })
})

// user search book by title
inputSearch.addEventListener('input',() => {
    if (inputSearch.value !== ""){
        const books = getBook();
        let book ;
        books.forEach(e => {
            const title = e.title.toLowerCase();
            if(title.startsWith(inputSearch.value))book = e
            else{
                return result.innerHTML = `<p style="color: rgb(73, 73, 73);">Book is not found</p>`
            }
        })  
        showByTitle(book);
    }else{result.innerHTML = ""};
})

// user cancel update book
contentBookElem.addEventListener('click',(e) => {
    if(e.target.classList.contains('btn-cancel')){
        resetInput();
        e.target.remove();
    }
})