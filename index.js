const WebSocket = require("ws");
const express = require("express");
const cookieParser = require("cookie-parser");

class Main {
  #WS_PORT = 8060;
  constructor() {
    // Using Express as a server to handle 101 Request
    this.app = express();
    this.app.use(cookieParser());
    this.server = this.app.listen(
      this.#WS_PORT,
      console.log(`\n[!] Socket is Listening on Port: ${this.#WS_PORT}`)
    );
    this.wss = new WebSocket.Server({
      noServer: true,
      path: "/socket",
    });
  }

  get StartSocket() {

    console.log("\n[!] Socket Server Started.\n")

    let user_list = [];
    this.wss.getUniqueID = function () {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + "-" + s4();
    };

    this.wss.on("connection", function connection(ws, req) {
      const user_id = ws.user_id.toString();
      const socket_key = ws.id;
      console.log(ws_name);
      user_list.push(ws);
      ws.on("message", (e) => {
        console.log(e.toString());
        user_list.find((x) => {
          if (x.user_id == user_id) {
            x.send(e.toString().toUpperCase());
          }
        });
        ws.send(e.toString().toUpperCase());
      });

      ws.on("close", function close() {
        user_list.find((e) => {
          if (e.id == socket_key) {
            const index = user_list.indexOf(e);
            if (index > -1) {
              // only splice array when item is found
              console.log("deleted", e.id);
              user_list.splice(index, 1); // 2nd parameter means remove one item only
            }
          }
        });
        console.log("disconneted", user_list.length);
      });
    });


    // handling upgrade request
    this.server.on("upgrade", async function upgrade(request, socket, head) {

        // IF AUTH FAILED THEN DESTROYING THE CONNECTION
        // if(req.auth == fail){
        //      socket.destroy();
        //     return false;
        // }

      wss.handleUpgrade(request, socket, head, function x(ws) {
        console.log(request.rawHeaders);
        ws.user_id = 3;
        ws.id = wss.getUniqueID();
        // IF SUCCESSFLLY AUTHENTICATED THEN EMMITING CONNECTION EVENT TO CONTINUE TO UPGRADE REQUEST TO WS
        wss.emit("connection", ws, request);
      });
    });
  }
}

const main = new Main();
main.StartSocket;