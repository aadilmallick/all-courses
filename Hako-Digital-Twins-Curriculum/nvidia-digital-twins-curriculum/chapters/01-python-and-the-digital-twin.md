# 1. Optional Python refresher for physical models

## Start with a decision, then build a model

You are already comfortable with Python, so use this chapter as a reference and skip directly to the warehouse chapter if its software concepts are familiar. The new material is how software values acquire physical meaning. Imagine a small scan-and-pick teaching cell: a conveyor moves a boxed item, a camera observes it, and an arm transfers it to a tote. This is a fictional subsystem inspired by the flow in your Hako onboarding, not a reconstruction of its unavailable code or equipment model.

We could build an attractive picture of this cell. That would answer questions about appearance. To answer the camera question, we also need dimensions, camera optics, lighting, part variation, a defect definition, timing, and evidence from real images. To answer a robot reach question, we need different details: robot geometry, joint limits, the tool, and obstacles. A useful model includes the information required by a particular decision. More detail has a cost and can introduce more uncertain assumptions.

A **digital twin** is a digital representation associated with a physical product, process, or facility and used to understand or influence its lifecycle. People use the term with different levels of strictness. In this course, an **operational twin** also has identified connections to observations of its physical counterpart, with a stated update rate and validity limits. A standalone simulator is a valuable component even before that connection exists. NVIDIA's [digital twin overview](https://www.nvidia.com/en-us/glossary/digital-twin/) provides the platform context; our inspection-cell design and teaching examples are original.

Your first task is smaller than controlling a robot. You will describe a part, calculate how long it spends under a camera, and decide whether the observations are sufficient for a toy rule. This introduces programming through a problem with quantities you can inspect. You need no robotics, calculus, or programming prerequisites.

## The equipment you actually need first

A **program** is a sequence of instructions written in a language a particular tool understands. Python source is readable text. A **Python interpreter** reads and executes that text. An **editor** helps you create it. A **terminal** accepts commands that start programs and show their output. These are separate tools. Typing Python into a terminal that expects PowerShell will produce errors even when the Python is correct.

The early lessons work with Python 3.12 and its standard library, meaning the modules supplied with Python. They do not require Omniverse, a robot, an NVIDIA account, or a GPU. The browser companion works without Python and illustrates the mathematics separately. Later, Isaac Sim uses its own Python environment. Keeping these environments separate prevents a frequent beginner failure: installing a package for one interpreter and running another.

On Windows, install Python 3.12 from the official Python distribution if you do not already have it. Open PowerShell in the extracted course folder. The following command assumes the Python launcher `py` was installed. If your installation supplies `python` instead, check `python --version` and substitute that name in the initial environment-creation command.

```powershell
py -3.12 --version
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe --version
.\.venv\Scripts\python.exe examples\01_first_model.py
```

Run each line separately. The first asks the launcher for a Python 3.12 interpreter. The second runs Python's `venv` module to create an isolated environment in `.venv`. The third explicitly uses the environment's interpreter. The fourth runs the included example file. No activation script is needed. If `py` is unavailable, the first problem is interpreter installation or discovery, not your ability to understand Python.

On Linux or macOS, an installed Python 3.12 interpreter can create the environment with `python3.12 -m venv .venv`; subsequent commands use `.venv/bin/python`. These are foundation-only instructions. They do not imply Isaac Sim supports every operating system that can run Python. See the official [virtual environment documentation](https://docs.python.org/3.12/library/venv.html) for the environment mechanism.

## A first complete program

Create a text file named `camera_time.py`, taking care that Windows has not added a hidden `.txt` extension. Put this code in it:

```python
part_length_m = 0.20
belt_speed_m_s = 0.10
visible_time_s = part_length_m / belt_speed_m_s
print(visible_time_s)
```

Run it with your environment's interpreter. The output is `2.0`. The first line gives the name `part_length_m` a value of 0.20. The equals sign is **assignment**, not a mathematical assertion that will keep updating itself. The second line creates another name. The third divides the current length by the current speed. The fourth calls the built-in function `print`, which writes a representation of the result.

An **expression** is something that produces a value, such as `0.20 / 0.10`. A **statement** performs an operation, such as assigning that result to a name. Parentheses after a function name contain the values provided to that function, called **arguments**. You will read thousands of function calls in NVIDIA examples; the basic pattern is already present here.

The suffixes in our names are deliberate. A length of `20` could mean meters, centimeters, or millimeters. Python does not infer the intended unit. Writing `_m`, `_s`, and `_m_s` makes that choice visible to a human reader. The calculation is length divided by length per time, so its unit is time: meters divided by meters per second equals seconds. Unit reasoning often catches mistakes before any graphics appear.

The model also has a limitation. A real part's visibility depends on camera field of view, occlusion, and the trajectory, not just part length. Here we define a toy observation interval from a length and speed. A useful habit begins now: describe what your calculation means and the assumptions that make it meaningful.

## Values, types, and the difference between a number and its label

A **type** describes the kind of value and the operations available on it. Python's `int` represents whole numbers such as a part count. A `float` represents an approximate real number such as a length. A `str` is text. A `bool` has one of two values, `True` and `False`. The special value `None` represents an intentional absence of a value.

```python
part_count = 3
exposure_s = 0.004
part_id = "part-003"
camera_ready = True
last_measurement = None

print(type(part_count).__name__)
print(type(exposure_s).__name__)
print(part_id)
```

The outputs are `int`, `float`, and `part-003`. `type` inspects a value's type. `.__name__` retrieves a readable name from that type object. The dot means “retrieve this named member from the object on the left.” An **object** is a Python value with associated data and behavior. You do not need a deeper runtime model to begin using objects correctly.

The text `"0.10"` is not the number `0.10`. Text may arrive from a form, a CSV file, or a network message. `float("0.10")` converts suitable text to a number. `float("fast")` raises an error because the conversion has no defined numerical meaning. Do not solve this by replacing every invalid input with zero: zero speed would mean something very different from an unknown speed.

Floating-point arithmetic is approximate. For example, `0.1 + 0.2` may display a small difference from `0.3`. This does not mean Python is unsuitable for engineering. It means exact equality is often the wrong numerical question. Later we compare computed results using a tolerance whose unit and scale are appropriate. Counts and identifiers remain exact; measured physical quantities already have uncertainty even before computation.

The official Python [introduction](https://docs.python.org/3.12/tutorial/introduction.html) documents the language basics. Our variable names, camera examples, unit conventions, and debugging sequence are chosen for this course.

## Decisions give a model behavior

Suppose our synthetic camera rule requires a positive speed and at least half a second of visibility. A program must choose between cases. Python uses `if`, optionally `elif`, and optionally `else`:

```python
belt_speed_m_s = 0.10
visible_length_m = 0.20

if belt_speed_m_s <= 0:
    print("No forward-motion observation interval")
else:
    visible_time_s = visible_length_m / belt_speed_m_s
    if visible_time_s >= 0.50:
        print("Enough time under the toy rule")
    else:
        print("Too short under the toy rule")
```

The comparison `<=` means less than or equal to. The expression after `if` is evaluated first. The indented statements execute only when that condition is true. A colon ends the condition line and introduces the indented block. Use four spaces per indentation level. Indentation is part of Python's grammar, so misalignment can change behavior or prevent execution.

The guard comes before division. That order matters because division by zero is not defined. A negative speed is not inherently impossible in a conveyor system, but this particular formula has been specified for forward travel. A general model could use speed magnitude and retain direction separately. The important step is to state the contract before choosing the implementation.

Use `==` to compare values and `=` to assign them. Use `and` when both conditions must hold, `or` when either suffices, and `not` to reverse a Boolean condition. Avoid assuming a complex Boolean expression is clear because it fits on one line. Names such as `camera_ready` and `measurement_fresh` let the decision read in the language of the process.

Missing measurements deserve their own branch. `if last_measurement is None:` checks absence. A measurement of zero can be valid: a robot at its reference position may have zero displacement. Treating zero as missing would erase real information. This distinction becomes critical when a twin displays telemetry and the network stops delivering samples.

## Collections let the model describe more than one part

A **list** stores an ordered collection. A **dictionary** stores associations from keys to values. Lists are useful for a sequence of measurements; dictionaries are useful for fields in a record. Indexes in a list start at zero, so the first element is at position `0`.

```python
lengths_m = [0.18, 0.20, 0.23]
print(lengths_m[0])

part = {
    "id": "part-003",
    "length_m": 0.20,
    "defect_seen": False,
}
print(part["length_m"])
```

The outputs are `0.18` and `0.2`. Square brackets create the list and retrieve items. Curly braces create the dictionary. Each dictionary entry uses a colon to separate its key from its value. Commas separate entries. The braces and indentation make the record readable; the dictionary itself is one value.

A dictionary does not automatically enforce a schema, which is a description of required fields and their meanings. A misspelled key may create a different field or raise `KeyError` when read. `part.get("temperature_c")` returns `None` if that key is absent, which is useful only if absence is permitted by your design. For a required identity or coordinate field, silently accepting absence is usually a mistake.

Lists can change. `lengths_m.append(0.24)` adds another item. There is also a **tuple**, written `(0.0, 1.0, 2.0)`, whose collection structure cannot be changed in place. Tuples make sense for a fixed coordinate triple, though individual libraries may expect lists, tuples, arrays, or their own vector types. An API's documented input shape decides what is appropriate.

There is an important copying trap. `other = lengths_m` creates a second name for the same list. Changing the list through either name affects that same object. `other = lengths_m.copy()` creates a new outer list. For nested mutable records, a shallow copy still shares inner objects. We avoid accidental sharing by creating fresh simulation state on reset rather than reusing a global list from a previous run.

## Repeating work without repeating source code

Now calculate visibility for three part lengths:

```python
lengths_m = [0.18, 0.20, 0.23]
belt_speed_m_s = 0.10

for length_m in lengths_m:
    time_s = length_m / belt_speed_m_s
    print(f"{length_m:.2f} m -> {time_s:.2f} s")
```

The output is:

```text
0.18 m -> 1.80 s
0.20 m -> 2.00 s
0.23 m -> 2.30 s
```

`for` takes each item from the collection, assigns it to `length_m`, and executes the indented block. The string beginning with `f` is a formatted string. A value inside braces is inserted into the text; `:.2f` displays two digits after the decimal point. Formatting changes the displayed representation, not the stored physical value.

`range(5)` produces the integers 0 through 4. This is useful for a fixed number of simulation updates. A `while` loop repeats while a condition remains true, so it needs a route to termination. A loop tied only to “application is running” can be appropriate in an interactive simulator; a batch experiment should also have a bounded time or step count so failures do not consume resources indefinitely.

Avoid modifying the collection you are traversing unless you have a carefully defined reason. If you need only accepted parts, build a new list. This keeps the original evidence separate from a derived result. That distinction is useful far beyond Python: source observations, cleaned observations, inferred state, and predictions should remain distinguishable in an operational twin.

## Functions turn calculations into reusable contracts

A **function** groups instructions under a name. Inputs are **parameters** in its definition; supplied values are arguments at a call site. Its output is a returned value.

```python
import math

def visible_time(length_m: float, speed_m_s: float) -> float:
    if not math.isfinite(length_m) or length_m <= 0:
        raise ValueError("length_m must be finite and positive")
    if not math.isfinite(speed_m_s) or speed_m_s <= 0:
        raise ValueError("speed_m_s must be finite and positive")
    return length_m / speed_m_s

result_s = visible_time(length_m=0.20, speed_m_s=0.10)
print(f"Visible for {result_s:.2f} s")
```

`import math` makes the standard mathematics module available. A **module** is a unit of Python code that can be imported. `math.isfinite` rejects infinity and “not a number,” both of which can appear in numerical data. `def` introduces the function. The annotations `: float` and `-> float` document expected input and output types; Python does not enforce these annotations by itself.

`raise ValueError(...)` deliberately signals that an input violates the function's contract. `return` sends a value back to the caller and ends the function call. A function that only prints is less reusable: another calculation needs the number, not a message on the screen. Keep computation and presentation separate whenever that makes the next use easier.

Within the call, `length_m=0.20` is a named argument. It makes the units and meaning visible. Names inside a function are normally local to that call. This helps isolate one computation from another. A function that depends on hidden global state is harder to test because the same visible arguments may produce a different result after unrelated code runs.

We choose a deliberately strict contract here. A stopped belt could instead return an infinite duration or a special status, but those alternatives would require downstream code to handle that meaning. There is no universally correct return value divorced from the problem. Clear input rules and meaningful failure behavior are more valuable than making every input produce a number.

## Records and objects without mysterious terminology

As records become more important, spelling every field name as a string becomes inconvenient. A **class** defines a kind of object. An **instance** is one object of that class. A **method** is a function accessed through an object. A **dataclass** is a Python convenience for classes primarily used to hold fields.

```python
from dataclasses import dataclass

@dataclass
class Observation:
    part_id: str
    time_s: float
    position_m: float

observation = Observation("part-003", 1.25, 0.80)
print(observation.part_id)
print(observation.position_m)
```

The `@dataclass` line is a **decorator**: a tool applied to the class definition. Here it generates routine behavior such as initialization and a readable representation. You do not need to implement a decorator to use this one. `Observation(...)` creates an instance, and the dot retrieves one of its fields.

An NVIDIA expression such as `cube.get_world_poses()` has the same broad structure. `cube` is an object; `get_world_poses` is a method; parentheses call it. Understanding that grammar removes much of the intimidation from a long API name. The remaining work is discovering the method's contract: coordinate frame, units, return shape, timing requirements, and possible failure cases.

A class is useful when state and related operations belong together. It is not required for every calculation. A plain function is often the clearest place for a coordinate transform or error metric. This course uses functions for mathematics, records for data, and small stateful objects where the lifecycle matters. The design follows the problem instead of turning every noun into a class.

## Files, JSON, and reproducible inputs

A program's working directory is the folder against which relative paths are resolved. It may differ from the folder containing the script. This explains many “file not found” errors. `pathlib.Path` helps handle paths, including spaces, without manually constructing operating-system separators.

```python
import json
from pathlib import Path

settings = {"speed_m_s": 0.10, "length_m": 0.20}
output_path = Path("settings.json")
output_path.write_text(json.dumps(settings, indent=2), encoding="utf-8")
loaded = json.loads(output_path.read_text(encoding="utf-8"))
print(loaded["speed_m_s"])
```

**JSON** is a text format for values such as numbers, strings, lists, and field maps. `dumps` converts Python data to JSON text; `loads` converts JSON text to Python data. File methods write and read that text. UTF-8 is an explicit character encoding. The output path is local to the current working directory and this example intentionally writes one small file.

The fact that JSON parses does not prove it is a valid robot observation. A valid JSON object can omit a timestamp, contain an unknown asset ID, or specify centimeters in a field expected to contain meters. Parsing establishes syntax. Validation establishes your domain contract. Chapter 10 turns that distinction into an ingestion pipeline.

For a sequence of rows, CSV is another useful format. Its columns need a documented schema, especially for units and time. Include a header rather than relying on positional memory. Preserve the original file and write cleaned data to a different file so that a questionable result can be traced back to the input.

## Read errors as evidence

An exception usually includes a **traceback**, a sequence of locations showing the active chain of calls. Start with the final error type and message, then find the most relevant line in your own code. `SyntaxError` means Python could not interpret the source structure. `NameError` often means a name was misspelled or used before assignment. `ModuleNotFoundError` often means the wrong interpreter is running or a required package is absent.

`TypeError` suggests an operation received the wrong kind of value or the wrong arguments. `ValueError` suggests the kind may be acceptable but the value violates a constraint. `FileNotFoundError` points toward path resolution or absent input. These are useful clues, not guarantees: read the actual message and inspect the relevant values.

A small diagnostic sequence is more productive than reinstalling everything. Print `sys.executable` to identify the running interpreter. Print the current working directory with `Path.cwd()`. Print `type(value)` and `repr(value)` for a suspect input. `repr` displays a representation that can expose hidden whitespace or the difference between a string and a number. Reduce the failing example until one behavior remains.

Catch only errors you can handle meaningfully. `try: ... except ValueError: ...` can convert a user-input failure into a useful message. A broad `except Exception: pass` hides evidence and can make a twin appear healthy while it silently ignores every observation. Cleanup is different from suppression: a `finally` block runs whether an operation succeeds or fails, making it appropriate for closing a simulator or file handle.

## Checking a calculation is different from trusting a display

A **test** compares observed behavior to a stated expectation. Start with a known result: 0.20 meters at 0.10 meters per second corresponds to 2 seconds in our toy interval model. Then test invalid inputs, such as zero speed. Both cases represent requirements; neither is a quiz for you.

```python
import math
import unittest

class TestVisibility(unittest.TestCase):
    def test_known_interval(self):
        self.assertTrue(math.isclose(visible_time(0.20, 0.10), 2.0))

    def test_zero_speed_rejected(self):
        with self.assertRaises(ValueError):
            visible_time(0.20, 0.0)
```

This intentionally shown fragment belongs in a file that also defines or imports `visible_time`; the complete executable tests are included under `checks/`. `unittest.TestCase` supplies assertion methods. The word `self` is the current test instance, passed automatically when a method is called on it. The `with` block establishes an expected exception during the enclosed call. See the official [unittest reference](https://docs.python.org/3.12/library/unittest.html) for the testing interface.

Tests protect assumptions at the size where failures are easy to understand. A correct visibility calculation does not prove a camera can see a defect. That larger claim needs an optical model, realistic data, and measured comparison. Build confidence in layers, and never promote evidence from a small layer into a larger claim it cannot support.

## Your first connected learning session

Open the companion's **Conveyor timing** experiment. Change belt speed while keeping the observation length fixed. The displayed duration comes from the same division you just learned. Add exposure time to see a separate quantity: motion during an exposure is speed multiplied by exposure duration. At 0.10 m/s and 0.004 s, motion is 0.0004 m, or 0.4 mm. That calculation describes distance traveled, not a complete image-blur prediction.

Then run `examples/01_first_model.py`. Read its output alongside the source. You can change the inputs, run it again, and compare the new result. This is optional application work, not a gate before continuing. When something fails, the diagnostic steps above are part of learning, not evidence that you should already have known an answer.

If you use an AI coding coach, give it a bounded request: “Explain this Python 3.12 program to a beginner, one meaningful operation at a time. Define every new term before using it. Keep units visible. Show a complete runnable modification that rejects zero and nonfinite speed. Explain the expected output and which physical claims the example cannot establish.” Treat the response as a proposal to inspect and run. A confident explanation does not replace an API reference or a test.

You now have the software vocabulary needed for the rest of the course: values, types, records, functions, loops, modules, errors, files, and tests. The main path next develops warehouse flow and scheduling; the robotics foundations chapter gives these values further physical meaning. You will learn how a robot's position, orientation, velocity, and forces become quantities that a program can transform and a simulator can update.
