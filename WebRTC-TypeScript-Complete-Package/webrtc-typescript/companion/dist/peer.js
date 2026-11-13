                                                                                                         
                                                      
// Contract: one ordered signaling stream per live peer pair. The caller validates envelopes.
export function negotiate(pc                   , polite         , send            , report                          ) {
  let makingOffer = false;
  let ignoreOffer = false;
  let settingAnswer = false;
  let disposed = false;
  let queue = Promise.resolve();
  const onNegotiation = async () => {
    try {
      makingOffer = true;
      await pc.setLocalDescription();
      if (!disposed && pc.localDescription) send({ description: pc.localDescription.toJSON() });
    } catch (error) { if (!disposed) report(error); }
    finally { makingOffer = false; }
  };
  const onCandidate = (event                           ) => {
    if (event.candidate && !disposed) send({ candidate: event.candidate.toJSON() });
  };
  pc.addEventListener('negotiationneeded', onNegotiation);
  pc.addEventListener('icecandidate', onCandidate);
  async function apply(signal            ) {
    if (disposed) return;
    if ('description' in signal) {
      const description = signal.description;
      const ready = !makingOffer && (pc.signalingState === 'stable' || settingAnswer);
      ignoreOffer = !polite && description.type === 'offer' && !ready;
      if (ignoreOffer) return;
      settingAnswer = description.type === 'answer';
      try { await pc.setRemoteDescription(description); }
      finally { settingAnswer = false; }
      if (description.type === 'offer') {
        await pc.setLocalDescription();
        if (!disposed && pc.localDescription) send({ description: pc.localDescription.toJSON() });
      }
    } else {
      try { await pc.addIceCandidate(signal.candidate); }
      catch (error) { if (!ignoreOffer) throw error; }
    }
  }
  return {
    receive(signal            ) {
      queue = queue.then(() => apply(signal)).catch(error => { if (!disposed) report(error); });
      return queue;
    },
    dispose() {
      disposed = true;
      pc.removeEventListener('negotiationneeded', onNegotiation);
      pc.removeEventListener('icecandidate', onCandidate);
    }
  };
}


//# sourceURL=peer.ts