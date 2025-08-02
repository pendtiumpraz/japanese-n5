# Japanese N5 Learning App

A Progressive Web App (PWA) for learning Japanese N5 level content, focusing on writing and speaking skills.

## Features

### 📝 Writing Module
- **Hiragana & Katakana Practice**
  - Interactive flashcards with audio
  - Stroke order training with visual guides
  - Drag & Drop quiz (with toggleable hints)
  - Quick quiz with multiple choice and typing
  
- **Kanji N5 (100 Characters)**
  - Complete stroke order guides
  - Onyomi and Kunyomi readings
  - Example sentences
  - Interactive practice with scoring

### 🗣️ Speaking Module
- Text-to-Speech for all Japanese content
- Adjustable speech rate, pitch, and volume
- Voice selection support

### 📚 Vocabulary
- 800+ N5 vocabulary words
- Organized in 20 categories
- Audio pronunciation for each word
- Flashcard-based learning

### 🎯 Additional Features
- Grammar lessons (N5 level)
- Listening practice with dialogues
- Progress tracking and review system
- Offline capability (PWA)
- Mobile-responsive design

## Installation

1. Clone the repository:
```bash
git clone https://github.com/pendtiumpraz/japanese-n5.git
cd japanese-n5
```

2. Serve the files using any HTTP server:
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

3. Open http://localhost:8000 in your browser

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6 Modules)
- **Styling**: Custom CSS with CSS Variables
- **Architecture**: Hash-based routing, Component-based UI
- **APIs**: Web Speech API, Canvas API, Drag and Drop API
- **Storage**: LocalStorage for progress tracking
- **PWA**: Service Worker for offline functionality

## Project Structure

```
/
├── index.html          # Main HTML file
├── manifest.json       # PWA manifest
├── sw.js              # Service Worker
├── assets/
│   ├── css/
│   │   └── styles.css # Main stylesheet
│   ├── js/
│   │   ├── app.js     # Main application entry
│   │   ├── router.js  # Hash-based routing
│   │   ├── store.js   # State management
│   │   ├── audio.js   # TTS functionality
│   │   ├── write.js   # Stroke training
│   │   ├── quiz.js    # Quiz system
│   │   ├── data/      # Japanese data (kana, kanji, vocab)
│   │   └── ui/        # UI components and pages
│   └── icons/         # PWA icons
└── README.md
```

## Browser Support

- Chrome/Edge (Recommended) - Full feature support
- Firefox - All features except voice recognition
- Safari - Basic features, limited TTS voices
- Mobile browsers - Touch-optimized interface

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.