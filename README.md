# CountCraft

A production-ready cheer/dance choreography counter built with Next.js 15 (App Router), TypeScript, and modern web technologies.

## Features

- **Audio Waveform Visualization**: Upload MP3/WAV files and see waveforms rendered with wavesurfer.js
- **BPM Detection**: Automatic tempo estimation from audio or manual BPM input via Tap Tempo
- **8-Count Grid Generation**: Auto-generate precise count grids (1-8 per measure) across the entire track
- **Editable Count Labels**: Click any count cell to add text annotations (e.g., "Clean", "Hips", "High V")
- **Speak-to-Fill Mode**: Use Web Speech API to transcribe phrases in real-time and insert into the currently playing count
- **Precise Timing**: Counts align to timestamps using BPM + offset (downbeat nudging with ±5/10/25ms controls)
- **Non-Destructive Editing**: Moving BPM/offset reflows all count timestamps while preserving text
- **Persistent Storage**: SQLite database via Prisma with Performance, Track, and CountNote models
- **Export Options**: Download your counts as JSON or CSV for external use
- **Keyboard Controls**: Space (play/pause), arrows (seek/navigate), Enter (edit cell)
- **Mobile-Friendly**: Responsive design (editor best on desktop)

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript, React 19)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Prisma + SQLite (`./prisma/dev.db`)
- **Waveform**: wavesurfer.js
- **Speech-to-Text**: Web Speech API (browser-based, feature-detected)
- **Validation**: Zod schemas
- **Icons**: Lucide React

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd countcraft
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   No external API keys required! The default SQLite config works out of the box.

4. **Initialize the database**:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Creating a Performance

1. Click **"New Performance"** on the dashboard
2. Enter performance name, optional team name, and event date
3. Click **"Create Performance"**

### Adding Audio & Generating Counts

1. Open your performance
2. Click **"Upload Audio"** and select an MP3/WAV file
3. The app will:
   - Load the waveform
   - Estimate BPM (or use Tap Tempo)
   - Generate an 8-count grid across the full track duration
   - Create empty count cells for annotation

### Annotating Counts

- **Click a count cell** to edit its text
- **Play the track** and the current count will be highlighted
- Use **arrow keys** to navigate between counts
- Press **Enter** to edit the focused cell
- Press **Space** to play/pause

### Speak-to-Fill Mode

1. Switch to the **"Voice"** tab in the right panel
2. Click the microphone button to enable speech recognition
3. Press play and speak moves as the track plays
4. Transcriptions are inserted into the currently playing count cell

**Note**: Speech recognition requires a compatible browser (Chrome, Edge) and microphone permissions.

### Adjusting BPM & Offset

- **BPM Controls**: Manual input, Tap Tempo, or auto-detection
- **Offset Controls**: Slider or nudge buttons (±5/10/25ms) to align counts with the audio downbeat
- **Rebuild Grid**: Recomputes all count timestamps when BPM/offset changes (preserves text)

### Exporting

Click the **"Export"** dropdown in the editor toolbar:
- **Export JSON**: Full performance data (includes metadata, track info, and counts)
- **Export CSV**: Simple spreadsheet format (Measure, Count, Time, Text)

## Project Structure

```
countcraft/
├── prisma/
│   ├── schema.prisma       # Database schema (Performance, Track, CountNote)
│   └── seed.ts             # Seed script (demo performance)
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   └── page.tsx    # Dashboard (list performances)
│   │   ├── performance/
│   │   │   ├── new/page.tsx        # Create performance form
│   │   │   └── [id]/page.tsx       # Editor (waveform + grid + controls)
│   │   ├── api/
│   │   │   ├── performances/route.ts       # CRUD endpoints
│   │   │   ├── performances/[id]/route.ts
│   │   │   └── export/[id]/{json,csv}/route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/             # shadcn/ui primitives
│   │   ├── Waveform.tsx
│   │   ├── CountGrid.tsx
│   │   ├── SpeakToFill.tsx
│   │   ├── BPMControls.tsx
│   │   ├── OffsetControls.tsx
│   │   ├── TransportBar.tsx
│   │   ├── TapTempo.tsx
│   │   ├── PerformanceForm.tsx
│   │   ├── ProjectList.tsx
│   │   └── ExportMenu.tsx
│   └── lib/
│       ├── db.ts           # Prisma client singleton
│       ├── time.ts         # Time formatting helpers
│       ├── bpm.ts          # BPM detection (fallback autocorrelation)
│       ├── counts.ts       # Grid generation & nearest count logic
│       ├── csv.ts          # CSV export
│       ├── schema.ts       # Zod validation schemas
│       └── utils.ts        # cn() helper
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Scripts

- `npm run dev` - Start development server (Turbopack disabled per best practices)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run db:seed` - Seed database with demo data

## Database Models

### Performance
```prisma
model Performance {
  id         String   @id @default(cuid())
  name       String
  team       String?
  eventDate  DateTime?
  track      Track?
  countNotes CountNote[]
}
```

### Track
```prisma
model Track {
  id            String   @id @default(cuid())
  performanceId String   @unique
  fileName      String
  durationSec   Float
  bpm           Float
  offsetSec     Float    // positive = audio starts before downbeat
  performance   Performance @relation(...)
}
```

### CountNote
```prisma
model CountNote {
  id             String  @id @default(cuid())
  performanceId  String
  measureIndex   Int     // 0-based
  countInMeasure Int     // 1..8
  atSec          Float   // computed timestamp
  text           String  @default("")
  performance    Performance @relation(...)
}
```

## Keyboard Shortcuts

- **Space**: Play/Pause
- **← / →**: Seek ±1 second
- **Shift + ← / →**: Seek ±0.1 second
- **↑ / ↓**: Jump to previous/next count
- **Enter**: Edit current cell
- **Esc**: Cancel editing

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will auto-detect Next.js and deploy
4. **Note**: SQLite is file-based and not ideal for serverless. For production, consider migrating to PostgreSQL/MySQL:
   - Update `prisma/schema.prisma` datasource to `postgresql`
   - Set `DATABASE_URL` in Vercel environment variables

### Local Production Build

```bash
npm run build
npm start
```

## Browser Compatibility

- **Waveform**: Modern browsers with Web Audio API support
- **Speech-to-Text**: Chrome, Edge (Chromium-based). Gracefully degrades on Safari/Firefox.

## Limitations & Future Enhancements

- **Audio Upload**: Client-side only (no server storage). Large files work but stay in browser memory.
- **PDF Export**: TODO (commented placeholders in code for @react-pdf/renderer integration)
- **Advanced BPM Detection**: Current implementation uses simple autocorrelation; can be improved with FFT-based analysis or web-audio-beat-detector library.
- **Undo/Redo**: Not yet implemented.
- **Collaboration**: Single-user app; no real-time sync.

## Troubleshooting

### Speech Recognition Not Working
- Ensure you're using Chrome or Edge
- Grant microphone permissions when prompted
- Check browser console for errors

### Waveform Not Loading
- Ensure audio file is a valid MP3/WAV
- Check browser console for CORS errors (if loading remote URLs)
- Try a different file or use local files

### Database Errors
- Run `npx prisma db push` to sync schema
- Delete `prisma/dev.db` and re-run `db:push` + `db:seed` for a fresh start

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes with clear commit messages
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

Built with ❤️ for coaches and choreographers everywhere.
