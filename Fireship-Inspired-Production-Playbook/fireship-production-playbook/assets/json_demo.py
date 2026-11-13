"""Synthetic recording fixture. Run: python assets/json_demo.py"""
import json

BAD_FIXTURE = '{"a": 2, "b": 2, "sum": 5}'
GOOD_FIXTURE = '{"a": 2, "b": 2, "sum": 4}'


def inspect_sum(text):
    try:
        item = json.loads(text)
    except json.JSONDecodeError:
        return False, False, False
    shape = (isinstance(item, dict)
             and set(item) == {"a", "b", "sum"}
             and all(type(item[key]) is int for key in item))
    correct = shape and item["a"] + item["b"] == item["sum"]
    return True, shape, bool(correct)


if __name__ == "__main__":
    for label, passed in zip(("PARSE", "STRUCTURE", "ARITHMETIC"),
                             inspect_sum(BAD_FIXTURE)):
        print(f"{label}: {'PASS' if passed else 'FAIL'}")
