#!/usr/bin/env python3

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import random
import asyncio

app = FastAPI(title="PDF to Markdown Converter", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/conversions/pdf-to-markdown")
async def convert_pdf_to_markdown(file: UploadFile = File(...)):
    print(f"Received file: {file.filename}, content_type: {file.content_type}")
    
    try:
        # Check if file is PDF
        if file.content_type != 'application/pdf':
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file selected")
        
        # Read file content (in real app, you'd process this)
        content = await file.read()
        print(f"File size: {len(content)} bytes")
        
        # Simulate processing delay
        await asyncio.sleep(3)
        
        # 90% success rate for demo purposes
        if random.random() < 0.9:
            # Mock successful conversion
            clean_filename = file.filename.replace('.pdf', '').replace('.PDF', '')
            mock_markdown = f"""# {clean_filename}

## Abstract
This is a mock conversion of the uploaded PDF file "{file.filename}". In a real implementation, this would contain the actual extracted and converted text from your PDF document.

## Introduction
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

## Methodology  
The methodology section would contain details about the research approach, data collection, and analysis methods used in the paper.

### Data Collection
- Sample size: N = 1,000 participants
- Duration: 6 months
- Location: Multiple research centers

## Results
Key findings and results would be presented here with appropriate formatting, tables, and figures converted from the original PDF.

### Key Findings
1. Significant improvement in performance metrics
2. Reduced processing time by 40%
3. Enhanced accuracy rates across all test cases

## Discussion
The results demonstrate the effectiveness of the proposed approach. Further research is needed to validate these findings in different contexts.

## Conclusion
The conclusion summarizes the main contributions and findings of the research presented in this paper. This mock conversion shows how a real PDF would be structured as markdown.

## References
1. Smith, J. et al. (2023). Advanced PDF Processing Techniques.
2. Johnson, A. (2022). Machine Learning Applications in Document Processing.
3. Brown, K. et al. (2021). Automated Text Extraction Methods.
"""
            
            return JSONResponse(content={
                'success': True,
                'markdown': mock_markdown,
                'filename': file.filename
            })
        else:
            # Mock failure
            raise HTTPException(
                status_code=500, 
                detail='Failed to convert PDF to markdown. Please try again.'
            )
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Server error: {str(e)}")
        raise HTTPException(status_code=500, detail=f'Server error: {str(e)}')

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
    print("Endpoint: http://localhost:5000/conversions/pdf-to-markdown")
    print("API Docs: http://localhost:5000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")