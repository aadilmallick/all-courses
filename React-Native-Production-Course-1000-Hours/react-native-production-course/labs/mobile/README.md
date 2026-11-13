# Fixture mobile overlay

This is a small TypeScript/TSX starter for the course, **not a complete production capstone** and not a standalone preinstalled Expo project. It shows a transaction overview, details, and a local budget editor. Authentication, durable storage, banking, and billing are implemented by following the later lessons in your own application.

1. Generate a fresh stable Expo SDK 58 Router project with `npx create-expo-app@latest pocketpilot` and inspect its selected version.
2. Retain its generated dependencies and lockfile. Keep one route root, preferably `src/app` for this overlay.
3. Move the template demonstration routes out of the route directory in your new project, then copy this overlay's `src/app` and `src/features` into its `src` directory. Review conflicts instead of overwriting unrelated work.
4. Ensure `expo-router` and `react-native-safe-area-context` are installed through the template or `npx expo install`.
5. Run `npx expo-doctor`, your generated project's TypeScript check, and `npx expo start`.

All data is synthetic. Budget editing updates only component memory and resets when the screen remounts; the screen says this explicitly. Use the repository, storage, and backend lessons to make it durable. This overlay was authored and inspected but not compiled or run as a native app in the course-authoring environment.
