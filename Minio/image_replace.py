from pymongo import MongoClient
import requests
from minio import Minio
from minio.error import S3Error
import os

# MongoDB connection
mongo_client = MongoClient('mongodb://localhost:27017/')
db = mongo_client['Xange22']
collection = db['matches']

# MinIO connection
minio_client = Minio(
    "minio.fanxange.live:80",  # IP and port
    access_key="i01NpDnkVLkJe83bsMMD",
    secret_key="yUNmhOS6mkNFj3nshCLgX8gqeGSumbrXTDJWXHJx",
)

bucket_name = "fanxange"

# Ensure the bucket exists
if not minio_client.bucket_exists(bucket_name):
    minio_client.make_bucket(bucket_name)

def upload_to_minio(file_path, file_name):
    try:
        result = minio_client.fput_object(
            bucket_name, file_name, file_path,
        )
        print("Endpoint URL:", minio_client._endpoint_url)
        return f"{minio_client._endpoint_url}/{bucket_name}/{file_name}"
    except S3Error as exc:
        print("Error uploading to MinIO:", exc)
        return None

def process_documents():
    temp_dir = 'temp'
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)

    for document in collection.find():
        image_url = document.get("team1logo")  # Adjust the field name as per your document structure
        if image_url:
            # Download the image
            response = requests.get(image_url)
            file_name = image_url.split("/")[-1]
            temp_path = f"temp/{file_name}"
            with open(temp_path, "wb") as f:
                f.write(response.content)

            # Upload to MinIO
            minio_url = upload_to_minio(temp_path, file_name)

            if minio_url:
                # Update the MongoDB document
                collection.update_one({"_id": document["_id"]}, {"$set": {"minio_image_url": minio_url}})

            # Clean up the temp file
            os.remove(temp_path)

if __name__ == "__main__":
    process_documents()
