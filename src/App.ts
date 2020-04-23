/**
 * 程序入口
 * @author dodo
 * @date 2020.04.23
 */

import net from "net";
import { Socket, Server } from "net";
import Client from "./Client";
import _ from "lodash";

const PORT = 48080;

export default class App {
    /// 运行
    public run(): void {
        console.log("Run! Fast Run! Gump!");

        this.m_server = net.createServer((socket) => {
            console.log("[SERVER CONNECT]");

            let client = new Client(socket, (client) => {
                _.remove(this.m_clients, (c) => {
                    return client == c;
                });
                console.log("[SERVER]: clients =", this.m_clients.length);
            });
            client.run();
            this.m_clients.push(client);
        });
        this.m_server.listen(PORT, () => {
            console.log("==>> 服务器启动");
        });
        this.m_server.on("close", () => {
            console.log("[SERVER CLOSE]");
        });
        this.m_server.on("listening", () => {
            console.log("[SERVER LISTENING]");
        });
        this.m_server.on("error", (err) => {
            console.log("[SERVER ERROR]:", err.toString());
        });
    }

    private m_server: Server | undefined;
    private m_clients: Client[] = [];
}

// const app = new App();
// app.run();

// setTimeout(() => {
//     let socket = net.createConnection(PORT, "127.0.0.1", () => {
//         console.log("[CLIENT CONNECT]");
//     });

//     let client = new Client(socket, client => {
//     });
//     client.socket.on("connect", () => {
//         let buf = Buffer.from("hello socket");
//         client.encodeSend(buf);
//     });
// }, 1000);

let buf1 = Buffer.from("hello world");
console.log(buf1.length);

let buf2 = Buffer.from(buf1.buffer, 2);
console.log(buf2.length);
