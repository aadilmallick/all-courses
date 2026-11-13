import json
from core import TwinState, residual_metrics

def fixture(sequence=12):
    return {"schema_version":1,"asset_id":"conveyor-01","sequence":sequence,
            "source_time_s":4.2,"received_time_s":4.28,"position_m":0.84,"frame":"cell_world"}

if __name__ == "__main__":
    state = TwinState()
    print("Accepted:", state.accept(fixture()))
    print("At 4.4 s:", state.status(4.4))
    print("At 4.7 s:", state.status(4.7))
    try:
        state.accept(fixture())
    except ValueError as error:
        print("Rejected duplicate:", error)
    print(json.dumps(residual_metrics([0,0.5,1], [0.02,0.47,1.04]), indent=2))
