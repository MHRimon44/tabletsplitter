# Tablet Splitter App

A React Native app that allows users to create, move, and split tablets (rectangles) interactively on the screen. This project demonstrates gesture handling, dynamic UI updates, and state management with Context API using React Native CLI and TypeScript.

---

## **Features**

1. **Draw Tablets**

   - Press and drag on empty canvas space to create a tablet.
   - Minimum tablet size: **40 dpi × 20 dpi**.
   - Tablets are assigned **random colors** automatically.

2. **Split Tablets**

   - Single tap on any part of the screen splits intersecting tablets.
   - Minimum part size: **20 dpi × 10 dpi**.
   - Parts retain **original tablet color and corner radius**.

3. **Move Tablets**

   - Each tablet or part can be **dragged anywhere** on the canvas.

4. **Nudge Unsplittable Parts**

   - If a tablet part is too small to split, it will **move slightly along the split line**.

5. **Dynamic UI**

   - Tap shows splitting lines temporarily.
   - Rubberband rectangle shows while drawing a new tablet.
   - Hints and warnings displayed when minimum size is not met.

---

## **Tech Stack**

- **React Native CLI** (TypeScript)
- **react-native-gesture-handler** – Pan & Tap gestures
- **react-native-reanimated** – Smooth animations for dragging
- **Context API** – State management for tablets

---

## **Installation & Running**

1. Clone the repo:

```bash
git clone <https://github.com/MHRimon44/tabletsplitter.git>
cd TabletSplitter
```

2. Install dependencies:

```bash
npm install
```

3. Start Metro Bundler:

```bash
npm start
```

4. Run on Android device/emulator:

```bash
npm run android
```

---

## **APK**

The release APK is located at:
`android/app/build/outputs/apk/release/app-release.apk`

Install it on any Android device to test the app.

### **Build APK from source**

1. Go to the Android folder:

```bash
cd android
```

2. Run Gradle assembleRelease:

```bash
./gradlew assembleRelease
```

3. The generated APK will be in:
   `android/app/build/outputs/apk/release/app-release.apk`

---

## **Usage Instructions**

1. **Create a Tablet**

   - Press & drag on empty space.
   - Release to create a tablet.

2. **Split a Tablet**

   - Tap anywhere on the canvas.
   - Tablets intersecting the tap position will split along horizontal and/or vertical lines.

3. **Move a Tablet**

   - Press & drag any tablet or part.

4. **Unsplittable Tablet Part**

   - Small tablets that cannot split will **nudge slightly** along the split line.

---

## **Notes**

- Minimum size rules ensure tablets are always usable and visible.
- Tablets retain color and corner radius after multiple splits.
- All gestures are handled with **react-native-gesture-handler** and smooth animation is powered by **react-native-reanimated**.

---

## **Author**

Md Mehedi Hasan
Email: [mehedihasanrimon01@gmail.com](mailto:mehedihasanrimon01@gmail.com)
Phone: +8801792085854
