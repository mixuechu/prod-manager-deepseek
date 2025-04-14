import openai
from typing import Dict, Any, List
import os
import json
from ..models.script import ScriptAnalysis, Scene, Character, Prop

async def analyze_script(filepath: str) -> Dict[str, Any]:
    """
    分析上传的剧本文件
    """
    try:
        # 读取文件内容
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()

        # 将内容分块，每块不超过4000个字符
        chunks = split_content(content, max_length=4000)
        
        all_scenes = []
        all_characters = set()
        all_props = set()
        
        # 逐块分析
        for chunk in chunks:
            analysis = await analyze_chunk(chunk)
            
            # 合并场景信息
            all_scenes.extend(analysis.get('scenes', []))
            
            # 收集角色信息
            for character in analysis.get('characters', []):
                all_characters.add(character['name'])
            
            # 收集道具信息
            for scene in analysis.get('scenes', []):
                for prop in scene.get('props', []):
                    all_props.add(prop['name'])
        
        # 整合分析结果
        result = {
            'scenes': all_scenes,
            'characters': [{'name': name} for name in all_characters],
            'props': [{'name': name} for name in all_props],
            'statistics': {
                'total_scenes': len(all_scenes),
                'total_characters': len(all_characters),
                'total_props': len(all_props)
            }
        }
        
        return result
        
    except Exception as e:
        print(f"Error analyzing script: {str(e)}")
        raise

async def analyze_chunk(content: str) -> Dict[str, Any]:
    """
    使用 OpenAI API 分析剧本内容块
    """
    prompt = f"""
    你是一个专业的影视制片分析AI。请分析以下剧本片段，提取关键信息：

    {content}

    请按以下JSON格式返回分析结果：
    {{
        "scenes": [
            {{
                "number": "场景编号",
                "location": "场景地点",
                "time": "场景时间",
                "description": "场景描述",
                "characters": [
                    {{
                        "name": "角色名",
                        "actions": "角色在场景中的主要动作"
                    }}
                ],
                "props": [
                    {{
                        "name": "道具名称",
                        "importance": "high/medium/low"
                    }}
                ],
                "technical_requirements": "拍摄技术要求",
                "estimated_duration": "预计拍摄时长（小时）"
            }}
        ],
        "characters": [
            {{
                "name": "角色名",
                "type": "角色类型（主角/配角等）",
                "description": "角色描述"
            }}
        ]
    }}
    """

    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "你是一个专业的影视制片分析助手。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=2000
        )
        
        # 解析返回的JSON
        result = json.loads(response.choices[0].message.content)
        return result
        
    except Exception as e:
        print(f"Error calling OpenAI API: {str(e)}")
        # 返回一个示例分析结果
        return {
            "scenes": [],
            "characters": []
        }

def split_content(content: str, max_length: int = 4000) -> List[str]:
    """
    将内容分割成较小的块
    """
    words = content.split()
    chunks = []
    current_chunk = []
    current_length = 0
    
    for word in words:
        word_length = len(word) + 1  # +1 for space
        if current_length + word_length > max_length:
            chunks.append(' '.join(current_chunk))
            current_chunk = [word]
            current_length = word_length
        else:
            current_chunk.append(word)
            current_length += word_length
    
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    
    return chunks 