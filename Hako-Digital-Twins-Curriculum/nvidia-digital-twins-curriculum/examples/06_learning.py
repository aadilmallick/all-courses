"""Executed scalar logistic regression and tabular Q-learning teaching lab."""
import math
import random

def sigmoid(z):
    if z >= 0:
        return 1 / (1 + math.exp(-z))
    ez = math.exp(z)
    return ez / (1+ez)

def dataset(seed, count):
    rng = random.Random(seed)
    return [(rng.gauss(-1 if index % 2 == 0 else 1, 0.7), index % 2) for index in range(count)]

def train_classifier():
    train = dataset(10, 200)
    weight, bias = 0.0, 0.0
    for _ in range(400):
        grad_w = grad_b = 0.0
        for feature, label in train:
            error = sigmoid(weight*feature+bias)-label
            grad_w += error*feature
            grad_b += error
        weight -= 0.2*grad_w/len(train)
        bias -= 0.2*grad_b/len(train)
    counts = {"tp":0,"fp":0,"tn":0,"fn":0}
    for feature, label in dataset(20,200):
        predicted = sigmoid(weight*feature+bias) >= 0.5
        counts[("tp" if predicted else "fn") if label else ("fp" if predicted else "tn")] += 1
    return weight, bias, counts

def train_grid(seed=7):
    rng = random.Random(seed)
    q = [[0.0,0.0] for _ in range(5)]
    for _ in range(500):
        state = 0
        for _ in range(40):
            action = rng.randrange(2) if rng.random() < 0.2 else max(range(2), key=lambda a:q[state][a])
            next_state = max(0,min(4,state+(-1 if action == 0 else 1)))
            done = next_state == 4
            reward = 1.0 if done else -0.01
            target = reward + (0 if done else 0.95*max(q[next_state]))
            q[state][action] += 0.2*(target-q[state][action])
            state = next_state
            if done: break
    route = [0]
    for _ in range(10):
        state = route[-1]
        if state == 4: break
        action = max(range(2), key=lambda a:q[state][a])
        route.append(max(0,min(4,state+(-1 if action == 0 else 1))))
    return q, route

if __name__ == "__main__":
    print("Classifier weight, bias, held-out counts:", train_classifier())
    print("Learned greedy grid route:", train_grid()[1])
