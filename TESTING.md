# Terminal Copilot - Testing Guide

## Manual Testing Checklist

### 1. Terminal Component
- [ ] Terminal displays welcome message on load
- [ ] Can type commands in terminal
- [ ] Enter key submits command
- [ ] Backspace key works correctly
- [ ] Up/Down arrow keys navigate command history
- [ ] Command output displays correctly
- [ ] Terminal scrolls automatically on new input

### 2. AI Suggestions
- [ ] AI suggestions appear after entering a command
- [ ] Suggestions include Understanding section
- [ ] Suggestions include Analysis section
- [ ] Suggestions include Risk Assessment
- [ ] Command suggestions display with risk levels
- [ ] Risk levels show correct icons (safe/warning/dangerous)
- [ ] Copy button works for suggested commands
- [ ] Run Command button triggers execution

### 3. Command History
- [ ] Commands appear in history list after execution
- [ ] Most recent commands appear at the top
- [ ] History shows command and timestamp
- [ ] Copy button copies command to clipboard
- [ ] Replay button re-runs command and gets new suggestions
- [ ] Delete button removes command from history
- [ ] Hover effects display correctly

### 4. Search Functionality
- [ ] Search icon toggles search input
- [ ] Search field accepts text input
- [ ] Search filters history by command name
- [ ] Search results display correctly
- [ ] Clicking search result fills terminal input
- [ ] Clear (X) button clears search field
- [ ] Search closes after selection

### 5. API Integration
- [ ] API endpoint `/api/ai/suggestions` responds correctly
- [ ] API endpoint `/api/command/execute` responds correctly
- [ ] API endpoint `/api/history` responds correctly
- [ ] API endpoint `/api/history/search` responds correctly
- [ ] Error handling works when API fails
- [ ] Loading states display correctly

### 6. Responsiveness
- [ ] Layout works on desktop (1920px+)
- [ ] Layout works on tablet (1024px)
- [ ] Terminal fills available space
- [ ] History panel resizes correctly
- [ ] AI suggestion panel remains visible
- [ ] No overflow issues on any screen size

### 7. Performance
- [ ] App loads within 3 seconds
- [ ] AI suggestions respond within 5 seconds
- [ ] Search filters instantly with 50+ commands
- [ ] No console errors or warnings
- [ ] Memory usage is stable over time

## Test Scenarios

### Scenario 1: Basic Command Flow
1. Load application
2. Type `ls -la` in terminal
3. Press Enter
4. Observe AI suggestions appear
5. Verify command appears in history
6. Expected: All three components update

### Scenario 2: Dangerous Command Detection
1. Type `rm -rf /` in terminal
2. Press Enter
3. Expected: Risk level shows "dangerous" in red
4. Expected: Cannot execute button is disabled

### Scenario 3: Search and Replay
1. Execute multiple commands (ls, pwd, echo test)
2. Click search icon
3. Type "ls" in search
4. Click search result
5. Expected: Terminal input filled with "ls"
6. Press Enter
7. Expected: New suggestions appear, command added to history

### Scenario 4: Command History Navigation
1. Execute 3 different commands
2. Click in terminal input
3. Press Up arrow
4. Expected: Last command appears in input
5. Press Up arrow again
6. Expected: Second-to-last command appears
7. Press Down arrow
8. Expected: Last command appears again

### Scenario 5: Error Handling
1. Open browser dev tools Network tab
2. Disable internet or mock 500 error on AI API
3. Type command and press Enter
4. Expected: Error message displays
5. Expected: User can continue using app

## Debugging Tips

### Check Terminal Console
```javascript
// Open browser DevTools Console (F12)
// Look for [v0] debug messages
// These indicate execution flow
```

### Check API Calls
1. Open DevTools Network tab
2. Look for requests to `/api/ai/suggestions`
3. Check response body for suggestions
4. Check response status codes

### Check Component State
```javascript
// In React DevTools
// Inspect terminal component state
// Verify history array updates
// Check currentSuggestion state
```

### Common Issues

#### AI Suggestions not appearing
- Check API route `/api/ai/suggestions` exists
- Verify command length is < 1000 characters
- Check browser console for error messages
- Verify network request succeeds (200 status)

#### Search not working
- Ensure history has commands
- Try exact command text first
- Clear browser cache and reload
- Check that onSearch prop is passed

#### Terminal input frozen
- Reload page
- Check console for JavaScript errors
- Verify event listeners are attached
- Try different browser

#### History not persisting
- Check that `setHistory` updates state
- Verify timestamps are set correctly
- Ensure ID generation works
- Check that new command appends to array

## Performance Monitoring

### Metrics to Track
- Time to first render: < 2s
- AI suggestion response time: < 5s
- Search filter time: < 100ms
- Memory growth: < 50MB over 10 min

### Tools
- Chrome DevTools Performance tab
- React Profiler
- Lighthouse audit
- Network throttling simulation

## Regression Testing

After any code changes:
1. Clear browser cache
2. Reload application
3. Run full manual testing checklist
4. Test on 2+ different browsers
5. Test on tablet size viewport
6. Run API tests with curl

## Browser Compatibility

### Supported
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Test Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Load Testing

### Simulate Large History
```javascript
// In browser console
const mockHistory = Array.from({ length: 500 }, (_, i) => ({
  id: `cmd-${i}`,
  timestamp: new Date(),
  command: `command-${i}`,
  output: 'output',
  exitCode: 0
}));
// Paste into state to test performance
```

## Accessibility Testing

- [ ] Tab navigation works
- [ ] Screen reader can access content
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Keyboard-only navigation works
- [ ] ARIA labels present where needed
