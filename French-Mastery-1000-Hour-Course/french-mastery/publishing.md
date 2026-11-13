# Hosting status

The complete static site was built, packaged, and its source uploaded. Saved version 1 corresponds to commit `064b8949f89dc101e307612919f335f2070edd1f`. Two private deployment attempts failed at the hosting provider; no live URL was verified. The complete local build in dist is usable independently of hosting.

- Site: `appgprj_6af7266626ec81918cc5f2e91e7b7bfe`
- Saved version: `appgprj_6af7266626ec81918cc5f2e91e7b7bfe~appgver_2aafaa3ffa50819189110c78b81ad17f`
- First deployment: `appgdep_6af72d481558819185ad760f9691feca`; provider reported an unknown Cloudflare workers-sdk error.
- Second deployment: `appgdep_6af72d71303881919d1906d6c6362252`; provider reported “Failed to publish the built site.”

The archive, source commit, and saved-version provenance were verified. The service did not return a more specific repairable build error. Avoid creating a duplicate site: a future retry can use this existing identity and saved version. The local delivery additionally includes a Windows launcher and this status note, added after the failed publication attempts; these do not change the built learning pages.
