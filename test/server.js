import { createServer } from "http";

const server = createServer((_, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.write("Hello, World!");
  res.end();
});

server.listen(3000, () => console.log("Server running on port: 3000"));
