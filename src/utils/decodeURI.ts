export function decodeURI(encodedName: string): string {
    if (!encodedName) return '';
    return decodeURIComponent(encodedName.replace(/\+/g, ' '));
  }