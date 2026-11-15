
import os
import httpx

from dotenv import load_dotenv

load_dotenv()


async def post_to_discord(message: str) -> dict:

    webhook_url = os.getenv("DISCORD_WEBHOOK_URL")

    if not webhook_url:
        return {
            "platform": "Discord",
            "status": "Failed",
            "error": "Discord webhook URL is missing"
        }

    if len(message) > 2000:
        return {
            "platform": "Discord",
            "status": "Failed",
            "error": "Discord message exceeds 2000 characters"
        }

    try:
        async with httpx.AsyncClient(timeout=15) as client:

            response = await client.post(
                webhook_url,
                json={
                    "content": message
                }
            )

            response.raise_for_status()

        return {
            "platform": "Discord",
            "status": "Success",
            "message": "Message published successfully"
        }

    except httpx.HTTPStatusError as e:
        return {
            "platform": "Discord",
            "status": "Failed",
            "error": e.response.text
        }

    except httpx.RequestError as e:
        return {
            "platform": "Discord",
            "status": "Failed",
            "error": str(e)
        }
