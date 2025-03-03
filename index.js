import {config} from "dotenv"
import {initiServer} from "./configs/server.js"
import {admimDefaul} from "./src/user/user.controller.js"

config()
initiServer()
admimDefaul()