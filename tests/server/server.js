"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const RibServer_1 = require("../../Rib-Server/src/RibServer");
const PORT = parseInt(process.argv[2] || "5000");
RibServer_1.default.startServer(PORT);
RibServer_1.default.setRedisUrl('//localhost:6379');
let myRib = new RibServer_1.default();
myRib.onConnect((client) => __awaiter(this, void 0, void 0, function* () {
    client.getName = () => {
        return client.name;
    };
}));
function postMessage(message, client) {
    myRib.clientFunctions.postMessage(message, { query: { _ribId: { $ne: client._ribId } } });
}
function setName(name, client) {
    client.name = name;
}
function getNames() {
    return __awaiter(this, void 0, void 0, function* () {
        let names = yield myRib.runPOF('getName');
        return names;
    });
}
function getName(client) {
    return client.name;
}
function add(x, y) {
    return __awaiter(this, void 0, void 0, function* () {
        return x + y;
    });
}
myRib.onDisconnect((client) => {
    console.log("A client disconnected 🙁");
});
myRib.exposeFunctions([postMessage, setName, getNames, getName, add]);
