# Architecture Documentation

## Project Structure

The codebase has been refactored into a modular, maintainable structure following best practices for React applications.

```
src/
├── components/          # React UI components
│   ├── icons/          # Icon components (SVG)
│   ├── sidebar/        # Sidebar-related components
│   │   ├── ApiKeySection.tsx
│   │   ├── PromptSection.tsx
│   │   ├── AdvancedEditor.tsx
│   │   ├── SidebarFooter.tsx
│   │   └── Sidebar.tsx
│   ├── canvas/         # Canvas-related components
│   │   ├── EmptyState.tsx
│   │   ├── LoadingState.tsx
│   │   ├── TreeVisualization.tsx
│   │   ├── CanvasControls.tsx
│   │   └── Canvas.tsx
│   ├── Header.tsx      # App header component
│   └── Toast.tsx       # Toast notification component
├── hooks/              # Custom React hooks
│   ├── useApiKey.ts    # API key management
│   ├── useTree.ts      # Tree data management
│   ├── useCanvas.ts    # Canvas pan/zoom logic
│   └── useToast.ts     # Toast notification state
├── services/           # External service integrations
│   └── ai.ts           # OpenAI API integration
├── utils/              # Utility functions
│   ├── json.ts         # JSON parsing utilities
│   ├── validation.ts   # JSON validation
│   ├── string.ts       # String manipulation
│   ├── math.ts         # Math utilities
│   ├── nodeStyle.ts    # Node styling
│   ├── text.ts         # Text wrapping utilities
│   └── tree.ts         # Tree operations (parse, layout, export)
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
├── constants/          # Application constants
│   └── index.ts        # Configuration constants
├── OSTWhiteboardApp.tsx  # Main app component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Component Hierarchy

```
OSTWhiteboardApp
├── Header
│   └── OST Tooltip
├── Sidebar
│   ├── ApiKeySection
│   ├── PromptSection
│   ├── AdvancedEditor
│   └── SidebarFooter
├── Canvas
│   ├── EmptyState (conditional)
│   ├── LoadingState (conditional)
│   ├── TreeVisualization (conditional)
│   └── CanvasControls (conditional)
└── Toast (conditional)
```

## Key Design Decisions

### 1. Separation of Concerns
- **Components**: Pure UI components with minimal logic
- **Hooks**: Business logic and state management
- **Services**: External API integrations
- **Utils**: Pure functions for data transformation

### 2. Custom Hooks
- `useApiKey`: Manages API key state and localStorage
- `useTree`: Handles tree data, parsing, and export
- `useCanvas`: Manages canvas pan/zoom interactions
- `useToast`: Toast notification state management

### 3. Component Organization
- Components are grouped by feature (sidebar, canvas)
- Each component has a single responsibility
- Props are clearly typed with TypeScript interfaces

### 4. Utility Functions
- Grouped by domain (json, string, math, tree)
- Pure functions for easy testing
- No side effects in utility functions

## Adding New Features

### Adding a New Component
1. Create the component file in the appropriate directory
2. Define TypeScript interfaces for props
3. Export from the component directory
4. Import and use in parent component

### Adding a New Hook
1. Create hook file in `hooks/` directory
2. Follow naming convention: `use[FeatureName]`
3. Return an object or tuple with state and functions
4. Document hook usage in comments

### Adding a New Utility
1. Create utility file in `utils/` directory
2. Keep functions pure (no side effects)
3. Add TypeScript types
4. Export from utility file

## Testing Strategy

Each layer can be tested independently:
- **Components**: Test rendering and user interactions
- **Hooks**: Test state management logic
- **Utils**: Test pure functions with unit tests
- **Services**: Mock external API calls

## Future Scalability

The current structure supports:
- Easy addition of new features
- Component reusability
- Clear separation of concerns
- Type safety with TypeScript
- Maintainable codebase

## Dependencies

- React 18.2.0
- TypeScript 5.3.3
- Tailwind CSS 3.4.7
- Vite 5.0.8
