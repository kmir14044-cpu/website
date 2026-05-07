from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):

    print("Received file:", file.filename)

    input_bytes = await file.read()

    print("Read bytes:", len(input_bytes))

    try:
        input_image = Image.open(io.BytesIO(input_bytes))
        output_image = remove(input_image)
        buf = io.BytesIO()
        output_image.save(buf, format='PNG')
        output_bytes = buf.getvalue()
        print("Processed bytes:", len(output_bytes))
    except Exception as e:
        print("Error:", e)
        raise

    return StreamingResponse(
        io.BytesIO(output_bytes),
        media_type="image/png"
    )

app.mount("/", StaticFiles(directory=".", html=True), name="static")