const axios = require("axios");

async function getBooksByTitle(title) {
  try {
    const items = await axios({
      url: `http://localhost:5000/title/${title}`,
    });

    return items;
  } catch (error) {
    console.error(error);
  }
}

getBooksByTitle("The Epic Of Gilgamesh").then((res) => {
  console.log(res.data);
});
