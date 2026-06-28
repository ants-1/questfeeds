import app from "./app";
import config from "./config/serverConfig";

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});