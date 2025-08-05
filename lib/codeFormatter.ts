// utils/codeFormatter.ts

export function formatCode(code: string, language: string = 'typescript'): string {
  // Remove excessive whitespace and normalize line endings
  const formatted = code.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Split into lines for processing
  const lines = formatted.split('\n');
  const formattedLines: string[] = [];
  let indentLevel = 0;
  const indentSize = 2; // Use 2 spaces for indentation
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines but preserve them
    if (line === '') {
      formattedLines.push('');
      continue;
    }
    
    // Decrease indent for closing brackets/braces
    if (line.match(/^[\}\]\)]/)) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Add proper indentation
    const indent = ' '.repeat(indentLevel * indentSize);
    formattedLines.push(indent + line);
    
    // Increase indent for opening brackets/braces
    if (line.match(/[\{\[\(]\s*$/)) {
      indentLevel++;
    }
    
    // Handle special cases for TypeScript/JSX
    if (language === 'typescript' || language === 'tsx') {
      // Handle arrow functions
      if (line.includes('=>') && line.includes('{')) {
        indentLevel++;
      }
      
      // Handle interface/type definitions
      if (line.match(/^(interface|type|class)\s+\w+.*\{\s*$/)) {
        indentLevel++;
      }
    }
  }
  
  return formattedLines.join('\n');
}

export function cleanStreamedCode(code: string): string {
  // Remove HTML entities that might come from streaming
  let cleaned = code
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");
  
  // Remove any XML-like tags that might have leaked through
  cleaned = cleaned.replace(/<\/?[^>]+(>|$)/g, '');
  
  // Normalize quotes
  cleaned = cleaned.replace(/[""]/g, '"').replace(/['']/g, "'");
  
  return cleaned;
}

export function detectLanguage(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase();
  
  const languageMap: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'css': 'css',
    'scss': 'scss',
    'html': 'html',
    'json': 'json',
    'md': 'markdown',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c'
  };
  
  return languageMap[extension || ''] || 'typescript';
}