resource "aws_vpc" "rolt_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    name     = "rolt-vpc"
    resource = "vpc"
  }
}

resource "aws_subnet" "rolt_public_subnet" {
  vpc_id     = aws_vpc.rolt_vpc.id
  cidr_block = "10.0.1.0/24"
  tags = {
    resource = "subnet"
    name     = "rolt_public_subnet"
  }
}
