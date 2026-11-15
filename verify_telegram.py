
import asyncio
import os

import httpx
from dotenv import load_dotenv

load_dotenv()


async def main():
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")

    if not token or not chat_id:
        print("ERROR: Missing Telegram configuration.")
        return

    base_url = f"https://api.telegram.org/bot{token}"

    async with httpx.AsyncClient(timeout=15) as client:

        # 1. Verify bot token
        me_response = await client.get(f"{base_url}/getMe")
        me_data = me_response.json()

        if not me_data.get("ok"):
            print("ERROR: Invalid bot token.")
            return

        bot = me_data["result"]
        print("SUCCESS: Bot authentication verified.")
        print("Bot username:", bot.get("username"))

        # 2. Verify channel access
        chat_response = await client.get(
            f"{base_url}/getChat",
            params={"chat_id": chat_id}
        )

        chat_data = chat_response.json()

        if not chat_data.get("ok"):
            print("ERROR: Cannot access channel.")
            print("Reason:", chat_data.get("description"))
            return

        chat = chat_data["result"]

        print("SUCCESS: Channel access verified.")
        print("Channel:", chat.get("title"))
        print("Username:", chat.get("username"))

        if chat.get("type") != "channel":
            print("WARNING: The configured destination is not a channel.")


if __name__ == "__main__":
    asyncio.run(main())
