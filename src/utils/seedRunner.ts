import "dotenv/config";
import { seedService } from "../services/seed.service";

seedService
  .seedExamples()
  .then(({ subject, created }) => {
    // eslint-disable-next-line no-console
    console.log(`✔ Matéria "${subject.name}" pronta. ${created.length} questões novas inseridas.`);
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Erro ao popular o banco:", err);
    process.exitCode = 1;
  });
