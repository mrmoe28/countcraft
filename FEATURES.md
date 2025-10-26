# CountCraft Features Documentation

## Overview

CountCraft is a professional choreography counter and choreography assistant built for dance coaches and choreographers. It enables users to upload music tracks, automatically generate 8-count grids (the standard choreography format), and annotate counts with custom text labels and voice transcriptions synchronized with audio playback.

## Tech Stack

- **Framework**: Next.js 15 (App Router, React 19, TypeScript)
- **Database**: PostgreSQL via Prisma ORM
- **UI**: Tailwind CSS + shadcn/ui components + Radix UI
- **Audio**: wavesurfer.js for waveform visualization
- **Icons**: Lucide React
- **Validation**: Zod schemas

---

## Core Features

### 1. Performance Management

#### Dashboard
- View all performances in a grid layout
- Performance statistics dashboard with cards showing:
  - Total performances
  - Total tracks uploaded
  - Recent activity
- Each performance card displays:
  - Performance name
  - Team name (if set)
  - Event date (if set)
  - Audio duration
  - Status badge
- Hover effects and click-to-navigate functionality

#### Create Performance
- Form-based performance creation
- Fields:
  - **Name** (required)
  - **Team** (optional)
  - **Event Date** (optional)
- Automatic redirect to editor after creation

#### Performance Metadata
- Update performance details anytime
- All changes auto-saved to database

---

### 2. Audio Handling

#### Audio Upload
- Support for MP3, WAV, and M4A file formats
- File validation and error handling
- Automatic duration detection
- MIME type detection for proper audio processing

#### Waveform Visualization
- Interactive audio waveform display using wavesurfer.js
- Visual features:
  - Green waveform with amber cursor
  - Normalized display (128px height)
  - Real-time playhead tracking during playback
  - Click-to-seek functionality
- Supports both ArrayBuffer and string sources

#### Audio Playback Controls
- Play/Pause button with keyboard shortcut (Space)
- Time display showing current position and total duration
- Precise millisecond-level timing (mm:ss.mmm format)
- Smooth seeking via waveform interaction

---

### 3. BPM & Timing Control

#### Automatic BPM Detection
- Peak-detection algorithm analyzes audio buffer
- Downsampling optimization for performance
- Detection range: 40-240 BPM
- Automatic fallback to 120 BPM if detection fails

#### Manual BPM Controls
- Direct text input with min/max validation (40-240 BPM)
- Input sanitization and error feedback

#### Tap Tempo
- Interactive tap button to measure BPM
- Calculates BPM from intervals between taps
- Stores 2-4 tap measurements for accuracy
- Real-time BPM update based on tap rhythm

#### Offset/Timing Alignment
- Precise offset control (±2 seconds range)
- Slider control with 1ms precision steps
- Quick nudge buttons:
  - ±5ms increments
  - ±10ms increments
  - ±25ms increments
- Ensures perfect alignment of counts to audio downbeats
- All offsets stored per performance in database

---

### 4. Count Grid System

#### 8-Count Grid Generation
- Automatic grid generation based on:
  - Audio duration
  - BPM (beats per minute)
  - Timing offset
- Standard choreography format (8 counts per measure)
- Precise timestamp calculation:
  ```
  atSec = offsetSec + (measureIndex × measureDuration) + ((countInMeasure - 1) × beatDuration)
  ```

#### Interactive Count Grid UI
- Visual grid layout:
  - 8 columns per measure (counts 1-8)
  - Organized by measure rows
  - Responsive design
- Visual highlighting of currently playing count
- Hover states for enhanced interactivity
- Color-coded active count:
  - Primary ring border
  - Background tint

#### Editable Count Labels
- Click any count cell to enter edit mode
- Text input for choreography instructions
  - Examples: "Clean", "Hips", "High V", "Turn right"
- Save actions:
  - Click outside cell (blur)
  - Press Enter key
- Cancel editing with Escape key
- Auto-save to database on each change

---

### 5. Voice-to-Text Integration (Speak-to-Fill)

#### Web Speech API Integration
- Browser-based speech recognition (Chrome/Edge)
- Graceful degradation for unsupported browsers
- Real-time transcription display

#### Features
- Toggle microphone on/off with button
- Continuous listening during playback
- Displays interim and final results
- Auto-insert transcribed text into currently playing count
- Toast notifications confirming successful insertions

#### Smart Playback Sync
- Only records when audio is actively playing
- Automatically targets count cell at current playhead position
- Supports overlapping transcriptions for complex choreography
- Hands-free choreography notation workflow

---

### 6. Data Persistence & Export

#### Database Models

**Performance**
- id, name, team (optional), eventDate (optional)
- createdAt, updatedAt timestamps

**Track**
- id, performanceId (unique), fileName, durationSec, bpm, offsetSec
- createdAt, updatedAt timestamps

**CountNote**
- id, performanceId, measureIndex, countInMeasure (1-8), atSec, text
- createdAt, updatedAt timestamps
- Unique constraint: (performanceId, measureIndex, countInMeasure)

#### Export Formats

**JSON Export**
- Complete performance data structure
- Includes:
  - Performance metadata
  - Track information
  - All count notes with timestamps
- Browser download as `.json` file

**CSV Export**
- Spreadsheet-compatible format
- Columns:
  - Measure (1-indexed)
  - Count (1-8)
  - Time (seconds, 3 decimal places)
  - Text (properly quoted/escaped)
- Browser download as `.csv` file

---

### 7. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Space** | Play/Pause |
| **← / →** | Seek ±1 second |
| **Shift + ← / →** | Seek ±0.1 second |
| **↑ / ↓** | Jump to previous/next count |
| **Enter** | Edit current/focused cell |
| **Escape** | Cancel editing |

---

### 8. API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/performances` | Fetch all performances with tracks & notes |
| POST | `/api/performances` | Create performance (batch create with track & notes) |
| GET | `/api/performances/[id]` | Fetch single performance with all data |
| PUT/PATCH | `/api/performances/[id]` | Update performance metadata |
| DELETE | `/api/performances/[id]` | Delete performance (cascades to track & notes) |
| GET | `/api/export/[id]/json` | Download performance as JSON file |
| GET | `/api/export/[id]/csv` | Download counts as CSV file |

---

## Unique & Special Features

### 1. Non-Destructive Editing
Changing BPM or offset automatically reflows all count timestamps while preserving all text labels and annotations.

### 2. Smart Count Sync
Visual indication of currently playing count during playback with automatic grid highlighting and scrolling.

### 3. Real-time Speech Recognition
Voice-to-text annotations that automatically sync to playhead position, enabling hands-free choreography notation.

### 4. Precision Timing Controls
Millisecond-level offset nudging for perfect alignment with audio downbeats and musical phrasing.

### 5. Batch Operations
Single API call creates performance + track + all count notes together for optimal performance.

### 6. Cascade Deletion
Deleting a performance automatically cleans up related tracks and notes in the database.

### 7. Theme Support
Full dark/light mode with next-themes integration and system preference detection.

### 8. Responsive Design
Mobile-friendly dashboard with editor optimized for desktop workflow.

---

## Validation Rules

- **BPM**: 40-240 range
- **Performance Name**: Required (minimum 1 character)
- **Count Values**: 1-8 (per measure)
- **Duration**: Must be positive
- **Team & Event Date**: Optional fields
- **Unique Constraints**:
  - One track per performance
  - Unique count note per (performance, measure, count)

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home (redirects to dashboard)
│   ├── dashboard/page.tsx          # Performance list & stats
│   ├── performance/
│   │   ├── new/page.tsx           # Create performance form
│   │   └── [id]/page.tsx          # Main editor
│   ├── api/
│   │   ├── performances/route.ts        # GET/POST
│   │   ├── performances/[id]/route.ts  # GET/PUT/DELETE
│   │   └── export/[id]/
│   │       ├── json/route.ts
│   │       └── csv/route.ts
│   ├── layout.tsx                 # Root layout
│   └── globals.css
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── Waveform.tsx              # wavesurfer.js wrapper
│   ├── CountGrid.tsx             # 8-count grid with editing
│   ├── SpeakToFill.tsx           # Voice transcription
│   ├── BPMControls.tsx           # BPM input + Tap Tempo
│   ├── TapTempo.tsx              # Tap detection logic
│   ├── OffsetControls.tsx        # Offset slider + nudges
│   ├── TransportBar.tsx          # Play/Pause + time display
│   ├── ExportMenu.tsx            # JSON/CSV export dropdown
│   ├── PerformanceForm.tsx       # Performance creation form
│   ├── ProjectList.tsx           # Dashboard grid
│   ├── navigation.tsx            # Top navigation
│   └── theme-provider.tsx        # Dark/light mode
├── lib/
│   ├── counts.ts                 # Grid generation algorithms
│   ├── bpm.ts                    # BPM detection
│   ├── csv.ts                    # CSV formatting
│   ├── time.ts                   # Time utilities
│   ├── db.ts                     # Prisma client
│   ├── schema.ts                 # Zod validation schemas
│   └── utils.ts                  # Helper utilities
└── hooks/
    └── use-toast.ts              # Toast notification hook
```

---

## Key Dependencies

**Core Packages:**
- `@prisma/client@^6.0.0` - ORM & database client
- `wavesurfer.js@^7.8.0` - Audio waveform visualization
- `next-themes@^0.4.6` - Theme management
- `@radix-ui/*` - Accessible UI primitives (9 packages)
- `sonner@^1.7.0` - Toast notifications
- `lucide-react@^0.460.0` - Icon library
- `zod@^3.23.8` - Schema validation
- `tailwindcss@^3.4.14` - CSS framework
- `class-variance-authority@^0.7.0` - Component variants

---

## Use Cases

### For Choreographers
- Upload competition routine music
- Generate count structure automatically
- Annotate each count with movement descriptions
- Use voice commands during practice to document choreography
- Export to share with team members

### For Dance Coaches
- Organize multiple performances/routines
- Track competition dates and team assignments
- Review and edit choreography notes
- Export to CSV for printing or sharing

### For Dance Teams
- Standardized notation format (8-count grid)
- Easy collaboration via JSON/CSV exports
- Precise timing alignment with music
- Professional presentation and organization

---

## Future Enhancement Opportunities

- User authentication & multi-user support
- Performance sharing & collaboration
- Video sync with counts
- Mobile app (native iOS/Android)
- Advanced export formats (PDF, video overlays)
- Count pattern templates
- Formation diagrams integration
- Cloud storage for audio files

---

## Technical Notes

- All timestamps use millisecond precision
- Database operations include automatic cascade deletes
- Speech recognition requires HTTPS (production) or localhost
- Waveform rendering optimized for performance with downsampling
- Responsive design tested on desktop, tablet, and mobile viewports
