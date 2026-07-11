require("./db");
const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();

const runServer = () => {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

runServer();
