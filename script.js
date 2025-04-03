const API_URL = "";

let pages = {
    current: "",
    prev: "",
    next: "",
};

showBooks();

function showBooks(){
    fetch(pages.current)
    .then((response) => response.json())
    .then((data) => {
        
    })

    .catch((error) => {
        console.error("Error en la solicitud:", error);
    });
}
