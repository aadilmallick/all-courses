from core import visible_time

if __name__ == "__main__":
    for length_m in (0.18, 0.20, 0.23):
        print(f"{length_m:.2f} m -> {visible_time(length_m, 0.10):.2f} s")
    print("Travel during 4 ms exposure:", 0.10 * 0.004 * 1000, "mm")
