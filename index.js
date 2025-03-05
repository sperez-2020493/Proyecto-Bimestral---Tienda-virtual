import {config} from "dotenv"
import {initiServer} from "./configs/server.js"
import {admimDefaul} from "./src/user/user.controller.js"
import {categoríaDefaut} from "./src/category/category.controller.js"


config()
initiServer()
admimDefaul()
categoríaDefaut()