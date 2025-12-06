#!/usr/bin/env python3

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import tempfile
import subprocess
import shutil
import os
from pathlib import Path

app = FastAPI(title="PDF to Markdown Converter", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def run_chandra_conversion(pdf_path: str, output_dir: str) -> str:
    """
    Run chandra OCR to convert PDF to markdown.
    Returns the markdown content as a string.
    """
    # Run chandra CLI with HuggingFace method
    result = subprocess.run(
        ["chandra", pdf_path, output_dir, "--method", "hf"],
        capture_output=True,
        text=True,
        timeout=300  # 5 minute timeout for large documents
    )
    
    if result.returncode != 0:
        raise RuntimeError(f"Chandra conversion failed: {result.stderr}")
    
    # Find the generated markdown file
    # Chandra creates a subdirectory with the PDF name containing the .md file
    pdf_name = Path(pdf_path).stem
    output_subdir = Path(output_dir) / pdf_name
    
    # Look for markdown file in the output
    md_files = list(output_subdir.glob("*.md")) if output_subdir.exists() else []
    
    if not md_files:
        # Also check the root output dir
        md_files = list(Path(output_dir).glob("*.md"))
    
    if not md_files:
        raise RuntimeError(f"No markdown file generated. Output dir contents: {list(Path(output_dir).rglob('*'))}")
    
    # Read and return the markdown content
    markdown_path = md_files[0]
    return markdown_path.read_text(encoding="utf-8")


@app.post("/convert")
async def convert_pdf_to_markdown(file: UploadFile = File(...)):
    """
    Convert an uploaded PDF to markdown using Chandra OCR.
    
    Returns:
        JSON with success status, markdown content, and original filename.
    """
    print(f"Received file: {file.filename}, content_type: {file.content_type}")
    
    # Validate file type
    if file.content_type != 'application/pdf':
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")
    
    # Create temp directories for input and output
    temp_dir = tempfile.mkdtemp(prefix="chandra_")
    output_dir = tempfile.mkdtemp(prefix="chandra_out_")
    
    try:
        # Save uploaded PDF to temp file
        pdf_path = os.path.join(temp_dir, file.filename)
        content = await file.read()
        print(f"File size: {len(content)} bytes")
        
        with open(pdf_path, "wb") as f:
            f.write(content)
        
        print(f"Saved PDF to: {pdf_path}")
        print(f"Running Chandra conversion...")
        
        # Run chandra conversion
        markdown_content = run_chandra_conversion(pdf_path, output_dir)
        
        print(f"Conversion successful. Markdown length: {len(markdown_content)} chars")
        
        return JSONResponse(content={
            'success': True,
            'markdown': markdown_content,
            'filename': file.filename
        })
        
    except subprocess.TimeoutExpired:
        print("Conversion timed out")
        raise HTTPException(
            status_code=504,
            detail="PDF conversion timed out. The document may be too large or complex."
        )
    except RuntimeError as e:
        print(f"Conversion error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print(f"Server error: {str(e)}")
        raise HTTPException(status_code=500, detail=f'Server error: {str(e)}')
    finally:
        # Clean up temp directories
        shutil.rmtree(temp_dir, ignore_errors=True)
        shutil.rmtree(output_dir, ignore_errors=True)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "PDF to Markdown Converter"}

@app.get("/")
async def root():
    return {
        "message": "PDF to Markdown Conversion API", 
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    print("Starting PDF conversion server with FastAPI...")
    print("Endpoint: POST http://localhost:8000/convert")
    print("API Docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")