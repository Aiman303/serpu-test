// Настройки Serpuru. Здесь только публичные значения: publishable key можно держать в коде сайта.
// Ключи Gemini сюда НЕ кладём — они живут в секретах Supabase (Edge Functions → Secrets).
window.SERPURU = {
  supabaseUrl: "https://jjxtvixlwpwwcznnzkes.supabase.co",
  publishableKey: "sb_publishable_V9X2w2KQkcy4_DFay8ePtw_XAKeNNvT",
  aiFunction: "https://jjxtvixlwpwwcznnzkes.supabase.co/functions/v1/serpu-ai",
  telegramProvider: "custom:telegram", // id провайдера в Supabase Auth, когда подключите вход через Telegram
  owners: "Апсаматова Айман и Баиев Дастан",
  email: "aitov.anime@gmail.com",
  drugsCount: 7487,
};
