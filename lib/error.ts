export function friendlyError(error: unknown): string {
  if (error instanceof Error) {
    // Map known errors
    if (error.message.includes('fetch') || error.message.includes('network')) 
      return 'Unable to connect. Please try again.';
    if (error.message.includes('401') || error.message.includes('unauthorized'))
      return 'Session expired. Please log in again.';
    
    // Specific error mappings
    if (error.message.toLowerCase().includes('email already exists'))
      return 'This email is already registered. Try logging in.';
    if (error.message.toLowerCase().includes('password'))
      return 'Password must be at least 8 characters with letters and numbers';
    if (error.message.toLowerCase().includes('invalid credentials') || error.message.includes('Request failed'))
      return 'Invalid email or password';
    if (error.message.includes('503'))
      return 'Payment processing is being set up. Your current plan is active.';
    if (error.message.toLowerCase().includes('limit') || error.message.toLowerCase().includes('quota'))
      return "You've reached your plan limit. Upgrade to create more instances.";
    
    // Return the original message if it's already user-friendly
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}
