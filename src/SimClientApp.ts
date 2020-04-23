/**
 * 模拟客户端
 * @author dodo
 * @date 2020.04.23
 */

import net from "net";
import Client from "./Client";
import _ from "lodash";
import { PORT } from "./Consts";

setTimeout(() => {
    let socket = net.createConnection(PORT, "127.0.0.1", () => {
        console.log("[CLIENT CONNECT]");
    });

    let client = new Client(socket);
    client.socket.on("connect", () => {
        setInterval(() => {
            client.ping();
        }, 1000);
        client.ping();
    });
    client.socket.on("data", (data) => {
        client.decode(data);

        while (client.queue.length > 0) {
            let buf = client.queue.splice(0, 1);
            let s = buf.toString();
            console.log(s);
        }
    });
}, 1000);
