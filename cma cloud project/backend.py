import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    s3_client = boto3.client('s3', region_name='us-east-1')
    bucket_name = "your-unique-vault-bucket-name"
    
    # Get filename from the frontend request
    body = json.loads(event['body'])
    file_name = body['fileName']
    
    try:
        # Generate a signed URL for a PUT request
        response = s3_client.generate_presigned_url('put_object',
            Params={'Bucket': bucket_name, 'Key': file_name},
            ExpiresIn=3600) # URL expires in 1 hour
    except ClientError as e:
        return {'statusCode': 500, 'body': json.dumps(str(e))}

    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Origin": "*", # Required for CORS
            "Access-Control-Allow-Headers": "Content-Type"
        },
        'body': json.dumps({'uploadURL': response})
    }