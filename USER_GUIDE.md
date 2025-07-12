# InfoVault User Guide

## Welcome to InfoVault!

InfoVault is your personal repository manager for organizing digital assets. Think of it as a smart filing cabinet for all your important links, documents, images, and notes.

## Quick Start

### 1. Understanding the Interface

**Sidebar (Left)**:
- **Dashboard**: View items in the selected project
- **Projects**: Manage all your project folders
- **Search**: Find items across all projects  
- **Settings**: Export/import data and app settings

**Main Area**:
- Shows your items as cards with previews
- Use the search bar to find specific items
- Sort and filter items using the top controls

### 2. Your First Project

1. Click the "+" button next to "Projects" in the sidebar
2. Give your project a name (e.g., "Work Resources")
3. Add a description (optional)
4. Click "Create Project"

### 3. Adding Your First Item

1. Select your project from the sidebar
2. Click "Add Item" in the main area
3. Choose the type of item:
   - **URL**: Web links, online resources
   - **Image**: Photos, screenshots, graphics
   - **Video**: Video files or links
   - **Document**: PDFs, Word docs, presentations
   - **Code**: Code snippets, GitHub repos
   - **Note**: Text notes, ideas, reminders
   - **Reference**: Important references, bookmarks
   - **Archive**: Compressed files, backups

4. Fill in the details:
   - **Name**: What you want to call this item
   - **Description**: What this item is about (important!)
   - **Source**: URL or file path where it's located
   - **Tags**: Keywords for easy searching (separate with commas)

5. Click "Add Item"

## Daily Usage

### Finding Your Items

**Browse by Project**: Click any project in the sidebar to see its items

**Search Everything**: Use the search bar to find items by:
- Name
- Description  
- Tags

**Filter Results**: Click "Filter" to narrow down by:
- Item type (URLs, images, etc.)
- Date range (today, this week, etc.)

**Sort Items**: Choose how to sort:
- **Name**: Alphabetical order
- **Date**: Most recently updated first
- **Type**: Group by item type

### Managing Items

**Edit an Item**: Click the edit icon (pencil) on any item card

**Delete an Item**: Click the trash icon - you'll be asked to confirm

**Open/View an Item**: Click the action button:
- URLs open in your browser
- Images show in a new tab
- Other files depend on your system

### Working with Tags

Tags are keywords that make finding items easy. Good tagging examples:

- **URL to React docs**: `react, documentation, frontend, learning`
- **Meeting notes**: `meeting, project-alpha, notes, january`
- **Design inspiration**: `design, ui, inspiration, mobile`

### Organizing with Projects

Create projects for different areas of your life:
- **Work Projects**: Separate project for each work initiative
- **Learning**: Resources for skills you're developing
- **Personal**: Home projects, hobbies, personal docs
- **Reference**: Important documents, templates, guides

## Advanced Features

### Export Your Data

1. Go to Settings
2. Click "Export Data"
3. Choose format:
   - **CSV**: Open in Excel/Google Sheets
   - **JSON**: Complete backup with all data
4. Click "Export"

### Import Data

1. Go to Settings  
2. Click "Import Data"
3. Select a JSON file previously exported from InfoVault
4. Click "Import"

Note: Imported projects will have "(Imported)" added to their names.

### Backup Strategy

**Automatic Database Backup**: Your data is automatically saved to a SQLite database file

**Database Location**: `~/.infovault/infovault.db` (in your home directory)

**Additional Backups**: 
- Export JSON files for sharing between computers
- Export CSV for viewing in spreadsheets
- Copy the database file itself for complete backup

**Data Persistence**: Unlike earlier versions, your data now survives app restarts!

## Tips for Success

### Good Naming
- **Clear and Descriptive**: "React Tutorial - Hooks" vs "Tutorial"
- **Include Context**: "Meeting Notes - Q4 Planning - Dec 2024"

### Effective Descriptions  
Always fill in the description! Future you will thank you:
- "Official React documentation for learning hooks and components"
- "Meeting notes covering Q4 goals, budget discussion, and team assignments"

### Smart Tagging
- Use consistent tag names
- Include broad categories: `frontend`, `backend`, `design`
- Add specific keywords: `react`, `api`, `mobile`
- Include project names: `project-alpha`, `redesign`

### Project Organization
- Keep projects focused but not too narrow
- 5-20 items per project is often ideal
- Split large projects when they get unwieldy

## Common Workflows

### Research Project
1. Create project: "Market Research - Q1 2024"
2. Add competitor websites (URLs)
3. Add research reports (documents)
4. Add analysis notes (notes)
5. Tag everything with: `research`, `competitors`, `q1-2024`

### Learning New Technology
1. Create project: "Learning Python"
2. Add tutorial links (URLs)
3. Add code examples (code items)
4. Add practice notes (notes)
5. Tag with: `python`, `learning`, `tutorial`

### Design Collection
1. Create project: "UI Design Inspiration"
2. Add design showcase sites (URLs)
3. Add screenshot collections (images)
4. Add design notes (notes)
5. Tag with: `design`, `ui`, `inspiration`, `mobile`

## Troubleshooting

**Can't find an item?**
- Try searching with different keywords
- Check if you're in the right project
- Use broader search terms

**Item won't open?**
- Check if the URL/path is still valid
- For files, make sure they still exist

**Lost data?**
- Your data is automatically saved to a database file
- Check `~/.infovault/infovault.db` exists in your home directory
- Use Export feature to create backup files

## Privacy & Security

InfoVault is designed with privacy in mind:
- All data stays on your computer
- No cloud storage or external servers
- No account required
- No data tracking

Your information belongs to you and stays with you.

## Getting Help

- Check this guide for common questions
- Use the "About InfoVault" button for feature overview
- Remember: This is your personal tool - organize it however works for you!

---

*Happy organizing! InfoVault helps you keep track of what matters most.*