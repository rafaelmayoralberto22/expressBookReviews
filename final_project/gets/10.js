const axios = require("axios");

async function getBooks() {
  try {
    const books = await axios({
      url: "http://localhost:5000",
    });

    return books;
  } catch (error) {
    console.error(error);
  }
}

getBooks().then((res) => {
  console.log(res.data);
});
