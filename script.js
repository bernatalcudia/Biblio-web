const API_URL = "https://openlibrary.org/search.json?";
const API_BOOK_IMG = "https://covers.openlibrary.org/b/id/"

const inputSearch = document.getElementById("inputSearch");
const searchBtn = document.getElementById("searchButton");
searchBtn.addEventListener("click", userSearch);
const filterForm = document.getElementById("filterForm");

const openCart = document.getElementById("buyButton");
openCart.addEventListener("click", openCartPage);
const closeCart = document.getElementById("closeCart");
closeCart.addEventListener("click", closeCartPage);

const gridBooks = document.getElementById("booksGrid");
const cartBox = document.getElementById("cartBox");

const titleSearch = "title=";
const authorSearch = "author=";
const booksLimitPage = "limit=24";

let userInput;
let numPage = 1;
let userInputUrl;

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

    let userCart = localStorage.getItem("usercart");

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

function upPage(){
    window.scrollTo({top:0, behavior:"smooth"});
}

function openCartPage() {
    cartBox.style.display = "flex";
}

function closeCartPage() {
    cartBox.style.display = "none";
}