export const interval = (start: Date, end: Date): string => {
    const diff = Math.floor((+end - +start) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}m ${seconds}s`;
};
