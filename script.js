const API_URL = "https://openlibrary.org/search.json?author=r+r+martin&limit=24";
const API_BOOK_IMG = "https://covers.openlibrary.org/b/id/"
const inputSearch = document.getElementById("inputSearch");

const openCart = document.getElementById("buyButton");
openCart.addEventListener("click", openCartPage);
const closeCart = document.getElementById("closeCart");
closeCart.addEventListener("click", closeCartPage);

const cartBox = document.getElementById("cartBox");
cartBox.style.display = "none";


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
            data.docs.forEach(book => {
                console.log(book);
                createBookCard(book);
            });
        })

        .catch((error) => {
            console.error("Error en la solicitud:", error);
        });
}


function createBookCard(book) {
    const bookBox = document.createElement("article");
    bookBox.setAttribute("class", "bookBox");

    const bookCoverURL = `${API_BOOK_IMG}${book.cover_i}`;
    const bookCover = document.createElement("img");
    bookCover.src = `${bookCoverURL}-M.jpg`;

    const bookInfo = document.createElement("section");
    bookInfo.setAttribute("class", "bookInfo");

    const bookName = document.createElement("h3");
    bookName.innerText = `${book.title}`;
    const bookAuthorYear = document.createElement("p");
    bookAuthorYear.innerText = `${book.author_name[0]} (${book.first_publish_year})`;
    const bookPrice =  document.createElement("p");
    bookPrice.setAttribute("class", "bookPrice");
    const price = Math.floor(Math.random() * (30 - 20 + 1) + 20)
    bookPrice.innerText = `${price}€`;

    const addCartBtn = document.createElement("button");
    addCartBtn.setAttribute("class", "addCartBook");
    addCartBtn.setAttribute("id", book.title)
    addCartBtn.innerText = "Añadir al carrito";
    addCartBtn.addEventListener("click", () => addBookToCart(addCartBtn.id, price, bookCoverURL));

    bookInfo.append(bookName, bookAuthorYear, bookPrice, addCartBtn);
    bookBox.append(bookCover, bookInfo);
    gridBooks.append(bookBox);
}

function addBookToCart(bookID, price, bookCoverURL) {

    let userCart = localStorage.getItem("usercart")

    let cartBooks = userCart ? JSON.parse(userCart) : [];

    const bookIndexArray = cartBooks.findIndex(book => book.bookname === bookID) //Retorna su indice y si no lo encuentra devulve un -1

    if (bookIndexArray > -1) {
        cartBooks[bookIndexArray].quantity += 1
    } else {
        const addBook = {
            bookname: bookID,
            quantity: 1,
            price: price,
            cartimg: `${bookCoverURL}-S.jpg`
        };
        cartBooks.push(addBook)
    }

    localStorage.setItem("usercart", JSON.stringify(cartBooks))


    console.log("cart update", cartBooks)
    // if (!localStorage.getItem("usercart")) {
    //     cartBooks.push(addBook);
    //     localStorage.setItem("usercart", JSON.stringify(cartBooks));
    // }
    // else {
    //     const userCart = JSON.parse(localStorage.getItem("usercart"));

    //     userCart.forEach(book => {
    //         if (book.bookname !== bookID) {
    //             book.quantity += 1;

    //             localStorage.setItem("usercart", JSON.stringify(userCart));
    //         }
    //         else {
    //             userCart.push(addBook);
    //             localStorage.setItem("usercart", JSON.stringify(userCart));
    //         }
    //     });
    // }
}

function openCartPage() {
    cartBox.style.display = "flex";
}

function closeCartPage() {
    cartBox.style.display = "none";
}