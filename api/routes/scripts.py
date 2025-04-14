from fastapi import APIRouter, UploadFile, HTTPException
from typing import List
import aiofiles
import os
from datetime import datetime
from ..services.script_analyzer import analyze_script
from ..models.script import ScriptAnalysis

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_script(file: UploadFile) -> dict:
    try:
        # 验证文件类型
        allowed_types = {
            "application/pdf": "pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
            "text/plain": "txt"
        }
        
        file_type = file.content_type
        if file_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"不支持的文件类型: {file_type}. 请上传 PDF、DOCX 或 TXT 文件."
            )
        
        # 生成唯一文件名
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        extension = allowed_types[file_type]
        filename = f"script_{timestamp}.{extension}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        
        # 保存文件
        async with aiofiles.open(filepath, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
        
        # 开始分析脚本
        analysis_result = await analyze_script(filepath)
        
        return {
            "message": "文件上传成功",
            "filename": filename,
            "analysis": analysis_result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analysis/{script_id}")
async def get_script_analysis(script_id: str) -> ScriptAnalysis:
    try:
        # 从数据库获取分析结果
        analysis = await db.scripts.find_one({"script_id": script_id})
        if not analysis:
            raise HTTPException(status_code=404, detail="找不到该脚本的分析结果")
        return ScriptAnalysis(**analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 