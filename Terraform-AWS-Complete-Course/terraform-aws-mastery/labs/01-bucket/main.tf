resource "aws_s3_bucket" "notes" {
  bucket_prefix = "tf-mastery-notes-"
  force_destroy = false
}
resource "aws_s3_bucket_public_access_block" "notes" {
  bucket                  = aws_s3_bucket.notes.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
resource "aws_s3_bucket_versioning" "notes" {
  bucket = aws_s3_bucket.notes.id
  versioning_configuration { status = "Enabled" }
}
resource "aws_s3_bucket_server_side_encryption_configuration" "notes" {
  bucket = aws_s3_bucket.notes.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}
output "bucket_name" { value = aws_s3_bucket.notes.id }
