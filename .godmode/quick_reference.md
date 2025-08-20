# GOD Mode Quick Reference

## Resuming in Existing Session

### From Terminal:
```bash
god --resume "new task to add"
```
This gives you a prompt to paste into Claude.

### Directly in Claude:
Just type any of these:
- "GOD Mode activate"
- "GOD Mode reactivate"  
- "Resume GOD Mode"
- "@orchestrator status"
- "[ATLAS] architecture review"

### Quick Commands in Claude:
- `status` - Show current progress
- `show dashboard` - Display team dashboard
- `@agent_name` - Invoke specific agent
- `[AGENT]` - Switch to agent persona

## Session Types:
1. **New**: `god "requirements"`
2. **Continue**: `god --continue "resume work"`  
3. **Resume**: `god --resume "add to current"`

## Agent Prefixes:
- [ORCHESTRATOR] - When coordinating
- [ATLAS] - When designing architecture
- [NEXUS] - When implementing code
- [SAGE] - When testing/reviewing
