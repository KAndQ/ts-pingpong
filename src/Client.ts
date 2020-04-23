/**
 * 客户端
 * @author dodo
 * @date 2020.04.23
 */

import { Socket } from "net";
import process from "process";

const HEAD_SIZE = 4;

export default class Client {
    public constructor(socket: Socket, closeListener: (client: Client) => void) {
        this.m_socket = socket;
        this.m_closeListener = closeListener;
    }

    public get socket() {
        return this.m_socket;
    }

    public run() {
        this.m_socket.on("close", (had_error) => {
            console.log("[CLIENT CLOSE], had_error =", had_error);
            this.m_closeListener(this);
        });
        this.m_socket.on("connect", () => {
            console.log("[CLIENT CONNECT]");
        });
        this.m_socket.on("data", (data) => {
            console.log("[CLIENT DATA]");

            this.decode(data);
        });
        this.m_socket.on("drain", () => {
            console.log("[CLIENT DRAIN]");
        });
        this.m_socket.on("end", () => {
            console.log("[CLIENT END]");
        });
        this.m_socket.on("error", (err) => {
            console.log("[CLIENT ERROR]");
        });
        this.m_socket.on(
            "lookup",
            (err: Error, address: string, family: string | number, host: string) => {
                console.log("[CLIENT LOOKUP]");
            }
        );
        this.m_socket.on("timeout", () => {
            console.log("[CLIENT TIMEOUT]");
        });
    }

    public encodeSend(data: Buffer): void {
        let headBuf = Buffer.alloc(HEAD_SIZE);
        headBuf.writeUInt32BE(data.length);
        this.m_socket.write(Buffer.concat([headBuf, data]));
    }

    public decode(data: Buffer): void {
        if (this.m_buffer === undefined) {
            this.m_buffer = data;
        } else {
            this.m_buffer = Buffer.concat([this.m_buffer, data]);
        }

        while (this.m_buffer.length >= this.m_readSize) {
            if (this.m_isReadHead) {
                this.m_readSize = this.m_buffer.readUInt32BE();
                console.log("readSize =", this.m_readSize);
                this.m_isReadHead = false;
                this.m_buffer = Buffer.from(this.m_buffer, HEAD_SIZE, 4);
                console.log("buffer.length =", this.m_buffer.length);
                process.exit();
            } else {
                let buf = Buffer.from(this.m_buffer, 0, this.m_readSize);
                this.m_queue.push(buf);

                this.m_buffer = Buffer.from(this.m_buffer, this.m_readSize);
                this.m_readSize = HEAD_SIZE;
                this.m_isReadHead = true;
            }
        }
    }

    private m_socket: Socket;
    private m_buffer: Buffer | undefined;
    private m_isReadHead: boolean = true;
    private m_readSize: number = HEAD_SIZE;
    private m_queue: Buffer[] = [];
    private m_closeListener: (client: Client) => void;
}
