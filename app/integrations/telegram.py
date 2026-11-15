
import os
from datetime import datetime, timezone

import httpx
from dotenv import load_dotenv

load_dotenv()


async def post_to_telegram(message: str) -> dict:
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")

    if not token or not chat_id:
        return {
            "platform": "Telegram",
            "status": "Failed",
            "posted_url": None,
            "public_access": None,
            "date": None,
            "time": None,
            "error": "Telegram credentials are not configured."
        }

    api_url = f"https://api.telegram.org/bot{token}/sendMessage"

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                api_url,
                json={
                    "chat_id": chat_id,
                    "text": message
                }
            )

        data = response.json()

        if response.status_code != 200 or not data.get("ok"):
            description = data.get(
                "description",
                "Telegram API rejected the request."
            )

            return {
                "platform": "Telegram",
                "status": "Failed",
                "posted_url": None,
                "public_access": None,
                "date": None,
                "time": None,
                "error": description
            }

        result = data["result"]
        message_id = result["message_id"]
        chat = result["chat"]

        timestamp = result["date"]
        posted_at = datetime.fromtimestamp(
            timestamp, tz=timezone.utc
        )

        channel_username = chat.get("username")

        posted_url = (
            f"https://t.me/{channel_username}/{message_id}"
            if channel_username
            else None
        )

        return {
            "platform": "Telegram",
            "status": "Success",
            "posted_url": posted_url,
            "public_access": bool(channel_username),
            "date": posted_at.strftime("%Y-%m-%d"),
            "time": posted_at.strftime("%H:%M:%S UTC"),
            "error": None
        }

    except httpx.TimeoutException:
        return {
            "platform": "Telegram",
            "status": "Failed",
            "posted_url": None,
            "public_access": None,
            "date": None,
            "time": None,
            "error": "Telegram API request timed out."
        }

    except httpx.RequestError:
        return {
            "platform": "Telegram",
            "status": "Failed",
            "posted_url": None,
            "public_access": None,
            "date": None,
            "time": None,
            "error": "Unable to connect to Telegram API."
        }

    except (ValueError, KeyError, TypeError):
        return {
            "platform": "Telegram",
            "status": "Failed",
            "posted_url": None,
            "public_access": None,
            "date": None,
            "time": None,
            "error": "Unexpected response from Telegram API."
        }
