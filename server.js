const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
app.use(
  cors({
    origin: allowedOrigin,
    methods: ["POST"],
    optionsSuccessStatus: 200,
  }),
);

app.use(express.json());

app.post("/api/send-form", async (req, res) => {
  const { name, phone, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      error: 'Поля "Имя" и "Телефон" обязательны для заполнения.',
    });
  }

  const tgMessage =
    `🔥 *Новая заявка* \n\n` +
    `*Имя:* ${name}\n` +
    `*Контакт:* ${phone}\n\n` +
    `*Сообщение:* ${message || "—"}`;

  try {
    const botToken = process.env.TG_BOT_TOKEN;
    const chatId = process.env.TG_CHAT_ID;

    const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    await axios.post(tgUrl, {
      chat_id: chatId,
      text: tgMessage,
      parse_mode: "Markdown",
    });

    return res.status(200).json({
      success: true,
      message: "Данные успешно отправлены в Telegram!",
    });
  } catch (error) {
    console.error(
      "Ошибка при отправке в Telegram:",
      error.response ? error.response.data : error.message,
    );

    return res.status(500).json({
      success: false,
      error: "Не удалось отправить сообщение в Telegram.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер успешно запущен на порту ${PORT}`);
});
