import "dotenv/config";
import { createApp } from "./app";

const PORT = Number(process.env.PORT) || 3333;

const app = createApp();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`✔ API do Banco de Questões rodando em http://localhost:${PORT}/api`);
});
