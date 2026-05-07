from rembg import remove
from PIL import Image
import io

# Test with a simple image or something
# Since no image, just try import
print("rembg imported")
try:
    # Create a dummy image
    img = Image.new('RGB', (100, 100), color='red')
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    input_bytes = buf.getvalue()
    
    output_bytes = remove(input_bytes)
    print("Background removal successful")
except Exception as e:
    print(f"Error: {e}")