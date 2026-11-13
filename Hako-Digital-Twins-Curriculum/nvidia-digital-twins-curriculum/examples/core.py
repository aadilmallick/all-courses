"""Small, unit-labelled teaching models. No NVIDIA runtime required."""
from dataclasses import dataclass
import math


def positive(value, name):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or value <= 0:
        raise ValueError(f"{name} must be finite and positive")
    return value


def visible_time(length_m, speed_m_s):
    return positive(length_m, "length_m") / positive(speed_m_s, "speed_m_s")


def local_to_world(point, translation, heading_rad):
    x, y = point
    tx, ty = translation
    c, s = math.cos(heading_rad), math.sin(heading_rad)
    return c * x - s * y + tx, s * x + c * y + ty


def world_to_local(point, translation, heading_rad):
    return local_to_world((point[0] - translation[0], point[1] - translation[1]), (0, 0), -heading_rad)


def forward_arm(q1, q2, l1=0.4, l2=0.3):
    positive(l1, "l1"); positive(l2, "l2")
    return l1 * math.cos(q1) + l2 * math.cos(q1 + q2), l1 * math.sin(q1) + l2 * math.sin(q1 + q2)


def inverse_arm(x, y, l1=0.4, l2=0.3, elbow=1):
    positive(l1, "l1"); positive(l2, "l2")
    if elbow not in (-1, 1) or not all(math.isfinite(v) for v in (x, y)):
        raise ValueError("Finite target and elbow +/-1 required")
    cosine = (x*x + y*y - l1*l1 - l2*l2) / (2*l1*l2)
    if cosine < -1 - 1e-12 or cosine > 1 + 1e-12:
        raise ValueError("Target outside planar geometric workspace")
    q2 = elbow * math.acos(max(-1.0, min(1.0, cosine)))
    q1 = math.atan2(y, x) - math.atan2(l2 * math.sin(q2), l1 + l2 * math.cos(q2))
    return q1, q2


def wheel_targets(v_m_s, yaw_rad_s, radius_m, separation_m):
    positive(radius_m, "radius_m"); positive(separation_m, "separation_m")
    if not all(math.isfinite(v) for v in (v_m_s, yaw_rad_s)):
        raise ValueError("Commands must be finite")
    return (v_m_s-yaw_rad_s*separation_m/2)/radius_m, (v_m_s+yaw_rad_s*separation_m/2)/radius_m


def project(point, fx=500, fy=500, cx=320, cy=240):
    x, y, z = point
    positive(z, "optical depth")
    if not all(math.isfinite(v) for v in (x, y, fx, fy, cx, cy)):
        raise ValueError("Projection fields must be finite")
    positive(fx, "fx"); positive(fy, "fy")
    return fx*x/z+cx, fy*y/z+cy


def stopping_distance(speed_m_s, delay_s, deceleration_m_s2):
    positive(deceleration_m_s2, "deceleration")
    if not all(math.isfinite(v) and v >= 0 for v in (speed_m_s, delay_s)):
        raise ValueError("Speed and delay must be finite and nonnegative")
    return speed_m_s*delay_s + speed_m_s**2/(2*deceleration_m_s2)


def residual_metrics(reference, prediction):
    if not reference or len(reference) != len(prediction):
        raise ValueError("Nonempty matched sequences required")
    residuals = [b-a for a,b in zip(reference, prediction)]
    if not all(math.isfinite(v) for v in residuals):
        raise ValueError("Finite residuals required")
    n = len(residuals)
    return {"bias_m": sum(residuals)/n, "mae_m": sum(abs(v) for v in residuals)/n,
            "rmse_m": math.sqrt(sum(v*v for v in residuals)/n)}


@dataclass(frozen=True)
class Observation:
    asset_id: str
    sequence: int
    source_time_s: float
    received_time_s: float
    position_m: float
    frame: str


class TwinState:
    """Shared run-relative clocks; newest sequence per known asset wins."""
    def __init__(self):
        self.latest = {}

    def accept(self, record):
        if not isinstance(record, dict) or record.get("schema_version") != 1 or isinstance(record.get("schema_version"), bool):
            raise ValueError("Expected schema_version 1")
        if record.get("asset_id") != "conveyor-01" or record.get("frame") != "cell_world":
            raise ValueError("Unknown asset or frame")
        sequence = record.get("sequence")
        if type(sequence) is not int or sequence < 0:
            raise ValueError("Sequence must be a nonnegative integer")
        for key in ("source_time_s", "received_time_s", "position_m"):
            value = record.get(key)
            if type(value) not in (float, int) or not math.isfinite(value):
                raise ValueError(f"Finite numeric {key} required")
        if record["source_time_s"] < 0 or record["received_time_s"] < record["source_time_s"]:
            raise ValueError("Invalid times under the shared-clock fixture")
        if not 0 <= record["position_m"] <= 10:
            raise ValueError("Position outside teaching envelope [0,10] m")
        previous = self.latest.get(record["asset_id"])
        if previous and (sequence <= previous.sequence or record["source_time_s"] < previous.source_time_s):
            raise ValueError("Duplicate or out-of-order observation")
        observation = Observation(**{key: record[key] for key in Observation.__dataclass_fields__})
        self.latest[observation.asset_id] = observation
        return observation

    def status(self, now_s, threshold_s=0.25):
        positive(threshold_s, "threshold_s")
        observation = self.latest.get("conveyor-01")
        if observation is None:
            return {"status": "unknown", "age_s": None}
        if not math.isfinite(now_s) or now_s < observation.received_time_s:
            raise ValueError("Query must follow receipt under shared clock")
        age = now_s-observation.source_time_s
        return {"status": "fresh" if age <= threshold_s else "stale", "age_s": age}
