# 9. Generate useful data and understand robot learning

This is optional depth for your current role. Your onboarding prioritizes orchestration and event-driven replay; it does not require training robot policies before contributing. Read this chapter when evaluating perception data or a specific learning proposal.

## Begin with the failure you want to reduce

Our inspection cell needs to identify parts with a visible surface defect. We could collect images from the physical camera and label them. Rare defects may be difficult to obtain, changing the camera may require downtime, and privacy or customer restrictions may limit sharing. A simulator can generate images and labels under controlled conditions, which makes **synthetic data generation** useful.

The usefulness is conditional. A dataset is valuable when it improves a measured task under the conditions that matter. Ten thousand polished images of an unrealistic defect may teach the wrong cue. A small set of deliberately varied, correctly labeled images can reveal a failure that a much larger unstructured set misses. Start with a failure hypothesis, a data contract, and an evaluation plan.

We will separate three workflows. **Supervised learning** learns a mapping from examples paired with desired outputs. **Reinforcement learning** improves a policy using interaction and a reward signal. **Imitation learning** learns behavior from demonstrations. Simulation can support all three, but images and labels, interaction transitions, and demonstrations are different kinds of evidence.

No prior machine-learning knowledge is assumed. This chapter teaches enough mathematics to read a simple learning loop, understand evaluation, and design an informed Isaac workflow. The runnable learning examples are intentionally small CPU models. The included Replicator script provides a separate native rendering route that requires Isaac Sim.

## Define the prediction and its label

A **classification** task chooses a category, such as accepted versus rejected. **Object detection** locates objects, often with bounding boxes and category labels. **Semantic segmentation** labels pixels by category. **Instance segmentation** distinguishes individual objects of the same category. **Pose estimation** predicts position and orientation under a stated convention.

These labels answer different questions. A bounding box around a part does not locate a tiny defect. A semantic label of “part” does not identify which serial-numbered physical part is present. A predicted defect class does not establish its severity. Choose the label based on the downstream decision and its observable evidence.

A bounding box can be represented by minimum and maximum pixel coordinates, or center and size, or normalized coordinates. Record which representation, image origin, endpoint convention, and clipping policy apply. For a 640 by 480 image, a pixel coordinate is not interchangeable with a number normalized to `[0,1]`.

For each generated image, preserve a run ID, camera definition, source asset identities, semantic labels, parameter values, random seed, time, and annotator configuration. These fields let you trace a surprising model prediction back to the scene that produced it. A folder of PNGs alone does not preserve an experiment.

## Ground truth has a scope

In simulation, an annotator can produce labels from scene state. Those labels are often called **ground truth**, meaning they come from the simulation's known representation rather than a model's inference. They are truth about that representation, under the annotator's definition. They do not prove the simulated defect matches a real defect or that a real camera would observe it in the same way.

Occlusion complicates labels. A full object's projected extent differs from the visible pixels remaining after another object blocks it. A tight visible box differs from an amodal box representing an object's full extent. A training pipeline needs one consistent definition and an evaluation pipeline that uses the same intended semantics.

Inspect images and overlays together. A defect label can be correct in the scene while the defect is invisible at the chosen resolution. A class ID can be valid while its mapping file names the wrong class. Labels can shift if an image is resized without updating coordinates. Automated schema checks and visual spot inspection address different failure modes.

Build a tiny dataset first, perhaps a handful of parameter combinations with known expected differences. Verify the complete path from scene to image to label to consumer. Only then increase generation volume. Scaling a wrong annotation contract produces a larger wrong dataset.

## Randomization is a distribution design problem

**Domain randomization** varies relevant simulation parameters so the learner encounters a range of conditions. Examples include camera pose, illumination, surface appearance, part position, defect shape, and sensor noise. A **distribution** specifies how values are selected, including their ranges and relative frequency.

A uniform distribution over illumination from 100 to 1,000 gives equal density across that interval. It does not mean those values occur equally often in your facility. A normal distribution concentrates around a mean with spread described by a standard deviation. Choose distributions using measurements or an explicit uncertainty model whenever possible.

Independent randomization can generate impossible combinations. A heavy tool may belong only to a particular robot configuration; an exposure setting may depend on illumination; a camera mount may have discrete validated positions. Preserve these relationships. A dataset that makes every combination possible can train behavior for a world the deployment never inhabits while undersampling realistic difficult cases.

The **random seed** selects a reproducible pseudorandom sequence under a particular generator implementation. A fixed seed helps compare configurations, but it is not a complete reproducibility record. Software versions, assets, ordering, parallelism, render settings, and nondeterministic GPU execution can also affect results. Store sampled parameter values in addition to the seed.

## A synthetic scalar dataset before images

Before adding rendering, consider a toy measurement named `score`. Accepted parts tend to have low scores and defective parts high scores. This is a synthetic learning problem chosen to expose mechanics; it does not represent a real defect detector. Each record contains a number and a label, where label 0 means accepted and 1 means defective.

A model might predict defect when `score >= threshold`. If an accepted sample has score 0.3 and a defect has score 0.8, a threshold of 0.5 separates them. With noise and overlapping distributions, no threshold may classify every case correctly. The goal becomes selecting a tradeoff under a stated cost model and evaluating it on held-out evidence.

```python
samples = [(0.2, 0), (0.4, 0), (0.6, 1), (0.8, 1)]
threshold = 0.5

for score, label in samples:
    prediction = int(score >= threshold)
    print(score, label, prediction)
```

`int(True)` is 1 and `int(False)` is 0. The loop unpacks each pair into the measurement and known label. The program performs inference using a hand-chosen threshold; it does not yet learn. Keeping that distinction visible prevents a common confusion between executing a rule and training a model.

The companion's **Detection tradeoffs** experiment creates a seeded synthetic score distribution and computes counts from the selected threshold. Its output responds to threshold and distribution shift. It contains no hidden image model and should not be reported as camera-inspection performance.

## From a hard threshold to a trainable model

A simple binary model can compute a weighted score `z = weight*measurement + bias`, then convert it to a probability-like output with the sigmoid function `p = 1/(1+exp(-z))`. The sigmoid maps real-valued inputs into `(0,1)`. At `z=0`, it gives 0.5. Larger positive values approach 1; negative values approach 0.

The **parameters** are weight and bias. **Training** adjusts them using labeled examples. A **loss function** measures how poorly predictions match labels. For binary labels, binary cross-entropy is `-(y*log(p) + (1-y)*log(1-p))`. If the true label is 1, confidently predicting near zero incurs a large loss. If the true label is 0, confidently predicting near one does too.

For sigmoid with this loss, the derivative of loss with respect to the weighted score is `p-y`. A derivative tells us how a small change in one quantity affects another. The weight gradient for one sample is `(p-y)*measurement`, and the bias gradient is `p-y`. **Gradient descent** subtracts a small multiple of these gradients from the parameters.

For one sample with measurement 0.8, label 1, initial weight 0, and bias 0, the prediction is 0.5. The residual `p-y` is -0.5. The weight gradient is -0.4. With learning rate 0.1, the new weight is `0 - 0.1*(-0.4) = 0.04` and new bias is 0.05. The score increases, moving the prediction in the desired direction. The included CPU example performs complete dataset passes rather than leaving this as an unexplained formula.

## Training settings and numerical care

An **epoch** is one pass through the training dataset. A **batch** is a subset used for one parameter update. A **learning rate** controls update size. A high rate can overshoot useful parameters; a very low one can make progress slow. These are algorithm settings, not physical quantities of the inspection cell.

Scale input features deliberately. A feature measured in millimeters may have numerical values a thousand times larger than the same feature in meters. That changes optimization behavior unless preprocessing accounts for it. Fit preprocessing using training data, then apply the same fixed transformation to validation and test inputs. Using test-set statistics during training leaks information.

Avoid taking `log(0)` when reporting loss. Clamp probability only for a numerically safe loss calculation or use a stable logit-based implementation. A stable sigmoid also avoids overflow by treating positive and negative scores appropriately. The complete scalar classifier uses these precautions and a deterministic synthetic dataset.

Learning parameters does not make the system causal. If every defective training part also has a red background, the model can learn background color instead of defects. Simulation makes this confounding easy to create accidentally because one scene-generation rule can couple label and appearance. Evaluate on controlled changes that break irrelevant correlations.

## Separate training, validation, and test evidence

The **training set** influences fitted parameters. A **validation set** helps choose model settings or thresholds. A **test set** estimates performance after those choices are fixed. Repeatedly consulting the test set to improve the model effectively turns it into more validation data and weakens its independent meaning.

Split by meaningful groups, not just random image rows. Adjacent frames of the same synthetic part in nearly the same pose are highly related. If some go into training and others into testing, the test can look impressive without measuring generalization to new parts or settings. Keep asset families, acquisition sessions, defect instances, or environment conditions together when those represent the desired generalization boundary.

Hold out realistic real observations whenever available. Evaluate performance by lighting, defect size, material, camera position, and other operationally meaningful subgroups. An aggregate score can hide failure on the exact rare defect that motivated the project. Label uncertainty and human disagreement also belong in the evidence record.

The **sim-to-real gap** is the difference between simulated and physical conditions relevant to the task. It includes visual appearance, dynamics, sensor response, latency, manufacturing variation, and behavior. Domain randomization can improve robustness, but it is not a guarantee of transfer. Evaluate the deployed observation and action process, not only the model file.

## Read the confusion matrix as operational outcomes

Define a defect as the positive class. A **true positive** is a defective part flagged as defective. A **false positive** is an accepted part incorrectly flagged. A **false negative** is a defect missed. A **true negative** is an accepted part correctly accepted.

Suppose a test contains 100 defective and 900 accepted parts. A detector flags 90 defects and 45 accepted parts. Then TP is 90, FN is 10, FP is 45, and TN is 855. **Precision** is `TP/(TP+FP) = 90/135`, about 66.7%. **Recall** is `TP/(TP+FN) = 90/100`, or 90%. Accuracy is `(TP+TN)/1000 = 94.5%`.

A classifier that always says “accepted” would already have 90% accuracy on that dataset while missing every defect. This is why accuracy alone can be misleading under class imbalance. The positive-class definition and class prevalence must be visible when comparing numbers.

Now suppose only 10 of 1,000 parts are defective, with the same 90% recall and 5% false-positive rate. Expected true positives are 9 and expected false positives about 49.5. Expected precision is `9/(9+49.5)`, about 15.4%. The conditional classifier behavior is unchanged in this constructed example; population prevalence changed. A balanced test dataset therefore cannot directly forecast production reject rates.

Lowering a defect threshold often increases recall and false positives. A toy expected cost can combine `false_negative_cost*FN + false_positive_cost*FP`, but those costs are scenario inputs, not universal business facts. Use a stakeholder-defined consequence model. A statistical score does not independently decide acceptable physical or commercial risk.

## Measure uncertainty rather than reporting a magical percentage

A performance estimate depends on sample size and sampling design. Zero observed failures in ten trials is much weaker evidence than zero in ten thousand representative trials. Under a simple independent Bernoulli model, a rough 95% upper bound for failure probability after zero failures is about `3/n`. This is a useful approximation with assumptions, not a certification formula.

If trials are correlated, such as repeated near-identical frames, the independent-sample interpretation is inappropriate. Report the number of distinct parts, sessions, and scenarios, not only image count. When a model is evaluated after extensive threshold tuning on the same data, acknowledge the selection process.

A predicted probability also needs **calibration**: among cases assigned about 0.8 probability, roughly 80% should be positive under the evaluated distribution if the probabilities are calibrated. A model can rank cases well while producing poorly calibrated probabilities. A 0.99 output is a model value, not automatically 99% confidence that a physical action is appropriate.

In early prototypes, a clear data split, subgroup results, error examples, and an honest sample count are more useful than a dense dashboard of unexplained metrics. Inspect failure cases and connect them to scene-generation decisions you can change and test.

## Replicator provides a native generation route

**Replicator** supplies scene manipulation, randomization, annotation, and writing capabilities within the NVIDIA workflow. A **render product** represents requested image output from a camera at a resolution. An **annotator** derives a particular output such as RGB or bounding boxes. A **writer** consumes outputs and stores them through a backend.

For the 6.2 baseline, the included `examples/06_replicator_capture.py` uses the current functional creation API, a disk backend, a camera, labeled cubes, and `BasicWriter`. It generates a bounded capture sequence and waits for writing to finish before detaching resources. This API differs from many older examples, so avoid mixing old writer initialization patterns with new backend patterns.

The official [getting-started scripts](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/replicator_tutorials/tutorial_replicator_getting_started.html) document the version-specific pipeline. The course script uses original scene parameters and a small random-position sequence. It requires a compatible simulator installation and was not executed in this environment.

The workflow is scene setup, label assignment, camera and render-product creation, writer/backend configuration, controlled variation, capture, completion wait, and cleanup. Each stage can fail independently. A created output directory does not prove images were written; images alone do not prove annotations align. Inspect sample files and overlays before increasing capture count.

## Design a small image experiment

Take two candidate camera distances and three lighting conditions. Keep the part dimensions and defect dimensions fixed. Capture a few repeated positions for each combination, storing the exact settings. Predict an approximate defect pixel width using the projection relation from the sensors and interfaces chapter, then inspect whether rendered visibility behaves consistently.

The experiment asks one question: how does this setup affect an observable defect representation? It does not require training a large model immediately. If the defect occupies less than a pixel in every image, a larger dataset will not solve the optical resolution problem. If labels are correct but the surface model makes the defect invisible, investigate appearance and illumination before changing the classifier.

Add variation in a controlled sequence. First vary one parameter, then realistic combinations, then a held-out condition. Store output in run-specific folders and write a manifest. A manifest connects every generated sample to scene identity, parameters, software version, and annotation definition.

For realistic industrial inspection, the optical model may need measured material appearance, sensor response, depth of field, lens distortion, and image-processing effects. Include those only when they affect the decision. The beginner experiment establishes the geometry and data-contract mechanics first.

## Reinforcement learning begins with interaction

In reinforcement learning, an **agent** observes an environment, chooses an **action**, receives a **reward**, and continues. A **policy** maps observations to actions. An **episode** is one run from reset to a termination condition or time limit. A **return** combines rewards across time, often discounting later rewards by a factor `gamma` between zero and one.

For example, a toy agent moves along positions 0 through 4 toward a goal at 4. It can move left or right. Each non-goal step has reward -0.01; reaching the goal gives +1. An observation is the current position. The environment is deliberately tiny so you can inspect every update. It is not a robot dynamics model.

The inspected [reinforcement-learning introduction](https://spinningup.openai.com/en/latest/spinningup/rl_intro.html) defines the state/observation/action/reward framework. Our grid and numerical update are original teaching examples. In a real robot, observations might contain joint positions, velocities, target pose, and sensor data, while actions might be position targets, velocities, or torques.

**State** describes all relevant environment information under the model; an observation can reveal only part. If the training policy receives exact object pose but the deployed robot has only camera pixels, there is an observation mismatch. Solving that mismatch may require perception, estimation, or a different training design. It cannot be fixed by renaming the state vector “camera input.”

## A complete learning update you can calculate

In **tabular Q-learning**, `Q(state, action)` estimates future discounted return for a state-action pair. After an interaction, update the estimate toward `reward + gamma*best_next_Q`, except that a terminal transition has no future term. A learning rate `alpha` controls how far to move toward the target.

```text
target = reward + gamma*max_next_Q     # nonterminal transition
new_Q = old_Q + alpha*(target-old_Q)
```

Suppose `old_Q = 0.2`, reward is 0.1, gamma is 0.9, best next value is 0.5, and alpha is 0.1. The target is `0.1 + 0.9*0.5 = 0.55`. The update difference is 0.35, and the new estimate is `0.2 + 0.1*0.35 = 0.235`. On a terminal transition with reward 1, the target is simply 1.

The agent also needs **exploration**. Always choosing the currently best action can miss a better one never tried. An epsilon-greedy policy chooses a random action with probability epsilon and otherwise a highest-valued action. Ties and seeds affect the learning trajectory, which is why the tiny example records them.

`examples/06_learning.py` trains both the scalar classifier and the tabular grid policy, then reports held-out classifier counts and the greedy grid route. The companion's **Reward design** experiment compares route returns and runs the same type of small Q update sequence in JavaScript. It demonstrates genuine tabular learning, while making clear that no neural policy or Isaac Lab training runs in the browser.

## Reward design can produce the wrong success

If you reward an agent for moving quickly, it may move quickly in circles. If you reward proximity to a goal every step, it may hover near the goal instead of terminating. If collisions are expensive but the episode ends without a terminal penalty, the policy may exploit the termination rules. The objective includes rewards, observations, action limits, reset distribution, and episode boundaries.

Define success using a metric independent of training reward. For a pick-and-place task, success might require the correct object inside a target region with a stable pose after release, within a time budget and without prohibited contacts. A high average reward is not a substitute for that observable task outcome.

**Termination** indicates a modeled terminal condition. **Truncation** can indicate an external time limit. Learning algorithms may treat them differently when estimating future value. A reset must return robot state, objects, controller memory, randomization, and episode counters to a consistent starting condition. Leftover integral state or a stale camera buffer can make repeated episodes incomparable.

Evaluate over held-out seeds and parameter ranges. Report success rate, failures by category, time to completion, constraint violations, and sensitivity to delays or dynamics changes. A policy that succeeds only under one reset pose has learned a narrow behavior, even if its video looks impressive.

## Where Isaac Lab fits

Isaac Lab provides infrastructure for robot-learning environments, batched simulation, observations, rewards, resets, and integration with learning libraries. It saves infrastructure effort; it does not define your task correctly for you. An environment author still owns units, frames, asset validity, actuator models, observation availability, reward meaning, and evaluation.

For the 6.2 course baseline, use the pairing listed by NVIDIA's [compatibility matrix](https://docs.isaacsim.omniverse.nvidia.com/6.2.0/installation/compatibility.html), then follow that Lab release's own installation and dependency table. The exact training command depends on the selected release, task, and learning backend. We do not fabricate a universal command that claims to work across all releases.

A guided first native learning session is: verify the matched installation; run one documented stock task unchanged; identify its observation and action shapes; inspect reward and reset code; reduce the number of environments for inspection; record a seeded evaluation; then change one task parameter and compare. Do not begin by building a custom humanoid and rewriting the reward simultaneously.

Batched environments increase experience throughput, but more environments also change memory demand and experiment dynamics. A training run's wall-clock speed is separate from the policy's real-world control frequency. Record policy action rate, simulator step rate, decimation, and actuator assumptions. A trained policy file without its observation normalization and action scaling is an incomplete artifact.

## Imitation, foundation models, and bounded next steps

Imitation learning uses demonstrations, such as observed state-action sequences. **Behavior cloning** fits an action predictor to those pairs. It can work well where demonstrations cover the deployment distribution, but mistakes can move the system into states absent from training. Data collection quality, synchronization, and the expert's behavior all matter.

Vision-language-action models combine visual observations, language-conditioned intent, and actions under a particular architecture and training scheme. World foundation models can generate or transform plausible physical-world observations. NVIDIA's [Cosmos documentation hub](https://docs.nvidia.com/cosmos/) describes its current platform direction. This book treats these as advanced workflow options, not prerequisites for an inspection-cell twin.

Generated visual plausibility does not establish metrically correct geometry, collision-free trajectories, or task safety. Use explicit geometry and simulation where measurements and repeatability matter, and evaluate generated data under the same label and distribution rules as other synthetic data. A model-generated video is evidence of a generated video, not a verified physical experiment.

You can now read a learning loop, design a small dataset experiment, calculate evaluation metrics, and identify what native NVIDIA tools contribute. The final chapter connects these components into a purposeful digital twin with live-state contracts, validation, a capstone, and a practical learning schedule tied to reviewable outputs.
