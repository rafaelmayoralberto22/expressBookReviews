const axios = require("axios");

async function getBooksByISBN(isbn) {
  try {
    const book = await axios({
      url: `http://localhost:5000/isbn/${isbn}`,
      
    });

    return book;
  } catch (error) {
    console.error(error);
  }
}

getBooksByISBN(1).then((res) => {
  console.log(res.data);
});
