const axios = require("axios");

async function getBooksByAuthor(author) {
  try {
    const books = await axios({
      url: `http://localhost:5000/author/${author}`,
    });

    return books;
  } catch (error) {
    console.error(error);
  }
}

getBooksByAuthor("Dante Alighieri").then((res) => {
  console.log(res.data);
});
