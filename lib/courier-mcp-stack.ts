import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import { Construct } from 'constructs';

export class CourierMcpStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create VPC
        const vpc = new ec2.Vpc(this, 'McpVpc', {
            maxAzs: 2
        });

        const fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'CourierMcpService', {
            vpc,
            taskImageOptions: {
                image: ecs.ContainerImage.fromAsset('.'), // Assumes Dockerfile is in project root
                containerPort: 3000, // Adjust to your Express app port
            },
            memoryLimitMiB: 512,
            cpu: 256,
            desiredCount: 1,
        });

        fargateService.targetGroup.configureHealthCheck({
            path: '/health',
            healthyHttpCodes: '200',
        });

        // Output the load balancer URL
        new cdk.CfnOutput(this, 'LoadBalancerDNS', {
            value: fargateService.loadBalancer.loadBalancerDnsName,
        });
    }
}