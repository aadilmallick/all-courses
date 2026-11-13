"""Optional model recipes, not executed in this edition. Downloads may be large.
Install the corresponding direct dependencies from requirements-models.txt in an
isolated environment and consult upstream hardware/system-library instructions.
"""
import argparse
from pathlib import Path
parser=argparse.ArgumentParser()
parser.add_argument('mode', choices=['recognize','speak'])
parser.add_argument('input', help='audio filename for recognize; spoken text for speak')
args=parser.parse_args()
if args.mode=='recognize':
    from faster_whisper import WhisperModel
    model=WhisperModel('small',device='cpu',compute_type='int8')
    segments,info=model.transcribe(args.input,beam_size=5)
    for segment in segments:
        print(f'{segment.start:.2f}–{segment.end:.2f}: {segment.text}')
else:
    from kokoro import KPipeline
    import soundfile as sf
    pipeline=KPipeline(lang_code='a')
    for index,(_,_,audio) in enumerate(pipeline(args.input,voice='af_heart')):
        path=Path(f'local-reply-{index:02d}.wav')
        sf.write(path,audio,24000)
        print(path)
