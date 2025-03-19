import { config } from "dotenv"
import path from "path"

config({
    path: path.resolve(__dirname, "../", "../.env")
})

export const LOG_SERVER_CONSTANTS = {
    DEV : {
        PORT: process.env.PORT!
    }
}