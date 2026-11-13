"""Dependency-free audio, cancellation, transaction, and measurement exercises."""
import asyncio
import math
import struct
import wave
from dataclasses import dataclass, field


def pcm16(samples):
    return b''.join(struct.pack('<h', round(max(-1, min(1, s)) * 32767)) for s in samples)


def tone(path='tone.wav', rate=16000, seconds=1.0):
    samples = [0.15 * math.sin(2 * math.pi * 440 * n / rate) for n in range(round(rate * seconds))]
    with wave.open(str(path), 'wb') as out:
        out.setnchannels(1)
        out.setsampwidth(2)
        out.setframerate(rate)
        out.writeframes(pcm16(samples))
    return len(samples)


def endpoint(frames, silence_ms=500, frame_ms=20):
    """frames: boolean speech decisions, not a real VAD. Returns commit times."""
    if silence_ms <= 0 or frame_ms <= 0:
        raise ValueError('positive timing required')
    active, quiet, commits = False, 0, []
    for i, speech in enumerate(frames):
        if speech:
            active, quiet = True, 0
        elif active:
            quiet += frame_ms
            if quiet >= silence_ms:
                commits.append((i + 1) * frame_ms)
                active, quiet = False, 0
    return commits


@dataclass
class Playback:
    epoch: int = 0
    queue: list = field(default_factory=list)

    def interrupt(self):
        self.epoch += 1
        self.queue.clear()

    def accept(self, epoch, chunk):
        if epoch == self.epoch:
            self.queue.append(chunk)
            return True
        return False


class BookingLedger:
    """Single-process teaching ledger; production requires a durable transaction."""
    def __init__(self):
        self.proposals = {}
        self.receipts = {}

    def propose(self, user, slot, proposal_id):
        value = (user, slot)
        if proposal_id in self.proposals and self.proposals[proposal_id] != value:
            raise ValueError('proposal ID conflict')
        self.proposals[proposal_id] = value
        return proposal_id

    def confirm(self, user, proposal_id):
        owner, slot = self.proposals[proposal_id]
        if owner != user:
            raise PermissionError('wrong owner')
        if proposal_id not in self.receipts:
            self.receipts[proposal_id] = {'receipt': f'booking-{len(self.receipts)+1}', 'slot': slot}
        return self.receipts[proposal_id]


def percentile(values, p):
    if not values or not 0 <= p <= 100:
        raise ValueError('nonempty values and percentile 0..100 required')
    values = sorted(values)
    return values[max(0, math.ceil(p / 100 * len(values)) - 1)]


async def stream_demo():
    """Mock text/PCM frames expose scheduling; no speech model is involved."""
    queue = asyncio.Queue(maxsize=2)
    async def produce():
        for word in ['Your', 'appointment', 'is', 'available.']:
            await queue.put(word)
        await queue.put(None)
    async def consume():
        while (word := await queue.get()) is not None:
            print('chunk:', word)
            await asyncio.sleep(0)
    async with asyncio.TaskGroup() as tasks:
        tasks.create_task(produce())
        tasks.create_task(consume())


if __name__ == '__main__':
    print('samples:', tone())
    print('commits:', endpoint([True]*10 + [False]*25))
    asyncio.run(stream_demo())
