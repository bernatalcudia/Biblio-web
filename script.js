const API_URL = "https://openlibrary.org/search.json?author=r+r+martin&limit=25";
const API_BOOK_IMG = "https://covers.openlibrary.org/b/id/"
const inputSearch = document.getElementById("inputSearch");

const cartBooks = [];


/* Search parameters:

q : Solr query syntax
title : Search for books by title
author : Search for books by author

limit=10 : items limit/fetch
page=numPage

HOLA Y ADIÓS

*/

let pages = {
    current: `${API_URL}`,
    prev: "",
    next: "",
};


const gridBooks = document.getElementById("mainpage")

showBooks();

function showBooks(){
    fetch(pages.current)
    .then((response) => response.json())
    .then((data) => {
        data.docs.forEach(book => {
            console.log(book);
            createBookCard(book);
        });
    })

    .catch((error) => {
        console.error("Error en la solicitud:", error);
    });
}


function createBookCard(book){
    const bookBox = document.createElement("article");
    bookBox.setAttribute("class", "bookBox");

    const bookCoverURL = `${API_BOOK_IMG}${book.cover_i}-M.jpg`;
    const bookCover = document.createElement("img");
    bookCover.src = bookCoverURL;

    const bookInfo = document.createElement("section");
    bookInfo.setAttribute("class", "bookInfo");

    const bookName = document.createElement("h3");
    bookName.innerText = `${book.title}`;
    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = `Autor: ${book.author_name[0]}`;
    const bookYear = document.createElement("p");
    bookYear.innerText = `Año de publicación: ${book.first_publish_year}`;

    const addCartBtn = document.createElement("button");
    addCartBtn.setAttribute("class", "addCartBook");
    addCartBtn.setAttribute("id", book.title)
    addCartBtn.innerText = "Añadir al carrito";
    addCartBtn.addEventListener("click", () => addBookToCart(addCartBtn.id));

    bookInfo.append(bookName, bookAuthor, bookYear, addCartBtn);
    bookBox.append(bookCover, bookInfo);
    gridBooks.append(bookBox);
}

function addBookToCart(bookID){
    const addBook = {
        bookname: bookID,
        quantity: 1
    };

    if (!localStorage.getItem("usercart")){
        cartBooks.push(addBook);
        localStorage.setItem("usercart", JSON.stringify(cartBooks));
    }
    else{
        const userCart = JSON.parse(localStorage.getItem("usercart"));

        userCart.forEach(book => {
            if (book.bookname !== bookID){
                book.quantity += 1;

                localStorage.setItem("usercart", JSON.stringify(userCart));
            }
            else{
                userCart.push(addBook);
                localStorage.setItem("usercart", JSON.stringify(userCart));
            }
        });
    }
}