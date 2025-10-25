# CountCraft Troubleshooting Guide

## Create Performance Button Not Working

### Problem
The "Create Performance" button was not working due to schema validation errors.

### Root Cause
The Zod schema validation in `src/lib/schema.ts` was expecting datetime strings for the `eventDate` field, but HTML date inputs provide date strings in "YYYY-MM-DD" format.

### Solution
Updated the schema validation to accept date strings instead of datetime strings:

**Before:**
```typescript
eventDate: z.string().datetime().optional().nullable(),
```

**After:**
```typescript
eventDate: z.string().optional().nullable(),
```

### Files Modified
- `src/lib/schema.ts` - Updated `CreatePerformanceSchema`, `UpdatePerformanceSchema`, and `BatchCreatePerformanceSchema`

### Testing
- API endpoint `/api/performances` now accepts POST requests with date strings
- Frontend form submission works correctly
- Database connection verified with Neon PostgreSQL

### Prevention
When using HTML date inputs with Zod validation, use `.string()` instead of `.string().datetime()` for date fields, as HTML date inputs provide date strings, not datetime strings.

## Audio File Upload Crashes

### Problem
The application crashes when users try to upload audio files.

### Root Cause
Multiple issues in the file upload process:
1. No error handling in `handleFileSelect` function
2. No file type validation
3. No file size limits
4. No error handling in Waveform component
5. Missing error handling for AudioContext operations

### Solution
Added comprehensive error handling and validation:

**File Upload Validation:**
- Added file type validation (audio files only)
- Added file size limit (50MB max)
- Added try-catch blocks around all async operations
- Added proper error messages with toast notifications
- Added state reset on errors

**Waveform Component:**
- Added try-catch blocks around WaveSurfer creation
- Added error event handlers
- Added proper cleanup error handling

### Files Modified
- `src/app/performance/[id]/page.tsx` - Enhanced `handleFileSelect` function
- `src/components/Waveform.tsx` - Added error handling

### Testing
- File upload now handles errors gracefully
- Users get clear error messages for invalid files
- Application no longer crashes on file upload errors
- Large files are rejected with appropriate messages

### Prevention
Always wrap async operations in try-catch blocks, validate user inputs, and provide clear error feedback to users.

## M4A File Support

### Problem
M4A files were not supported for upload and processing.

### Solution
Added comprehensive M4A file support:

**File Validation:**
- Added M4A to allowed file types and extensions
- Enhanced file type validation to check both MIME type and file extension
- Updated file input accept attribute to include M4A files

**Audio Processing:**
- Enhanced Waveform component to detect and use correct MIME type
- Added audioFile prop to pass file metadata for proper MIME type detection
- Improved blob creation with correct MIME type for M4A files

### Files Modified
- `src/app/performance/[id]/page.tsx` - Enhanced file validation and input
- `src/components/Waveform.tsx` - Added MIME type detection
- `FEATURES.md` - Updated documentation

### Testing
- M4A files now upload and process correctly
- Waveform visualization works with M4A files
- BPM detection works with M4A files
- All audio processing features work with M4A format

### Prevention
When adding new audio format support, always update both file validation and MIME type detection in the audio processing pipeline.

## "Failed to create performance" Error

### Problem
Console error "Failed to create performance" when uploading audio files in the performance editor.

### Root Cause
The file upload logic was incorrectly trying to create a new performance instead of adding a track to the existing performance. The batch creation API was being called with the wrong data structure.

### Solution
Fixed the file upload logic by:

**API Structure:**
- Created separate endpoints for track and notes creation
- `/api/performances/[id]/track` - Creates track for existing performance
- `/api/performances/[id]/notes` - Creates count notes for existing performance

**File Upload Logic:**
- Split the batch creation into two separate API calls
- First creates the track, then creates the notes
- Proper error handling for each step
- Maintains existing performance data

### Files Modified
- `src/app/performance/[id]/page.tsx` - Fixed file upload logic
- `src/app/api/performances/[id]/track/route.ts` - New track creation endpoint
- `src/app/api/performances/[id]/notes/route.ts` - New notes creation endpoint

### Testing
- File upload now works correctly without "Failed to create performance" error
- Tracks are properly created and associated with existing performances
- Count notes are generated and saved correctly
- All audio processing features work as expected

### Prevention
When working with existing resources, use update/create endpoints rather than batch creation endpoints that expect new resources.

## Track Creation API Issues

### Problem
"Failed to create track" error when uploading audio files, preventing waveform and count grid from displaying.

### Root Cause
The track creation API was failing due to schema validation issues and missing performanceId in the request body.

### Solution
Fixed the track creation API by:

**API Endpoint Fixes:**
- Added performanceId to request body in the API endpoint
- Enhanced error handling with detailed error messages
- Fixed schema validation for track creation

**Frontend Logic:**
- Removed performanceId from frontend request (added in API)
- Added proper await for loadPerformance after upload
- Added debugging logs to track data loading

### Files Modified
- `src/app/api/performances/[id]/track/route.ts` - Fixed performanceId handling
- `src/app/performance/[id]/page.tsx` - Enhanced error handling and debugging

### Testing
- Track creation API now works correctly
- Performance data loads properly after upload
- Waveform and count grid display correctly
- All audio processing features work as expected

### Prevention
Always ensure API endpoints handle required fields properly and add comprehensive error handling with detailed error messages.

## AI-Enhanced Audio Processing

### Features Implemented
All AI-powered audio processing features have been successfully implemented:

**🎵 Smart BPM Detection**
- AI-powered BPM analysis using OpenAI GPT-4
- More accurate tempo detection than traditional methods
- Handles complex rhythms and tempo changes

**🎭 Choreography Analysis**
- AI-generated choreography suggestions
- Automatic count placement recommendations
- Difficulty assessment and tips

**🎼 Music Genre Recognition**
- Automatic genre detection (pop, hip-hop, jazz, rock, etc.)
- Genre-specific BPM and rhythm analysis
- Style-appropriate choreography suggestions

**📊 Advanced Audio Insights**
- Energy level analysis (1-10 scale)
- Tempo stability assessment
- Rhythm complexity analysis
- Dynamic range evaluation

**🎯 Smart Count Suggestions**
- AI-generated count-by-count choreography recommendations
- Beat pattern analysis with accent detection
- Musical phrase identification
- Intensity-based movement suggestions

### Files Created/Modified
- `src/lib/ai-audio-analysis.ts` - Core AI analysis functions
- `src/components/AIAnalysisPanel.tsx` - UI component for displaying AI insights
- `src/app/api/audio/process/route.ts` - Enhanced with AI processing
- `src/app/performance/[id]/page.tsx` - Added AI Analysis tab

### Usage
1. Upload any audio file (MP3, WAV, M4A, MP4, etc.)
2. AI automatically analyzes the audio
3. View comprehensive analysis in the "AI Analysis" tab
4. Get specific choreography recommendations
5. Use count-by-count suggestions for choreography planning

### Requirements
- OpenAI API key must be configured in `.env.local`
- Requires internet connection for AI analysis
- Fallback to basic analysis if AI service unavailable
