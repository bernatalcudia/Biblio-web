const API_URL = "https://openlibrary.org/search.json?";
const API_BOOK_IMG = "https://covers.openlibrary.org/b/id/"

const inputSearch = document.getElementById("inputSearch");
inputSearch.addEventListener("input", highlightSearchButton);
const searchBtn = document.getElementById("searchButton");
searchBtn.addEventListener("click", userSearch);
const filterForm = document.getElementById("filterForm");
filterForm.addEventListener("change", changeInputPlaceholder);

const cartUserBooks = document.getElementById("cartContent");
const emptyText = document.getElementById("cartEmpty");
const openCart = document.getElementById("cartButton");
openCart.addEventListener("click", openCartPage);
const closeCart = document.getElementById("closeCart");
closeCart.addEventListener("click", closeCartPage);
const buyBtn = document.getElementById("buyButton");
buyBtn.addEventListener("click", buyBooks);
const purchasePrice = document.getElementById("purchasePrice");

const gridBooks = document.getElementById("booksGrid");
const cartBox = document.getElementById("cartBox");

const titleSearch = "title=";
const authorSearch = "author=";
const booksLimitPage = "limit=24";

let userInput;
let numPage = 1;
let userInputUrl;
let totalPrice = 0;

async function userSearch(){
    if (inputSearch.value == ""){
        alert("No has introducido ningúna palabra");
    }
    else{
        numPage = 1;
        await transformUserInput();
        
        if (filterForm.filterRadio[0].checked){
            userInputUrl = `${API_URL}${titleSearch}${userInput}`;
        }
        else if (filterForm.filterRadio[1].checked){
            userInputUrl = `${API_URL}${authorSearch}${userInput}`;
        }

        showBooks();
    }

}

function transformUserInput(){
    userInput = inputSearch.value.replaceAll(" ", "+");
    return userInput;
}

function showBooks() {
    fetch(`${userInputUrl}&page=${numPage}&${booksLimitPage}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            
            gridBooks.innerHTML = "";
            disablePageButtons(data.docs.length);
            upPage();

            data.docs.forEach(book => {
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

    const bookTitle = document.createElement("h3");
    bookTitle.innerText = `${book.title}`;
    const bookAuthorYear = document.createElement("p");
    bookAuthorYear.innerText = `${book.author_name[0]} (${book.first_publish_year})`;
    const bookPrice =  document.createElement("p");
    bookPrice.setAttribute("class", "bookPrice");
    const price = Math.floor(Math.random() * (30 - 20 + 1) + 20)
    bookPrice.innerText = `${price}€`;
    const bookID = book.key.split("/").pop();

    const addCartBtn = document.createElement("button");
    addCartBtn.setAttribute("class", "addCartBook");
    addCartBtn.setAttribute("id", bookTitle.innerText);
    addCartBtn.innerText = "Añadir al carrito";
    addCartBtn.addEventListener("click", () => addBookToCart(addCartBtn.id, price, bookCoverURL, bookID));

    bookInfo.append(bookTitle, bookAuthorYear, bookPrice, addCartBtn);
    bookBox.append(bookCover, bookInfo);
    gridBooks.append(bookBox);
}


function addBookToCart(addCartID, price, bookCoverURL, bookID) {
    let userCart = localStorage.getItem("usercart");

    let cartBooks = userCart ? JSON.parse(userCart) : [];

    const bookIndexArray = cartBooks.findIndex(book => book.bookname === addCartID) //Retorna su indice y si no lo encuentra devulve un -1

    if (bookIndexArray > -1) {
        cartBooks[bookIndexArray].quantity += 1
    } else {
        const addBook = {
            bookname: addCartID,
            quantity: 1,
            price: price,
            cartimg: `${bookCoverURL}-M.jpg`,
            id: bookID
        };
        const disableCartBtn = document.getElementById(`${addCartID}`)
        disableCartBtn.innerHTML = "Añadido";
        cartBooks.push(addBook)
    }

    localStorage.setItem("usercart", JSON.stringify(cartBooks))
    insertCartBooks();

    console.log("cart update", cartBooks)
}

function insertCartBooks() {    
    if (localStorage.getItem("usercart")) {

        const userCart = JSON.parse(localStorage.getItem("usercart"));
        const booksQ = document.getElementById("booksQuantity");
        booksQ.innerText = userCart.length;
        checkCartContent(userCart);

        cartUserBooks.innerHTML = "";
        userCart.forEach(book => {
            createBookCardCart(book);
        });
    }
    
    calcPrice();
}

function rechargeCart(userCart){
    localStorage.setItem("usercart", JSON.stringify(userCart));
    insertCartBooks();
}

function checkCartContent(userCart){
    if (userCart.length > 0){
        emptyText.innerText = "";
    }
    else{
        emptyText.innerText = "Tu carrito esta vacio";
    }
}

function createBookCardCart(book) {
    const bookCartCard = document.createElement("article");
    bookCartCard.setAttribute("class", "bookCartCard");
    const bookCartInfoBox = document.createElement("section");
    bookCartInfoBox.setAttribute("class", "bookCartInfoBox");

    const cartBookCover = document.createElement("img");
    cartBookCover.setAttribute("class", "cartBookCover");
    cartBookCover.src = `${book.cartimg}`;

    const cartBookInfo = document.createElement("section");
    cartBookInfo.setAttribute("class", "cartBookInfo");

    const cartBookName = document.createElement("h3");
    cartBookName.innerText = `${book.bookname}`;
    const cartBookPrice = document.createElement("p");
    cartBookPrice.innerText = `${book.price}€`;

    const quantityBookSelector = document.createElement("section");
    quantityBookSelector.setAttribute("class", "quantityBookSelector");

    const substractBook = document.createElement("button");
    substractBook.setAttribute("class", "quantityBtns");
    substractBook.setAttribute("id", `sub${book.id}`);
    substractBook.innerText = "-";
    substractBook.addEventListener("click", () => subsBook(book.id));
    const sumBook = document.createElement("button");
    sumBook.setAttribute("class", "quantityBtns");
    sumBook.setAttribute("id", `sum${book.id}`);
    sumBook.innerText = "+";
    sumBook.addEventListener("click", () => addBook(book.id));
    const cartBookQuantity = document.createElement("p");
    cartBookQuantity.setAttribute("class", "cartBookQuantity");
    cartBookQuantity.innerText = `${book.quantity}`;

    quantityBookSelector.append(substractBook, cartBookQuantity, sumBook);

    const removeBookBtn = document.createElement("button");
    removeBookBtn.setAttribute("class", "removeBook");
    removeBookBtn.innerText = "X";
    removeBookBtn.addEventListener("click", () => removeCartBook(book.id));

    
    cartBookInfo.append(cartBookName, cartBookPrice, quantityBookSelector);
    bookCartInfoBox.append(cartBookCover, cartBookInfo);
    bookCartCard.append(bookCartInfoBox, removeBookBtn);
    cartUserBooks.append(bookCartCard);
}

function removeCartBook(bookID){
    const userCart = JSON.parse(localStorage.getItem("usercart"));

    userCart.forEach(book => {
        if (book.id == bookID){
            userCart.splice(userCart.indexOf(book), 1);
        }
    })

    rechargeCart(userCart);
}

function subsBook(bookID){
    const userCart = JSON.parse(localStorage.getItem("usercart"));

    userCart.forEach(book => {
        if (book.id == bookID){
            if (book.quantity > 1){
                book.quantity -= 1;
            }
        }
    })

    rechargeCart(userCart);
}

function addBook(bookID){
    const userCart = JSON.parse(localStorage.getItem("usercart"));

    userCart.forEach(book => {
        if (book.id == bookID){
            book.quantity += 1;
        }
    })

    rechargeCart(userCart);
}


function calcPrice(){
    const userCart = JSON.parse(localStorage.getItem("usercart"));

    totalPrice = 0;

    userCart.forEach(book => {
        totalPrice += book.price * book.quantity;
    })

    purchasePrice.innerText = `Total: ${totalPrice}€`;
}

function buyBooks(){
    if (totalPrice == 0){
        alert("No hay nada en tu carrito para comprar");
    }
    else{
        alert(`Gracias por tu compra, tu total es de ${purchasePrice.innerText}`);
        let userCart = JSON.parse(localStorage.getItem("usercart"));
        userCart=[];
        localStorage.setItem("usercart", JSON.stringify(userCart));
        insertCartBooks();
    }
}

const nextPageButton = document.getElementById("nextB")
nextPageButton.addEventListener("click", toNextPage);
const prevPageButton = document.getElementById("prevB")
prevPageButton.addEventListener("click", toPrevPage);
const paginationButtonsVisibility = document.getElementById("paginationButtons").style;


function toNextPage(){
    numPage++;

    showBooks();
}

function toPrevPage(){
    numPage--;

    showBooks();
}

function disablePageButtons(booksInPage){
    paginationButtonsVisibility.visibility = "visible";

    if (numPage == 1){
        prevPageButton.setAttribute("disabled", true);
    }
    else{
        prevPageButton.removeAttribute("disabled");
    }

    if (booksInPage < 24){
        nextPageButton.setAttribute("disabled", true)
    }
    else{
        nextPageButton.removeAttribute("disabled");
    }
}

function changeInputPlaceholder(){
    if (filterForm.filterRadio[0].checked){
        inputSearch.placeholder = "Nombre del libro...";
    }
    else if (filterForm.filterRadio[1].checked){
        inputSearch.placeholder = "Nombre del autor...";
    }
}

function highlightSearchButton(){
    if (inputSearch.value == "") {
        searchBtn.classList.remove("searchButtonReady");
    }
    else {
        searchBtn.classList.add("searchButtonReady");
    }
}

function upPage(){
    window.scrollTo({top:0, behavior:"smooth"});
}

function openCartPage() {
    cartBox.style.display = "flex";
}

function closeCartPage() {
    cartBox.style.display = "none";
}

insertCartBooks();