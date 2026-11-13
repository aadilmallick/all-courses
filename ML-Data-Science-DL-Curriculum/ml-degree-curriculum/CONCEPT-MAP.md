# Concept dependencies

```mermaid
flowchart TD
    A["Algebra and numerical arrays"] --> B["Geometry and calculus"]
    A --> C["Probability and inference"]
    B --> D["Objectives and optimization"]
    C --> D
    C --> E["Sampling and valid evaluation"]
    D --> F["Classical ML and neural networks"]
    E --> F
    F --> G["Sequences and transformers"]
    F --> H["Graphs and generative models"]
    G --> I["Reinforcement learning and adaptation"]
    H --> J["Integrated capstone"]
    I --> J
```

The numbered reading order rebuilds all prerequisites before the corresponding model derivations. Framework workshops are optional alternative implementation treatments and retain their own internal section numbers. Cross references provide deeper treatment after the prerequisite definition has been introduced.
