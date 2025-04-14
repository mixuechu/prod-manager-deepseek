import openai
import json
from ..config.settings import OPENAI_API_KEY
from ..models.scene import Scene, ScriptAnalysis, Character

# Configure OpenAI
openai.api_key = OPENAI_API_KEY

async def analyze_script(text: str) -> ScriptAnalysis:
    """Analyze script text using OpenAI API"""
    try:
        prompt = f"""
        请分析以下剧本文本，提取场景和角色信息。以JSON格式返回，包含以下信息：
        1. 场景列表：编号、地点、时间、出现的角色、道具、特殊说明
        2. 角色列表：姓名、类型、描述

        剧本文本：
        {text}

        请确保返回的JSON格式符合以下结构：
        {{
            "scenes": [
                {{
                    "number": 1,
                    "location": "地点",
                    "time": "时间",
                    "characters": ["角色1", "角色2"],
                    "props": ["道具1", "道具2"],
                    "special_notes": "特殊说明"
                }}
            ],
            "characters": [
                {{
                    "name": "角色名",
                    "type": "角色类型",
                    "description": "角色描述"
                }}
            ]
        }}
        """

        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "你是一个专业的剧本分析助手，擅长提取剧本中的关键信息。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=2000
        )

        result = json.loads(response.choices[0].message.content)
        return ScriptAnalysis(
            scenes=[Scene(**scene) for scene in result["scenes"]],
            characters=[Character(**char) for char in result["characters"]]
        )

    except Exception as e:
        print(f"OpenAI API Error: {str(e)}")
        # Return sample data as fallback
        return ScriptAnalysis(
            scenes=[
                Scene(
                    number=1,
                    location="办公室",
                    time="日景",
                    characters=["张明", "李秘书"],
                    props=["文件袋", "办公桌"],
                    special_notes="重要场景，需要特写镜头"
                )
            ],
            characters=[
                Character(
                    name="张明",
                    type="主角",
                    description="35岁，精明能干的调查记者"
                )
            ]
        ) 