// Error handling utilities for user-friendly error messages

export function sanitizeErrorMessage(error: unknown): string {
  let message = 'Something went wrong. Please try again.';
  
  if (error instanceof Error) {
    message = error.message;
    
    // Remove any technical prefixes
    message = message.replace(/^AuthError:\s*/, '');
    message = message.replace(/^Error:\s*/, '');
    
    // If message contains technical details, use fallback
    if (
      message.includes('webpack-internal') ||
      message.includes('.ts:') ||
      message.includes('async ') ||
      message.includes('at ') ||
      message.includes('stack trace') ||
      message.includes('webpack') ||
      message.length > 200 // Very long messages are likely technical
    ) {
      message = 'Something went wrong. Please try again.';
    }
  }
  
  return message;
}

export function sanitizeAuthError(error: unknown): string {
  let message = 'Login failed. Please check your credentials and try again.';
  
  if (error instanceof Error) {
    message = error.message;
    
    // Remove any technical prefixes
    message = message.replace(/^AuthError:\s*/, '');
    message = message.replace(/^Error:\s*/, '');
    
    // If message contains technical details, use fallback
    if (
      message.includes('webpack-internal') ||
      message.includes('.ts:') ||
      message.includes('async ') ||
      message.includes('at ') ||
      message.includes('stack trace') ||
      message.includes('webpack') ||
      message.length > 200 // Very long messages are likely technical
    ) {
      message = 'Login failed. Please check your credentials and try again.';
    }
  }
  
  return message;
}