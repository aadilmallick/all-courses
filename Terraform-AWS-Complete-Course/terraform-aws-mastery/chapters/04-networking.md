# 4. Build a network by tracing a packet

**Central problem:** How do we determine which components can communicate, and express that design without accidental address overlap or hidden routing assumptions?

**Prerequisites:** Terraform values and instance keys; AWS accounts and regions. This chapter introduces the necessary networking before the configuration that uses it.

**Source:** [modules/network](../modules/network/main.tf) and [labs/02-network](../labs/02-network/main.tf). The default lab creates network components and an S3 gateway endpoint, with no EC2 instances, NAT gateways, load balancers, or public IPv4 allocations. This is a deliberate learning topology, not a universal production network.

## 4.1 Start with delivery, then introduce the address

A computer sends information in packets. At a practical level, a packet includes source and destination addresses, a protocol, and often source and destination ports. A router chooses where to send it next. A firewall decides whether the traffic is permitted. A name service can translate a human-readable name into an address. These are distinct jobs.

Suppose an application needs to read an object from S3. Before debugging Terraform, ask four questions: what endpoint did the application resolve, which route carries its packets, which network controls permit the traffic, and which IAM identity authorizes the object read? A failure in any one can produce an application error. The error message alone may not identify the layer.

An IPv4 address is a 32-bit number conventionally written as four decimal octets, such as `10.42.1.7`. Each octet represents eight bits and ranges from zero to 255. You do not need to manipulate binary strings constantly, but understanding the address size explains why network prefixes change capacity in powers of two.

A **port** identifies a transport endpoint within a host. HTTPS commonly uses TCP port 443. A server listening on port 443 still needs a reachable address and permitted traffic. Conversely, a working route does not create a listener or authorize the application request. Keep these distinctions visible when reviewing security group rules.

## 4.2 Derive CIDR sizes with a concrete example

CIDR notation writes an address followed by a prefix length. `10.42.0.0/16` means the first 16 of the 32 bits identify the network. That leaves 16 address bits, so the block contains `2^(32 - 16) = 65,536` addresses. A `/24` leaves eight bits and contains 256 addresses. A longer prefix means a smaller range.

To divide a `/16` into `/24` subnets, add eight prefix bits. There are `2^8 = 256` possible subnet slots, numbered zero through 255. Each slot advances the third octet in this particular example. Slot zero is `10.42.0.0/24`, slot one is `10.42.1.0/24`, and slot 128 is `10.42.128.0/24`.

Terraform's expression `cidrsubnet("10.42.0.0/16", 8, 128)` computes the last range. The arguments are the original prefix, the additional network bits, and the subnet number. The added bits count is not the target prefix length. Passing 24 as the second argument would mean adding 24 bits to the original prefix, which is not the intended calculation.

AWS reserves certain IPv4 addresses in each ordinary subnet, so 256 total addresses do not mean 256 assignable host addresses. For the common subnet rules, five addresses are reserved, leaving 251 in a `/24`. Service-specific consumption, scaling, and operational headroom further reduce practical capacity. A subnet plan should account for interfaces created by managed services, not just the number of virtual machines you initially expect.

The course uses deliberately roomy ranges for clarity. Real address planning must consider corporate networks, peering, VPNs, and future regions. Overlapping address space can make later connectivity difficult. Creating a small VPC in isolation is easy; fitting it into an organization's address plan is a different engineering problem.

## 4.3 A VPC contains subnets, and a subnet belongs to one zone

A Virtual Private Cloud is a logically isolated virtual network associated with a region. A subnet is a slice of its address space located in one Availability Zone. Spreading an application across two subnets in the same zone does not provide the same fault separation as using two zones.

The lab takes a map of logical zone keys. Each value supplies an actual zone name and a stable address slot:

~~~hcl
zones = {
  first  = { name = "us-east-1a", slot = 0 }
  second = { name = "us-east-1b", slot = 1 }
}
~~~

The keys `first` and `second` are module identities. The zone names are AWS placement choices. The slots determine CIDR allocation. Keeping these concepts separate lets the module preserve an understandable addressing policy rather than assigning subnets based on incidental list order.

Zone names can map to different physical zones across accounts. For cross-account alignment, AWS zone IDs are the appropriate concept to investigate. This lab uses names within one account and tells you to confirm availability before applying. Merely changing `region` without changing these zone values is insufficient.

A multi-zone network supports an availability design; it does not automatically make the application highly available. A single database in one zone, a missing second application instance, or an untested failover procedure can remain a single point of failure. Infrastructure topology is one layer of availability evidence.

## 4.4 Public and private describe routes, not trustworthiness

A public subnet has a route to an internet gateway for relevant internet destinations. A private subnet lacks that direct internet-gateway route. A resource also needs suitable addressing and security settings to communicate as intended. Giving a subnet the tag `public` does not make it public, and calling a subnet `private` does not establish a security boundary by itself.

The lab creates one public route table shared by the public subnets. It contains a default IPv4 route, `0.0.0.0/0`, pointing at the internet gateway. Each private subnet receives its own private route table. Those tables initially have no default internet route.

The VPC's local route supports communication within the VPC address space subject to the other relevant controls. Route selection generally uses the most specific matching destination prefix. A `/24` route is more specific than a `/16`, and both are more specific than `/0`. This is called longest-prefix matching.

Consider destination `10.42.129.8`. In this lab it belongs to the VPC range, so the local VPC route is relevant. Destination `8.8.8.8` does not belong to that range. In a public route table, the default internet route can be selected. In the lab's private route table, there is no general internet path for that destination.

The companion's **CIDR and route explorer** calculates subnet ranges and selects the longest matching route from a small explicit route list. It does not simulate AWS appliances, security groups, DNS, or transit networking. Use it to isolate address arithmetic and route choice before combining those layers.

## 4.5 Trace the module's resource relationships

The module begins with a VPC, enables its DNS features, and attaches an internet gateway. It then creates public and private subnets for each zone key. The public and private CIDR calculations intentionally use different halves of the available slot space.

~~~hcl
resource "aws_subnet" "private" {
  for_each          = var.zones
  vpc_id            = aws_vpc.this.id
  availability_zone = each.value.name
  cidr_block        = cidrsubnet(var.cidr, 8, 128 + each.value.slot)

  tags = {
    Name = "${var.name}-private-${each.key}"
  }
}
~~~

This is a fragment from the complete module. For `first` with slot zero, the subnet number is 128 and the resulting range is `10.42.128.0/24`. For `second` with slot one, it is 129. Public subnets use slots zero and one, so the four ranges do not overlap.

The input validation rejects duplicate slots, noninteger slots, and slots outside zero through 127. Those checks protect the mapping between the two halves of the address space. The module explicitly accepts an IPv4 `/16`; adding eight bits then produces the tested `/24` subnet layout. Generalizing that contract requires a new address policy and tests.

The explicit `slot` field is an architectural promise. Adding a third zone with slot two does not shift the existing ranges. Removing the first entry does not renumber the second. This is an application of the stable-key principle from Chapter 2 to a setting where accidental reassociation can replace infrastructure.

## 4.6 Associate route tables explicitly

Creating a route table is not enough. A subnet must use the intended route table. The association resources make that relationship reviewable:

~~~hcl
resource "aws_route_table_association" "private" {
  for_each       = aws_subnet.private
  subnet_id      = each.value.id
  route_table_id = aws_route_table.private[each.key].id
}
~~~

The association iterates over the created private subnets. Each subnet key selects the matching private route table. That is why the same logical keys flow through both collections. The expressions encode a one-to-one relationship rather than relying on matching positions in independently sorted lists.

AWS also has main and default network constructs. Relying on them can make a demonstration shorter but can hide inherited behavior. In a real repository, inspect whether a resource creates a new route table, modifies a default one, or depends on an existing association. Different ownership choices can produce very different plans even when diagrams look similar.

Do not manage the same route simultaneously through an inline route declaration and a standalone route resource when the provider documents conflicting ownership. Terraform configurations need a coherent owner for each managed setting. Two declarations fighting over the same remote property can produce perpetual differences or unintended deletion.

## 4.7 Understand public IPv4 and NAT before adding them

An internet gateway route alone does not supply an EC2 instance with a public IPv4 address. The lab explicitly sets `map_public_ip_on_launch = false` on public subnets. A public subnet can host a public load balancer or a deliberately addressed resource without forcing every launched instance to receive a public address.

A NAT gateway allows suitable private-subnet IPv4 traffic to initiate connections through an egress path without giving every instance its own public IPv4 address. It usually introduces hourly and data-processing charges, and a zonal design has availability and cross-zone cost consequences. The lab omits NAT by default because the network concepts can be learned without an always-on paid egress component.

If a production application needs arbitrary outbound internet access from private subnets, the omission must be addressed through a deliberate design. A public NAT gateway typically resides in a public subnet with an Elastic IP and internet-gateway connectivity; private route tables point appropriate traffic to it. A single shared NAT can reduce some fixed costs while creating a wider failure dependency and potential cross-zone traffic. Per-zone NAT can improve fault isolation at greater cost.

The correct choice depends on traffic, availability objectives, service endpoints, and controls. “Always use one NAT per zone” and “always use one NAT to save money” are both incomplete policies without those assumptions. The book's reference network makes the lack of general egress explicit so that a learner is not surprised when a package download from a private host fails.

## 4.8 An S3 gateway endpoint is a service-specific route

The network module creates an S3 gateway endpoint and associates it with the private route tables. This provides a service-specific path for S3 traffic in the supported context. It does not create arbitrary internet access, and it does not grant S3 object permissions.

The service name is derived from the provider's current region. The endpoint attaches to the VPC and identifies which route tables receive the relevant routing integration. An application still needs a valid IAM identity and applicable bucket permissions. An endpoint policy can add another limit; our introductory endpoint uses the provider/service defaults and is not a complete data perimeter design.

Distinguish **gateway endpoints** from **interface endpoints**. Interface endpoints create network interfaces and have different DNS, security group, availability, and pricing considerations. Replacing one with the other because both contain the word endpoint is not a harmless refactor.

For a private EC2 management design, you may need Systems Manager endpoints, logging endpoints, and other service paths. An S3 gateway endpoint alone does not make Session Manager work. Build the required dependency list from the actual application and operational workflow, then verify the resulting connectivity rather than assuming “private endpoint” covers every AWS API.

## 4.9 Security groups are stateful allow rules

A security group governs allowed traffic for associated network interfaces or supported resource associations. Rules describe protocol, port ranges, and source or destination scope. Security groups are stateful: return traffic for an allowed tracked connection is handled differently from a stateless packet filter.

Imagine a public load balancer forwarding to private application instances on TCP 8080. A common design allows the load balancer to receive HTTPS from clients, then allows the application to receive 8080 from the load balancer's security group. The application does not need an internet-wide inbound 8080 rule merely because the load balancer serves public requests.

A source security-group reference is not a copy of that group's rules and does not represent every possible route. It identifies a permitted source relationship under AWS's security group semantics. Routing must still carry the packets, and the application must still listen on the expected port.

Prefer narrow, separately owned security group rule resources when that matches the provider's documented approach. Mixing inline and standalone rule management can create ownership conflicts. A complete rule review should state the traffic's purpose, source, destination, protocol, port, and owner. A rule without a known use case is difficult to defend or safely remove.

AWS's [security group documentation](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) describes the model and examples. For the lab, we avoid attaching a misleading example group to no workload. The compute discussion supplies realistic relationships when there is a component to protect.

## 4.10 Network ACLs are a different control

A network ACL operates at the subnet boundary with ordered allow and deny rules. It is stateless, so return traffic needs appropriate rules as well. Rule ordering and ephemeral client ports can therefore matter in ways that differ from security groups.

An organization may use network ACLs as a coarse additional boundary. They are not a convenient substitute for understanding workload-level security group rules. Adding a restrictive ACL before identifying return traffic can break otherwise valid connections and produce confusing symptoms.

The lab leaves the VPC's default ACL behavior in place rather than adding an arbitrary custom ACL whose relationship to a nonexistent workload cannot be meaningfully verified. AWS's [network ACL guide](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html) is the primary reference for the distinction. In production, inherited ACLs should be inspected as part of the actual network path.

## 4.11 DNS is necessary for many service connections

DNS maps names to records, including addresses. A network can have correct routes and still fail because a name resolves unexpectedly or not at all. The module enables DNS support and DNS hostnames on the VPC because many ordinary AWS workflows depend on usable naming behavior.

A public DNS name does not necessarily imply a public network path from every caller. Split-horizon DNS, private hosted zones, interface endpoint private DNS, and resolver configuration can change what different clients observe. Diagnose resolution from the actual source environment rather than from your laptop alone.

Terraform data sources can look up hosted zones and other existing DNS objects, but a lookup is a dependency on external ownership. A matching name might not be unique enough, especially across public and private zones. Use explicit identifiers or filters that encode the intended scope, and fail clearly when the lookup does not identify the expected object.

For TLS, names also matter to certificate validation. A reachable IP with a certificate for another hostname is not a successful HTTPS deployment. Later architecture work separates DNS routing, certificate issuance, listener configuration, and application behavior so each can be verified independently.

## 4.12 Plan and inspect the network lab

Create the lab's local variable file and set your verified account ID. Confirm the two zone names are available in your selected region. If you select another region, override the zone map as well as the region.

~~~powershell
Copy-Item ./labs/02-network/terraform.tfvars.example ./labs/02-network/terraform.tfvars
terraform -chdir=labs/02-network init
terraform -chdir=labs/02-network validate
terraform -chdir=labs/02-network plan -out=network.tfplan
terraform -chdir=labs/02-network show network.tfplan
~~~

Read the CIDRs, zone placement, route associations, and endpoint service name. The resource graph is larger than the storage lab, but the conceptual review remains manageable when organized by relationships: VPC containment, subnet identity, route selection, association, and service endpoint.

After choosing to apply, inspect `private_cidrs` and compare the values with the arithmetic above. Terraform's graph command can emit a graph description for inspection; rendering that output requires an additional Graphviz installation, which is optional. Do not treat a generated graph as a network reachability test. Terraform's dependency graph describes provisioning relationships, not every packet path.

The mocked network tests check the first private CIDR, the expected subnet/table counts, and duplicate-slot rejection. They establish selected contract properties without AWS. They cannot prove zone availability, account quotas, or actual endpoint connectivity. That distinction is recorded in the verification report.

## 4.13 Work a connectivity incident from evidence

Suppose a private instance can reach S3 but cannot download software from an internet repository. First observe that the two destinations can use different routes. The S3 gateway endpoint supports one service path. The absence of NAT or another egress design explains the missing general internet path without implying that the S3 endpoint is broken.

Next suppose the S3 request reaches the service but returns AccessDenied. The network path may already be functioning. Inspect the application role, bucket policy, endpoint policy, encryption-key permissions where applicable, and organization constraints. Adding an internet route would not fix an explicit authorization deny and could unnecessarily broaden connectivity.

Now suppose a load balancer returns a gateway error while the instance is healthy when accessed locally. Check listener rules, target port, health-check path, target group membership, application binding address, and security groups between the load balancer and target. Terraform can successfully provision all declared objects even when those application-level values do not agree.

A reliable troubleshooting sequence starts with a specific source, destination name, resolved address, protocol, port, and timestamp. Then trace the route and controls. Avoid “the network is broken” as an initial diagnosis; it is too broad to select a useful next observation.

## 4.14 Address planning is a compatibility decision

Once clients, peers, and routing systems depend on a subnet range, changing it can require resource replacement and coordinated migration. Treat CIDRs as part of a long-lived interface. A tidy new numbering scheme is rarely worth unplanned replacement of production subnets.

Separate current allocation from future reservation. Our public/private half-space convention is intentionally simple, but it reserves a large portion of the VPC for a small lab. A production plan may allocate by zone, workload tier, or business unit, with explicit growth allowances. Document which dimension the slot represents so future contributors do not reuse it inconsistently.

IPv6 adds another address family and different design considerations. Do not assume that blocking or routing IPv4 traffic also handles IPv6. A dual-stack design needs matching intent across addresses, routes, security controls, DNS, and application listeners. This course teaches the IPv4 baseline thoroughly and treats dual-stack adoption as an expert design extension requiring current service-specific verification.

## 4.15 Optional guided application

Add a third logical zone entry with a unique slot. Before applying, inspect the computed ranges at the console and review whether existing subnet addresses remain unchanged. The reference result for slot two is public `10.42.2.0/24` and private `10.42.130.0/24`. Existing keys should retain their original ranges.

For a design-only extension, sketch the path from an HTTPS client to an ALB, then to private application targets, then to a private database. Mark each route boundary, each security-group relationship, and each identity check. The reference path should not require the database to accept public traffic. Chapter 5 explains how compute and load balancing turn that path into a working service.

When finished with the real lab, review a destroy plan and remove the resources in the sandbox. There is no application data in the default network lab, but deletion can still fail if you attach unrelated resources to its subnets or VPC. Keep ownership boundaries clean; do not repurpose a disposable learning network as shared corporate infrastructure.

## Worked packet trace with a reply path

Consider a hypothetical private application address `10.42.128.20` sending an HTTPS request to an external address. The destination is outside `10.42.0.0/16`. In the default lab private route table there is no matching general internet route, so the packet has no intended general egress path. A security-group egress allow cannot manufacture the missing route.

If a reviewed NAT design were added, the private default route would select the NAT gateway. The NAT gateway would need its own valid placement, public addressing, and internet-gateway path. The response would return through the connection mapping. A single rule labeled “allow HTTPS” is only one part of that chain.

Now replace the external destination with an S3 destination covered by the gateway endpoint's service routing. The service-specific path can work without general internet egress. The client still needs DNS resolution and IAM permission. This explains why one AWS request can succeed while an ordinary package download fails from the same host.

For an ALB-to-application connection, identify both endpoints and the return traffic. The load balancer's connection to a target has its own source/destination relationship; it is not literally the original client's TCP connection passing unchanged through every layer. Health checks may use a particular path and port that must match the application. A listener working on 443 does not imply the target process is listening on 443.

### Address arithmetic as an invariant

The tested network module now explicitly limits its input to an IPv4 `/16`, then adds eight bits for `/24` subnets. This restriction makes its teaching contract honest. The public slot range zero through 127 and the private offset of 128 divide the 256 possible `/24` slots without overlap when caller slots are unique.

For slot 17, public allocation is `10.42.17.0/24` and private allocation is `10.42.145.0/24`. The arithmetic is `128 + 17 = 145`. For slot 127, the private slot is 255, the last available `/24` slot in this `/16`. Slot 128 is rejected because its private offset would exceed the chosen range. Those boundary values are more useful checks than trying many arbitrary CIDR strings without a stated invariant.

If you generalize the module later, derive the address policy from the accepted prefix range and validate it. Do not merely remove the `/16` validation and leave every downstream assumption unchanged. A more generic interface creates a larger compatibility and testing obligation.

## References and transition

AWS's [VPC overview](https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html) provides the primary vocabulary for VPCs, subnets, and routing. The course source deliberately exposes route associations and address calculations so you can inspect the implementation instead of relying on a diagram alone. The next chapter builds a small real HTTP service and compares serverless, virtual-machine, and container execution models through their operational responsibilities.
