const API_URL =
    "https://openlibrary.org/search.json?author=r+r+martin&limit=10";
const API_BOOKS_IMGS = "https://covers.openlibrary.org/b/id/";

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

const gridBooks = document.getElementById("mainpage");

showBooks();

function showBooks() {
    fetch(pages.current)
        .then((response) => response.json())
        .then((data) => {
            data.docs.forEach((book) => {
                console.log(book);
                createBookCard(book);
            });
        })

        .catch((error) => {
            console.error("Error en la solicitud:", error);
        });
}

async function createBookCard(book) {
    const bookBox = document.createElement("article");
    bookBox.setAttribute("class", "bookBox");

    const bookName = document.createElement("h3");
    bookName.innerText = `${book.title}`;
    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = `Autor: ${book.author_name[0]}`;
    const bookYear = document.createElement("p");
    bookYear.innerText = `Año de publicación: ${book.first_publish_year}`;

    const addCartBtn = document.createElement("button");
    addCartBtn.setAttribute("class", "addCartBook");

    const bookCoverId = book.cover_i;

    // let bookCover;
    // await searchBookImage(bookCoverId, bookCover);
    // const bookImg = document.createElement("img");
    // bookImg.src = bookCover;

    bookBox.append(bookName, bookAuthor, bookYear);
    gridBooks.append(bookBox);
}

// function searchBookImage(bookCoverId, bookCover){
//     return fetch(`${API_BOOKS_IMGS}${bookCoverId}-S.jpg`)
//     .then((response) => response.blob())
//     .then((data) => {
//         console.log(data);
//     })

//     .catch((error) => {
//         console.error("Error en la solicitud:", error);
//     });
// }
