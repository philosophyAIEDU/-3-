export function escapeHtml(unsafe: string): string {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

export function formatKoreanDate(timestamp: number): string {
    return new Intl.DateTimeFormat('ko-KR', { 
        dateStyle: 'full', 
        timeStyle: 'short' 
    }).format(new Date(timestamp));
}
