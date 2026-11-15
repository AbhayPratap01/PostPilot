import asyncio

from app.integrations.telegram import post_to_telegram
from app.integrations.discord import post_to_discord


class PlatformManager:

    def __init__(self):
        self.platforms = {
            "telegram": post_to_telegram,
            "discord": post_to_discord,
        }

    async def publish(self, message: str):

        tasks = [
            platform_function(message)
            for platform_function in self.platforms.values()
        ]

        responses = await asyncio.gather(
            *tasks,
            return_exceptions=True
        )

        results = []

        for platform, response in zip(self.platforms, responses):
            if isinstance(response, Exception):
                results.append({
                    "platform": platform,
                    "status": "Failed",
                    "error": str(response)
                })
            else:
                results.append({
                    "platform": platform,
                    **response
                })

        return {
            "success": all(
                result.get("status") == "Success"
                for result in results
            ),
            "results": results
        }


platform_manager = PlatformManager()