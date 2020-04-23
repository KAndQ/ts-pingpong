# ts-pingpong

TypeScript + Socket 处理粘包问题的简单 ping pong.

协议格式: 4 字节 + 数据

4 字节: 表示数据长度(大端)
数据: 实际的数据内容;
