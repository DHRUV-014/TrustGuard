import os
import requests
import time

# Configuration
REAL_PATH = "ml/check/real"
FAKE_PATH = "ml/check/fake"
COUNT = 100  # Number of images per folder

def download_images():
    # Ensure directories exist
    os.makedirs(REAL_PATH, exist_ok=True)
    os.makedirs(FAKE_PATH, exist_ok=True)

    print(f"🚀 Starting terminal ingest: {COUNT} images per class...")

    for i in range(1, COUNT + 1):
        # 1. Fetch REAL images (Source: Unsplash Source API - curated 'face' tag)
        try:
            real_url = f"https://source.unsplash.com/featured/400x400/?face,portrait&sig={i}"
            real_data = requests.get(real_url).content
            with open(os.path.join(REAL_PATH, f"real_{i:03d}.jpg"), "wb") as f:
                f.write(real_data)
        except Exception as e:
            print(f"Error downloading real_{i}: {e}")

        # 2. Fetch FAKE images (Source: ThisPersonDoesNotExist)
        try:
            # We use a slight delay to respect the server
            time.sleep(1.2) 
            fake_url = "https://thispersondoesnotexist.com/image"
            fake_data = requests.get(fake_url, headers={'User-Agent': 'Mozilla/5.0'}).content
            with open(os.path.join(FAKE_PATH, f"fake_{i:03d}.jpg"), "wb") as f:
                f.write(fake_data)
        except Exception as e:
            print(f"Error downloading fake_{i}: {e}")

        if i % 10 == 0:
            print(f"✅ Ingested {i}/{COUNT} samples...")

if __name__ == "__main__":
    download_images()