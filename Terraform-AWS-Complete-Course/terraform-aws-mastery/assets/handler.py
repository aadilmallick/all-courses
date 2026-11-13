import json
import os

def main(event, context):
    method = event.get("requestContext", {}).get("http", {}).get("method", "GET")
    path = event.get("rawPath", "/health")
    if method != "GET" or path != "/health":
        return {"statusCode": 404, "body": json.dumps({"error": "not found"})}
    return {
        "statusCode": 200,
        "headers": {"content-type": "application/json", "cache-control": "no-store"},
        "body": json.dumps({"status": "ok", "release": os.environ.get("RELEASE", "local")})
    }
