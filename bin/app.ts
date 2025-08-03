#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CourierMcpStack } from '../lib/courier-mcp-stack'

const app = new cdk.App();
new CourierMcpStack(app, 'CourierMcpStack2');