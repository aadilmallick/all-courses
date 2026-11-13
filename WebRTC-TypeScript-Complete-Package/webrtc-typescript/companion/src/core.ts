export type Sample = { timestamp: number; bytes: number };
export function bitrate(previous: Sample | undefined, current: Sample): number | null {
  if (!previous || current.timestamp <= previous.timestamp || current.bytes < previous.bytes) return null;
  return 8 * (current.bytes - previous.bytes) * 1000 / (current.timestamp - previous.timestamp);
}
export function topology(participants: number, megabits: number) {
  if (!Number.isInteger(participants) || participants < 2 || !Number.isFinite(megabits) || megabits <= 0) {
    throw new RangeError('Use at least two participants and a positive stream rate.');
  }
  return { links: participants * (participants - 1) / 2,
    meshUpload: (participants - 1) * megabits,
    sfuUpload: megabits,
    allVideoDownload: (participants - 1) * megabits,
    sfuEgress: participants * (participants - 1) * megabits };
}
export function summarizeSdp(sdp: string) {
  return sdp.split(/\r?\n/).filter(line => /^(m=|a=(mid:|sendrecv|sendonly|recvonly|inactive|rtpmap:|fingerprint:|ice-ufrag:|sctp-port:|max-message-size:))/.test(line));
}
export function textError(error: unknown): string {
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error);
}
