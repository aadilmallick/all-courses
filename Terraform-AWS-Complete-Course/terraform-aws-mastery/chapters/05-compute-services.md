# 5. Turn infrastructure into an observable HTTP service

**Central problem:** How do source code, an execution identity, a deployment artifact, an invocation path, and operational evidence become a working service?

**Prerequisites:** AWS identity and resource dependencies. Chapter 4 supplies the network concepts needed for the EC2 and container comparisons; the runnable serverless lab does not require the VPC lab.

**Source:** [health API module](../modules/health-api/main.tf), [function source](../assets/handler.py), [packager](../scripts/package_lambda.py), and [serverless root](../labs/03-serverless/main.tf).

## 5.1 Separate five responsibilities before choosing a service

A working application needs executable code, a place to run it, an identity for its actions, a way for clients to reach it, and a way for operators to observe failures. Terraform can configure infrastructure for those responsibilities, but declaring a function does not prove its handler returns the response a client expects.

Our reference service answers `GET /health` with a JSON object containing a status and release identifier. That tiny behavior is deliberate. It is enough to demonstrate artifact packaging, deployment hashing, IAM trust, logging permissions, API integration, routing, and post-deployment verification without adding a database client or framework as an unexplained dependency.

The health response does not certify database availability, cross-region recovery, or every downstream dependency. It demonstrates that a particular invocation path reached a particular release of the handler. Health checks should be designed around their consumers: a load balancer needs to know whether a target can accept traffic, while a deployment probe may also verify the expected release identifier.

We will deploy the small service using Lambda and an API Gateway HTTP API. Then we will compare the corresponding responsibilities in EC2, Auto Scaling, ECS, and EKS. The comparison is architectural; the provided runnable reference does not pretend to implement four full compute platforms.

## 5.2 Read the complete handler before provisioning it

The function uses only Python's standard library:

~~~python
import json
import os


def main(event, context):
    method = event.get("requestContext", {}).get("http", {}).get("method", "GET")
    path = event.get("rawPath", "/health")
    if method != "GET" or path != "/health":
        return {"statusCode": 404, "body": json.dumps({"error": "not found"})}
    return {
        "statusCode": 200,
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-store"
        },
        "body": json.dumps({
            "status": "ok",
            "release": os.environ.get("RELEASE", "local")
        })
    }
~~~

`json.dumps` serializes a Python value into a JSON string. The response body is a string because that is what this API integration response contract expects. `os.environ` reads deployment-provided environment values. The function does not print those environment values or return the entire event, which helps keep the demonstration from exposing incidental request data.

The nested `get` calls extract the HTTP method from an API Gateway version 2 event while providing a default for simple local calls. The path check rejects unrelated paths if the function is invoked directly with another event. API Gateway also has an explicit health route, so request routing and application behavior reinforce each other.

The configured handler string is `handler.main`: import the file named `handler.py` and call its `main` function. A file placed under an unexpected subdirectory in the ZIP can cause an import error even when Terraform successfully uploads the archive. Artifact layout is part of the executable contract.

## 5.3 Build an artifact once and identify it by content

An **artifact** is a deployable package produced from source. Here it is a ZIP containing `handler.py` at its root. The supplied packaging script uses Python's ZIP library and fixes the archive entry timestamp so unchanged source produces reproducible package bytes in the stated environment.

~~~powershell
python ./scripts/package_lambda.py
~~~

On systems where Python is invoked as `py`, use `py -3 ./scripts/package_lambda.py`. The course already includes a built `assets/health.zip`, and the readable source remains canonical. Rebuild after changing the handler. Do not edit the ZIP manually and assume the source still represents what will be deployed.

The Terraform function resource uses `filebase64sha256(var.package_path)` for `source_code_hash`. This computes a hash from the actual package bytes and encodes it for the provider. When the bytes change, Terraform can plan a code update. A filename alone would not distinguish two different packages written to the same location.

Content identity is a foundation for reliable delivery. Build the package once, test it, retain its digest, and use those bytes during the reviewed deployment. Building a different package between plan and apply can break the connection between the reviewed change and the deployed application. Chapter 10 extends that reasoning to the saved Terraform plan itself.

## 5.4 The execution role is not the caller permission

Lambda's execution role allows the running function to call other AWS APIs. Its trust policy permits the Lambda service to assume the role. In our module, the attached permissions allow creation of log streams and publication of log events in the explicitly managed log group.

API Gateway's permission to invoke the function is a separate resource policy relationship. The module declares `aws_lambda_permission` with the API Gateway service principal and a source ARN scoped to the health route. The function's role does not grant API Gateway invocation permission merely because both pieces belong to the same application.

This yields three distinct identities in the workflow: the Terraform executor configures infrastructure, API Gateway invokes the function, and the function's role writes logs. A production data-processing function might also receive table or object permissions, but our health handler does not access those services and therefore receives no such permissions.

The distinction is reinforced by the pinned [Lambda resource documentation](https://raw.githubusercontent.com/hashicorp/terraform-provider-aws/v6.0.0/website/docs/r/lambda_function.html.markdown). When diagnosing AccessDenied, identify which of these identities made the failing request before editing any policy.

## 5.5 Logging is configured infrastructure

The module creates a CloudWatch log group named for the function and gives it seven-day retention. Without explicit retention, logs can accumulate beyond the intended learning period. A retention period is an operational choice that should reflect investigation needs, privacy, and costs.

The function's log-writing policy references the managed group's ARN with an appropriate stream suffix. That reference establishes a dependency on the log group. An explicit dependency from the function to the role policy expresses the hidden readiness relationship: the function should not be provisioned as ready for use before the required role policy is configured.

Terraform ordering does not eliminate every service propagation delay. IAM changes can take time to become effective across distributed systems. A provider may retry known transient conditions; persistent errors need investigation. Repeatedly adding broad `depends_on` declarations is not a universal solution to eventual consistency.

Application logs should convey meaningful events without dumping secrets, tokens, or full personal payloads. Our handler deliberately keeps its response and behavior small. For a richer service, choose structured fields such as request ID, operation, outcome, and duration, then define a retention and access policy for the resulting data.

## 5.6 Trace an HTTP request through the module

The HTTP API defines the public entry point. A route matches `GET /health`. An integration connects that route to the Lambda function using AWS proxy integration and payload format version `2.0`. A default stage deploys the route configuration. The invocation permission allows the matching API source to call the function.

~~~text
client HTTPS request
  -> HTTP API endpoint
  -> GET /health route
  -> Lambda proxy integration
  -> Lambda invocation permission
  -> handler.main(event, context)
  -> JSON response envelope
  -> client response
~~~

The route's authorization type is explicitly `NONE`. That makes this nonsecret health endpoint publicly callable. It is an intentional demonstration choice, not a recommendation to expose application data routes without authentication. The module returns no customer data and supports only the health path.

For protected HTTP API routes, AWS_IAM authorization requires clients to sign requests and have applicable `execute-api` permission. JWT authorization is another option with an issuer and audience contract. Neither should be simulated by checking a hard-coded secret query parameter. The primary [HTTP API IAM authorization guide](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-access-control-iam.html) explains the signing requirement.

The integration schema is version-sensitive, so the source uses the pinned provider's supported [API Gateway integration arguments](https://raw.githubusercontent.com/hashicorp/terraform-provider-aws/v6.0.0/website/docs/r/apigatewayv2_integration.html.markdown). A successful integration declaration is still distinct from a handler that returns a valid response.

## 5.7 Apply, observe, and change one release

Set the serverless root's verified account ID, confirm the selected profile, and build the artifact if you changed its source. Then inspect the proposed resources:

~~~powershell
Copy-Item ./labs/03-serverless/terraform.tfvars.example ./labs/03-serverless/terraform.tfvars
terraform -chdir=labs/03-serverless init
terraform -chdir=labs/03-serverless validate
terraform -chdir=labs/03-serverless plan -out=service.tfplan
terraform -chdir=labs/03-serverless show service.tfplan
~~~

The plan includes logging, IAM, Lambda, and API Gateway resources. It does not include a VPC, NAT gateway, or EC2 instance. A Lambda function does not need to be attached to your VPC to exist or serve this health endpoint. VPC attachment is a separate choice driven by access to private resources and network controls.

After choosing to apply:

~~~powershell
terraform -chdir=labs/03-serverless apply service.tfplan
$taskHealthUrl = terraform -chdir=labs/03-serverless output -raw url
Invoke-RestMethod -Uri $taskHealthUrl
~~~

The expected response contains status `ok` and release `lesson-05`. The exact endpoint hostname is assigned by AWS and will differ. If the response is wrong, inspect the actual package, handler configuration, integration event format, and logs before changing unrelated networking.

To observe a release configuration change, add `release = "lesson-05-v2"` to the module call in the root, plan again, and review the environment update. After applying, the endpoint should report the new release. This checks that the request reached the revised function configuration; it does not test a code change unless the artifact bytes also changed.

## 5.8 Runtime selection has a lifecycle

The module declares Python `3.13` as the Lambda runtime. The language version used to package a ZIP with a standard-library script is separate from the remote function runtime. For code with native extensions, architecture and operating-system compatibility become additional packaging constraints.

AWS publishes a runtime support schedule. A runtime can enter deprecation stages, and the ability to create or update functions can change accordingly. Review the current [runtime documentation](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) before deploying an old course package years later. Pinning a runtime creates clarity; it does not remove the obligation to maintain it.

The reference handler has no third-party Python dependency. If you add a database SDK or web framework, declare and pin the dependency, package it appropriately, and test the resulting artifact. Relying on an incidental library in a managed runtime can undermine reproducibility unless that reliance is deliberate and documented.

A mature deployment records source revision, package digest, runtime, architecture, and environment configuration. Those facts explain what is running more reliably than a folder called `latest`. They also make rollback decisions more concrete because an earlier release can be identified and reconstructed.

## 5.9 Capacity is a queueing and limit problem

For a rough steady-state estimate, average concurrent executions are approximately arrival rate multiplied by average execution duration. If a service receives 20 requests per second and each takes 0.2 seconds, the mean in-flight work is roughly four requests. This is a simplified use of the relationship often called Little's Law; bursts, retries, downstream limits, and duration distributions still matter.

Lambda concurrency limits and API throttles constrain different parts of the path. The lab's default stage settings specify a modest rate and burst target to make the demonstration bounded, but throttling is not a hard dollar budget. Requests, retries, and other service usage can still incur charges. Do not advertise the settings as a complete cost-protection mechanism.

The companion's **Capacity explorer** calculates the approximate in-flight work from arrival rate and duration, then compares it with a chosen concurrency capacity. It labels the calculation as an average model. A value below capacity does not guarantee low tail latency or adequate burst handling.

For real systems, measure latency percentiles, error rates, throttles, and downstream saturation. A function that scales rapidly can overwhelm a database faster than a fixed-size server fleet. Independent service scalability is not the same as end-to-end capacity.

## 5.10 EC2 teaches a different ownership boundary

EC2 provides virtual machines. You choose an image, instance type, networking, storage, instance profile, and other settings. You also need a strategy for operating-system updates, application installation, process supervision, and replacement. Terraform can provision the machine while an image pipeline or configuration-management process handles the software image.

An Amazon Machine Image, or AMI, is region-specific and has a publisher identity. A lookup that selects the newest matching image can change behavior on a later plan without a source edit. That can be useful for an image-refresh workflow but surprising in a reproducible release. Pin an approved image ID per region or promote a tested image reference deliberately.

User data supplies boot-time initialization instructions to supported images. It is not a reliable secret-delivery mechanism, and it is not a complete ongoing configuration-management system. A script that downloads packages from the internet requires a working egress path; the private network lab intentionally lacks general internet egress.

If you use EC2, prefer role-based credentials through an instance profile and require the appropriate instance metadata protections, including IMDSv2 where supported by your design. Avoid opening SSH to the world as a default lab convenience. Systems Manager can provide administrative access, but it requires a managed agent, permissions, and network paths of its own.

The pinned [EC2 instance schema](https://raw.githubusercontent.com/hashicorp/terraform-provider-aws/v6.0.0/website/docs/r/instance.html.markdown) is a reference for supported arguments. The important course lesson is to distinguish a machine's successful creation from the application's successful initialization and readiness.

## 5.11 Auto Scaling and load balancing turn instances into a service

A launch template describes how to create instances. An Auto Scaling group manages a fleet with minimum, desired, and maximum capacity. A load balancer distributes requests to registered healthy targets. A target group defines the target type, port, protocol, and health check. A listener accepts client traffic and selects a forwarding action.

Trace the dependencies in that order of meaning rather than memorizing a resource list. The launch template needs an approved image and instance security settings. The group needs subnets and a launch template version. The target group needs the VPC and application port. The listener needs a certificate for HTTPS and a forwarding destination. Security groups must permit the client-to-balancer and balancer-to-target paths.

Do not confuse Auto Scaling's desired capacity with a value Terraform must constantly restore. If an autoscaler owns capacity at runtime, define which settings Terraform owns and which are delegated. A narrowly justified lifecycle ignore can prevent ownership conflict, but ignoring all changes would also hide important configuration drift.

Rolling replacement needs spare capacity and a health strategy. “Create before destroy” is not sufficient if account quotas, subnet addresses, unique names, or application compatibility prevent old and new capacity from coexisting. Model the migration path, not only the desired final count.

Launch template user data expects the encoding documented by the provider, which is why a supported expression such as `filebase64(...)` matters. Exact launch and refresh arguments should be checked against the [pinned launch-template schema](https://raw.githubusercontent.com/hashicorp/terraform-provider-aws/v6.0.0/website/docs/r/launch_template.html.markdown) and related service resources before implementing a production fleet.

## 5.12 Containers move the package boundary

A container image packages application code and its userspace dependencies under an image format. ECS orchestrates tasks and services; Fargate supplies a managed execution option. A task definition describes containers, resource settings, logging, and execution relationships. An ECS service maintains desired tasks and can integrate with a load balancer.

The **task execution role** and **task role** serve different purposes. The execution role supports operations such as pulling an image and delivering logs under the configured platform behavior. The task role supplies the application with permissions for its own AWS calls. Granting the image-pull role application data access can broaden authority unnecessarily.

Pin an image by immutable digest for a reviewed release. A mutable tag such as `latest` can point to different bytes after a plan, weakening the evidence chain. Terraform should coordinate infrastructure and chosen image identity; it should not become an improvised Docker build script with credentials hidden in local-exec commands.

EKS provides managed Kubernetes control-plane capabilities while leaving additional cluster, workload, identity, networking, and upgrade responsibilities. Terraform is commonly used for clusters and foundational integrations; Kubernetes-native tooling often owns ongoing application deployments. Splitting these concerns can avoid provider initialization cycles and clarify the boundary between infrastructure and workload controllers.

## 5.13 Choose compute by constraints, not fashion

| Model | Useful when | Responsibilities that remain visible |
|---|---|---|
| Lambda | Event-driven or request workloads fit its execution model | Runtime maintenance, artifact quality, concurrency, IAM, retries, observability |
| EC2 with Auto Scaling | You need host-level control or a VM operating model | Images, patching, fleet refresh, capacity, process readiness |
| ECS/Fargate | Containers fit the team and workload | Images, tasks, service scaling, network paths, role boundaries |
| EKS | Kubernetes capabilities justify its complexity | Cluster/workload upgrades, controllers, identity, networking, operational skill |

A small internal endpoint does not automatically justify a Kubernetes platform. A long-running stateful workload does not automatically fit a short-lived function model. Start with execution duration, state, latency, runtime needs, operational ownership, scaling behavior, and team competence. Then evaluate cost using the actual usage pattern.

The runnable reference selects Lambda because it gives a compact way to teach the complete deployment chain. The choice is not a ranking of every AWS compute service. Expert work includes choosing a smaller architecture when it satisfies the requirements and being explicit about the constraints that would force a different choice.

## 5.14 Diagnose the response path systematically

A missing endpoint can be an output or deployment issue. A 404 can be a route mismatch. A 403 can be an authorization issue or an incorrect request path depending on the API behavior. A 5xx can indicate invocation, handler, dependency, or response-format failure. Use the observed status and logs to select a hypothesis rather than treating every failure as a networking problem.

If the handler cannot be imported, inspect the ZIP root and handler string. If API Gateway cannot invoke the function, inspect the Lambda permission source ARN and integration target. If logs are missing, compare the function name, log group, and execution-role policy. If the response has an old release, compare the deployed environment and artifact against the reviewed inputs.

A good incident record includes the endpoint, timestamp, request method/path, response status, expected release, and relevant request identifiers. Do not include bearer tokens or private payloads merely to make the report look complete. Reproduction steps should preserve the behavior while minimizing sensitive data.

## 5.15 Optional application with a reference direction

Add a build identifier to the health response through the existing `RELEASE` environment variable, then verify that a configuration-only update changes the response. Next change the handler's output structure, rebuild the ZIP, and inspect the source-code hash difference in the plan. These are two different deployment mechanisms with different evidence.

A reference solution retains the same function and API identities, changes only the intended environment value or artifact bytes, and verifies the endpoint afterward. It does not create a second function merely because a release identifier changed. If a replacement is proposed, inspect the exact forcing argument before applying.

For a design extension, write the additional controls needed for a private data route: caller authentication, authorization scope, input validation, application data permissions, logging discipline, and tests. The reference module intentionally implements only a public nonsecret health endpoint. Adding a database ARN to an environment variable does not implement CRUD behavior or grant permission to access that database.


## Worked readiness distinction: provisioned, reachable, and correct

A function can exist in AWS while its handler fails to import. An HTTP API can exist while its route targets the wrong integration. An endpoint can return 200 while serving the wrong release. These are three different readiness claims, and they need different observations.

Terraform resource success establishes that the provider completed its defined operations and recorded the results it could observe. It does not execute every possible application path. A direct function invocation can help isolate handler behavior from API routing, while an external HTTP request verifies the combined public path. Comparing the release field ties that response to the intended configuration.

If a custom domain is added, introduce another explicit chain: registered DNS name, appropriate certificate validation, API custom-domain configuration, mapping to the intended API/stage, and DNS routing to that target. A valid certificate for the wrong hostname is not a successful deployment. A DNS record pointing at an old API can make the new API healthy but unused.

Keep liveness and readiness semantics deliberate. A liveness check asks whether a process should be restarted. A readiness check asks whether it should receive work. A deployment verification probe asks whether the intended release is serving the expected behavior. Combining every dependency into every check can cause cascading failures: a temporary downstream outage might make an otherwise healthy process restart repeatedly.

For the reference health handler, the promise is intentionally narrow: execute the handler through the configured HTTP route and return the release. A richer readiness endpoint could check a dependency with a bounded timeout, but then its cost, permissions, failure behavior, and information exposure need review. It should not print secret connection details to explain a failure.

### Retry behavior changes the application contract

Some event sources retry failed function work. An HTTP caller may also retry after a timeout without knowing whether the first request completed. If a future Field Notes write route creates data, it needs an idempotency strategy appropriate to the operation, such as a client request identifier and conditional write.

Terraform can provision the table, queue, permissions, and retry-related settings, but it cannot make arbitrary application code idempotent. This is another useful ownership boundary. Infrastructure and software contracts meet at the event format, timeout, retry, authorization, and persistence semantics. Expert review follows those relationships rather than assuming a managed compute service removes them.


## 5.16 Cleanup and the next boundary

Review a destroy plan for the serverless root when finished. It should remove the API, function, role relationships, and managed log group. Logs are evidence with their own retention needs; deleting the group removes the demonstration's operational history. In production, decide whether logging infrastructure belongs to a different ownership and retention boundary.

You now have enough moving pieces that a laptop state file becomes a team concern. If two operators manage the same function from separate state files, both can believe they own it. If a laptop disappears, the configuration alone does not tell the full association history. Chapter 6 turns state storage, locking, access, and recovery into an explicit operational design.


For every compute choice, identify the deployable unit explicitly: a ZIP for this function, an approved image for a VM fleet, or an immutable container image for a container service. Then identify the process that produces and tests it. This simple inventory prevents Terraform from becoming an accidental mixture of artifact builder, secret transporter, application installer, and infrastructure coordinator without anyone reviewing those extra responsibilities.
