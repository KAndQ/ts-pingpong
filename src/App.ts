/**
 * 程序入口
 * @author dodo
 * @date 2020.04.23
 */

import net from "net";
import { Socket, Server } from "net";
import Client from "./Client";
import _ from "lodash";
import { PORT } from "./Consts";

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

        setInterval(() => {
            this.m_clients.forEach(client => {
                while (client.queue.length > 0) {
                    let buf = client.queue.splice(0, 1)[0];
                    let s = buf.toString();
                    if (s === "ping") {
                        client.pong();
                    }
                }
            });
        }, 0);
    }

    private m_server: Server | undefined;
    private m_clients: Client[] = [];
}

const app = new App();
app.run();
