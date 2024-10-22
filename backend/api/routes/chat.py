import uuid
from fastapi import APIRouter, BackgroundTasks, Form, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse, JSONResponse
import json
from typing import Dict, Optional
from utils import combine_audio, generate_dialogue, generate_podcast_info, generate_podcast_summary, get_pdf_text

router = APIRouter()

@router.post("/generate_transcript")
async def generate_transcript(
    pdfFile: Optional[UploadFile] = File(None),
    textInput: str = Form(...),
    tone: str = Form(...),
    duration: str = Form(...),
    language: str = Form(...),
    
): 
    pdfContent = await get_pdf_text(pdfFile)
    new_text = pdfContent
    return StreamingResponse(generate_dialogue(new_text,textInput, tone, duration, language), media_type="application/json")


@router.get("/test")
def test():
    return {"message": "Hello World"}

@router.post("/summarize")
async def get_summary(
    textInput: str = Form(...),
    tone: str = Form(...),
    duration: str = Form(...),
    language: str = Form(...),
    pdfFile: Optional[UploadFile] = File(None)
):
    pdfContent = await get_pdf_text(pdfFile)
    new_text = pdfContent
    return StreamingResponse(
        generate_podcast_summary(
            new_text,
            textInput,
            tone,
            duration,
            language,
        ),
        media_type="application/json"
    )

@router.post("/pod_info")
async def get_pod_info(
    textInput: str = Form(...),
    tone: str = Form(...),
    duration: str = Form(...),
    language: str = Form(...),
    pdfFile: Optional[UploadFile] = File(None)
):
    pdfContent = await get_pdf_text(pdfFile)
    new_text = pdfContent[:100]
    
    return StreamingResponse(generate_podcast_info(new_text, textInput, tone, duration, language), media_type="application/json")


task_status: Dict[str, Dict] = {}


@router.post("/generate_audio")
async def audio(
    background_tasks: BackgroundTasks,
    text: str = Form(...),
    language: str = Form(...)
):  
    task_id = str(uuid.uuid4())
    task_status[task_id] = {"status": "processing"}
    
    background_tasks.add_task(combine_audio, task_status, task_id, text, language)

    return JSONResponse(content={"task_id": task_id, "status": "processing"})


@router.get("/audio_status/{task_id}")
async def get_audio_status(task_id: str):
    if task_id not in task_status:
        raise HTTPException(status_code=404, detail="Task not found")
    
    status = task_status[task_id]
    
    if status["status"] == "completed":
        return JSONResponse(content={
            "status": "completed",
            "audio_url": status["audio_url"]
        })
    elif status["status"] == "failed":
        return JSONResponse(content={
            "status": "failed",
            "error": status["error"]
        })
    else:
        return JSONResponse(content={
            "status": "processing"
        })
    
    


