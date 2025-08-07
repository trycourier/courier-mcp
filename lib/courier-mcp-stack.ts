import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import { ApplicationProtocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';

export class CourierMcpStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC
    const vpc = new ec2.Vpc(this, 'McpVpc', {
      maxAzs: 2
    });

    // Self-signed certificate for development/testing
    const certificate = new certificatemanager.Certificate(this, 'Certificate', {
      domainName: '*.elb.amazonaws.com', // Wildcard for ELB domains
      validation: certificatemanager.CertificateValidation.fromDns(),
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
      protocol: ApplicationProtocol.HTTPS,
      certificate: certificate,
      redirectHTTP: true, // Automatically redirect HTTP to HTTPS
    });

    fargateService.targetGroup.configureHealthCheck({
      path: '/health',
      healthyHttpCodes: '200',
    });

    // Output the load balancer URLs
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: fargateService.loadBalancer.loadBalancerDnsName,
      description: 'Load Balancer DNS Name',
    });

    new cdk.CfnOutput(this, 'ServiceURL', {
      value: `https://${fargateService.loadBalancer.loadBalancerDnsName}`,
      description: 'HTTPS Service URL',
    });
  }
}