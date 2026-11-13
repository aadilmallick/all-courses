"""Optional ROS 2 Jazzy text observation. No actuator commands."""
import json
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class ObservationPublisher(Node):
    def __init__(self):
        super().__init__("course_observer")
        self.publisher = self.create_publisher(String, "/course/observation", 10)
        self.timer = self.create_timer(0.5, self.publish_observation)

    def publish_observation(self):
        message = String()
        message.data = json.dumps({"asset_id":"part-003", "position_m":0.8})
        self.publisher.publish(message)

def main():
    rclpy.init()
    node = ObservationPublisher()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == "__main__":
    main()
