import math
from core import local_to_world, forward_arm, inverse_arm, stopping_distance

if __name__ == "__main__":
    print("Sensor world point:", local_to_world((0.5, 0), (2, 1), math.pi/2))
    angles = inverse_arm(0.4, 0.3)
    print("IK degrees:", tuple(round(math.degrees(v), 4) for v in angles))
    print("FK reconstruction:", forward_arm(*angles))
    print("Toy stopping distance:", stopping_distance(1, 0.2, 2), "m")
