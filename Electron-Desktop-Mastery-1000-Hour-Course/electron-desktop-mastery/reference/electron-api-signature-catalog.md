# Electron API signature catalog

Pinned source: **electron/electron v45.3.2**, retrieved November 13, 2026. This generated reference extracts public documentation headings (events, properties and methods) and preserves links to their exact source pages. It supplements the teaching chapters; it does not assert that every platform-specific or experimental feature was run. Deprecated and experimental labels are retained when present in headings. Consult the pinned declaration file in your installed Electron package for overloads and argument types.

Rebuild strategy: list `docs/api` at the pinned tag, retrieve every Markdown page, extract Markdown headings outside fenced code, and record Git blob SHAs. Empty redirect pages are recorded too. The structured data-object index follows the main pages.

[Course index](../README.md) · [Practical API atlas](electron-api-atlas.md)

## Page index

- [app-shim-host.md](#app-shim-host)
- [app.md](#app)
- [auto-updater.md](#auto-updater)
- [base-window.md](#base-window)
- [browser-view.md](#browser-view)
- [browser-window.md](#browser-window)
- [client-request.md](#client-request)
- [clipboard-item.md](#clipboard-item)
- [clipboard.md](#clipboard)
- [command-line-switches.md](#command-line-switches)
- [command-line.md](#command-line)
- [content-tracing.md](#content-tracing)
- [context-bridge.md](#context-bridge)
- [cookies.md](#cookies)
- [corner-smoothing-css.md](#corner-smoothing-css)
- [crash-reporter.md](#crash-reporter)
- [debugger.md](#debugger)
- [desktop-capturer.md](#desktop-capturer)
- [dialog.md](#dialog)
- [dock.md](#dock)
- [download-item.md](#download-item)
- [environment-variables.md](#environment-variables)
- [extensions-api.md](#extensions-api)
- [extensions.md](#extensions)
- [global-shortcut.md](#global-shortcut)
- [image-view.md](#image-view)
- [in-app-purchase.md](#in-app-purchase)
- [incoming-message.md](#incoming-message)
- [ipc-main-service-worker.md](#ipc-main-service-worker)
- [ipc-main.md](#ipc-main)
- [ipc-renderer.md](#ipc-renderer)
- [language-model-utility.md](#language-model-utility)
- [local-ai-handler.md](#local-ai-handler)
- [menu-item.md](#menu-item)
- [menu.md](#menu)
- [message-channel-main.md](#message-channel-main)
- [message-port-main.md](#message-port-main)
- [native-image.md](#native-image)
- [native-theme.md](#native-theme)
- [navigation-history.md](#navigation-history)
- [net-log.md](#net-log)
- [net.md](#net)
- [notification.md](#notification)
- [parent-port.md](#parent-port)
- [power-monitor.md](#power-monitor)
- [power-save-blocker.md](#power-save-blocker)
- [process.md](#process)
- [protocol.md](#protocol)
- [push-notifications.md](#push-notifications)
- [safe-storage.md](#safe-storage)
- [screen.md](#screen)
- [service-worker-main.md](#service-worker-main)
- [service-workers.md](#service-workers)
- [session.md](#session)
- [share-menu.md](#share-menu)
- [shared-texture.md](#shared-texture)
- [shell.md](#shell)
- [system-preferences.md](#system-preferences)
- [touch-bar-button.md](#touch-bar-button)
- [touch-bar-color-picker.md](#touch-bar-color-picker)
- [touch-bar-group.md](#touch-bar-group)
- [touch-bar-label.md](#touch-bar-label)
- [touch-bar-other-items-proxy.md](#touch-bar-other-items-proxy)
- [touch-bar-popover.md](#touch-bar-popover)
- [touch-bar-scrubber.md](#touch-bar-scrubber)
- [touch-bar-segmented-control.md](#touch-bar-segmented-control)
- [touch-bar-slider.md](#touch-bar-slider)
- [touch-bar-spacer.md](#touch-bar-spacer)
- [touch-bar.md](#touch-bar)
- [tray.md](#tray)
- [utility-process.md](#utility-process)
- [view.md](#view)
- [web-contents-view.md](#web-contents-view)
- [web-contents.md](#web-contents)
- [web-frame-main.md](#web-frame-main)
- [web-frame.md](#web-frame)
- [web-request.md](#web-request)
- [web-socket.md](#web-socket)
- [web-utils.md](#web-utils)
- [webview-tag.md](#webview-tag)
- [window-open.md](#window-open)

<a id="app-shim-host"></a>

## app-shim-host.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/app-shim-host.md) · Git blob: `fba58e3e7acb1b19a7beba94378bb5ed94160d42`

- Class: AppShimHost
- Instance Events
- Event: 'activate' _Experimental_
- Event: 'open-file' _Experimental_
- Event: 'open-url' _Experimental_
- Event: 'quit-requested' _Experimental_
- Event: 'disconnected' _Experimental_
- Instance Methods
- `shim.isConnected()` _Experimental_
- `shim.satisfiesCodeRequirement(requirement)` _Experimental_
- `shim.setBadge(text)` _Experimental_
- `shim.bounce([type])` _Experimental_
- `shim.cancelBounce()` _Experimental_
- `shim.setApplicationMenu(menu)` _Experimental_
- `shim.quit()` _Experimental_
- Instance Properties
- `shim.pid` _Readonly_ _Experimental_
- `shim.bundlePath` _Readonly_ _Experimental_
- `shim.bundleId` _Readonly_ _Experimental_

<a id="app"></a>

## app.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/app.md) · Git blob: `baebb95f8d0dcef75124563bebda9c93100caa7d`

- app
- Events
- Event: 'will-finish-launching'
- Event: 'ready'
- Event: 'window-all-closed'
- Event: 'before-quit'
- Event: 'will-quit'
- Event: 'quit'
- Event: 'open-file' _macOS_
- Event: 'open-url' _macOS_
- Event: 'activate' _macOS_
- Event: 'app-shim-connected' _macOS_ _Experimental_
- Event: 'app-shim-version-mismatch' _macOS_ _Experimental_
- Event: 'did-become-active' _macOS_
- Event: 'did-resign-active' _macOS_
- Event: 'continue-activity' _macOS_
- Event: 'will-continue-activity' _macOS_
- Event: 'continue-activity-error' _macOS_
- Event: 'activity-was-continued' _macOS_
- Event: 'update-activity-state' _macOS_
- Event: 'new-window-for-tab' _macOS_
- Event: 'browser-window-blur'
- Event: 'browser-window-focus'
- Event: 'browser-window-created'
- Event: 'web-contents-created'
- Event: 'certificate-error'
- Event: 'select-client-certificate'
- Event: 'login'
- Event: 'gpu-info-update'
- Event: 'render-process-gone'
- Event: 'child-process-gone'
- Event: 'accessibility-support-changed' _macOS_ _Windows_
- Event: 'session-created'
- Event: 'second-instance'
- Methods
- `app.quit()`
- `app.exit([exitCode])`
- `app.relaunch([options])`
- `app.isReady()`
- `app.whenReady()`
- `app.focus([options])`
- `app.isActive()` _macOS_
- `app.hide()` _macOS_
- `app.isHidden()` _macOS_
- `app.show()` _macOS_
- `app.setAppLogsPath([path])`
- `app.getAppPath()`
- `app.getPath(name)`
- `app.getFileIcon(path[, options])`
- `app.setPath(name, path)`
- `app.getVersion()`
- `app.getName()`
- `app.setName(name)`
- `app.setDesktopName(name)` _Linux_
- `app.getLocale()`
- `app.getLocaleCountryCode()`
- `app.getSystemLocale()`
- `app.getPreferredSystemLanguages()`
- `app.addRecentDocument(path)` _macOS_ _Windows_
- `app.clearRecentDocuments()` _macOS_ _Windows_
- `app.getRecentDocuments()` _macOS_ _Windows_
- `app.setAsDefaultProtocolClient(protocol[, path, args])`
- `app.removeAsDefaultProtocolClient(protocol[, path, args])` _macOS_ _Windows_
- `app.isDefaultProtocolClient(protocol[, path, args])`
- `app.getApplicationNameForProtocol(url)`
- `app.getApplicationInfoForProtocol(url)`
- `app.setUserTasks(tasks)` _Windows_
- `app.getJumpListSettings()` _Windows_
- `app.setJumpList(categories)` _Windows_
- `app.requestSingleInstanceLock([additionalData])`
- `app.hasSingleInstanceLock()`
- `app.releaseSingleInstanceLock()`
- `app.setUserActivity(type, userInfo[, webpageURL])` _macOS_
- `app.getCurrentActivityType()` _macOS_
- `app.invalidateCurrentActivity()` _macOS_
- `app.resignCurrentActivity()` _macOS_
- `app.updateCurrentActivity(type, userInfo)` _macOS_
- `app.setAppUserModelId(id)` _Windows_
- `app.setToastActivatorCLSID(id)` _Windows_
- `app.setActivationPolicy(policy)` _macOS_
- `app.startAppShimServer([options])` _macOS_ _Experimental_
- `app.stopAppShimServer()` _macOS_ _Experimental_
- `app.importCertificate(options, callback)` _Linux_
- `app.configureHostResolver(options)`
- `app.configureWebAuthn(options)` _macOS_
- `app.disableHardwareAcceleration()`
- `app.isHardwareAccelerationEnabled()`
- `app.disableDomainBlockingFor3DAPIs()`
- `app.getAppMetrics()`
- `app.getGPUFeatureStatus()`
- `app.getGPUInfo(infoType)`
- `app.setBadgeCount([count])` _Linux_ _macOS_
- `app.getBadgeCount()` _macOS_
- `app.getLoginItemSettings([options])` _macOS_ _Windows_
- `app.setLoginItemSettings(settings)` _macOS_ _Windows_
- `app.isAccessibilitySupportEnabled()` _macOS_ _Windows_
- `app.setAccessibilitySupportEnabled(enabled)` _macOS_ _Windows_
- `app.getAccessibilitySupportFeatures()` _macOS_ _Windows_
- `app.setAccessibilitySupportFeatures(features)` _macOS_ _Windows_
- `app.showAboutPanel()`
- `app.setAboutPanelOptions(options)`
- `app.isEmojiPanelSupported()`
- `app.showEmojiPanel()` _macOS_ _Windows_
- `app.startAccessingSecurityScopedResource(bookmarkData)` _mas_
- `app.enableSandbox()`
- `app.isInApplicationsFolder()` _macOS_
- `app.moveToApplicationsFolder([options])` _macOS_
- `app.isSecureKeyboardEntryEnabled()` _macOS_
- `app.setSecureKeyboardEntryEnabled(enabled)` _macOS_
- `app.setProxy(config)`
- `app.resolveProxy(url)`
- `app.setClientCertRequestPasswordHandler(handler)`  _Linux_
- Properties
- `app.accessibilitySupportEnabled` _macOS_ _Windows_
- `app.applicationMenu`
- `app.badgeCount` _Linux_ _macOS_
- `app.commandLine` _Readonly_
- `app.dock` _macOS_ _Readonly_
- `app.isPackaged` _Readonly_
- `app.toastActivatorCLSID` _Windows_ _Readonly_
- `app.name`
- `app.userAgentFallback`
- `app.runningUnderARM64Translation` _Readonly_ _macOS_ _Windows_

<a id="auto-updater"></a>

## auto-updater.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/auto-updater.md) · Git blob: `7b135c7e23a9aea56bd8d6288a1ed2f47aa48f2e`

- autoUpdater
- Platform Notices
- macOS
- Windows
- Squirrel.Windows
- MSIX Packages
- Events
- Event: 'error'
- Event: 'checking-for-update'
- Event: 'update-available'
- Event: 'update-not-available'
- Event: 'update-downloaded'
- Event: 'before-quit-for-update'
- Methods
- `autoUpdater.setFeedURL(options)`
- `autoUpdater.getFeedURL()`
- `autoUpdater.checkForUpdates()`
- `autoUpdater.quitAndInstall()`

<a id="base-window"></a>

## base-window.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/base-window.md) · Git blob: `44d1b805ff11918a793f6ff19aa1294f8a782c00`

- BaseWindow
- Parent and child windows
- Modal windows
- Platform notices
- Resource management
- Class: BaseWindow
- `new BaseWindow([options])`
- Instance Events
- Event: 'close'
- Event: 'closed'
- Event: 'query-session-end' _Windows_
- Event: 'session-end' _Windows_
- Event: 'blur'
- Event: 'focus'
- Event: 'show'
- Event: 'hide'
- Event: 'maximize'
- Event: 'unmaximize'
- Event: 'minimize'
- Event: 'restore'
- Event: 'will-resize' _macOS_ _Windows_
- Event: 'resize'
- Event: 'resized' _macOS_ _Windows_
- Event: 'will-move' _macOS_ _Windows_
- Event: 'move'
- Event: 'moved' _macOS_ _Windows_
- Event: 'enter-full-screen'
- Event: 'leave-full-screen'
- Event: 'always-on-top-changed'
- Event: 'app-command' _Windows_ _Linux_
- Event: 'swipe' _macOS_
- Event: 'rotate-gesture' _macOS_
- Event: 'sheet-begin' _macOS_
- Event: 'sheet-end' _macOS_
- Event: 'new-window-for-tab' _macOS_
- Event: 'system-context-menu' _Windows_ _Linux_
- Event: 'persisted-state-restored'
- Static Methods
- `BaseWindow.getAllWindows()`
- `BaseWindow.getFocusedWindow()`
- `BaseWindow.fromId(id)`
- `BaseWindow.clearPersistedState(name)`
- Instance Properties
- `win.id` _Readonly_
- `win.contentView`
- `win.tabbingIdentifier` _macOS_ _Readonly_
- `win.autoHideMenuBar` _Linux_ _Windows_
- `win.simpleFullScreen`
- `win.fullScreen`
- `win.focusable` _Windows_ _macOS_
- `win.visibleOnAllWorkspaces` _macOS_ _Linux_
- `win.shadow`
- `win.menuBarVisible` _Windows_ _Linux_
- `win.kiosk`
- `win.documentEdited` _macOS_
- `win.representedFilename` _macOS_
- `win.title`
- `win.minimizable` _macOS_ _Windows_
- `win.maximizable` _macOS_ _Windows_
- `win.fullScreenable`
- `win.resizable`
- `win.closable` _macOS_ _Windows_
- `win.movable` _macOS_ _Windows_
- `win.excludedFromShownWindowsMenu` _macOS_
- `win.accessibleTitle`
- `win.snapped` _Windows_ _Readonly_
- Instance Methods
- `win.setContentView(view)`
- `win.getContentView()`
- `win.destroy()`
- `win.close()`
- `win.focus()`
- `win.blur()`
- `win.isFocused()`
- `win.isDestroyed()`
- `win.show()`
- `win.showInactive()`
- `win.hide()`
- `win.isVisible()`
- `win.isModal()`
- `win.maximize()`
- `win.unmaximize()`
- `win.isMaximized()`
- `win.minimize()`
- `win.restore()`
- `win.isMinimized()`
- `win.setFullScreen(flag)`
- `win.isFullScreen()`
- `win.setSimpleFullScreen(flag)` _macOS_
- `win.isSimpleFullScreen()` _macOS_
- `win.isNormal()`
- `win.setAspectRatio(aspectRatio[, extraSize])`
- `win.setBackgroundColor(backgroundColor)`
- `win.previewFile(path[, displayName])` _macOS_
- `win.closeFilePreview()` _macOS_
- `win.setBounds(bounds[, animate])`
- `win.getBounds()`
- `win.getBackgroundColor()`
- `win.setContentBounds(bounds[, animate])`
- `win.getContentBounds()`
- `win.getNormalBounds()`
- `win.setEnabled(enable)`
- `win.isEnabled()`
- `win.setSize(width, height[, animate])`
- `win.getSize()`
- `win.setContentSize(width, height[, animate])`
- `win.getContentSize()`
- `win.setMinimumSize(width, height)`
- `win.getMinimumSize()`
- `win.setMaximumSize(width, height)`
- `win.getMaximumSize()`
- `win.setResizable(resizable)`
- `win.isResizable()`
- `win.setMovable(movable)` _macOS_ _Windows_
- `win.isMovable()` _macOS_ _Windows_
- `win.setMinimizable(minimizable)` _macOS_ _Windows_
- `win.isMinimizable()` _macOS_ _Windows_
- `win.setMaximizable(maximizable)` _macOS_ _Windows_
- `win.isMaximizable()` _macOS_ _Windows_
- `win.setFullScreenable(fullscreenable)`
- `win.isFullScreenable()`
- `win.setClosable(closable)` _macOS_ _Windows_
- `win.isClosable()` _macOS_ _Windows_
- `win.setHiddenInMissionControl(hidden)` _macOS_
- `win.isHiddenInMissionControl()` _macOS_
- `win.setAlwaysOnTop(flag[, level][, relativeLevel])`
- `win.isAlwaysOnTop()`
- `win.moveAbove(mediaSourceId)`
- `win.moveTop()`
- `win.center()`
- `win.setPosition(x, y[, animate])`
- `win.getPosition()`
- `win.setTitle(title)`
- `win.getTitle()`
- `win.setSheetOffset(offsetY[, offsetX])` _macOS_
- `win.flashFrame(flag)`
- `win.setSkipTaskbar(skip)` _macOS_ _Windows_
- `win.setKiosk(flag)`
- `win.isKiosk()`
- `win.isTabletMode()` _Windows_
- `win.getMediaSourceId()`
- `win.getNativeWindowHandle()`
- `win.hookWindowMessage(message, callback)` _Windows_
- `win.isWindowMessageHooked(message)` _Windows_
- `win.unhookWindowMessage(message)` _Windows_
- `win.unhookAllWindowMessages()` _Windows_
- `win.setRepresentedFilename(filename)` _macOS_
- `win.getRepresentedFilename()` _macOS_
- `win.setDocumentEdited(edited)` _macOS_
- `win.isDocumentEdited()` _macOS_
- `win.setMenu(menu)` _Linux_ _Windows_
- `win.removeMenu()` _Linux_ _Windows_
- `win.setProgressBar(progress[, options])`
- `win.setOverlayIcon(overlay, description)` _Windows_
- `win.invalidateShadow()` _macOS_
- `win.setHasShadow(hasShadow)`
- `win.hasShadow()`
- `win.setOpacity(opacity)` _Windows_ _macOS_
- `win.getOpacity()`
- `win.setShape(rects)` _Windows_ _Linux_ _Experimental_
- `win.setThumbarButtons(buttons)` _Windows_
- `win.setThumbnailClip(region)` _Windows_
- `win.setThumbnailToolTip(toolTip)` _Windows_
- `win.setAppDetails(options)` _Windows_
- `win.setAccentColor(accentColor)` _Windows_
- `win.getAccentColor()` _Windows_
- `win.setIcon(icon)` _Windows_ _Linux_
- `win.setWindowButtonVisibility(visible)` _macOS_
- `win.setAutoHideMenuBar(hide)` _Windows_ _Linux_
- `win.isMenuBarAutoHide()` _Windows_ _Linux_
- `win.setMenuBarVisibility(visible)` _Windows_ _Linux_
- `win.isMenuBarVisible()` _Windows_ _Linux_
- `win.isSnapped()` _Windows_
- `win.setVisibleOnAllWorkspaces(visible[, options])` _macOS_ _Linux_
- `win.isVisibleOnAllWorkspaces()` _macOS_ _Linux_
- `win.setIgnoreMouseEvents(ignore[, options])`
- `win.setContentProtection(enable)` _macOS_ _Windows_
- `win.isContentProtected()` _macOS_ _Windows_
- `win.setFocusable(focusable)` _macOS_ _Windows_
- `win.isFocusable()` _macOS_ _Windows_
- `win.setParentWindow(parent)`
- `win.getParentWindow()`
- `win.getChildWindows()`
- `win.setAutoHideCursor(autoHide)` _macOS_
- `win.selectPreviousTab()` _macOS_
- `win.selectNextTab()` _macOS_
- `win.showAllTabs()` _macOS_
- `win.mergeAllWindows()` _macOS_
- `win.moveTabToNewWindow()` _macOS_
- `win.toggleTabBar()` _macOS_
- `win.addTabbedWindow(baseWindow)` _macOS_
- `win.setVibrancy(type)` _macOS_
- `win.setBackgroundMaterial(material)` _Windows_
- `win.setWindowButtonPosition(position)` _macOS_
- `win.getWindowButtonPosition()` _macOS_
- `win.setTouchBar(touchBar)` _macOS_
- `win.setTitleBarOverlay(options)` _Windows_ _Linux_

<a id="browser-view"></a>

## browser-view.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/browser-view.md) · Git blob: `568f74175b56aa64f7446ae5b360781baef2cd28`

- BrowserView
- Class: BrowserView
- Example
- `new BrowserView([options])` _Deprecated_
- Instance Properties
- `view.webContents` _Deprecated_
- Instance Methods
- `view.setAutoResize(options)` _Deprecated_
- `view.setBounds(bounds)` _Deprecated_
- `view.getBounds()` _Deprecated_
- `view.setBackgroundColor(color)` _Deprecated_

<a id="browser-window"></a>

## browser-window.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/browser-window.md) · Git blob: `f1a60125e1279d4e21ed196dc8c552275bf13a52`

- BrowserWindow
- Window customization
- Showing the window gracefully
- Using the `ready-to-show` event
- Setting the `backgroundColor` property
- Parent and child windows
- Modal windows
- Page visibility
- Platform notices
- Class: BrowserWindow extends `BaseWindow`
- `new BrowserWindow([options])`
- Instance Events
- Event: 'page-title-updated'
- Event: 'close'
- Event: 'closed'
- Event: 'query-session-end' _Windows_
- Event: 'session-end' _Windows_
- Event: 'unresponsive'
- Event: 'responsive'
- Event: 'blur'
- Event: 'focus'
- Event: 'show'
- Event: 'hide'
- Event: 'ready-to-show'
- Event: 'maximize'
- Event: 'unmaximize'
- Event: 'minimize'
- Event: 'restore'
- Event: 'will-resize' _macOS_ _Windows_
- Event: 'resize'
- Event: 'resized' _macOS_ _Windows_
- Event: 'will-move' _macOS_ _Windows_
- Event: 'move'
- Event: 'moved' _macOS_ _Windows_
- Event: 'enter-full-screen'
- Event: 'leave-full-screen'
- Event: 'enter-html-full-screen'
- Event: 'leave-html-full-screen'
- Event: 'always-on-top-changed'
- Event: 'app-command' _Windows_ _Linux_
- Event: 'swipe' _macOS_
- Event: 'rotate-gesture' _macOS_
- Event: 'sheet-begin' _macOS_
- Event: 'sheet-end' _macOS_
- Event: 'new-window-for-tab' _macOS_
- Event: 'system-context-menu' _Windows_ _Linux_
- Static Methods
- `BrowserWindow.getAllWindows()`
- `BrowserWindow.getFocusedWindow()`
- `BrowserWindow.fromWebContents(webContents)`
- `BrowserWindow.fromBrowserView(browserView)` _Deprecated_
- `BrowserWindow.fromId(id)`
- Instance Properties
- `win.webContents` _Readonly_
- `win.id` _Readonly_
- `win.tabbingIdentifier` _macOS_ _Readonly_
- `win.autoHideMenuBar` _Linux_ _Windows_
- `win.simpleFullScreen`
- `win.fullScreen`
- `win.focusable` _Windows_ _macOS_
- `win.visibleOnAllWorkspaces` _macOS_ _Linux_
- `win.shadow`
- `win.menuBarVisible` _Windows_ _Linux_
- `win.kiosk`
- `win.documentEdited` _macOS_
- `win.representedFilename` _macOS_
- `win.title`
- `win.minimizable` _macOS_ _Windows_
- `win.maximizable` _macOS_ _Windows_
- `win.fullScreenable`
- `win.resizable`
- `win.closable` _macOS_ _Windows_
- `win.movable` _macOS_ _Windows_
- `win.excludedFromShownWindowsMenu` _macOS_
- `win.accessibleTitle`
- `win.snapped` _Windows_ _Readonly_
- Instance Methods
- `win.destroy()`
- `win.close()`
- `win.focus()`
- `win.blur()`
- `win.isFocused()`
- `win.isDestroyed()`
- `win.show()`
- `win.showInactive()`
- `win.hide()`
- `win.isVisible()`
- `win.isModal()`
- `win.maximize()`
- `win.unmaximize()`
- `win.isMaximized()`
- `win.minimize()`
- `win.restore()`
- `win.isMinimized()`
- `win.setFullScreen(flag)`
- `win.isFullScreen()`
- `win.setSimpleFullScreen(flag)` _macOS_
- `win.isSimpleFullScreen()` _macOS_
- `win.isNormal()`
- `win.setAspectRatio(aspectRatio[, extraSize])`
- `win.setBackgroundColor(backgroundColor)`
- `win.previewFile(path[, displayName])` _macOS_
- `win.closeFilePreview()` _macOS_
- `win.setBounds(bounds[, animate])`
- `win.getBounds()`
- `win.getBackgroundColor()`
- `win.setContentBounds(bounds[, animate])`
- `win.getContentBounds()`
- `win.getNormalBounds()`
- `win.setEnabled(enable)`
- `win.isEnabled()`
- `win.setSize(width, height[, animate])`
- `win.getSize()`
- `win.setContentSize(width, height[, animate])`
- `win.getContentSize()`
- `win.setMinimumSize(width, height)`
- `win.getMinimumSize()`
- `win.setMaximumSize(width, height)`
- `win.getMaximumSize()`
- `win.setResizable(resizable)`
- `win.isResizable()`
- `win.setMovable(movable)` _macOS_ _Windows_
- `win.isMovable()` _macOS_ _Windows_
- `win.setMinimizable(minimizable)` _macOS_ _Windows_
- `win.isMinimizable()` _macOS_ _Windows_
- `win.setMaximizable(maximizable)` _macOS_ _Windows_
- `win.isMaximizable()` _macOS_ _Windows_
- `win.setFullScreenable(fullscreenable)`
- `win.isFullScreenable()`
- `win.setClosable(closable)` _macOS_ _Windows_
- `win.isClosable()` _macOS_ _Windows_
- `win.setHiddenInMissionControl(hidden)` _macOS_
- `win.isHiddenInMissionControl()` _macOS_
- `win.setAlwaysOnTop(flag[, level][, relativeLevel])`
- `win.isAlwaysOnTop()`
- `win.moveAbove(mediaSourceId)`
- `win.moveTop()`
- `win.center()`
- `win.setPosition(x, y[, animate])`
- `win.getPosition()`
- `win.setTitle(title)`
- `win.getTitle()`
- `win.setSheetOffset(offsetY[, offsetX])` _macOS_
- `win.flashFrame(flag)`
- `win.setSkipTaskbar(skip)` _macOS_ _Windows_
- `win.setKiosk(flag)`
- `win.isKiosk()`
- `win.isTabletMode()` _Windows_
- `win.getMediaSourceId()`
- `win.getNativeWindowHandle()`
- `win.hookWindowMessage(message, callback)` _Windows_
- `win.isWindowMessageHooked(message)` _Windows_
- `win.unhookWindowMessage(message)` _Windows_
- `win.unhookAllWindowMessages()` _Windows_
- `win.setRepresentedFilename(filename)` _macOS_
- `win.getRepresentedFilename()` _macOS_
- `win.setDocumentEdited(edited)` _macOS_
- `win.isDocumentEdited()` _macOS_
- `win.focusOnWebView()`
- `win.blurWebView()`
- `win.capturePage([rect, opts])`
- `win.loadURL(url[, options])`
- `win.loadFile(filePath[, options])`
- `win.reload()`
- `win.setMenu(menu)` _Linux_ _Windows_
- `win.removeMenu()` _Linux_ _Windows_
- `win.setProgressBar(progress[, options])`
- `win.setOverlayIcon(overlay, description)` _Windows_
- `win.invalidateShadow()` _macOS_
- `win.setHasShadow(hasShadow)`
- `win.hasShadow()`
- `win.setOpacity(opacity)`
- `win.getOpacity()`
- `win.setShape(rects)` _Windows_ _Linux_ _Experimental_
- `win.setThumbarButtons(buttons)` _Windows_
- `win.setThumbnailClip(region)` _Windows_
- `win.setThumbnailToolTip(toolTip)` _Windows_
- `win.setAppDetails(options)` _Windows_
- `win.setAccentColor(accentColor)` _Windows_
- `win.getAccentColor()` _Windows_
- `win.showDefinitionForSelection()` _macOS_
- `win.setIcon(icon)` _Windows_ _Linux_
- `win.setWindowButtonVisibility(visible)` _macOS_
- `win.setAutoHideMenuBar(hide)` _Windows_ _Linux_
- `win.isMenuBarAutoHide()` _Windows_ _Linux_
- `win.setMenuBarVisibility(visible)` _Windows_ _Linux_
- `win.isMenuBarVisible()` _Windows_ _Linux_
- `win.isSnapped()` _Windows_
- `win.setVisibleOnAllWorkspaces(visible[, options])` _macOS_ _Linux_
- `win.isVisibleOnAllWorkspaces()` _macOS_ _Linux_
- `win.setIgnoreMouseEvents(ignore[, options])`
- `win.setContentProtection(enable)` _macOS_ _Windows_
- `win.isContentProtected()` _macOS_ _Windows_
- `win.setFocusable(focusable)` _macOS_ _Windows_
- `win.isFocusable()` _macOS_ _Windows_
- `win.setParentWindow(parent)`
- `win.getParentWindow()`
- `win.getChildWindows()`
- `win.setAutoHideCursor(autoHide)` _macOS_
- `win.selectPreviousTab()` _macOS_
- `win.selectNextTab()` _macOS_
- `win.showAllTabs()` _macOS_
- `win.mergeAllWindows()` _macOS_
- `win.moveTabToNewWindow()` _macOS_
- `win.toggleTabBar()` _macOS_
- `win.addTabbedWindow(browserWindow)` _macOS_
- `win.setVibrancy(type[, options])` _macOS_
- `win.setBackgroundMaterial(material)` _Windows_
- `win.setWindowButtonPosition(position)` _macOS_
- `win.getWindowButtonPosition()` _macOS_
- `win.setTouchBar(touchBar)` _macOS_
- `win.setBrowserView(browserView)` _Deprecated_
- `win.getBrowserView()` _Deprecated_
- `win.addBrowserView(browserView)` _Deprecated_
- `win.removeBrowserView(browserView)` _Deprecated_
- `win.setTopBrowserView(browserView)` _Deprecated_
- `win.getBrowserViews()` _Deprecated_
- `win.setTitleBarOverlay(options)` _Windows_ _Linux_

<a id="client-request"></a>

## client-request.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/client-request.md) · Git blob: `0205346319d0593c7d9d1153c8e97f08648f0aab`

- Class: ClientRequest
- `new ClientRequest(options)`
- Instance Events
- Event: 'response'
- Event: 'login'
- Event: 'finish'
- Event: 'abort'
- Event: 'error'
- Event: 'close'
- Event: 'redirect'
- Instance Properties
- `request.chunkedEncoding`
- Instance Methods
- `request.setHeader(name, value)`
- `request.getHeader(name)`
- `request.removeHeader(name)`
- `request.write(chunk[, encoding][, callback])`
- `request.end([chunk][, encoding][, callback])`
- `request.abort()`
- `request.followRedirect()`
- `request.getUploadProgress()`

<a id="clipboard-item"></a>

## clipboard-item.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/clipboard-item.md) · Git blob: `aa324b583d287cab9fdabcbe71c6c688465874f6`

- ClipboardItem
- Class: ClipboardItem
- `new ClipboardItem(items)`
- Files: the `text/uri-list` MIME type
- Instance Properties
- `clipboardItem.types` _Readonly_
- Instance Methods
- `clipboardItem.getType<T extends string>(type)`
- `clipboardItem.getType(bookmark)`

<a id="clipboard"></a>

## clipboard.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/clipboard.md) · Git blob: `4077baf5f1b89cdd126a8690eb1f1940f93721b6`

- clipboard
- Methods
- `clipboard.readText()`
- `clipboard.writeText(text)`
- `clipboard.read()`
- `clipboard.write(data)`
- `clipboard.has(mimetype)`
- `clipboard.clear()`
- Properties
- `clipboard.selection` _Linux_ _Readonly_

<a id="command-line-switches"></a>

## command-line-switches.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/command-line-switches.md) · Git blob: `a4a032fb47e2cc048c788efa46736f4e5055daa5`

- Supported Command Line Switches
- Electron CLI Flags
- --auth-server-whitelist=`url`
- --auth-negotiate-delegate-whitelist=`url`
- --disable-ntlm-v2
- --disable-http-cache
- --disable-http2
- --disable-geolocation _macOS_
- --disable-renderer-backgrounding
- --disk-cache-size=`size`
- --enable-logging\[=file]
- --force-fieldtrials=`trials`
- --host-rules=`rules` _Deprecated_
- --host-resolver-rules=`rules`
- --ignore-certificate-errors
- --ignore-connections-limit=`domains`
- --js-flags=`flags`
- --lang
- --log-file=`path`
- --log-net-log=`path`
- --log-level=`N`
- --no-proxy-server
- --no-sandbox
- --no-stdio-init
- --proxy-bypass-list=`hosts`
- --proxy-pac-url=`url`
- --proxy-server=`address:port`
- --remote-debugging-port=`port`
- --v=`log_level`
- --vmodule=`pattern`
- --force_high_performance_gpu
- --force_low_power_gpu
- --xdg-portal-required-version=`version`
- Node.js Flags
- `--inspect-brk[=[host:]port]`
- `--inspect-brk-node[=[host:]port]`
- `--inspect-port=[host:]port`
- `--inspect[=[host:]port]`
- `--inspect-publish-uid=stderr,http`
- `--experimental-network-inspection`
- `--experimental-inspector-network-resource`
- `--no-deprecation`
- `--throw-deprecation`
- `--trace-deprecation`
- `--trace-warnings`
- `--dns-result-order=order`
- `--diagnostic-dir=directory`
- `--no-experimental-global-navigator`
- `--experimental-transform-types`
- Chromium Flags
- Chromium features relevant to Electron apps

<a id="command-line"></a>

## command-line.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/command-line.md) · Git blob: `e424ba1f1c498c02643a4d289eafb7d33e2936ab`

- Class: CommandLine
- Instance Methods
- `commandLine.appendSwitch(switch[, value])`
- `commandLine.appendArgument(value)`
- `commandLine.hasSwitch(switch)`
- `commandLine.getSwitchValue(switch)`
- `commandLine.removeSwitch(switch)`

<a id="content-tracing"></a>

## content-tracing.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/content-tracing.md) · Git blob: `33540c53d8d18f96e4a26c7f2f931de277f03281`

- contentTracing
- Methods
- `contentTracing.getCategories()`
- `contentTracing.startRecording(options)`
- `contentTracing.stopRecording([resultFilePath])`
- `contentTracing.getTraceBufferUsage()`

<a id="context-bridge"></a>

## context-bridge.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/context-bridge.md) · Git blob: `d5bddc8526c0cf7d60f5efdb24547e9af4646a62`

- contextBridge
- Glossary
- Main World
- Isolated World
- Methods
- `contextBridge.exposeInMainWorld(apiKey, api)`
- `contextBridge.exposeInIsolatedWorld(worldId, apiKey, api)`
- `contextBridge.executeInMainWorld(executionScript)` _Experimental_
- Usage
- API
- API Functions
- Parameter / Error / Return Type support
- Exposing ipcRenderer
- Exposing Node Global Symbols

<a id="cookies"></a>

## cookies.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/cookies.md) · Git blob: `985a2ac9e85436b4a9b8fa9df0d757196edafacc`

- Class: Cookies
- Instance Events
- Event: 'changed'
- Instance Methods
- `cookies.get(filter)`
- `cookies.set(details)`
- `cookies.remove(url, name)`
- `cookies.flushStore()`

<a id="corner-smoothing-css"></a>

## corner-smoothing-css.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/corner-smoothing-css.md) · Git blob: `f9c1ec53dc3b0789debc22a780b9afb4218d65bb`

- CSS Rule: `-electron-corner-smoothing`
- Example
- Matching the system UI
- Controlling availability
- Formal reference

<a id="crash-reporter"></a>

## crash-reporter.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/crash-reporter.md) · Git blob: `5493fc476bdc793a3fa9b8bcb04de386af303084`

- crashReporter
- Methods
- `crashReporter.start(options)`
- `crashReporter.getLastCrashReport()`
- `crashReporter.getUploadedReports()`
- `crashReporter.getUploadToServer()`
- `crashReporter.setUploadToServer(uploadToServer)`
- `crashReporter.addExtraParameter(key, value)`
- `crashReporter.removeExtraParameter(key)`
- `crashReporter.getParameters()`
- In Node child processes
- `process.crashReporter.getParameters()`
- `process.crashReporter.addExtraParameter(key, value)`
- `process.crashReporter.removeExtraParameter(key)`
- Crash Report Payload

<a id="debugger"></a>

## debugger.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/debugger.md) · Git blob: `a404134b293b5ed6dc3c63482a529564eec1405f`

- Class: Debugger
- Instance Events
- Event: 'detach'
- Event: 'message'
- Instance Methods
- `debugger.attach([protocolVersion])`
- `debugger.isAttached()`
- `debugger.detach()`
- `debugger.sendCommand(method[, commandParams, sessionId])`

<a id="desktop-capturer"></a>

## desktop-capturer.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/desktop-capturer.md) · Git blob: `2e0ef601ff5d496f4a253c091f28b59afe1853f8`

- desktopCapturer
- Methods
- `desktopCapturer.getSources(options)`
- Caveats
- Linux
- macOS versions 14.2 or higher
- macOS versions 12.7.6 or lower

<a id="dialog"></a>

## dialog.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/dialog.md) · Git blob: `7a67346411a60d66e4bcc5d77aab8ccb5717b000`

- dialog
- Methods
- `dialog.showOpenDialogSync([window, ]options)`
- `dialog.showOpenDialog([window, ]options)`
- `dialog.showSaveDialogSync([window, ]options)`
- `dialog.showSaveDialog([window, ]options)`
- `dialog.showMessageBoxSync([window, ]options)`
- `dialog.showMessageBox([window, ]options)`
- `dialog.showErrorBox(title, content)`
- `dialog.showCertificateTrustDialog([window, ]options)` _macOS_ _Windows_
- Bookmarks array
- Sheets

<a id="dock"></a>

## dock.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/dock.md) · Git blob: `6ea2ac956cda0102cfcbf067be9173341e425d41`

- Class: Dock
- Instance Methods
- `dock.bounce([type])` _macOS_
- `dock.cancelBounce(id)` _macOS_
- `dock.downloadFinished(filePath)` _macOS_
- `dock.setBadge(text)` _macOS_
- `dock.getBadge()` _macOS_
- `dock.hide()` _macOS_
- `dock.show()` _macOS_
- `dock.isVisible()` _macOS_
- `dock.setMenu(menu)` _macOS_
- `dock.getMenu()` _macOS_
- `dock.setIcon(image)` _macOS_

<a id="download-item"></a>

## download-item.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/download-item.md) · Git blob: `0c18c99ad7b664f36fb3dec3635a1f210057d540`

- Class: DownloadItem
- Instance Events
- Event: 'updated'
- Event: 'done'
- Instance Methods
- `downloadItem.setSavePath(path)`
- `downloadItem.getSavePath()`
- `downloadItem.setSaveDialogOptions(options)`
- `downloadItem.getSaveDialogOptions()`
- `downloadItem.pause()`
- `downloadItem.isPaused()`
- `downloadItem.resume()`
- `downloadItem.canResume()`
- `downloadItem.cancel()`
- `downloadItem.getURL()`
- `downloadItem.getMimeType()`
- `downloadItem.hasUserGesture()`
- `downloadItem.getInitiatorOrigin()`
- `downloadItem.getFilename()`
- `downloadItem.getCurrentBytesPerSecond()`
- `downloadItem.getTotalBytes()`
- `downloadItem.getReceivedBytes()`
- `downloadItem.getPercentComplete()`
- `downloadItem.getContentDisposition()`
- `downloadItem.getState()`
- `downloadItem.getURLChain()`
- `downloadItem.getLastModifiedTime()`
- `downloadItem.getETag()`
- `downloadItem.getStartTime()`
- `downloadItem.getEndTime()`
- Instance Properties
- `downloadItem.savePath`

<a id="environment-variables"></a>

## environment-variables.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/environment-variables.md) · Git blob: `9f85353e16ee2c2336a9567c493fcbccb10a67d9`

- Environment Variables
- Production Variables
- `NODE_OPTIONS`
- `NODE_EXTRA_CA_CERTS`
- `GOOGLE_API_KEY`
- `ELECTRON_NO_ASAR`
- `ELECTRON_RUN_AS_NODE`
- `ELECTRON_NO_ATTACH_CONSOLE` _Windows_
- `ELECTRON_FORCE_WINDOW_MENU_BAR` _Linux_
- `ELECTRON_TRASH` _Linux_
- Development Variables
- `ELECTRON_ENABLE_LOGGING`
- `ELECTRON_LOG_FILE`
- `ELECTRON_DEBUG_NOTIFICATIONS`
- `ELECTRON_DEBUG_MSIX_UPDATER`
- `ELECTRON_DEBUG_DRAGGABLE_REGIONS` _Experimental_
- `ELECTRON_LOG_ASAR_READS`
- `ELECTRON_ENABLE_STACK_DUMPING`
- `ELECTRON_DEFAULT_ERROR_MODE` _Windows_
- `ELECTRON_OVERRIDE_DIST_PATH`
- `ELECTRON_INSTALL_PLATFORM`
- `ELECTRON_INSTALL_ARCH`

<a id="extensions-api"></a>

## extensions-api.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/extensions-api.md) · Git blob: `0e9a3eeda6918d9645f77a41d13e0e520cd36d2a`

- Class: Extensions
- Instance Events
- Event: 'extension-loaded'
- Event: 'extension-unloaded'
- Event: 'extension-ready'
- Instance Methods
- `extensions.loadExtension(path[, options])`
- `extensions.removeExtension(extensionId)`
- `extensions.getExtension(extensionId)`
- `extensions.getAllExtensions()`

<a id="extensions"></a>

## extensions.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/extensions.md) · Git blob: `aa7439c148a27ce3331d9e9174ff8f4debd58f37`

- Chrome Extension Support
- Loading extensions
- Supported Extensions APIs
- Supported Manifest Keys
- `chrome.devtools.inspectedWindow`
- `chrome.devtools.network`
- `chrome.devtools.panels`
- `chrome.extension`
- `chrome.management`
- `chrome.runtime`
- `chrome.scripting`
- `chrome.storage`
- `chrome.system.storage`
- `chrome.tabs`
- `chrome.webRequest`

<a id="global-shortcut"></a>

## global-shortcut.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/global-shortcut.md) · Git blob: `b7f0e27ff4d5206fccb9fbec0f16f0c2e581fa9b`

- globalShortcut
- Usage on Linux
- Methods
- `globalShortcut.register(accelerator, callback)`
- `globalShortcut.registerAll(accelerators, callback)`
- `globalShortcut.isRegistered(accelerator)`
- `globalShortcut.unregister(accelerator)`
- `globalShortcut.unregisterAll()`
- `globalShortcut.setSuspended(suspended)`
- `globalShortcut.isSuspended()`

<a id="image-view"></a>

## image-view.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/image-view.md) · Git blob: `80c4c8aea3d27eb63ac3b1f3d20e9cf4c9105627`

- ImageView
- Class: ImageView extends `View`
- `new ImageView()` _Experimental_
- Instance Methods
- `image.setImage(image)` _Experimental_

<a id="in-app-purchase"></a>

## in-app-purchase.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/in-app-purchase.md) · Git blob: `b14b4ef1ba3546561f9fd0a3031533844deb718d`

- inAppPurchase
- Events
- Event: 'transactions-updated'
- Methods
- `inAppPurchase.purchaseProduct(productID[, opts])`
- `inAppPurchase.getProducts(productIDs)`
- `inAppPurchase.canMakePayments()`
- `inAppPurchase.restoreCompletedTransactions()`
- `inAppPurchase.getReceiptURL()`
- `inAppPurchase.finishAllTransactions()`
- `inAppPurchase.finishTransactionByDate(date)`

<a id="incoming-message"></a>

## incoming-message.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/incoming-message.md) · Git blob: `5f498f40fa64cb1450cd5e9df8371ef76c969fbf`

- Class: IncomingMessage
- Instance Events
- Event: 'data'
- Event: 'end'
- Event: 'aborted'
- Event: 'error'
- Instance Properties
- `response.statusCode`
- `response.statusMessage`
- `response.headers`
- `response.httpVersion`
- `response.httpVersionMajor`
- `response.httpVersionMinor`
- `response.rawHeaders`

<a id="ipc-main-service-worker"></a>

## ipc-main-service-worker.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/ipc-main-service-worker.md) · Git blob: `08a9d63a98174e482a566b5836674de9cf3c22de`

- Class: IpcMainServiceWorker
- Instance Methods
- `ipcMainServiceWorker.on(channel, listener)`
- `ipcMainServiceWorker.once(channel, listener)`
- `ipcMainServiceWorker.removeListener(channel, listener)`
- `ipcMainServiceWorker.removeAllListeners([channel])`
- `ipcMainServiceWorker.handle(channel, listener)`
- `ipcMainServiceWorker.handleOnce(channel, listener)`
- `ipcMainServiceWorker.removeHandler(channel)`

<a id="ipc-main"></a>

## ipc-main.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/ipc-main.md) · Git blob: `b14b010f1339aba783d5c03315648c5bfb2912db`

- ipcMain
- Sending messages
- Methods
- `ipcMain.on(channel, listener)`
- `ipcMain.off(channel, listener)`
- `ipcMain.once(channel, listener)`
- `ipcMain.addListener(channel, listener)`
- `ipcMain.removeListener(channel, listener)`
- `ipcMain.removeAllListeners([channel])`
- `ipcMain.handle(channel, listener)`
- `ipcMain.handleOnce(channel, listener)`
- `ipcMain.removeHandler(channel)`

<a id="ipc-renderer"></a>

## ipc-renderer.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/ipc-renderer.md) · Git blob: `9438da81268d4b579fbd7adb594fe149ef53aab7`

- ipcRenderer
- Methods
- `ipcRenderer.on(channel, listener)`
- `ipcRenderer.off(channel, listener)`
- `ipcRenderer.once(channel, listener)`
- `ipcRenderer.addListener(channel, listener)`
- `ipcRenderer.removeListener(channel, listener)`
- `ipcRenderer.removeAllListeners([channel])`
- `ipcRenderer.send(channel, ...args)`
- `ipcRenderer.invoke(channel, ...args)`
- `ipcRenderer.sendSync(channel, ...args)`
- `ipcRenderer.postMessage(channel, message, [transfer])`
- `ipcRenderer.sendToHost(channel, ...args)`

<a id="language-model-utility"></a>

## language-model-utility.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/language-model-utility.md) · Git blob: `c81e1eee57126802aec9e80ec2aca601daa7a887`

- Class: LanguageModelUtility
- `new LanguageModelUtility(initialState)`
- Static Methods
- `LanguageModelUtility.create(options)` _Experimental_
- `LanguageModelUtility.availability([options])` _Experimental_
- Instance Properties
- `languageModelUtility.contextUsage` _Experimental_
- `languageModelUtility.contextWindow` _Experimental_
- Instance Methods
- `languageModelUtility.prompt(input, options)` _Experimental_
- `languageModelUtility.append(input, options)` _Experimental_
- `languageModelUtility.measureContextUsage(input, options)` _Experimental_
- `languageModelUtility.clone(options)` _Experimental_
- `languageModelUtility.destroy()` _Experimental_

<a id="local-ai-handler"></a>

## local-ai-handler.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/local-ai-handler.md) · Git blob: `8d8d647c852ce49dc643c194ba5676113f00b4a2`

- localAIHandler
- Methods
- `localAIHandler.setPromptAPIHandler(promptAPIHandler)` _Experimental_

<a id="menu-item"></a>

## menu-item.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/menu-item.md) · Git blob: `008ed1ff4952538b47a96abc6d5b95b48badfa2b`

- MenuItem
- Class: MenuItem
- `new MenuItem(options)`
- Instance Properties
- `menuItem.id`
- `menuItem.label`
- `menuItem.accessibilityLabel` _macOS_
- `menuItem.click`
- `menuItem.submenu`
- `menuItem.type`
- `menuItem.role`
- `menuItem.accelerator`
- `menuItem.userAccelerator` _Readonly_ _macOS_
- `menuItem.icon`
- `menuItem.sublabel`
- `menuItem.toolTip` _macOS_
- `menuItem.enabled`
- `menuItem.visible`
- `menuItem.checked`
- `menuItem.registerAccelerator` _Linux_ _Windows_
- `menuItem.sharingItem` _macOS_
- `menuItem.commandId`
- `menuItem.menu`
- `menuItem.badge` _macOS_

<a id="menu"></a>

## menu.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/menu.md) · Git blob: `4730ba2cf39b40b35b21883b6c22c15fccc76a75`

- Menu
- Class: Menu
- `new Menu()`
- Static Methods
- `Menu.setApplicationMenu(menu)`
- `Menu.getApplicationMenu()`
- `Menu.setHighlightColors(options)` _Windows_
- `Menu.sendActionToFirstResponder(action)` _macOS_
- `Menu.buildFromTemplate(template)`
- Instance Methods
- `menu.popup([options])`
- `menu.closePopup([window])`
- `menu.append(menuItem)`
- `menu.getMenuItemById(id)`
- `menu.insert(pos, menuItem)`
- Instance Events
- Event: 'menu-will-show'
- Event: 'menu-will-close'
- Instance Properties
- `menu.items`

<a id="message-channel-main"></a>

## message-channel-main.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/message-channel-main.md) · Git blob: `9825fea47453a0d5d7f704042ff6aa3fda70956f`

- MessageChannelMain
- Class: MessageChannelMain
- Instance Properties
- `channel.port1`
- `channel.port2`

<a id="message-port-main"></a>

## message-port-main.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/message-port-main.md) · Git blob: `371d358f94cb0268ed7d1fa60d67bbed7a20c0a5`

- MessagePortMain
- Class: MessagePortMain
- Instance Methods
- `port.postMessage(message, [transfer])`
- `port.start()`
- `port.close()`
- Instance Events
- Event: 'message'
- Event: 'close'

<a id="native-image"></a>

## native-image.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/native-image.md) · Git blob: `425eaa92939544efc3310f545b9f6f74cf47bb39`

- nativeImage
- Supported Formats
- High Resolution Image
- Template Image _macOS_
- Methods
- `nativeImage.createEmpty()`
- `nativeImage.createThumbnailFromPath(path, size)` _macOS_ _Windows_
- `nativeImage.createFromPath(path)`
- `nativeImage.createFromBitmap(buffer, options)`
- `nativeImage.createFromBuffer(buffer[, options])`
- `nativeImage.createFromDataURL(dataURL)`
- `nativeImage.createFromNamedImage(imageName[, options])` _macOS_
- `nativeImage.createMenuSymbol(imageName)` _macOS_
- Class: NativeImage
- Instance Methods
- `image.toPNG([options])`
- `image.toJPEG(quality)`
- `image.toBitmap([options])`
- `image.toDataURL([options])`
- `image.getBitmap([options])` _Deprecated_
- `image.getNativeHandle()` _macOS_
- `image.isEmpty()`
- `image.getSize([scaleFactor])`
- `image.setTemplateImage(option)`
- `image.isTemplateImage()`
- `image.crop(rect)`
- `image.resize(options)`
- `image.getAspectRatio([scaleFactor])`
- `image.getScaleFactors()`
- `image.addRepresentation(options)`
- Instance Properties
- `nativeImage.isMacTemplateImage` _macOS_

<a id="native-theme"></a>

## native-theme.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/native-theme.md) · Git blob: `c587cb8ca263181c289f314ec4366803b91f70f4`

- nativeTheme
- Events
- Event: 'updated'
- Properties
- `nativeTheme.shouldUseDarkColors` _Readonly_
- `nativeTheme.themeSource`
- `nativeTheme.shouldUseHighContrastColors` _macOS_ _Windows_ _Readonly_
- `nativeTheme.shouldUseDarkColorsForSystemIntegratedUI` _macOS_ _Windows_ _Readonly_
- `nativeTheme.shouldUseInvertedColorScheme` _macOS_ _Windows_ _Readonly_
- `nativeTheme.inForcedColorsMode` _Windows_ _Readonly_
- `nativeTheme.prefersReducedTransparency` _Readonly_
- `nativeTheme.shouldDifferentiateWithoutColor` _macOS_ _Readonly_

<a id="navigation-history"></a>

## navigation-history.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/navigation-history.md) · Git blob: `098279bdb4c26d1ef6bcd08f43c159e5516a48ed`

- Class: NavigationHistory
- Instance Methods
- `navigationHistory.canGoBack()`
- `navigationHistory.canGoForward()`
- `navigationHistory.canGoToOffset(offset)`
- `navigationHistory.clear()`
- `navigationHistory.getActiveIndex()`
- `navigationHistory.getEntryAtIndex(index)`
- `navigationHistory.goBack()`
- `navigationHistory.goForward()`
- `navigationHistory.goToIndex(index)`
- `navigationHistory.goToOffset(offset)`
- `navigationHistory.length()`
- `navigationHistory.removeEntryAtIndex(index)`
- `navigationHistory.getAllEntries()`
- `navigationHistory.restore(options)`

<a id="net-log"></a>

## net-log.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/net-log.md) · Git blob: `96facc7621b1e037d380b43375cfb9d5083315c8`

- netLog
- Methods
- `netLog.startLogging(path[, options])`
- `netLog.stopLogging()`
- Properties
- `netLog.currentlyLogging` _Readonly_

<a id="net"></a>

## net.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/net.md) · Git blob: `5bfc73666821411395aa7a4df4241bd87c5d72e1`

- net
- Methods
- `net.request(options)`
- `net.fetch(input[, init])`
- `net.isOnline()`
- `net.resolveHost(host, [options])`
- Properties
- `net.online` _Readonly_
- `net.WebSocket`

<a id="notification"></a>

## notification.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/notification.md) · Git blob: `bc8eacfaa3894ae6b2d04f7fee7773eeee8e445e`

- Notification
- Class: Notification
- Static Methods
- `Notification.isSupported()`
- `Notification.handleActivation(callback)` _Windows_
- `Notification.getHistory()` _macOS_
- `Notification.remove(id)` _macOS_
- `Notification.removeAll()` _macOS_
- `Notification.removeGroup(groupId)` _macOS_
- `new Notification([options])`
- Instance Events
- Event: 'show'
- Event: 'click'
- Event: 'close'
- Event: 'reply' _macOS_ _Windows_
- Event: 'action'
- Event: 'failed' _macOS_ _Windows_
- Instance Methods
- `notification.show()`
- `notification.close()`
- Instance Properties
- `notification.id` _macOS_ _Windows_ _Readonly_
- `notification.groupId` _macOS_ _Windows_ _Readonly_
- `notification.groupTitle` _Windows_ _Readonly_
- `notification.title`
- `notification.subtitle`
- `notification.body`
- `notification.replyPlaceholder`
- `notification.sound`
- `notification.closeButtonText`
- `notification.silent`
- `notification.hasReply`
- `notification.urgency` _Linux_
- `notification.timeoutType` _Linux_ _Windows_
- `notification.actions`
- `notification.toastXml` _Windows_
- Playing Sounds

<a id="parent-port"></a>

## parent-port.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/parent-port.md) · Git blob: `4b181b474b9337bdfd8d87bde7554047eb39127b`

- parentPort
- Events
- Event: 'message'
- Methods
- `parentPort.postMessage(message)`

<a id="power-monitor"></a>

## power-monitor.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/power-monitor.md) · Git blob: `83289e0739123aebf8f32095f243746932e91409`

- powerMonitor
- Events
- Event: 'suspend'
- Event: 'resume'
- Event: 'on-ac' _macOS_ _Windows_
- Event: 'on-battery' _macOS_  _Windows_
- Event: 'thermal-state-change' _macOS_
- Event: 'speed-limit-change' _macOS_ _Windows_
- Event: 'shutdown' _Linux_ _macOS_
- Event: 'lock-screen' _macOS_ _Windows_
- Event: 'unlock-screen' _macOS_ _Windows_
- Event: 'user-did-become-active' _macOS_
- Event: 'user-did-resign-active' _macOS_
- Methods
- `powerMonitor.getSystemIdleState(idleThreshold)`
- `powerMonitor.getSystemIdleTime()`
- `powerMonitor.getCurrentThermalState()` _macOS_
- `powerMonitor.isOnBatteryPower()`
- Properties
- `powerMonitor.onBatteryPower`

<a id="power-save-blocker"></a>

## power-save-blocker.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/power-save-blocker.md) · Git blob: `348a6b78907a603e65333bc4e035440ccd13f8ba`

- powerSaveBlocker
- Methods
- `powerSaveBlocker.start(type)`
- `powerSaveBlocker.stop(id)`
- `powerSaveBlocker.isStarted(id)`

<a id="process"></a>

## process.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/process.md) · Git blob: `2c1161d9b66b3df4916f104700dfcf104711d730`

- process
- Sandbox
- Events
- Event: 'loaded'
- Properties
- `process.defaultApp` _Readonly_
- `process.isMainFrame` _Readonly_
- `process.mas` _Readonly_
- `process.noAsar`
- `process.noDeprecation`
- `process.resourcesPath` _Readonly_
- `process.sandboxed` _Readonly_
- `process.contextIsolated` _Readonly_
- `process.throwDeprecation`
- `process.traceDeprecation`
- `process.traceProcessWarnings`
- `process.type` _Readonly_
- `process.versions.chrome` _Readonly_
- `process.versions.electron` _Readonly_
- `process.windowsStore` _Readonly_
- `process.contextId` _Readonly_
- `process.parentPort`
- Methods
- `process.crash()`
- `process.getCreationTime()`
- `process.getCPUUsage()`
- `process.getHeapStatistics()`
- `process.getBlinkMemoryInfo()`
- `process.getProcessMemoryInfo()`
- `process.getSystemMemoryInfo()`
- `process.getSystemVersion()`
- `process.takeHeapSnapshot(filePath)`
- `process.hang()`
- `process.setFdLimit(maxDescriptors)` _macOS_ _Linux_

<a id="protocol"></a>

## protocol.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/protocol.md) · Git blob: `ce408076ae194fc1a5cfff987429fd20d6bbf1cb`

- protocol
- Using `protocol` with a custom `partition` or `session`
- Protocol names
- Methods
- `protocol.registerSchemesAsPrivileged(customSchemes)`
- `protocol.handle(scheme, handler)`
- `protocol.unhandle(scheme)`
- `protocol.registerSource(scheme, source)` _Experimental_
- `protocol.getSource(scheme)` _Experimental_
- `protocol.isProtocolHandled(scheme)`
- `protocol.registerFileProtocol(scheme, handler)` _Deprecated_
- `protocol.registerBufferProtocol(scheme, handler)` _Deprecated_
- `protocol.registerStringProtocol(scheme, handler)` _Deprecated_
- `protocol.registerHttpProtocol(scheme, handler)` _Deprecated_
- `protocol.registerStreamProtocol(scheme, handler)` _Deprecated_
- `protocol.unregisterProtocol(scheme)` _Deprecated_
- `protocol.isProtocolRegistered(scheme)` _Deprecated_
- `protocol.interceptFileProtocol(scheme, handler)` _Deprecated_
- `protocol.interceptStringProtocol(scheme, handler)` _Deprecated_
- `protocol.interceptBufferProtocol(scheme, handler)` _Deprecated_
- `protocol.interceptHttpProtocol(scheme, handler)` _Deprecated_
- `protocol.interceptStreamProtocol(scheme, handler)` _Deprecated_
- `protocol.uninterceptProtocol(scheme)` _Deprecated_
- `protocol.isProtocolIntercepted(scheme)` _Deprecated_

<a id="push-notifications"></a>

## push-notifications.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/push-notifications.md) · Git blob: `bec41e227f8816d5cfcdf60ec21e3adf4e422f27`

- pushNotifications
- Events
- Event: 'received-apns-notification' _macOS_
- Methods
- `pushNotifications.registerForAPNSNotifications()` _macOS_
- `pushNotifications.unregisterForAPNSNotifications()` _macOS_

<a id="safe-storage"></a>

## safe-storage.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/safe-storage.md) · Git blob: `9d64ea959c7d4058cd64e4e1d0bbb8ad617c6fff`

- safeStorage
- Platform-Specific Key Providers
- Synchronous API
- Asynchronous API
- Events
- Methods
- `safeStorage.isEncryptionAvailable()` _Deprecated_
- `safeStorage.isAsyncEncryptionAvailable()`
- `safeStorage.encryptString(plainText)` _Deprecated_
- `safeStorage.decryptString(encrypted)` _Deprecated_
- `safeStorage.encryptStringAsync(plainText)`
- `safeStorage.decryptStringAsync(encrypted)`
- `safeStorage.setUsePlainTextEncryption(usePlainText)`
- `safeStorage.getSelectedStorageBackend()` _Linux_

<a id="screen"></a>

## screen.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/screen.md) · Git blob: `d3411069af2fd31acf9fc80935056bbb41a8c800`

- screen
- Events
- Event: 'display-added'
- Event: 'display-removed'
- Event: 'display-metrics-changed'
- Methods
- `screen.getCursorScreenPoint()`
- `screen.getPrimaryDisplay()`
- `screen.getAllDisplays()`
- `screen.getDisplayNearestPoint(point)`
- `screen.getDisplayMatching(rect)`
- `screen.screenToDipPoint(point)` _Windows_ _Linux_
- `screen.dipToScreenPoint(point)` _Windows_ _Linux_
- `screen.screenToDipRect(window, rect)` _Windows_
- `screen.dipToScreenRect(window, rect)` _Windows_

<a id="service-worker-main"></a>

## service-worker-main.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/service-worker-main.md) · Git blob: `d51d65c9e351c98c0ff8c18d2caa77e2a0215f0f`

- Class: ServiceWorkerMain
- Instance Methods
- `serviceWorker.isDestroyed()` _Experimental_
- `serviceWorker.send(channel, ...args)` _Experimental_
- `serviceWorker.startTask()` _Experimental_
- Instance Properties
- `serviceWorker.ipc` _Readonly_ _Experimental_
- `serviceWorker.scope` _Readonly_ _Experimental_
- `serviceWorker.scriptURL` _Readonly_ _Experimental_
- `serviceWorker.versionId` _Readonly_ _Experimental_

<a id="service-workers"></a>

## service-workers.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/service-workers.md) · Git blob: `2132368b807796598d4e3e1ad2563e40047d531c`

- Class: ServiceWorkers
- Instance Events
- Event: 'console-message'
- Event: 'registration-completed'
- Event: 'running-status-changed' _Experimental_
- Instance Methods
- `serviceWorkers.getAllRunning()`
- `serviceWorkers.getInfoFromVersionID(versionId)`
- `serviceWorkers.getFromVersionID(versionId)` _Deprecated_
- `serviceWorkers.getWorkerFromVersionID(versionId)` _Experimental_
- `serviceWorkers.startWorkerForScope(scope)` _Experimental_

<a id="session"></a>

## session.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/session.md) · Git blob: `ac3117698aa1d888425aab3f96b4c0e46e952594`

- session
- Methods
- `session.fromPartition(partition[, options])`
- `session.fromPath(path[, options])`
- Properties
- `session.defaultSession`
- Class: Session
- Instance Events
- Event: 'will-download'
- Event: 'extension-loaded'
- Event: 'extension-unloaded'
- Event: 'extension-ready'
- Event: 'file-system-access-restricted'
- Event: 'preconnect'
- Event: 'spellcheck-dictionary-initialized'
- Event: 'spellcheck-dictionary-download-begin'
- Event: 'spellcheck-dictionary-download-success'
- Event: 'spellcheck-dictionary-download-failure'
- Event: 'select-hid-device'
- Event: 'hid-device-added'
- Event: 'hid-device-removed'
- Event: 'hid-device-revoked'
- Event: 'select-serial-port'
- Event: 'serial-port-added'
- Event: 'serial-port-removed'
- Event: 'serial-port-revoked'
- Event: 'select-usb-device'
- Event: 'usb-device-added'
- Event: 'usb-device-removed'
- Event: 'usb-device-revoked'
- Event: 'select-webauthn-authenticator' _macOS_
- Event: 'select-webauthn-account'
- Instance Methods
- `ses.getCacheSize()`
- `ses.clearCache()`
- `ses.clearStorageData([options])`
- `ses.flushStorageData()`
- `ses.setProxy(config)`
- `ses.resolveHost(host, [options])`
- `ses.resolveProxy(url)`
- `ses.forceReloadProxyConfig()`
- `ses.setDownloadPath(path)`
- `ses.enableNetworkEmulation(options)`
- `ses.preconnect(options)`
- `ses.closeAllConnections()`
- `ses.fetch(input[, init])`
- `ses.disableNetworkEmulation()`
- `ses.setCertificateVerifyProc(proc)`
- `ses.setPermissionRequestHandler(handler)`
- `ses.setPermissionCheckHandler(handler)`
- `ses.setDisplayMediaRequestHandler(handler[, opts])`
- `ses.setDevicePermissionHandler(handler)`
- `ses.setUSBProtectedClassesHandler(handler)`
- `ses.setBluetoothPairingHandler(handler)` _Windows_ _Linux_
- `ses.clearHostResolverCache()`
- `ses.allowNTLMCredentialsForDomains(domains)`
- `ses.setUserAgent(userAgent[, acceptLanguages])`
- `ses.isPersistent()`
- `ses.getUserAgent()`
- `ses.setSSLConfig(config)`
- `ses.getBlobData(identifier)`
- `ses.downloadURL(url[, options])`
- `ses.createInterruptedDownload(options)`
- `ses.clearAuthCache()`
- `ses.setPreloads(preloads)` _Deprecated_
- `ses.getPreloads()` _Deprecated_
- `ses.registerPreloadScript(script)`
- `ses.unregisterPreloadScript(id)`
- `ses.getPreloadScripts()`
- `ses.setCodeCachePath(path)`
- `ses.clearCodeCaches(options)`
- `ses.getSharedDictionaryUsageInfo()`
- `ses.getSharedDictionaryInfo(options)`
- `ses.clearSharedDictionaryCache()`
- `ses.clearSharedDictionaryCacheForIsolationKey(options)`
- `ses.setSpellCheckerEnabled(enable)`
- `ses.isSpellCheckerEnabled()`
- `ses.setSpellCheckerLanguages(languages)`
- `ses.getSpellCheckerLanguages()`
- `ses.setSpellCheckerDictionaryDownloadURL(url)`
- `ses.listWordsInSpellCheckerDictionary()`
- `ses.addWordToSpellCheckerDictionary(word)`
- `ses.removeWordFromSpellCheckerDictionary(word)`
- `ses.loadExtension(path[, options])` _Deprecated_
- `ses.removeExtension(extensionId)` _Deprecated_
- `ses.getExtension(extensionId)` _Deprecated_
- `ses.getAllExtensions()` _Deprecated_
- `ses.getStoragePath()`
- `ses.clearData([options])`
- `ses.registerLocalAIHandler(handler)` _Experimental_
- Instance Properties
- `ses.availableSpellCheckerLanguages` _Readonly_
- `ses.spellCheckerEnabled`
- `ses.storagePath` _Readonly_
- `ses.cookies` _Readonly_
- `ses.extensions` _Readonly_
- `ses.serviceWorkers` _Readonly_
- `ses.webRequest` _Readonly_
- `ses.protocol` _Readonly_
- `ses.netLog` _Readonly_

<a id="share-menu"></a>

## share-menu.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/share-menu.md) · Git blob: `cb5ee3d01709ffe9f7618c5aa4dd9b18faafc467`

- ShareMenu
- Class: ShareMenu
- `new ShareMenu(sharingItem)`
- Instance Methods
- `shareMenu.popup([options])`
- `shareMenu.closePopup([browserWindow])`

<a id="shared-texture"></a>

## shared-texture.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/shared-texture.md) · Git blob: `d49f596447e458ff1f935efcf79a706dcdab1186`

- sharedTexture
- Methods
- `sharedTexture.importSharedTexture(options)` _Experimental_
- `sharedTexture.sendSharedTexture(options, ...args)` _Experimental_
- `sharedTexture.setSharedTextureReceiver(callback)` _Experimental_
- Properties
- `sharedTexture.subtle` _Experimental_

<a id="shell"></a>

## shell.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/shell.md) · Git blob: `07f32c73fe43d079effd3bcdfd01a122e838b1b9`

- shell
- Methods
- `shell.showItemInFolder(fullPath)`
- `shell.openPath(path)`
- `shell.openExternal(url[, options])`
- `shell.trashItem(path)`
- `shell.beep()`
- `shell.writeShortcutLink(shortcutPath[, operation], options)` _Windows_
- `shell.readShortcutLink(shortcutPath)` _Windows_

<a id="system-preferences"></a>

## system-preferences.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/system-preferences.md) · Git blob: `876ce45e7da390f3c57dd4d353617c1b7f9cb5a0`

- systemPreferences
- Events
- Event: 'accent-color-changed' _Windows_ _Linux_
- Event: 'color-changed' _Windows_
- Methods
- `systemPreferences.isSwipeTrackingFromScrollEventsEnabled()` _macOS_
- `systemPreferences.postNotification(event, userInfo[, deliverImmediately])` _macOS_
- `systemPreferences.postLocalNotification(event, userInfo)` _macOS_
- `systemPreferences.postWorkspaceNotification(event, userInfo)` _macOS_
- `systemPreferences.subscribeNotification(event, callback)` _macOS_
- `systemPreferences.subscribeLocalNotification(event, callback)` _macOS_
- `systemPreferences.subscribeWorkspaceNotification(event, callback)` _macOS_
- `systemPreferences.unsubscribeNotification(id)` _macOS_
- `systemPreferences.unsubscribeLocalNotification(id)` _macOS_
- `systemPreferences.unsubscribeWorkspaceNotification(id)` _macOS_
- `systemPreferences.registerDefaults(defaults)` _macOS_
- `systemPreferences.getUserDefault<Type extends keyof UserDefaultTypes>(key, type)` _macOS_
- `systemPreferences.setUserDefault<Type extends keyof UserDefaultTypes>(key, type, value)` _macOS_
- `systemPreferences.removeUserDefault(key)` _macOS_
- `systemPreferences.getAccentColor()`
- `systemPreferences.getColor(color)` _Windows_ _macOS_
- `systemPreferences.getSystemColor(color)` _macOS_
- `systemPreferences.getEffectiveAppearance()` _macOS_
- `systemPreferences.canPromptTouchID()` _macOS_
- `systemPreferences.promptTouchID(reason)` _macOS_
- `systemPreferences.isTrustedAccessibilityClient(prompt)` _macOS_
- `systemPreferences.getMediaAccessStatus(mediaType)` _Windows_ _macOS_
- `systemPreferences.askForMediaAccess(mediaType)` _macOS_
- `systemPreferences.getAnimationSettings()`
- Properties
- `systemPreferences.accessibilityDisplayShouldReduceTransparency` _macOS_ _Deprecated_
- `systemPreferences.effectiveAppearance` _macOS_ _Readonly_

<a id="touch-bar-button"></a>

## touch-bar-button.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar-button.md) · Git blob: `4d9caaf4822f014e2f8bc6af5e839ffb97bd3b3b`

- Class: TouchBarButton
- `new TouchBarButton(options)`
- Instance Properties
- `touchBarButton.accessibilityLabel`
- `touchBarButton.label`
- `touchBarButton.backgroundColor`
- `touchBarButton.icon`
- `touchBarButton.iconPosition`
- `touchBarButton.enabled`

<a id="touch-bar-color-picker"></a>

## touch-bar-color-picker.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar-color-picker.md) · Git blob: `a80954adbb6a64da34f7d48317b1343ec892da29`

- Class: TouchBarColorPicker
- `new TouchBarColorPicker(options)`
- Instance Properties
- `touchBarColorPicker.availableColors`
- `touchBarColorPicker.selectedColor`

<a id="touch-bar-group"></a>

## touch-bar-group.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar-group.md) · Git blob: `a04b2279d0b5d2fbdca3c6c6857b3c781fb689cd`

- Class: TouchBarGroup
- `new TouchBarGroup(options)`

<a id="touch-bar-label"></a>

## touch-bar-label.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar-label.md) · Git blob: `c774fb804690b635710d5d66148b9bc0308b859f`

- Class: TouchBarLabel
- `new TouchBarLabel(options)`
- Instance Properties
- `touchBarLabel.label`
- `touchBarLabel.accessibilityLabel`
- `touchBarLabel.textColor`

<a id="touch-bar-other-items-proxy"></a>

## touch-bar-other-items-proxy.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar-other-items-proxy.md) · Git blob: `efad02d070c70319fd0ce523714b818c62992b28`

- Class: TouchBarOtherItemsProxy
- `new TouchBarOtherItemsProxy()`

<a id="touch-bar-popover"></a>

## touch-bar-popover.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar-popover.md) · Git blob: `2fae3b1af3f6e42f24c58e85d74c34cd986725d8`

- Class: TouchBarPopover
- `new TouchBarPopover(options)`
- Instance Properties
- `touchBarPopover.label`
- `touchBarPopover.icon`

<a id="touch-bar-scrubber"></a>

## touch-bar-scrubber.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar-scrubber.md) · Git blob: `a64f309c388f701718fc860db6b9a80b01ecbaaf`

- Class: TouchBarScrubber
- `new TouchBarScrubber(options)`
- Instance Properties
- `touchBarScrubber.items`
- `touchBarScrubber.selectedStyle`
- `touchBarScrubber.overlayStyle`
- `touchBarScrubber.showArrowButtons`
- `touchBarScrubber.mode`
- `touchBarScrubber.continuous`

<a id="touch-bar-segmented-control"></a>

## touch-bar-segmented-control.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar-segmented-control.md) · Git blob: `53d60622480d330d993ec6dad2fdf7926471fc0b`

- Class: TouchBarSegmentedControl
- `new TouchBarSegmentedControl(options)`
- Instance Properties
- `touchBarSegmentedControl.segmentStyle`
- `touchBarSegmentedControl.segments`
- `touchBarSegmentedControl.selectedIndex`
- `touchBarSegmentedControl.mode`

<a id="touch-bar-slider"></a>

## touch-bar-slider.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar-slider.md) · Git blob: `16036ffcf5b56435064178640bacf80980b57774`

- Class: TouchBarSlider
- `new TouchBarSlider(options)`
- Instance Properties
- `touchBarSlider.label`
- `touchBarSlider.value`
- `touchBarSlider.minValue`
- `touchBarSlider.maxValue`

<a id="touch-bar-spacer"></a>

## touch-bar-spacer.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar-spacer.md) · Git blob: `79f4a7bd5ecb42e05d3771f6a85d5f7cb12dbd88`

- Class: TouchBarSpacer
- `new TouchBarSpacer(options)`
- Instance Properties
- `touchBarSpacer.size`

<a id="touch-bar"></a>

## touch-bar.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/touch-bar.md) · Git blob: `2a94207a624ce5c7166f0fcd42729dfe1e536fc6`

- TouchBar
- Class: TouchBar
- `new TouchBar(options)`
- Static Properties
- `TouchBarButton`
- `TouchBarColorPicker`
- `TouchBarGroup`
- `TouchBarLabel`
- `TouchBarPopover`
- `TouchBarScrubber`
- `TouchBarSegmentedControl`
- `TouchBarSlider`
- `TouchBarSpacer`
- `TouchBarOtherItemsProxy`
- Instance Properties
- `touchBar.escapeItem`
- Examples
- Running the above example

<a id="tray"></a>

## tray.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/tray.md) · Git blob: `0c7c2e95ac0b85ffefac3a824caee52cc1b754c7`

- Tray
- Class: Tray
- `new Tray(image, [guid])`
- Instance Events
- Event: 'click'
- Event: 'right-click' _macOS_ _Windows_
- Event: 'double-click' _macOS_ _Windows_
- Event: 'middle-click' _Windows_
- Event: 'balloon-show' _Windows_
- Event: 'balloon-click' _Windows_
- Event: 'balloon-closed' _Windows_
- Event: 'drop' _macOS_
- Event: 'drop-files' _macOS_
- Event: 'drop-text' _macOS_
- Event: 'drag-enter' _macOS_
- Event: 'drag-leave' _macOS_
- Event: 'drag-end' _macOS_
- Event: 'mouse-up' _macOS_
- Event: 'mouse-down' _macOS_
- Event: 'mouse-enter' _macOS_ _Windows_
- Event: 'mouse-leave' _macOS_ _Windows_
- Event: 'mouse-move' _macOS_ _Windows_
- Instance Methods
- `tray.destroy()`
- `tray.setImage(image)`
- `tray.setPressedImage(image)` _macOS_
- `tray.setToolTip(toolTip)`
- `tray.setTitle(title[, options])` _macOS_
- `tray.getTitle()` _macOS_
- `tray.setIgnoreDoubleClickEvents(ignore)` _macOS_
- `tray.getIgnoreDoubleClickEvents()` _macOS_
- `tray.displayBalloon(options)` _Windows_
- `tray.removeBalloon()` _Windows_
- `tray.focus()` _Windows_
- `tray.popUpContextMenu([menu, position])` _macOS_ _Windows_
- `tray.closeContextMenu()` _macOS_ _Windows_
- `tray.setContextMenu(menu)`
- `tray.getBounds()` _macOS_ _Windows_
- `tray.getGUID()` _macOS_ _Windows_
- `tray.isDestroyed()`
- Platform considerations
- Linux
- macOS
- Windows

<a id="utility-process"></a>

## utility-process.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/utility-process.md) · Git blob: `ffa6ab0bd03601ef10ec7fb23d069295fc51b9e0`

- utilityProcess
- Methods
- `utilityProcess.fork(modulePath[, args][, options])`
- Class: UtilityProcess
- Instance Methods
- `child.postMessage(message, [transfer])`
- `child.kill()`
- Instance Properties
- `child.pid`
- `child.stdout`
- `child.stderr`
- Instance Events
- Event: 'spawn'
- Event: 'error' _Experimental_
- Event: 'exit'
- Event: 'message'
- Event: 'login'

<a id="view"></a>

## view.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/view.md) · Git blob: `c5367cdecf979de25176f71a0032d58c22ca400e`

- View
- Class: View
- `new View()`
- Instance Events
- Event: 'bounds-changed'
- Instance Methods
- `view.addChildView(view[, index])`
- `view.removeChildView(view)`
- `view.setBounds(bounds[, options])`
- `view.getBounds()`
- `view.setBackgroundColor(color)`
- `view.setBorderRadius(radius)`
- `view.setBackgroundBlur(blurRadius)`
- `view.setVisible(visible)`
- `view.getVisible()`
- Instance Properties
- `view.children` _Readonly_

<a id="web-contents-view"></a>

## web-contents-view.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/web-contents-view.md) · Git blob: `cae7dabfc563f19287217174aeaf44caf88cc59d`

- WebContentsView
- Class: WebContentsView extends `View`
- `new WebContentsView([options])`
- Instance Properties
- `view.webContents` _Readonly_

<a id="web-contents"></a>

## web-contents.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/web-contents.md) · Git blob: `dcac97b4892f06feaa046efc06ab3143bb14d788`

- webContents
- Navigation Events
- Document Navigations
- In-page Navigation
- Frame Navigation
- Methods
- `webContents.getAllWebContents()`
- `webContents.getFocusedWebContents()`
- `webContents.fromId(id)`
- `webContents.fromFrame(frame)`
- `webContents.fromDevToolsTargetId(targetId)`
- Class: WebContents
- Instance Events
- Event: 'did-finish-load'
- Event: 'did-fail-load'
- Event: 'did-fail-provisional-load'
- Event: 'did-frame-finish-load'
- Event: 'did-start-loading'
- Event: 'did-stop-loading'
- Event: 'dom-ready'
- Event: 'page-title-updated'
- Event: 'page-favicon-updated'
- Event: 'content-bounds-updated'
- Event: 'did-create-window'
- Event: 'will-navigate'
- Event: 'will-frame-navigate'
- Event: 'did-start-navigation'
- Event: 'will-redirect'
- Event: 'did-redirect-navigation'
- Event: 'did-navigate'
- Event: 'did-frame-navigate'
- Event: 'did-navigate-in-page'
- Event: 'will-prevent-unload'
- Event: 'render-process-gone'
- Event: 'unresponsive'
- Event: 'responsive'
- Event: 'destroyed'
- Event: 'input-event'
- Event: 'before-input-event'
- Event: 'before-mouse-event'
- Event: 'enter-html-full-screen'
- Event: 'leave-html-full-screen'
- Event: 'zoom-changed'
- Event: 'blur'
- Event: 'focus'
- Event: 'devtools-open-url'
- Event: 'devtools-search-query'
- Event: 'devtools-opened'
- Event: 'devtools-closed'
- Event: 'devtools-focused'
- Event: 'certificate-error'
- Event: 'select-client-certificate'
- Event: 'login'
- Event: 'found-in-page'
- Event: 'media-started-playing'
- Event: 'media-paused'
- Event: 'audio-state-changed'
- Event: 'did-change-theme-color'
- Event: 'update-target-url'
- Event: 'cursor-changed'
- Event: 'context-menu'
- Event: 'select-bluetooth-device'
- Event: 'paint'
- Event: 'devtools-reload-page'
- Event: 'will-attach-webview'
- Event: 'did-attach-webview'
- Event: 'console-message'
- Event: 'preload-error'
- Event: 'ipc-message'
- Event: 'ipc-message-sync'
- Event: 'preferred-size-changed'
- Event: 'frame-created'
- Instance Methods
- `contents.loadURL(url[, options])`
- `contents.loadFile(filePath[, options])`
- `contents.downloadURL(url[, options])`
- `contents.getURL()`
- `contents.getTitle()`
- `contents.isDestroyed()`
- `contents.close([opts])`
- `contents.focus()`
- `contents.isFocused()`
- `contents.isLoading()`
- `contents.isLoadingMainFrame()`
- `contents.isWaitingForResponse()`
- `contents.stop()`
- `contents.reload()`
- `contents.reloadIgnoringCache()`
- `contents.canGoBack()` _Deprecated_
- `contents.canGoForward()` _Deprecated_
- `contents.canGoToOffset(offset)` _Deprecated_
- `contents.clearHistory()` _Deprecated_
- `contents.goBack()` _Deprecated_
- `contents.goForward()` _Deprecated_
- `contents.goToIndex(index)` _Deprecated_
- `contents.goToOffset(offset)` _Deprecated_
- `contents.isCrashed()`
- `contents.forcefullyCrashRenderer()`
- `contents.setUserAgent(userAgent)`
- `contents.getUserAgent()`
- `contents.insertCSS(css[, options])`
- `contents.removeInsertedCSS(key)`
- `contents.executeJavaScript(code[, userGesture])`
- `contents.executeJavaScriptInIsolatedWorld(worldId, scripts[, userGesture])`
- `contents.setIgnoreMenuShortcuts(ignore)`
- `contents.setWindowOpenHandler(handler)`
- `contents.setAudioMuted(muted)`
- `contents.isAudioMuted()`
- `contents.isCurrentlyAudible()`
- `contents.setCaretBrowsingEnabled(enabled)`
- `contents.isCaretBrowsingEnabled()`
- `contents.setZoomFactor(factor)`
- `contents.getZoomFactor()`
- `contents.setZoomLevel(level)`
- `contents.getZoomLevel()`
- `contents.setZoomMode(mode)`
- `contents.getZoomMode()`
- `contents.setVisualZoomLevelLimits(minimumLevel, maximumLevel)`
- `contents.undo()`
- `contents.redo()`
- `contents.cut()`
- `contents.copy()`
- `contents.centerSelection()`
- `contents.copyImageAt(x, y)`
- `contents.copyVideoFrameAt(x, y)`
- `contents.saveVideoFrameAs(x, y)`
- `contents.paste()`
- `contents.pasteAndMatchStyle()`
- `contents.delete()`
- `contents.selectAll()`
- `contents.unselect()`
- `contents.scrollToTop()`
- `contents.scrollToBottom()`
- `contents.adjustSelection(options)`
- `contents.replace(text)`
- `contents.replaceMisspelling(text)`
- `contents.insertText(text)`
- `contents.findInPage(text[, options])`
- `contents.stopFindInPage(action)`
- `contents.capturePage([rect, opts])`
- `contents.isBeingCaptured()`
- `contents.getPrintersAsync()`
- `contents.print([options], [callback])`
- `contents.printToPDF(options)`
- `contents.addWorkSpace(path)`
- `contents.removeWorkSpace(path)`
- `contents.setDevToolsWebContents(devToolsWebContents)`
- `contents.openDevTools([options])`
- `contents.closeDevTools()`
- `contents.isDevToolsOpened()`
- `contents.isDevToolsFocused()`
- `contents.getDevToolsTitle()`
- `contents.setDevToolsTitle(title)`
- `contents.toggleDevTools()`
- `contents.inspectElement(x, y)`
- `contents.inspectSharedWorker()`
- `contents.inspectSharedWorkerById(workerId)`
- `contents.getAllSharedWorkers()`
- `contents.inspectServiceWorker()`
- `contents.send(channel, ...args)`
- `contents.sendToFrame(frameId, channel, ...args)`
- `contents.postMessage(channel, message, [transfer])`
- `contents.enableDeviceEmulation(parameters)`
- `contents.disableDeviceEmulation()`
- `contents.sendInputEvent(inputEvent)`
- `contents.beginFrameSubscription([onlyDirty ,]callback)`
- `contents.endFrameSubscription()`
- `contents.startDrag(item)`
- `contents.savePage(fullPath, saveType)`
- `contents.showDefinitionForSelection()` _macOS_
- `contents.isOffscreen()`
- `contents.startPainting()`
- `contents.stopPainting()`
- `contents.isPainting()`
- `contents.setFrameRate(fps)`
- `contents.getFrameRate()`
- `contents.invalidate()`
- `contents.getWebRTCIPHandlingPolicy()`
- `contents.setWebRTCIPHandlingPolicy(policy)`
- `contents.getWebRTCUDPPortRange()`
- `contents.setWebRTCUDPPortRange(udpPortRange)`
- `contents.getMediaSourceId(requestWebContents)`
- `contents.getOrCreateDevToolsTargetId()`
- `contents.getOSProcessId()`
- `contents.getProcessId()`
- `contents.clone()`
- `contents.takeHeapSnapshot(filePath)`
- `contents.getBackgroundThrottling()`
- `contents.setBackgroundThrottling(allowed)`
- `contents.getType()`
- `contents.setImageAnimationPolicy(policy)`
- Instance Properties
- `contents.ipc` _Readonly_
- `contents.audioMuted`
- `contents.caretBrowsingEnabled`
- `contents.userAgent`
- `contents.zoomLevel`
- `contents.zoomFactor`
- `contents.zoomMode`
- `contents.frameRate`
- `contents.id` _Readonly_
- `contents.session` _Readonly_
- `contents.navigationHistory` _Readonly_
- `contents.hostWebContents` _Readonly_
- `contents.devToolsWebContents` _Readonly_
- `contents.debugger` _Readonly_
- `contents.backgroundThrottling`
- `contents.mainFrame` _Readonly_
- `contents.opener` _Readonly_
- `contents.focusedFrame` _Readonly_

<a id="web-frame-main"></a>

## web-frame-main.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/web-frame-main.md) · Git blob: `9ee582c893a79e3a6439b0f00b2bffe2c1ea27b1`

- webFrameMain
- Methods
- `webFrameMain.fromId(processId, routingId)`
- `webFrameMain.fromFrameToken(processId, frameToken)`
- Class: WebFrameMain
- Instance Events
- Event: 'dom-ready'
- Instance Methods
- `frame.executeJavaScript(code[, userGesture])`
- `frame.reload()`
- `frame.isDestroyed()`
- `frame.send(channel, ...args)`
- `frame.postMessage(channel, message, [transfer])`
- `frame.collectJavaScriptCallStack()` _Experimental_
- `frame.copyVideoFrameAt(x, y)`
- `frame.saveVideoFrameAs(x, y)`
- `frame.printToPDF(options)`
- Instance Properties
- `frame.ipc` _Readonly_
- `frame.url` _Readonly_
- `frame.origin` _Readonly_
- `frame.top` _Readonly_
- `frame.parent` _Readonly_
- `frame.frames` _Readonly_
- `frame.framesInSubtree` _Readonly_
- `frame.frameTreeNodeId` _Readonly_
- `frame.name` _Readonly_
- `frame.frameToken` _Readonly_
- `frame.osProcessId` _Readonly_
- `frame.processId` _Readonly_
- `frame.routingId` _Readonly_
- `frame.visibilityState` _Readonly_
- `frame.detached` _Readonly_

<a id="web-frame"></a>

## web-frame.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/web-frame.md) · Git blob: `710d4153b432c6f2f673e75621396ef8af40546f`

- webFrame
- Methods
- `webFrame.setZoomFactor(factor)`
- `webFrame.getZoomFactor()`
- `webFrame.setZoomLevel(level)`
- `webFrame.getZoomLevel()`
- `webFrame.setVisualZoomLevelLimits(minimumLevel, maximumLevel)`
- `webFrame.setSpellCheckProvider(language, provider)`
- `webFrame.insertCSS(css[, options])`
- `webFrame.removeInsertedCSS(key)`
- `webFrame.insertText(text)`
- `webFrame.executeJavaScript(code[, userGesture][, callback])`
- `webFrame.executeJavaScriptInIsolatedWorld(worldId, scripts[, userGesture][, callback])`
- `webFrame.setIsolatedWorldInfo(worldId, info)`
- `webFrame.getIsolatedWorlds()`
- `webFrame.getResourceUsage()`
- `webFrame.clearCache()`
- `webFrame.getFrameForSelector(selector)`
- `webFrame.findFrameByName(name)`
- `webFrame.findFrameByRoutingId(routingId)` _Deprecated_
- `webFrame.findFrameByToken(frameToken)`
- `webFrame.isWordMisspelled(word)`
- `webFrame.getWordSuggestions(word)`
- Events
- Event: 'isolated-world-created'
- Properties
- `webFrame.top` _Readonly_
- `webFrame.opener` _Readonly_
- `webFrame.parent` _Readonly_
- `webFrame.firstChild` _Readonly_
- `webFrame.nextSibling` _Readonly_
- `webFrame.routingId` _Readonly_ _Deprecated_
- `webFrame.frameToken` _Readonly_

<a id="web-request"></a>

## web-request.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/web-request.md) · Git blob: `f15f821b34e703864581ac983737a82aab29bc72`

- Class: WebRequest
- Instance Methods
- `webRequest.onBeforeRequest([filter, ]listener)`
- `webRequest.onBeforeSendHeaders([filter, ]listener)`
- `webRequest.onSendHeaders([filter, ]listener)`
- `webRequest.onHeadersReceived([filter, ]listener)`
- `webRequest.onResponseStarted([filter, ]listener)`
- `webRequest.onBeforeRedirect([filter, ]listener)`
- `webRequest.onCompleted([filter, ]listener)`
- `webRequest.onErrorOccurred([filter, ]listener)`

<a id="web-socket"></a>

## web-socket.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/web-socket.md) · Git blob: `3185ab6346ea64b74af872045efdc73dac2dabca`

- Class: WebSocket extends `EventTarget`
- `new WebSocket(url[, protocols])`
- Static Properties
- `WebSocket.CONNECTING` _Readonly_
- `WebSocket.OPEN` _Readonly_
- `WebSocket.CLOSING` _Readonly_
- `WebSocket.CLOSED` _Readonly_
- Instance Properties
- `ws.url` _Readonly_
- `ws.readyState` _Readonly_
- `ws.bufferedAmount` _Readonly_
- `ws.protocol` _Readonly_
- `ws.extensions` _Readonly_
- `ws.binaryType`
- `ws.onopen`
- `ws.onmessage`
- `ws.onerror`
- `ws.onclose`
- Instance Methods
- `ws.send(data)`
- `ws.close([code][, reason])`
- Events

<a id="web-utils"></a>

## web-utils.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/web-utils.md) · Git blob: `39d85f6e6509818d30be31e1242d7e81956f9037`

- webUtils
- Methods
- `webUtils.getPathForFile(file)`

<a id="webview-tag"></a>

## webview-tag.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/webview-tag.md) · Git blob: `2d266851fda87c6be1e4587d99e2610750971607`

- `<webview>` Tag
- Warning
- Enabling
- Overview
- Example
- Internal implementation
- CSS Styling Notes
- Tag Attributes
- `src`
- `nodeintegration`
- `nodeintegrationinsubframes`
- `plugins`
- `preload`
- `httpreferrer`
- `useragent`
- `disablewebsecurity`
- `partition`
- `allowpopups`
- `webpreferences`
- `enableblinkfeatures`
- `disableblinkfeatures`
- Methods
- `<webview>.loadURL(url[, options])`
- `<webview>.downloadURL(url[, options])`
- `<webview>.getURL()`
- `<webview>.getTitle()`
- `<webview>.isLoading()`
- `<webview>.isLoadingMainFrame()`
- `<webview>.isWaitingForResponse()`
- `<webview>.stop()`
- `<webview>.reload()`
- `<webview>.reloadIgnoringCache()`
- `<webview>.canGoBack()`
- `<webview>.canGoForward()`
- `<webview>.canGoToOffset(offset)`
- `<webview>.clearHistory()`
- `<webview>.goBack()`
- `<webview>.goForward()`
- `<webview>.goToIndex(index)`
- `<webview>.goToOffset(offset)`
- `<webview>.isCrashed()`
- `<webview>.setUserAgent(userAgent)`
- `<webview>.getUserAgent()`
- `<webview>.insertCSS(css)`
- `<webview>.removeInsertedCSS(key)`
- `<webview>.executeJavaScript(code[, userGesture])`
- `<webview>.openDevTools()`
- `<webview>.closeDevTools()`
- `<webview>.isDevToolsOpened()`
- `<webview>.isDevToolsFocused()`
- `<webview>.inspectElement(x, y)`
- `<webview>.inspectSharedWorker()`
- `<webview>.inspectServiceWorker()`
- `<webview>.setAudioMuted(muted)`
- `<webview>.isAudioMuted()`
- `<webview>.isCurrentlyAudible()`
- `<webview>.undo()`
- `<webview>.redo()`
- `<webview>.cut()`
- `<webview>.copy()`
- `<webview>.centerSelection()`
- `<webview>.paste()`
- `<webview>.pasteAndMatchStyle()`
- `<webview>.delete()`
- `<webview>.selectAll()`
- `<webview>.unselect()`
- `<webview>.scrollToTop()`
- `<webview>.scrollToBottom()`
- `<webview>.adjustSelection(options)`
- `<webview>.replace(text)`
- `<webview>.replaceMisspelling(text)`
- `<webview>.insertText(text)`
- `<webview>.findInPage(text[, options])`
- `<webview>.stopFindInPage(action)`
- `<webview>.print([options])`
- `<webview>.printToPDF(options)`
- `<webview>.capturePage([rect])`
- `<webview>.send(channel, ...args)`
- `<webview>.sendToFrame(frameId, channel, ...args)`
- `<webview>.sendInputEvent(event)`
- `<webview>.setZoomFactor(factor)`
- `<webview>.setZoomLevel(level)`
- `<webview>.getZoomFactor()`
- `<webview>.getZoomLevel()`
- `<webview>.setVisualZoomLevelLimits(minimumLevel, maximumLevel)`
- `<webview>.showDefinitionForSelection()` _macOS_
- `<webview>.getWebContentsId()`
- DOM Events
- Event: 'load-commit'
- Event: 'did-finish-load'
- Event: 'did-fail-load'
- Event: 'did-frame-finish-load'
- Event: 'did-start-loading'
- Event: 'did-stop-loading'
- Event: 'did-attach'
- Event: 'dom-ready'
- Event: 'page-title-updated'
- Event: 'page-favicon-updated'
- Event: 'enter-html-full-screen'
- Event: 'leave-html-full-screen'
- Event: 'console-message'
- Event: 'found-in-page'
- Event: 'will-navigate'
- Event: 'will-frame-navigate'
- Event: 'did-start-navigation'
- Event: 'did-redirect-navigation'
- Event: 'did-navigate'
- Event: 'did-frame-navigate'
- Event: 'did-navigate-in-page'
- Event: 'close'
- Event: 'ipc-message'
- Event: 'render-process-gone'
- Event: 'destroyed'
- Event: 'media-started-playing'
- Event: 'media-paused'
- Event: 'did-change-theme-color'
- Event: 'update-target-url'
- Event: 'devtools-open-url'
- Event: 'devtools-search-query'
- Event: 'devtools-opened'
- Event: 'devtools-closed'
- Event: 'devtools-focused'
- Event: 'context-menu'

<a id="window-open"></a>

## window-open.md

[Exact source](https://github.com/electron/electron/blob/v45.3.2/docs/api/window-open.md) · Git blob: `b8102a7698fbbdf70242b6e00f8498fb7417eeea`

- Opening windows from the renderer
- `window.open(url[, frameName][, features])`
- Native `Window` example

## Structured data objects

These references define argument, event and return shapes. They belong to the API contract even though they are not independently constructed modules.

- [activation-arguments](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/activation-arguments.md)
- [base-window-options](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/base-window-options.md)
- [bluetooth-device](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/bluetooth-device.md)
- [browser-window-options](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/browser-window-options.md)
- [certificate-principal](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/certificate-principal.md)
- [certificate](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/certificate.md)
- [clipboard-bookmark](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/clipboard-bookmark.md)
- [color-space](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/color-space.md)
- [cookie](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/cookie.md)
- [cpu-usage](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/cpu-usage.md)
- [crash-report](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/crash-report.md)
- [custom-scheme](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/custom-scheme.md)
- [desktop-capturer-source](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/desktop-capturer-source.md)
- [display](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/display.md)
- [extension-info](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/extension-info.md)
- [extension](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/extension.md)
- [file-filter](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/file-filter.md)
- [file-path-with-headers](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/file-path-with-headers.md)
- [filesystem-permission-request](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/filesystem-permission-request.md)
- [gpu-feature-status](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/gpu-feature-status.md)
- [hid-device](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/hid-device.md)
- [input-event](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/input-event.md)
- [ipc-main-event](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/ipc-main-event.md)
- [ipc-main-invoke-event](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/ipc-main-invoke-event.md)
- [ipc-main-service-worker-event](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/ipc-main-service-worker-event.md)
- [ipc-main-service-worker-invoke-event](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/ipc-main-service-worker-invoke-event.md)
- [ipc-renderer-event](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/ipc-renderer-event.md)
- [jump-list-category](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/jump-list-category.md)
- [jump-list-item](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/jump-list-item.md)
- [keyboard-event](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/keyboard-event.md)
- [keyboard-input-event](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/keyboard-input-event.md)
- [language-model-append-options](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/language-model-append-options.md)
- [language-model-clone-options](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/language-model-clone-options.md)
- [language-model-create-core-options](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/language-model-create-core-options.md)
- [language-model-create-options](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/language-model-create-options.md)
- [language-model-expected](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/language-model-expected.md)
- [language-model-message-content](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/language-model-message-content.md)
- [language-model-message](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/language-model-message.md)
- [language-model-prompt-options](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/language-model-prompt-options.md)
- [media-access-permission-request](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/media-access-permission-request.md)
- [memory-info](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/memory-info.md)
- [memory-usage-details](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/memory-usage-details.md)
- [menu-item-badge](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/menu-item-badge.md)
- [mime-typed-buffer](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/mime-typed-buffer.md)
- [mouse-input-event](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/mouse-input-event.md)
- [mouse-wheel-input-event](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/mouse-wheel-input-event.md)
- [native-heap-profiler-options](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/native-heap-profiler-options.md)
- [navigation-entry](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/navigation-entry.md)
- [notification-action](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/notification-action.md)
- [notification-response](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/notification-response.md)
- [offscreen-shared-texture](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/offscreen-shared-texture.md)
- [open-external-permission-request](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/open-external-permission-request.md)
- [payment-discount](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/payment-discount.md)
- [permission-request](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/permission-request.md)
- [point](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/point.md)
- [post-body](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/post-body.md)
- [preload-script-registration](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/preload-script-registration.md)
- [preload-script](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/preload-script.md)
- [print-to-pdf-margins](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/print-to-pdf-margins.md)
- [print-to-pdf-options](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/print-to-pdf-options.md)
- [printer-info](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/printer-info.md)
- [process-memory-info](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/process-memory-info.md)
- [process-metric](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/process-metric.md)
- [product-discount](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/product-discount.md)
- [product-subscription-period](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/product-subscription-period.md)
- [product](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/product.md)
- [protocol-request](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/protocol-request.md)
- [protocol-response-upload-data](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/protocol-response-upload-data.md)
- [protocol-response](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/protocol-response.md)
- [protocol-route](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/protocol-route.md)
- [protocol-source](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/protocol-source.md)
- [proxy-config](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/proxy-config.md)
- [rectangle](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/rectangle.md)
- [referrer](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/referrer.md)
- [render-process-gone-details](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/render-process-gone-details.md)
- [resolved-endpoint](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/resolved-endpoint.md)
- [resolved-host](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/resolved-host.md)
- [scrubber-item](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/scrubber-item.md)
- [segmented-control-segment](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/segmented-control-segment.md)
- [serial-port](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/serial-port.md)
- [service-worker-info](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/service-worker-info.md)
- [shared-dictionary-info](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/shared-dictionary-info.md)
- [shared-dictionary-usage-info](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/shared-dictionary-usage-info.md)
- [shared-texture-handle](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/shared-texture-handle.md)
- [shared-texture-import-texture-info](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/shared-texture-import-texture-info.md)
- [shared-texture-imported-subtle](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/shared-texture-imported-subtle.md)
- [shared-texture-imported](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/shared-texture-imported.md)
- [shared-texture-subtle](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/shared-texture-subtle.md)
- [shared-texture-sync-token](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/shared-texture-sync-token.md)
- [shared-texture-transfer](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/shared-texture-transfer.md)
- [shared-worker-info](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/shared-worker-info.md)
- [sharing-item](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/sharing-item.md)
- [shortcut-details](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/shortcut-details.md)
- [size](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/size.md)
- [task](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/task.md)
- [thumbar-button](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/thumbar-button.md)
- [trace-categories-and-options](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/trace-categories-and-options.md)
- [trace-config](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/trace-config.md)
- [transaction](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/transaction.md)
- [upload-data](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/upload-data.md)
- [upload-file](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/upload-file.md)
- [upload-raw-data](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/upload-raw-data.md)
- [usb-device](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/usb-device.md)
- [user-default-types](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/user-default-types.md)
- [web-preferences](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/web-preferences.md)
- [web-request-filter](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/web-request-filter.md)
- [web-socket-options](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/web-socket-options.md)
- [web-source](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/web-source.md)
- [webauthn-account](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/webauthn-account.md)
- [window-open-handler-response](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/window-open-handler-response.md)
- [window-session-end-event](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/window-session-end-event.md)
- [window-state-persistence](https://github.com/electron/electron/blob/v45.3.2/docs/api/structures/window-state-persistence.md)
