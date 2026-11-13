"""Original teaching DES; NOT Hako's hako_sim.py or its policy implementation.
Nonpreemptive outage: active pick finishes; next pick waits for repair.
"""
from dataclasses import dataclass
from pathlib import Path
import hashlib
import json
import math
import simpy

@dataclass(frozen=True)
class Job:
    order_id: str
    arrival_s: float
    service_s: float = 6.0

def demand_fixture():
    return [Job(f"order-{i:03d}", i*2.0) for i in range(40)]

def run(policy, fault=True, cutoff_s=100.0, horizon_s=160.0):
    if policy not in ("baseline", "fault_aware"):
        raise ValueError("Unknown teaching policy")
    env = simpy.Environment()
    jobs = demand_fixture()
    pack = simpy.Resource(env, capacity=1)
    queues = [simpy.Store(env), simpy.Store(env)]
    finish_estimate = [0.0, 0.0]
    down_until = [0.0, 0.0]
    events, completion = [], {}

    def emit(kind, job=None, port=None, **payload):
        events.append({"schema_version":1,"run_id":policy,"event_id":f"{policy}-{len(events):05d}",
                       "time_s":env.now,"type":kind,"order_id":job.order_id if job else None,
                       "resource_id":f"pick-{port+1:02d}" if port is not None else None,"payload":payload})

    def pack_job(job):
        emit("waiting_pack", job)
        with pack.request() as request:
            yield request
            emit("pack_started",job)
            yield env.timeout(2.0)
            completion[job.order_id] = env.now
            emit("shipped",job)

    def worker(port):
        while True:
            job = yield queues[port].get()
            while env.now < down_until[port]:
                yield env.timeout(down_until[port]-env.now)
            finish_estimate[port] = env.now+job.service_s
            emit("pick_started",job,port,service_s=job.service_s)
            yield env.timeout(job.service_s)
            emit("pick_completed",job,port)
            finish_estimate[port] = env.now
            env.process(pack_job(job))

    def outage():
        yield env.timeout(20)
        down_until[0] = 50.0
        emit("fault_started",port=0,recovery_estimate_s=50.0)
        yield env.timeout(30)
        down_until[0] = 0.0
        emit("fault_ended",port=0)

    def source():
        for index, job in enumerate(jobs):
            yield env.timeout(job.arrival_s-env.now)
            emit("order_arrived",job)
            if policy == "baseline":
                chosen = index % 2
                reason = "round_robin"
            else:
                scores = []
                for port in range(2):
                    remaining = max(0,finish_estimate[port]-env.now)
                    queued = sum(item.service_s for item in queues[port].items)
                    repair = max(0,down_until[port]-env.now)
                    scores.append(max(remaining,repair)+queued)
                chosen = min(range(2),key=lambda port:scores[port])
                reason = "least_estimated_work_with_observed_outage"
            emit("assigned",job,chosen,reason=reason)
            yield queues[chosen].put(job)

    for port in range(2): env.process(worker(port))
    if fault: env.process(outage())
    env.process(source())
    env.run(until=horizon_s)
    shipped = {key:value for key,value in completion.items() if value < cutoff_s}
    arrivals = [job for job in jobs if job.arrival_s < cutoff_s]
    lead = sorted(shipped[job.order_id]-job.arrival_s for job in arrivals if job.order_id in shipped)
    busy = [0.0,0.0]
    starts = {}
    for event in events:
        if event['type'] == 'pick_started': starts[event['resource_id']] = event['time_s']
        if event['type'] == 'pick_completed':
            start = starts.pop(event['resource_id'])
            index = int(event['resource_id'][-2:])-1
            busy[index] += max(0,min(cutoff_s,event['time_s'])-min(cutoff_s,start))
    for resource,start in starts.items():
        busy[int(resource[-2:])-1] += max(0,cutoff_s-start)
    demand_data = [job.__dict__ for job in jobs]
    metrics = {"arrived":len(arrivals),"shipped_before_cutoff":len(shipped),
               "unfinished_at_cutoff":len(arrivals)-len(shipped),
               "mean_completed_lead_s":sum(lead)/len(lead) if lead else None,
               "p95_completed_lead_s":lead[math.ceil(0.95*len(lead))-1] if lead else None,
               "pick_calendar_utilization":[seconds/cutoff_s for seconds in busy]}
    return {"manifest":{"model":"original_teaching_des_v1","policy":policy,"time_unit":"seconds",
                        "cutoff_s":cutoff_s,"horizon_s":horizon_s,"fault_enabled":fault,
                        "fault_semantics":"active cycle finishes; queued starts wait; observed repair estimate known",
                        "demand_sha256":hashlib.sha256(json.dumps(demand_data,sort_keys=True).encode()).hexdigest(),
                        "assumptions":["unlimited eligible inventory","two pick ports","6 s per order pick","2 s pack",
                                       "deterministic teaching demand; no grid or geometry"]},
            "demand":demand_data,"events":events,"metrics":metrics}

if __name__ == "__main__":
    result = {"notice":"Synthetic teaching model, not Hako operating results.",
              "runs":[run("baseline"),run("fault_aware")]}
    output = Path(__file__).resolve().parents[1]/"assets"/"policy-replay.json"
    output.write_text(json.dumps(result,indent=2),encoding="utf-8")
    for item in result['runs']:
        print(item['manifest']['policy'],json.dumps(item['metrics']))
    print("Replay data:", output)
