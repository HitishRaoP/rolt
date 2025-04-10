resource "aws_ecs_cluster" "rolt" {
  name = "rolt"
}

resource "aws_ecs_task_definition" "deployer_task" {
  family                   = "deployer_task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  container_definitions = jsonencode([
    {
      name      = var.deployer_container
      image     = var.deployer_image
      essential = true
      portMappings = [
        {
          containerPort = 3000
          protocol      = "tcp"
        }
      ]
    }
  ])
}
