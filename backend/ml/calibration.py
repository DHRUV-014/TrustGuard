import math

# These values are safe defaults
# Later we can tune them
A = 4.0
B = -2.0

def calibrate(score: float) -> float:
    """
    Converts raw model probability
    into calibrated confidence
    """
    return 1 / (1 + math.exp(-(A * score + B)))