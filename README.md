# JSON ⇄ TOON Converter

A web-based converter for transforming JSON data to the TOON format and vice versa. Built with React and Monaco Editor.

## Features

- **Bidirectional Conversion**: Convert between JSON and TOON formats seamlessly
- **Real-time Editing**: Monaco Editor integration with syntax highlighting
- **Token Analysis**: See how much space you save with TOON format
- **Copy & Download**: Easily export your converted data
- **Error Handling**: Clear error messages for invalid inputs
- **Modern UI**: Dark theme with Tailwind CSS

## What is TOON?

TOON is a compact data format designed to reduce token usage for LLM applications. It represents structured data more efficiently than JSON.

**Example:**

**JSON (30 characters):**

```json
{
  "name": "John",
  "age": 30
}
```

**TOON (18 characters):**

```
name: John
age: 30
```

**For arrays, TOON uses tabular format:**

**JSON:**

```json
{
  "users": [
    { "id": 1, "name": "Alice", "role": "admin" },
    { "id": 2, "name": "Bob", "role": "user" }
  ]
}
```

**TOON:**

```
users[2]{id,name,role}:
  1,Alice,admin
  2,Bob,user
```

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/json-toon-converter.git

# Navigate to the project directory
cd json-toon-converter

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Dependencies

- **React** - UI framework
- **@monaco-editor/react** - Code editor component
- **@toon-format/toon** - TOON encoding/decoding library
- **Tailwind CSS** - Styling

## Usage

1. **JSON to TOON:**

   - Paste your JSON in the left editor
   - Click "Convert JSON → TOON"
   - See the TOON output on the right

2. **TOON to JSON:**

   - Click "Swap ⇄" to switch modes
   - Paste your TOON data in the left editor
   - Click "Convert TOON → JSON"
   - Get formatted JSON on the right

3. **Actions:**
   - **Copy**: Copy output to clipboard
   - **Download**: Save output as `.toon` or `.json` file
   - **Swap**: Switch between input/output modes

## 📊 Token Savings

The converter calculates and displays:

- JSON token count (approximate)
- TOON token count (approximate)
- Tokens saved
- Percentage reduction

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Links

- [TOON Format Documentation](https://github.com/toon-format/toon)
- [Report Issues](https://github.com/devcom33/json-toon-converter/issues)

---

Made with ❤️ for developers working with LLMs
